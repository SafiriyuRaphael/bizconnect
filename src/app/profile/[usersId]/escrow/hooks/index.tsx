import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useRef } from "react";
import getUserEscrows from "../api/getUserEscrow";
import updateEscrow from "../api/updateEscrow";
import { useEscrowStore } from "../store";
import {
  AddNotePayloadProps,
  EscrowUserResponse,
  IEscrow,
  PayloadProps,
  UpdateResponse,
} from "../types/escrow";
import getBaseType from "@/shared/utils/getBaseType";
import { useMessageModalStore } from "@/shared/store/useMessageModalStore";
import { uploadMultipleCloudinary } from "@/lib/cloudinary/uploadMultipleCloudinary";
import addNote from "../api/addNote";
import disputeAction from "../api/disputeAction";
import { ALLOWED_TYPES, MAX_FILE_SIZE } from "../constants";

export default function useEscrow() {
  const queryClient = useQueryClient();
  const {
    escrowParams,
    setEscrowParams,
    setSelectedEscrow,
    setShowDeliveryModal,
    setSelectedDispute,
    setDeliveryFiles,
    resetModal,
    setLoading,
    deliveryFiles,
    setNewNote,
    setDeliveryProof,
    setUploadError,
    setUploadedFiles,
    setIsUploading,
    setDisputeReason,
    setIsDropdownOpen,
    handleClose,
    uploadedFiles,
    selectedDispute,
    disputeReason,
    disputeEvidence,
  } = useEscrowStore();

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: allEscrows, isLoading: isFetchingEscrows } = useQuery<
    EscrowUserResponse,
    Error
  >({
    queryKey: ["get-escrow", escrowParams],
    queryFn: () => getUserEscrows(escrowParams),
  });

  const updateMutation = useMutation<UpdateResponse, Error, PayloadProps>({
    mutationFn: updateEscrow,
    onSuccess: () => {
      useMessageModalStore.getState().onOpen({
        type: "success",
        message: "Escrow updated successfully",
        title: "Success",
        autoClose: true,
        actions: null,
      });
      queryClient.invalidateQueries({ queryKey: ["get-escrow", escrowParams] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      resetModal();
    },
  });

  const noteMutation = useMutation<
    { message: string; escrow: IEscrow },
    Error,
    AddNotePayloadProps
  >({
    mutationFn: addNote,
    onSuccess: () => {
      useMessageModalStore.getState().onOpen({
        type: "success",
        message: "Note added successfully",
        title: "Success",
        autoClose: true,
        actions: null,
      });
      setNewNote("");
      queryClient.invalidateQueries({ queryKey: ["get-escrow", escrowParams] });
      resetModal();
    },
  });

  const disputeMutation = useMutation({
    mutationFn: disputeAction,
    onSuccess: () => {
      useMessageModalStore.getState().onOpen({
        type: "success",
        message: "Dispute updated successful",
        title: "Success",
        autoClose: true,
        actions: null,
      });
      queryClient.invalidateQueries({ queryKey: ["get-escrow", escrowParams] });
      resetModal();
      handleClose();
    },
  });

  const handleParamsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      if (name === "search") {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          setEscrowParams((prev) => ({
            ...prev,
            search: value,
          }));
        }, 500);
      } else {
        setEscrowParams((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    },
    []
  );

  const handleMarkDelivered = (escrowId: string) => {
    setSelectedEscrow(
      allEscrows?.escrows.find((e) => e._id === escrowId) || null
    );
    setShowDeliveryModal(true);
  };

  const handleOpenDispute = (escrow: IEscrow) => {
    setSelectedDispute(escrow);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      // Accept images and documents (max 10MB each)
      const mime = file.type;
      const fileType = getBaseType(mime);
      const isValidType =
        fileType === "image" || fileType === "document" || fileType === "pdf";
      const isValidSize = file.size <= 10 * 1024 * 1024;
      return isValidType && isValidSize;
    });

    setDeliveryFiles([...validFiles]);
  };

  const handleConfirmDelivery = async () => {
    if (deliveryFiles.length > 3) {
      useMessageModalStore.getState().onOpen({
        type: "error",
        message: "You can upload a maximum of 3 files.",
        title: "File Limit Exceeded",
        autoClose: true,
        actions: null,
      });
      return;
    }

    setLoading(true);
    try {
      let fileUrls: string[] = [];

      if (deliveryFiles.length > 0) {
        const uploadedFiles = await uploadMultipleCloudinary(deliveryFiles);
        fileUrls = uploadedFiles.map((file) => file?.imageUrl);
        setDeliveryProof(fileUrls);
      }

      updateMutation.mutate({
        action: "delivered",
        escrowId: useEscrowStore.getState().selectedEscrow?._id!,
        deliveryProof: fileUrls.length > 0 ? fileUrls : undefined,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReasonSelect = (reason: string) => {
    setDisputeReason(reason);
    setIsDropdownOpen(false);
  };

  const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      return `File "${file.name}" is too large. Maximum size is 10MB.`;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return `File type "${file.type}" is not supported. Please upload images, PDFs, or documents.`;
    }

    return null;
  };

  const handleDisputeFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    setUploadError("");
    setIsUploading(true);

    try {
      const validFiles = [];

      for (const file of files) {
        const error = validateFile(file);
        if (error) {
          setUploadError(error);
          setIsUploading(false);
          return;
        }
        validFiles.push(file);
      }

      const newFiles = validFiles.map((file) => ({
        id: Date.now() + Math.random(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null,
      }));

      setUploadedFiles((prev) => [...prev, ...newFiles]);
    } catch (error) {
      setUploadError("Error uploading files. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeFile = (fileId: number) => {
    setUploadedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  };

  const handleDisputeSubmit = async (escrow: IEscrow) => {
    if (!selectedDispute) return;
    const fileToUpload = uploadedFiles.map((files) => files.file);
    const files = await uploadMultipleCloudinary(fileToUpload);
    const evidence = files.map((file) => file?.imageUrl);
    if (!escrow.isDisputed) {
      const payload = {
        escrowId: selectedDispute?._id,
        reason: disputeReason,
        details: disputeEvidence,
        evidence,
        action: "open" as "open",
      };
      disputeMutation.mutate(payload);
    } else {
      const payload = {
        disputeId: selectedDispute.dispute?._id || "",
        message: disputeEvidence,
        evidence,
        action: "respond" as "respond",
      };
      disputeMutation.mutate(payload);
    }
    // handleClose();
  };

  // const handleParamsChange = useCallback(
  //   debounce(
  //     (
  //       e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  //       setEscrowParams: React.Dispatch<React.SetStateAction<EscrowQueryParams>>
  //     ) => {
  //       const { name, value } = e.target;

  //       if (name === "search") {
  //         setEscrowParams((prev: EscrowQueryParams) => ({
  //           ...prev,
  //           search: value,
  //         }));
  //       } else {
  //         setEscrowParams((prev: EscrowQueryParams) => ({
  //           ...prev,
  //           [name]: value,
  //         }));
  //       }
  //     },
  //     500
  //   ),
  //   []
  // );

  return {
    allEscrows,
    isFetchingEscrows,
    setEscrowParams,
    updateMutation,
    escrowParams,
    handleParamsChange,
    handleMarkDelivered,
    handleOpenDispute,
    handleFileUpload,
    handleConfirmDelivery,
    noteMutation,
    removeFile,
    handleDisputeFileUpload,
    handleReasonSelect,
    disputeMutation,
    fileInputRef,
    handleDisputeSubmit,
  };
}
