"use client";
import ProfileImage from "@/app/components/layout/ProfileImage";
import { Bell, RefreshCw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = {
    businessName: session?.user.businessName,
    fullName: session?.user.name,
  };
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">
                BizConnect Admin
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Bell className="w-6 h-6" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <RefreshCw className="w-6 h-6" />
            </button>
            <div
              className="cursor-pointer"
              onClick={() => router.push(`/profile/${session?.user.id}`)}
            >
              <ProfileImage
                user={user}
                logo={session?.user.logo}
                className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
