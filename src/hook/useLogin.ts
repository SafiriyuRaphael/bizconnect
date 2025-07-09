import { signIn } from 'next-auth/react';
import React, { useState } from 'react'
import { FormErrors } from '../../types';
import { useRouter } from 'next/navigation';

export default function useLogin() {
    const router = useRouter();
    const [rememberMe, setRememberMe] = useState(false);
    const [formData, setFormData] = useState({
        emailOrUsername: "",
        password: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (email: string): boolean => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const isEmailFormat = (input: string): boolean => {
        return input.includes("@");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            if (name === "rememberMe") {
                setRememberMe(checked);
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.emailOrUsername.trim()) {
            newErrors.emailOrUsername = "Email or username is required";
        } else if (
            isEmailFormat(formData.emailOrUsername) &&
            !validateEmail(formData.emailOrUsername)
        ) {
            newErrors.emailOrUsername = "Please enter a valid email address";
        } else if (
            !isEmailFormat(formData.emailOrUsername) &&
            formData.emailOrUsername.length < 3
        ) {
            newErrors.emailOrUsername = "Username must be at least 3 characters";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
        if (e) e.preventDefault();

        if (validateForm()) {
            setIsLoading(true);

            try {
                const loginData = {
                    emailOrUsername: formData.emailOrUsername,
                    password: formData.password,
                    redirect: false,
                };

                console.log("Login attempt:", loginData);

                const res = await signIn("credentials", {
                    emailOrUsername: loginData.emailOrUsername,
                    password: loginData.password,
                    redirect: false,
                });

                if (res?.error) {
                    setErrors({ general: res.error || "Invalid credentials" });
                } else if (res?.ok) {
                    router.push("/dashboard");
                }
            } catch (_) {
                setErrors({ general: "Network error. Please check your connection." });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSocialLogin = (provider: string) => {
        signIn(provider);
    };

    const handleForgotPassword = () => {
        router.push("/auth/forgot-password");
    };
    return { errors, formData, handleInputChange, rememberMe, isLoading, handleSubmit, handleSocialLogin, router, handleForgotPassword }
}
