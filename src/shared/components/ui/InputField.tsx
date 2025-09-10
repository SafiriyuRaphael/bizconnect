import React from "react";
import { LucideIcon, HelpCircle } from "lucide-react";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: LucideIcon;
  error?: string;
  required?: boolean;
  className?: string;
  tooltip?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  required = false,
  className = "",
  tooltip,
}) => {
  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {tooltip && (
          <div className="group relative inline-block">
            <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              {tooltip}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>
        )}
      </div>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full ${
            Icon ? "pl-11" : "pl-4"
          } pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={placeholder}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
