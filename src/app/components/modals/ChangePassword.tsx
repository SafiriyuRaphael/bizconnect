import { useState } from "react";
import { PasswordModalProps, PasswordValidation } from "../../../../types";
import Modals from "./Modals";
import PasswordInput from "../ui/PasswordInput";
import { AlertCircle } from "lucide-react";
import { validatePassword } from "@/lib/auth/validatePssword";

export default function ChangePasswordModal({
  isOpen,
  onClose,
  onSubmit,
  blurIntensity,
  showGlow,
  showPattern,
  size,
  variant,
}: PasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const isPasswordValid = (validation: PasswordValidation): boolean =>
    Object.values(validation).every(Boolean);

  const handleSubmit = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!currentPassword)
      newErrors.currentPassword = "Current password is required";
    if (!newPassword) newErrors.newPassword = "New password is required";
    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";

    if (newPassword && !isPasswordValid(validatePassword(newPassword))) {
      newErrors.newPassword = "Password does not meet requirements";
    }

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (currentPassword && newPassword && currentPassword === newPassword) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        await onSubmit({ currentPassword, newPassword });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        onClose();
      } catch (error) {
        setErrors(
          error instanceof Error
            ? { submit: error.message }
            : { submit: "Incorrect password. Please try again" }
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Modals
      isOpen={isOpen}
      onClose={onClose}
      title="Change Password"
      blurIntensity={blurIntensity}
      showGlow={showGlow}
      showPattern={showPattern}
      size={size}
      variant={variant}
    >
      <div className="space-y-4">
        <PasswordInput
          value={currentPassword}
          onChange={setCurrentPassword}
          placeholder="Current Password"
          error={errors.currentPassword}
        />

        <PasswordInput
          value={newPassword}
          onChange={setNewPassword}
          placeholder="New Password"
          showValidation={true}
          error={errors.newPassword}
        />

        <PasswordInput
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Confirm New Password"
          error={errors.confirmPassword}
        />

        {errors.submit && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            {errors.submit}
          </div>
        )}

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
            {isLoading ? "Changing..." : "Change Password"}
          </button>
        </div>
      </div>
    </Modals>
  );
}
