import React from "react";
import { HelpCircle } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  required?: boolean;
  tooltip?: string;
  className?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  error,
  required = false,
  tooltip,
  className = "",
}) => {
  return (
    <div className={className}>
      <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        {label} {required && <span className="text-red-500">*</span>}
        {tooltip && (
          <div className="group relative inline-block">
            <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              {tooltip}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>
        )}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
