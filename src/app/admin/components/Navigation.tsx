"use client";
import { BarChart3, Building2, Settings, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const tabs = [
    { id: "/", label: "Dashboard", icon: BarChart3 },
    { id: "businesses", label: "Businesses", icon: Building2 },
    { id: "users", label: "Users", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];
  return (
    <nav className="flex space-x-8 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => router.push(`/admin/${tab.id}`)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
            pathname === `/admin/${tab.id}`
              ? "bg-blue-100 text-blue-700"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <tab.icon className="w-4 h-4" />
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
