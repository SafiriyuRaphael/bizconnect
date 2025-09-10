import { validatePassword } from "@/lib/auth/validatePssword";
import { AlertCircle, Check, Eye, EyeOff, Lock } from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";
const ValidationItem: React.FC<{ isValid: boolean; text: string }> = ({
  isValid,
  text,
}) => (
  <div
    className={`flex items-center gap-2 ${
      isValid ? "text-green-600" : "text-gray-400"
    }`}
  >
    <Check
      className={`w-3 h-3 ${isValid ? "text-green-600" : "text-gray-300"}`}
    />
    {text}
  </div>
);

export default function PasswordInput({
  value,
  onChange,
  placeholder,
  showValidation = false,
  error,
}: {
  value: any;
  onChange: Dispatch<SetStateAction<string>>;
  placeholder: string;
  error: string;
  showValidation?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const validation = validatePassword(value);
  return (
    <div className="space-y-2">
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {showValidation && value && (
        <div className="space-y-1 text-sm">
          <ValidationItem
            isValid={validation.minLength}
            text="At least 8 characters"
          />
          <ValidationItem
            isValid={validation.hasUppercase}
            text="One uppercase letter"
          />
          <ValidationItem
            isValid={validation.hasLowercase}
            text="One lowercase letter"
          />
          <ValidationItem isValid={validation.hasNumber} text="One number" />
          <ValidationItem
            isValid={validation.hasSpecialChar}
            text="One special character"
          />
        </div>
      )}
    </div>
  );
}
