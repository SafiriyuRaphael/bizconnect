import React, { useState } from 'react'
import { FormErrors, RegisterData } from '../../types';
import { usePathname, useRouter } from 'next/navigation';
import { uploadCloudinary } from '@/lib/cloudinary/uploadClodinary';

export default function useRegister() {
    const router = useRouter()
    const pathname = usePathname()
    const [formData, setFormData] = useState<RegisterData>({
        fullName: "",
        businessName: "",
        email: "",
        phone: "",
        businessCategory: "",
        businessAddress: "",
        deliveryAddress: "",
        username: "",
        password: "",
        confirmPassword: "",
        businessDescription: "",
        website: "",
        gender: "",
        dateOfBirth: "",
        agreedToTerms: false,
        userType: "customer" as "customer" | "business",
        logo: null,
        deliveryTime: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalType, setModalType] = useState<"error" | "warning" | "info" | "success">("info")
    const [modalMessage, setModalMessage] = useState("")
    const [isSubmitting, setIssubmitting] = useState(false)

    const onClose = () => {
        setIsModalOpen(false)
    }

    const businessCategories = [
        { category: "Fashion & Clothing", value: "fashion" },
        { category: "Electronics & Tech", value: "electronics" },
        { category: "Beauty & Personal Care", value: "beauty" },
        { category: "Home & Garden", value: "home" },
        { category: "Food & Beverages", value: "food" },
        { category: "Health & Wellness", value: "health" },
        { category: "Automotive", value: "automotive" },
        { category: "Sports & Recreation", value: "sports" },
        { category: "Books & Education", value: "books" },
        { category: "Art & Crafts", value: "art" },
        { category: "Other", value: "other" }
    ];

    const userType = formData.userType

    const validateEmail = (email: string): boolean => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePhone = (phone: string): boolean => {
        const re = /^[\+]?[\d\s\-\(\)]{10,}$/;
        return re.test(phone);
    };

    const validatePassword = (password: string): boolean => {
        return password.length >= 8;
    };

    const handleNestedChange = <
        Parent extends keyof RegisterData,
        Field extends keyof NonNullable<RegisterData[Parent]>
    >(
        parent: Parent,
        field: Field,
        value: NonNullable<RegisterData[Parent]>[Field]
    ) => {
        setFormData((prev) => ({
            ...prev,
            [parent]: {
                ...(prev[parent] as object),
                [field]: value,
            },
        }));
    };

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
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
            setLogoFile(file)
            setErrors((prev) => ({ ...prev, logo: "" }));
        }
    };

    const setUserType = (type: "customer" | "business") => {
        setFormData(prev => ({ ...prev, userType: type }));
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
        if (userType === "business" && !formData.businessName.trim())
            newErrors.businessName = "Business name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!validateEmail(formData.email))
            newErrors.email = "Please enter a valid email";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        else if (!validatePhone(formData.phone))
            newErrors.phone = "Please enter a valid phone number";
        if (userType === "business" && !formData.businessCategory)
            newErrors.businessCategory = "Please select a business category";
        if (userType === "business" && !formData.businessAddress.trim())
            newErrors.businessAddress = "Business address is required";
        if (!formData.username.trim()) newErrors.username = "Username is required";
        else if (formData.username.length < 3)
            newErrors.username = "Username must be at least 3 characters";
        if (!formData.password) newErrors.password = "Password is required";
        else if (!validatePassword(formData.password))
            newErrors.password = "Password must be at least 8 characters";
        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";
        if (!formData.agreedToTerms)
            newErrors.agreedToTerms = "You must agree to the terms and conditions";
        if (
            formData.priceRange?.min != null &&
            Number(formData.priceRange.min) < 0
        ) {
            newErrors.priceRange = "Minimum price cannot be negative"
        }

        if (
            formData.priceRange?.max != null &&
            formData.priceRange?.min != null &&
            formData.priceRange.max < formData.priceRange.min
        ) {
            newErrors.priceRange = "Maximum price must be greater than minimum"
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        setIssubmitting(true)
        e.preventDefault();
        // console.log("Form submitted:", formData);
        if (validateForm()) {
            const logo_url = await uploadCloudinary(logoFile)
            const updatedFormData = { ...formData, logo: logo_url?.imageUrl };
            const res = await fetch("/api/auth/register", {
                method: "POST",
                body: JSON.stringify(updatedFormData),
                headers: { "Content-Type": "application/json" },
            });

            // registration logic here
            if (res.ok) {

                if (pathname.includes("/auth/register")) {
                    setModalMessage("Registration successful! Redirecting you to the login page...");
                    setIsModalOpen(true)
                    setModalType("success")
                    setTimeout(() => {
                        router.push("/auth/login")
                    }, 4000)

                } else {
                    setModalMessage("Registration successful!");
                    setIsModalOpen(true)
                    setModalType("success")

                }

            } else {
                const { error } = await res.json();
                setModalMessage(error)
                setIsModalOpen(true)
                setModalType("error")
            }
        }
        setIssubmitting(false)
    };
    return {
        setUserType,
        userType,
        handleSubmit,
        formData,
        handleInputChange,
        handleLogoUpload,
        logoFile,
        errors,
        businessCategories, router, modalMessage, isModalOpen, onClose, isSubmitting, modalType, handleNestedChange, setFormData
    }
}
