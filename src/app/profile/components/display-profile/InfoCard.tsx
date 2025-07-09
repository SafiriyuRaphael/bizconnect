import { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  label: string;
  value: string | undefined;
  className?: string;
  isLink?: boolean;
  href?: string;
};

export default function InfoCard({
  icon: Icon,
  label,
  value,
  className = "",
  isLink = false,
  href = "",
}: Props) {
  return (
    <div className="group relative bg-white rounded-xl p-4 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          {isLink ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium break-all transition-colors duration-200"
            >
              {value}
            </a>
          ) : (
            <p
              className={`font-semibold text-gray-900 break-words ${className}`}
            >
              {value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
