import React from "react";
import { Check } from "lucide-react";

interface CheckboxFieldProps {
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
  error?: string;
  className?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  name,
  checked,
  onChange,
  children,
  error,
  className = "",
}) => {
  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <div className="relative">
          <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
          />
          {checked && (
            <Check className="absolute top-0.5 left-0.5 w-3 h-3 text-white pointer-events-none" />
          )}
        </div>
        <label className="text-sm text-gray-600 leading-relaxed">
          {children}
        </label>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
