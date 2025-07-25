"use client";
import useDashboard from "@/hook/useDashboard";
import getAllBusiness from "@/lib/admin/getAllBusiness";
import { getBusinessCategoryDetails } from "@/lib/business/getBusinessCategoryDetails";
import {
  Building2,
  Edit3,
  Eye,
  Filter,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import AddBusinessModal from "../components/modals/AddBusinessModal";
import EditBusinessModal from "../components/modals/EditBusinessModal";
import { AllBusinessProps } from "../../../../types";
import AdminBusinessModal from "../components/modals/ViewBusinessModal";

export default function Page() {
  const { filteredBusinesses } = useDashboard(getAllBusiness);
  
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<"add" | "edit" | "view" | null>(null);
  const [business, setBusiness] = useState<AllBusinessProps | null>(null);

  const onClose = () => {
    setIsOpen(null);
    setBusiness(null);
  };

  const handleEdit = (bus: AllBusinessProps) => {
    setBusiness(bus);
    setIsOpen("edit");
  };

  const handleView = (bus: AllBusinessProps) => {
    setBusiness(bus);
    setIsOpen("view");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      socketRef.current = io(process.env.NEXT_PUBLIC_API_URL);
      socketRef.current?.emit("register", session?.user?.id);

      socketRef.current?.on("active-users", (data: string[]) => {
        console.log("🔥 Active Users: ", data);
        setActiveUsers(data);
      });

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [session?.user?.id]);

  return (
    <div className="space-y-6">
      <AddBusinessModal isOpen={isOpen === "add"} onClose={onClose} />
      <EditBusinessModal
        isOpen={isOpen === "edit"}
        businessData={business}
        onClose={onClose}
      />
      <AdminBusinessModal
        isOpen={isOpen === "view"}
        business={business}
        onClose={onClose}
      />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Business Management</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          onClick={() => setIsOpen("add")}
        >
          <Plus className="w-4 h-4" />
          Add Business
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search businesses..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBusinesses.map((business) => (
                <tr key={business._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <img src={business.logo} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {business.businessName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {business.verificationStatus}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getBusinessCategoryDetails(business.businessCategory).name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        activeUsers.includes(business._id)
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {activeUsers.includes(business._id)
                        ? "Active"
                        : "Offline"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {business.contactCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => handleView(business)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit3
                          className="w-4 h-4"
                          onClick={() => handleEdit(business)}
                        />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
