import { Building2, User } from "lucide-react";
import React from "react";

export default function TypeToggle({
  userType,
  setUserType,
}: {
  userType: "customer" | "business";
  setUserType: (type: "customer" | "business") => void;
}) {
  return (
    <div className="max-w-md mx-auto mb-8">
      <div className="bg-white p-2 rounded-xl shadow-sm border">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setUserType("customer")}
            className={`px-4 py-3 rounded-lg font-medium cursor-pointer transition-all duration-300 ${
              userType === "customer"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Customer
          </button>
          <button
            type="button"
            onClick={() => setUserType("business")}
            className={`px-4 py-3 cursor-pointer rounded-lg font-medium transition-all duration-300 ${
              userType === "business"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Building2 className="w-4 h-4 inline mr-2" />
            Business
          </button>
        </div>
      </div>
    </div>
  );
}
