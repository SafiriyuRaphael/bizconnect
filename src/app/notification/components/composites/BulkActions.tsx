import React from "react";
import useNotification from "../../hooks";
import { UseMutationResult } from "@tanstack/react-query";

export default function BulkActions({
  selectedIds,
  handleDelete,
  handleUpdate,
  deleteMutation,
  updateMutation
}: {
  selectedIds: Set<string>;
  handleDelete: () => void;
  handleUpdate: (action: "read" | "unread") => void;
  deleteMutation: UseMutationResult<
    {
      message: string;
      status: string;
    },
    Error,
    {
      ids: string[];
    },
    unknown
  >;
  updateMutation: UseMutationResult<
    {
      message: string;
      updated: Notification[];
    },
    Error,
    {
      ids: string[];
      action: "read" | "unread";
    },
    unknown
  >;
}) {
  return (
    <div className="bg-blue-50 border-b border-blue-200">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-800 font-medium">
            {selectedIds.size} notification
            {selectedIds.size !== 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleUpdate("read")}
              className="text-sm text-blue-700 hover:text-blue-900 font-medium disabled:text-blue-200 disabled:cursor-not-allowed disabled:animate-pulse"
            >
              {updateMutation.isPending ? "Updating" : "Mark as read"}
            </button>
            <button
              onClick={() => handleUpdate("unread")}
              className="text-sm text-blue-700 hover:text-blue-900 font-medium disabled:text-blue-200 disabled:cursor-not-allowed disabled:animate-pulse"
            >
              {updateMutation.isPending ? "Updating" : "Mark as unread"}
            </button>
            <button
              disabled={deleteMutation.isPending}
              onClick={handleDelete}
              className="text-sm text-red-600 hover:text-red-800 font-medium disabled:text-red-200 disabled:cursor-not-allowed disabled:animate-pulse"
            >
              {deleteMutation.isPending ? "Deleting" : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
