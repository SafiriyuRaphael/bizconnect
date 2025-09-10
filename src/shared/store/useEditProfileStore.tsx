import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { signOut } from "next-auth/react";
import { uploadCloudinary } from "@/lib/cloudinary/uploadClodinary";
import { useMessageModalStore } from "@/shared/store/useMessageModalStore";
import {
  AllBusinessProps,
  AnyUser,
  BusinessDisplayPicsProps,
  ProfileData,
} from "../../../types";

interface EditProfileStore {
  editMode: boolean;
  formData: ProfileData;
  errors: ProfileData;
  activeModal: string | null;
  uploading: boolean;
  profile: AnyUser | any;
  loading: boolean;
  expandedSections: {
    basic: boolean;
    personal: boolean;
    business: boolean;
    account: boolean;
  };
  businessPictures: BusinessDisplayPicsProps[];

  setEditMode: (mode: boolean) => void;
  setFormData: (data: ProfileData) => void;
  setErrors: (errors: ProfileData) => void;
  setActiveModal: (modal: string | null) => void;
  setUploading: (uploading: boolean) => void;
  setProfile: (profile: AnyUser | any) => void;
  setLoading: (loading: boolean) => void;
  setExpandedSections: (
    updater: (prev: {
      basic: boolean;
      personal: boolean;
      business: boolean;
      account: boolean;
    }) => {
      basic: boolean;
      personal: boolean;
      business: boolean;
      account: boolean;
    }
  ) => void;
  setBusinessPictures: (business: BusinessDisplayPicsProps[]) => void;
  openModal: (type: string) => void;
  closeModal: () => void;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleDeleteModal: () => void;
  handleDeletePassword: (payload: { password: string }) => Promise<void>;
  handleChangePassword: (payload: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<void>;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleNestedChange: <
    Parent extends keyof ProfileData,
    Field extends keyof NonNullable<ProfileData[Parent]>
  >(
    parent: Parent,
    field: Field,
    value: NonNullable<ProfileData[Parent]>[Field]
  ) => void;
  validateForm: () => boolean;
  handleCancel: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export const useEditProfileStore = create<EditProfileStore>()(
  devtools((set, get) => ({
    editMode: false,
    formData: {},
    errors: {},
    activeModal: null,
    uploading: false,
    profile: null,
    loading: false,
    businessPictures: [],
    expandedSections: {
      basic: true,
      personal: true,
      business: true,
      account: true,
    },
    setEditMode: (mode) => set({ editMode: mode }),
    setFormData: (data) => set({ formData: data }),
    setErrors: (errors) => set({ errors }),
    setActiveModal: (modal) => set({ activeModal: modal }),
    setUploading: (uploading) => set({ uploading }),
    setProfile: (profile) => set({ profile }),
    setLoading: (loading) => set({ loading }),
    setBusinessPictures: (businessPictures) => set({ businessPictures }),
    setExpandedSections: (
      sectionUpdater:
        | {
            basic: boolean;
            personal: boolean;
            business: boolean;
            account: boolean;
          }
        | ((prev: {
            basic: boolean;
            personal: boolean;
            business: boolean;
            account: boolean;
          }) => {
            basic: boolean;
            personal: boolean;
            business: boolean;
            account: boolean;
          })
    ) =>
      set((state) => ({
        expandedSections:
          typeof sectionUpdater === "function"
            ? sectionUpdater(state.expandedSections)
            : sectionUpdater,
      })),

    openModal: (type) => set({ activeModal: type }),
    closeModal: () => set({ activeModal: null }),

    handleLogoUpload: async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        set((state) => ({
          errors: { ...state.errors, logo: "File size must be less than 5MB" },
        }));
        return;
      }
      if (!file.type.startsWith("image/")) {
        set((state) => ({
          errors: { ...state.errors, logo: "Please upload an image file" },
        }));
        return;
      }
      set((state) => ({ errors: { ...state.errors, logo: "" } }));

      try {
        set({ uploading: true });
        const { profile } = get();

        const logo_url = await uploadCloudinary(file);

        if (logo_url) {
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
            set({ profile: data.user });
          } else {
            set((state) => ({
              errors: { ...state.errors, logo: "Failed to upload picture" },
            }));
          }
        }
      } catch (err) {
        set((state) => ({
          errors: { ...state.errors, logo: "Failed to upload picture" },
        }));
      } finally {
        set({ uploading: false });
      }
    },

    handleDeleteModal: () => {
      const actionButtons = (
        <>
          <button
            onClick={useMessageModalStore.getState().onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => get().openModal("inputPassword")}
            className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Confirm
          </button>
        </>
      );

      useMessageModalStore.getState().onOpen({
        title: "Confirm Delete",
        message:
          "Are you sure you want to delete this item? This action cannot be undone.",
        type: "warning",
        actions: actionButtons,
        autoClose: false,
      });
    },

    handleDeletePassword: async ({ password }: { password: string }) => {
      try {
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
      } catch (error) {
        console.error("Delete failed:", error);
        useMessageModalStore.getState().onOpen({
          message: "Failed to delete profile ❌",
          type: "error",
          autoClose: true,
          actions: null,
        });
      }
    },

    handleChangePassword: async ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => {
      try {
        const res = await fetch(`/api/profile/change-password`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ currentPassword, newPassword }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Change password failed");
        }

        setTimeout(() => {
          useMessageModalStore.getState().onOpen({
            title: "Password Changed",
            message: "Password Changed Successfully",
            type: "success",
            actions: null,
            autoClose: true,
          });
        }, 500);
      } catch (error) {
        console.error("Change password failed:", error);
        useMessageModalStore.getState().onOpen({
          message: "Failed to change password ❌",
          type: "error",
          autoClose: true,
          actions: null,
        });
      }
    },

    handleInputChange: (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      set((state) => ({
        formData: { ...state.formData, [name]: value },
        errors: { ...state.errors, [name]: "" },
      }));
    },

    handleNestedChange: <
      Parent extends keyof ProfileData,
      Field extends keyof NonNullable<ProfileData[Parent]>
    >(
      parent: Parent,
      field: Field,
      value: NonNullable<ProfileData[Parent]>[Field]
    ) => {
      set((state) => ({
        formData: {
          ...state.formData,
          [parent]: {
            ...(state.formData[parent] as object),
            [field]: value,
          },
        },
      }));
    },

    validateForm: () => {
      const { formData, profile } = get();
      const newErrors: ProfileData = {};

      if (formData.phone) {
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
        if (!formData.phone?.trim()) {
          newErrors.phone = "Phone number is required";
        } else if (!/^[\+]?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
          newErrors.phone = "Invalid phone number";
        }
      }

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

      if (profile?.userType === "customer") {
        if (
          formData.dateOfBirth &&
          new Date(formData.dateOfBirth) > new Date()
        ) {
          newErrors.dateOfBirth = "Date of birth cannot be in the future";
        }
      }

      set({ errors: newErrors });
      return Object.keys(newErrors).length === 0;
    },

    handleCancel: () => {
      set({ editMode: false, formData: {}, errors: {} });
    },

    handleSubmit: async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const { validateForm, formData, profile } = get();
      if (!validateForm()) return;

      set({ loading: true, errors: {} });

      try {
        const res = await fetch(`/api/profile/updates`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: profile?._id,
            updates: formData,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          if (data.errors) {
            set({ errors: data.errors });
          } else {
            useMessageModalStore.getState().onOpen({
              message: "Something went wrong updating profile",
              type: "error",
            });
          }
          return;
        }

        const data: { user: AnyUser; status: string } = await res.json();

        if (data?.user) {
          set({ profile: data.user });
        } else {
          useMessageModalStore.getState().onOpen({
            message: "Something went wrong updating profile",
            type: "error",
          });
        }
        useMessageModalStore.getState().onOpen({
          message: "Profile updated successfully ✅",
          type: "success",
          autoClose: true,
          actions: null,
        });
        set({ editMode: false, formData: {}, errors: {} });
      } catch (error) {
        console.error("Update failed:", error);
        useMessageModalStore.getState().onOpen({
          message: "Something went wrong updating profile ❌",
          type: "error",
          autoClose: true,
          actions: null,
        });
      } finally {
        set({ loading: false });
      }
    },
  }))
);
