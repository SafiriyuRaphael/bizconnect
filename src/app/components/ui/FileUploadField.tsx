import React from "react";
import { Upload } from "lucide-react";

interface FileUploadFieldProps {
  label: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  error?: string;
  fileName?: string;
  required?: boolean;
  className?: string;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  name,
  onChange,
  accept = "image/*",
  error,
  fileName,
  required = false,
  className = "",
}) => {
  const inputId = `${name}-upload`;

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type="file"
          onChange={onChange}
          accept={accept}
          className="hidden"
          id={inputId}
        />
        <label
          htmlFor={inputId}
          className={`w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-400 transition-colors flex items-center justify-center text-gray-600 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        >
          <Upload className="w-5 h-5 mr-2" />
          {fileName || `Upload ${label}`}
        </label>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
