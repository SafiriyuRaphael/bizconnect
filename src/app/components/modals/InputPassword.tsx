import React, { useState } from "react";
import Modals from "./Modals";
import PasswordInput from "../ui/PasswordInput";
import { PasswordModalProps } from "../../../../types";

export default function InputPasswordModal({
  isOpen,
  onClose,
  onSubmit,
  title = "",
  variant,
  size,
  showPattern,
  showGlow,
  blurIntensity,
}: PasswordModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({ password });
      setPassword("");
      onClose();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Incorrect password. Please try again"
      );
      console.error("password Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modals
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      blurIntensity={blurIntensity}
      showGlow={showGlow}
      showPattern={showPattern}
      size={size}
      variant={variant}
    >
      <div className="space-y-4">
        <p className="text-gray-600 text-sm mb-4">
          Please enter your password to continue.
        </p>

        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
          error={error}
        />

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Verifying..." : "Confirm"}
          </button>
        </div>
      </div>
    </Modals>
  );
}
