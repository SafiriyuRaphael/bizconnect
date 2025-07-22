"use client";
import React, { useState, useRef } from "react";
import {
  FileText,
  Image,
  CheckCircle,
  Camera,
  LucideIcon,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import verifyBusiness from "@/lib/business/verifyBusiness";
import { uploadCloudinary } from "@/lib/cloudinary/uploadClodinary";
import { IdDocumentType } from "../../../../../types";

// Type definitions
interface FormData {
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  ownerName: string;
  idType:
    | "driver_license"
    | "national_id_card"
    | "voters_card"
    | "international_passport";
}

interface UploadedFiles {
  [key: string]: File;
}

interface FileUploadBoxProps {
  label: string;
  fileType: string;
  accept: string;
  icon: LucideIcon;
}

const BizConVerification = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({});
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    businessAddress: "",
    businessPhone: "",
    ownerName: "",
    idType: "national_id_card",
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState("");

  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setVideoBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Camera access error:", error);
      alert("Camera access denied or not available");
    }
  };

  const router = useRouter();

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (fileType: string, files: FileList | null) => {
    if (files && files.length > 0) {
      setUploadedFiles((prev) => ({
        ...prev,
        [fileType]: files[0],
      }));
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submitVerification = async () => {
    // Check required fields for business
    const requiredFields: (keyof FormData)[] = [
      "businessName",
      "businessAddress",
      "businessPhone",
      "ownerName",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0 || !uploadedFiles.idDocument || !videoBlob) {
      alert(
        "Please fill in all required fields and complete verification steps"
      );
      return;
    }
    try {
      const {
        businessAddress,
        businessName,
        businessPhone,
        idType,
        ownerName,
      } = formData;

      const idUrl = await uploadCloudinary(uploadedFiles.idDocument);

      const selfieUrl = await uploadCloudinary(uploadedFiles.selfieUrl);

      const businessLogo = await uploadCloudinary(uploadedFiles.logo);

      if (!idUrl) {
        setError("failed to upload Id document");
      }

      const idDocument: IdDocumentType = {
        idType,
        idUrl: idUrl?.imageUrl,
        public_id: idUrl?.public_id,
      };

      const res = await verifyBusiness({
        fullName: ownerName,
        businessAddress,
        businessName,
        businessPhone,
        idDocument,
        selfieUrl: selfieUrl?.imageUrl,
        businessLogo: businessLogo?.imageUrl,
      });

      if (res.ok) {
        setError(
          "Business verification submitted successfully! We will review your application within 2-3 business days."
        );
      }
    } catch (err) {}
  };

  const FileUploadBox: React.FC<FileUploadBoxProps> = ({
    label,
    fileType,
    accept,
    icon: Icon,
  }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
      <input
        type="file"
        accept={accept}
        onChange={(e) => handleFileUpload(fileType, e.target.files)}
        className="hidden"
        id={fileType}
      />
      <label htmlFor={fileType} className="cursor-pointer">
        <Icon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-xs text-gray-500 mt-1">Click to upload</p>
        {uploadedFiles[fileType] && (
          <p className="text-xs text-green-600 mt-2 flex items-center justify-center">
            <CheckCircle className="h-4 w-4 mr-1" />
            {uploadedFiles[fileType].name}
          </p>
        )}
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="text-3xl font-bold text-gray-800">
                Business Verification
              </h2>
            </div>

            <div className="space-y-8">
              {/* Business Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Business Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) =>
                        handleInputChange("businessName", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter business name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Owner Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) =>
                        handleInputChange("ownerName", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter owner name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Address *
                    </label>
                    <input
                      type="text"
                      value={formData.businessAddress}
                      onChange={(e) =>
                        handleInputChange("businessAddress", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter business address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Phone *
                    </label>
                    <input
                      type="tel"
                      value={formData.businessPhone}
                      onChange={(e) =>
                        handleInputChange("businessPhone", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>

              {/* ID Document Upload */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Identity Verification *
                </h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select ID Type
                  </label>
                  <select
                    value={formData.idType}
                    onChange={(e) =>
                      handleInputChange(
                        "idType",
                        e.target.value as FormData["idType"]
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="national_id_card">
                      National ID Number (NIN)
                    </option>
                    <option value="international_passport">
                      International Passport
                    </option>
                    <option value="driver_license">Driver's License</option>
                    <option value="voters_card">Voters Card</option>
                  </select>
                </div>
                <FileUploadBox
                  label={`Upload ${formData.idType.toUpperCase()} Document`}
                  fileType="idDocument"
                  accept="image/*,application/pdf"
                  icon={FileText}
                />
              </div>

              {/* Video Verification */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Video Verification *
                </h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  {!videoBlob ? (
                    <div className="text-center">
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        className={`w-full max-w-md mx-auto rounded-lg ${
                          !isRecording ? "hidden" : ""
                        }`}
                      />
                      {!isRecording && (
                        <div className="mb-4">
                          <Camera className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                          <p className="text-gray-600 mb-4">
                            Record a clear video of yourself for identity
                            verification
                          </p>
                        </div>
                      )}
                      <button
                        onClick={
                          isRecording ? stopVideoRecording : startVideoRecording
                        }
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                          isRecording
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      >
                        {isRecording ? "Stop Recording" : "Start Recording"}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                      <p className="text-green-600 font-medium">
                        Video recorded successfully!
                      </p>
                      <button
                        onClick={() => {
                          setVideoBlob(null);
                          setIsRecording(false);
                        }}
                        className="mt-2 text-blue-500 hover:text-blue-600 text-sm"
                      >
                        Record Again
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Business Documents */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Business Documents (Optional)
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <FileUploadBox
                    label="Business Logo"
                    fileType="logo"
                    accept="image/*"
                    icon={Image}
                  />
                  <FileUploadBox
                    label="Business Registration"
                    fileType="registration"
                    accept="image/*,application/pdf"
                    icon={FileText}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t">
                <button
                  onClick={submitVerification}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  Submit Business Verification
                </button>
                <p className="text-sm text-gray-500 text-center mt-4">
                  * Required fields. We'll review your application within 2-3
                  business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BizConVerification;
