import React, { useState } from 'react'
import { FormErrors, RegisterData } from '../../types';
import { useRouter } from 'next/navigation';

export default function useRegister() {
    const router = useRouter()
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
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [errorModal, setErrorModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [isSubmitting, setIssubmitting] = useState(false)

    const onClose = () => {
        setErrorModal(false)
    }

    const businessCategories = [
        { category: "Fashion & Clothing", value: "fashion" },
        { category: "Electronics & Tech", value: "electronics" },
        { category: "Beauty & Personal Care", value: "beauty" },
        { category: "Home & Garden", value: "food" },
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
            setLogoFile(file);
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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        setIssubmitting(true)
        e.preventDefault();
        if (validateForm()) {
            console.log("Form submitted:", formData);

            const res = await fetch("/api/auth/register", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: { "Content-Type": "application/json" },
            });
            // Handle registration logic here
            if (res.ok) {
                router.push("/auth/login")
            } else {
                const { error } = await res.json();
                setErrorMessage(error)
                setErrorModal(true)
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
        businessCategories, router, errorMessage, errorModal, onClose, isSubmitting
    }
}
