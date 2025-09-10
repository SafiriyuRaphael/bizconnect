import validateEmail from '@/shared/utils/validateEmail';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FormErrors } from '../../../../../types';

export default function useForgetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    // Clear error when user starts typing
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      try {
        const response = await fetch("/api/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          setIsEmailSent(true);
        } else {
          const errorData = await response.json();
          setErrors({
            general:
              errorData.message ||
              "Failed to send reset email. Please try again.",
          });
        }
      } catch (_) {
        setErrors({
          general: "Network error. Please check your connection and try again.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBackToLogin = () => {
    router.push("/auth/login");
  };

  const handleResendEmail = () => {
    setIsEmailSent(false);
    setEmail("");
    setErrors({});
  };

  return { email, errors, handleSubmit, isLoading, isEmailSent, handleInputChange, handleBackToLogin, handleResendEmail, }
}
