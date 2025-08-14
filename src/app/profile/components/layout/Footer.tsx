"use client";
import { useEditProfileStore } from "@/store/useEditProfileStore";
import { signOut } from "next-auth/react";
import React from "react";

export default function Footer() {
  const { openModal, handleDeleteModal } = useEditProfileStore();
  return (
    <div className="mt-6 bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Account Actions
      </h3>
      <div className="flex flex-wrap gap-3">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => openModal("changePassword")}
        >
          Change Password
        </button>
        <button
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
        >
          Log Out
        </button>
        <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
          Download Data
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          onClick={handleDeleteModal}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
