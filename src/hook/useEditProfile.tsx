import { uploadCloudinary } from "@/lib/cloudinary/uploadClodinary";
import { generateDefaultLogo } from "@/lib/Image/generateDefaultLogo";
import { signOut } from "next-auth/react";
import React, { useState } from "react";
import { AllBusinessProps, AnyUser, ProfileData } from "../../types";

export default function useEditProfile(
  user: AnyUser | AllBusinessProps | null
) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({});
  const [modalType, setIsModalType] = useState<
    "error" | "warning" | "info" | "success"
  >("success");
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState<ProfileData>({});
  const [autoClose, setAutoClose] = useState(true);
  const [actions, setActions] = useState<React.JSX.Element | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const openModal = (type: string) => setActiveModal(type);

  const closeModal = () => setActiveModal(null);

  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState(user);

  // Initialize form data when entering edit mode

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setErrors((prev) => ({
          ...prev,
          logo: "File size must be less than 5MB",
        }));
        return;
      }
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, logo: "Please upload an image file" }));
        return;
      }
      setErrors((prev) => ({ ...prev, logo: "" }));
    }

    try {
      setUploading(true);
      console.log(profile);

      const logo_url = await uploadCloudinary(file);

      if (logo_url) {
        // hit your API to save the new logo
        const res = await fetch("/api/profile/updates", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: profile?._id,
            updates: { logo: logo_url.imageUrl },
          }),
        });

        const data: { user: AnyUser; status: string } = await res.json();

        if (data?.user) {
          setProfile(data.user);
        } else {
          setErrors({ logo: "failed to upload picture" });
        }
      }
    } catch (err) {
      setErrors({ logo: "failed to upload picture" });
    } finally {
      setUploading(false);
    }
  };

  const generateDefaultLogoDataUrl = (name: string): string => {
    const svg = generateDefaultLogo(name);
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const actionButtons = (
    <>
      <button
        onClick={closeModal}
        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={() => openModal("inputPassword")}
        className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
      >
        Confirm
      </button>
    </>
  );

  const handleDeleteModal = () => {
    setAutoClose(false);
    setTitle("Confirm Delete");
    setIsModalType("warning");
    setMessage(
      "Are you sure you want to delete this item? This action cannot be undone."
    );
    setActions(actionButtons);
    openModal("message");
  };

  const handleDeletePassword = async ({ password }: { password: string }) => {
    const res = await fetch(`/api/profile/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Delete failed");
    }

    signOut({ callbackUrl: "/auth/login" });
  };

  const handleChangePassword = async ({
    currentPassword,
    newPassword,
  }: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const res = await fetch(`/api/profile/change-password`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Delete failed");
    }

    setTimeout(() => {
      setActions(null);
      setAutoClose(true);
      setTitle("Password Changed");
      setIsModalType("success");
      setMessage("Password Changed Successfully");
      openModal("message");
    }, 500);
  };

  const fallbackAlt = profile?.businessName || profile?.fullName || "User";
  const fallbackSrc = generateDefaultLogoDataUrl(fallbackAlt);

  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle nested object changes (like priceRange)
  const handleNestedChange = <
    Parent extends keyof ProfileData,
    Field extends keyof NonNullable<ProfileData[Parent]>
  >(
    parent: Parent,
    field: Field,
    value: NonNullable<ProfileData[Parent]>[Field]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as object),
        [field]: value,
      },
    }));
  };

  const validateForm = () => {
    const newErrors: ProfileData = {};
    if (formData.phone) {
      // Common validations
      if (!formData.fullName?.trim()) {
        newErrors.fullName = "Full name is required";
      }
    }

    if (formData.email) {
      if (!formData.email?.trim()) {
        newErrors.email = "Email is required";
      } else if (
        !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)
      ) {
        newErrors.email = "Invalid email format";
      }
    }

    if (formData.username) {
      if (!formData.username?.trim()) {
        newErrors.username = "Username is required";
      } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
        newErrors.username =
          "Username can only contain letters, numbers, underscores (_) and hyphens (-)";
      } else if (formData.username.length < 4) {
        newErrors.username = "Username must be at least 3 characters";
      }
    }

    if (formData.phone) {
      if (formData.phone && !formData.phone?.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^[\+]?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
        newErrors.phone = "Invalid phone number";
      }
    }
    // Business-specific validations
    if (profile?.userType === "business") {
      if (formData.businessName && !formData.businessName?.trim()) {
        newErrors.businessName = "Business name is required";
      }

      if (formData.businessCategory && !formData.businessCategory) {
        newErrors.businessCategory = "Business category is required";
      }

      if (formData.businessAddress && !formData.businessAddress?.trim()) {
        newErrors.businessAddress = "Business address is required";
      }

      if (
        formData.website &&
        !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
          formData.website
        )
      ) {
        newErrors.website = "Invalid website URL";
      }

      if (
        formData.priceRange?.min != null &&
        Number(formData.priceRange.min) < 0
      ) {
        newErrors.priceRange = {
          min: "Minimum price cannot be negative",
          max: newErrors.priceRange?.max ?? "",
        };
      }

      if (
        formData.priceRange?.max != null &&
        formData.priceRange?.min != null &&
        formData.priceRange.max < formData.priceRange.min
      ) {
        newErrors.priceRange = {
          min: newErrors.priceRange?.min ?? "",
          max: "Maximum price must be greater than minimum",
        };
      }
    }

    // Customer-specific validations
    if (profile?.userType === "customer") {
      if (formData.dateOfBirth && new Date(formData.dateOfBirth) > new Date()) {
        newErrors.dateOfBirth = "Date of birth cannot be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({});
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage("");
    setErrors({});

    try {
      const res = await fetch(`/api/profile/updates`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?._id,
          updates: formData,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setMessage("Something went wrong updating profile");
        }
        return;
      }

      const data: { user: AnyUser; status: string } = await res.json();

      if (data?.user) {
        setProfile(data.user);
      } else {
        setMessage("Something went wrong updating profile");
      }

      setMessage("Profile updated successfully ✅");
      setIsModalType("success");
      setAutoClose(true);
      setActions(null);
      openModal("message");
      setEditMode(false);
      handleCancel();
    } catch (error) {
      console.error("Update failed:", error);
      setMessage("Something went wrong updating profile ❌");
      setIsModalType("error");
      setAutoClose(true);
      setActions(null);
      openModal("message");
    } finally {
      setLoading(false);
    }
  };
  return {
    activeModal,
    closeModal,
    handleChangePassword,
    message,
    modalType,
    autoClose,
    title,
    actions,
    handleDeleteModal,
    fallbackAlt,
    fallbackSrc,
    profile,
    editMode,
    setEditMode,
    uploading,
    errors,
    formData,
    openModal,
    handleDeletePassword,
    handleLogoUpload,
    setFormData,
    setIsModalType,
    handleSubmit,
    handleInputChange,
    handleNestedChange,
    handleCancel,
    loading,
  };
}
