import { ChevronDown, ChevronUp, LucideIcon } from "lucide-react";
import React from "react";

type Props = {
  title: string;
  icon: LucideIcon;
  section: "basic" | "personal" | "business" | "account";
  badge?: string | null;
  setExpandedSections: React.Dispatch<
    React.SetStateAction<{
      basic: boolean;
      personal: boolean;
      business: boolean;
      account: boolean;
    }>
  >;
  expandedSections: {
    basic: boolean;
    personal: boolean;
    business: boolean;
    account: boolean;
  };
};

export default function SectionHeader({
  title,
  icon: Icon,
  section,
  badge = null,
  setExpandedSections,
  expandedSections,
}: Props) {
  const toggleSection = (
    section: "basic" | "personal" | "business" | "account"
  ) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  return (
    <div
      className="flex items-center justify-between cursor-pointer group"
      onClick={() => toggleSection(section)}
    >
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
          {title}
        </h3>
        {badge && (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {expandedSections && expandedSections[section] ? (
          <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
        )}
      </div>
    </div>
  );
}
