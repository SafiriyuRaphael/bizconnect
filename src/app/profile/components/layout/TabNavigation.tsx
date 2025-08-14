"use client";
import { useEditProfileStore } from "@/store/useEditProfileStore";
import { BarChart3, Package, Shield, User } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function TabNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, editMode } = useEditProfileStore();
  const tabs = [
    { id: "/", label: "Overview", icon: User },
    { id: "products", label: "Products/Services", icon: Package },
    { id: "escrow", label: "Transactions", icon: Shield },
    ...(profile?.verifiedBusiness
      ? [{ id: "analytics", label: "Analytics", icon: BarChart3 }]
      : []),
  ];
  if (editMode) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-8 w-full overflow-x-scroll">
      <div className="flex space-x-1">
        {tabs.map((tab, i) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => router.push(`/profile/${profile?._id}/${tab.id}`)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                pathname.endsWith(tab.id) ||
                (i === 0 && pathname.endsWith(`${profile?._id}`))
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
