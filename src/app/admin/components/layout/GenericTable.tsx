import React from "react";
import { Eye, Edit3, Trash2, Phone, Video, MessageCircle } from "lucide-react";

// Define types for the column configuration
export interface Column<T> {
  header: string;
  accessor: keyof T | string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

// Props for the GenericTable component
export interface GenericTableProps<T> {
  data?: T[];
  columns?: Column<T>[];
  total: number;
  limit: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  activeUsers?: string[];
  handleView?: (item: T) => void;
  handleEdit?: (item: T) => void;
  handleDeleteModal?: (id: string) => void;
  handleVideoCall?: (id: string) => void;
  handleAudioCall?: (id: string) => void;
  handleChat?: (item: T) => void;
}

export const GenericTable = <T extends { _id: string }>({
  data,
  columns,
  total,
  limit,
  currentPage,
  onPageChange,
  handleView,
  handleEdit,
  handleDeleteModal,
  handleAudioCall,
  handleVideoCall,
  handleChat,
}: GenericTableProps<T>) => {
  const getNestedValue = (obj: T, accessor: string) => {
    return accessor
      .split(".")
      .reduce((o, key) => (o ? (o as any)[key] : undefined), obj);
  };

  const totalPages = Math.ceil(total / limit);

  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages: (number | string)[] = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const renderCell = (value: any): React.ReactNode => {
    if (React.isValidElement(value)) return value;
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    )
      return value.toString();
    if (value === null || value === undefined) return "-";
    try {
      return JSON.stringify(value);
    } catch {
      return "-";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {columns?.map((column, index) => (
                <th
                  key={index}
                  className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                    column.className || ""
                  }`}
                >
                  {column.header}
                </th>
              ))}
              {(handleView ||
                handleEdit ||
                handleDeleteModal ||
                handleVideoCall ||
                handleAudioCall ||
                handleChat) && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data?.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                {columns?.map((column, index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap">
                    {column.render
                      ? column.render(item)
                      : renderCell(
                          getNestedValue(item, column.accessor as string)
                        )}
                  </td>
                ))}
                {(handleView ||
                  handleEdit ||
                  handleDeleteModal ||
                  handleVideoCall ||
                  handleAudioCall ||
                  handleChat) && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {handleView && (
                        <button
                          onClick={() => handleView(item)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {handleChat && (
                        <button
                          onClick={() => handleChat(item)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      )}
                      {handleAudioCall && (
                        <button
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          onClick={() => {
                            handleAudioCall(item._id);
                          }}
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                      )}
                      {handleVideoCall && (
                        <button
                          onClick={() => handleVideoCall(item._id)}
                          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        >
                          <Video className="w-4 h-4" />
                        </button>
                      )}
                      {handleEdit && (
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                      {handleDeleteModal && (
                        <button
                          onClick={() => handleDeleteModal(item._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      {total > 0 && (
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * limit + 1} to{" "}
            {Math.min(currentPage * limit, total)} of {total} entries
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === "number" && onPageChange(page)}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : typeof page === "number"
                    ? "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
                    : "text-gray-400 cursor-default"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
