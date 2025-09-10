import React from "react";
import { LucideIcon } from "lucide-react";

interface TextAreaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  icon?: LucideIcon;
  error?: string;
  required?: boolean;
  rows?: number;
  className?: string;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  required = false,
  rows = 3,
  className = "",
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
        )}
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          className={`w-full ${
            Icon ? "pl-11" : "pl-4"
          } pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={placeholder}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
