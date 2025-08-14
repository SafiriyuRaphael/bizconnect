"use client";
import { useEditProfileStore } from "@/store/useEditProfileStore";
import {
  AlertCircle,
  CheckCircle,
  Clock3,
  MessageSquare,
  XCircle,
  X,
  FileText,
  Calendar,
  Filter,
  Search,
  Download,
  Upload,
  Eye,
  DollarSign,
  User,
  Package,
  AlertTriangle,
  Shield,
  RefreshCw,
} from "lucide-react";
import React, { useState, useMemo, ComponentType } from "react";

// Define TypeScript interfaces for the data structure
interface User {
  _id: string;
  fullName: string;
  email: string;
}

interface Item {
  _id: string;
  title: string;
  description: string;
}

interface Escrow {
  _id: string;
  itemId: Item;
  buyerId: User;
  sellerId: User;
  price: number;
  status:
    | "pending"
    | "funded"
    | "delivered"
    | "disputed"
    | "released"
    | "refunded";
  isDisputed: boolean;
  releaseDate: string | null;
  paymentIntentId: string | null;
  deliveryProof: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// Type for the useEditProfileStore hook
interface EditProfileStore {
  editMode: boolean;
}

// Mock escrow data
const mockEscrows: Escrow[] = [
  {
    _id: "esc1",
    itemId: {
      _id: "item1",
      title: "Web Development Service",
      description: "Full-stack e-commerce website",
    },
    buyerId: {
      _id: "buyer1",
      fullName: "Alice Johnson",
      email: "alice@example.com",
    },
    sellerId: {
      _id: "seller1",
      fullName: "John Developer",
      email: "john@example.com",
    },
    price: 25000,
    status: "funded",
    isDisputed: false,
    releaseDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    paymentIntentId: "pi_1234567890",
    deliveryProof: null,
    notes: "Client requested additional features",
    createdAt: "2024-08-01T00:00:00Z",
    updatedAt: "2024-08-01T00:00:00Z",
  },
  // ... other escrow objects (same structure, no changes needed)
];

// Type for status counts
interface StatusCounts {
  total: number;
  disputed: number;
  [key: string]: number; // Allow for dynamic status keys (e.g., "pending", "funded")
}

export default function EscrowManagementPage() {
  const [selectedDispute, setSelectedDispute] = useState<Escrow | null>(null);
  const [selectedEscrow, setSelectedEscrow] = useState<Escrow | null>(null);
  const [escrows] = useState<Escrow[]>(mockEscrows);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<
    | "all"
    | "pending"
    | "funded"
    | "delivered"
    | "disputed"
    | "released"
    | "refunded"
  >("all");
  const [disputeFilter, setDisputeFilter] = useState<
    "all" | "normal" | "disputed"
  >("all");
  const [disputeEvidence, setDisputeEvidence] = useState<string>("");
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const { editMode } = useEditProfileStore() as EditProfileStore;

  const getStatusIcon = (
    status: Escrow["status"]
  ): ComponentType<{ className?: string }> => {
    switch (status) {
      case "pending":
        return Clock3;
      case "funded":
        return DollarSign;
      case "delivered":
        return Package;
      case "disputed":
        return AlertCircle;
      case "released":
        return CheckCircle;
      case "refunded":
        return XCircle;
      default:
        return Clock3;
    }
  };

  if (editMode) return null;

  const getStatusColor = (status: Escrow["status"]): string => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "funded":
        return "text-blue-600 bg-blue-100 border-blue-200";
      case "delivered":
        return "text-purple-600 bg-purple-100 border-purple-200";
      case "disputed":
        return "text-red-600 bg-red-100 border-red-200";
      case "released":
        return "text-green-600 bg-green-100 border-green-200";
      case "refunded":
        return "text-orange-600 bg-orange-100 border-orange-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const filteredEscrows = useMemo(() => {
    return escrows.filter((escrow) => {
      const matchesSearch =
        escrow.itemId.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        escrow.buyerId.fullName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        escrow.sellerId.fullName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || escrow.status === statusFilter;
      const matchesDispute =
        disputeFilter === "all" ||
        (disputeFilter === "disputed" && escrow.isDisputed) ||
        (disputeFilter === "normal" && !escrow.isDisputed);

      return matchesSearch && matchesStatus && matchesDispute;
    });
  }, [escrows, searchTerm, statusFilter, disputeFilter]);

  const statusCounts = useMemo<StatusCounts>(() => {
    return escrows.reduce(
      (acc, escrow) => {
        acc[escrow.status] = (acc[escrow.status] || 0) + 1;
        acc.total += 1;
        if (escrow.isDisputed) acc.disputed += 1;
        return acc;
      },
      { total: 0, disputed: 0 } as StatusCounts
    );
  }, [escrows]);

  const totalValue = useMemo(() => {
    return escrows.reduce((sum, escrow) => sum + escrow.price, 0);
  }, [escrows]);

  const handleStatusUpdate = (
    escrowId: string,
    newStatus: Escrow["status"]
  ) => {
    console.log(`Updating escrow ${escrowId} to status ${newStatus}`);
  };

  const handleDisputeSubmit = () => {
    if (!disputeEvidence.trim() || !selectedDispute) return;

    console.log(
      `Submitting dispute evidence for ${selectedDispute._id}:`,
      disputeEvidence
    );
    setDisputeEvidence("");
    setSelectedDispute(null);
  };

  const getDaysUntilRelease = (releaseDate: string | null): number | null => {
    if (!releaseDate) return null;

    const date = new Date(releaseDate);
    if (isNaN(date.getTime())) return null;

    const days = Math.ceil(
      (date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return days > 0 ? days : 0;
  };

  // The JSX remains mostly unchanged, but we add types to event handlers
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Escrow Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage transactions and resolve disputes
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-blue-600 text-xs sm:text-sm font-medium truncate">
                    Total Escrows
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-900">
                    {statusCounts.total}
                  </p>
                </div>
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0 ml-2" />
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-green-600 text-xs sm:text-sm font-medium truncate">
                    Total Value
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-green-900">
                    ₦{(totalValue / 1000).toFixed(0)}k
                  </p>
                </div>
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0 ml-2" />
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-red-600 text-xs sm:text-sm font-medium truncate">
                    Disputed
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-red-900">
                    {statusCounts.disputed}
                  </p>
                </div>
                <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 flex-shrink-0 ml-2" />
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-purple-600 text-xs sm:text-sm font-medium truncate">
                    Active
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-900">
                    {(statusCounts.funded || 0) + (statusCounts.delivered || 0)}
                  </p>
                </div>
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 flex-shrink-0 ml-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by item, buyer, or seller..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <select
                value={statusFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setStatusFilter(
                    e.target.value as
                      | "all"
                      | "pending"
                      | "funded"
                      | "delivered"
                      | "disputed"
                      | "released"
                      | "refunded"
                  )
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="funded">Funded</option>
                <option value="delivered">Delivered</option>
                <option value="disputed">Disputed</option>
                <option value="released">Released</option>
                <option value="refunded">Refunded</option>
              </select>
              <select
                value={disputeFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setDisputeFilter(
                    e.target.value as "all" | "normal" | "disputed"
                  )
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">All Types</option>
                <option value="normal">Normal</option>
                <option value="disputed">Disputed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Escrow List */}
        <div className="space-y-4">
          {filteredEscrows.map((escrow) => {
            const StatusIcon = getStatusIcon(escrow.status);
            const daysUntilRelease = getDaysUntilRelease(escrow.releaseDate);

            return (
              <div
                key={escrow._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                        <h4 className="font-semibold text-gray-900 text-lg truncate">
                          {escrow.itemId.title}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              escrow.status
                            )}`}
                          >
                            <StatusIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">
                              {escrow.status.replace("_", " ").toUpperCase()}
                            </span>
                          </span>
                          {escrow.isDisputed && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                              <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span>DISPUTED</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-600 mb-3 text-sm sm:text-base">
                        {escrow.itemId.description}
                      </p>
                    </div>

                    {/* Mobile Action Menu */}
                    <div className="flex sm:hidden flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setSelectedEscrow(escrow);
                          setShowDetailsModal(true);
                        }}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-1 text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Details</span>
                      </button>

                      {escrow.isDisputed && (
                        <button
                          onClick={() => setSelectedDispute(escrow)}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-1 text-sm"
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>Dispute</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500">Buyer</p>
                      <p className="font-medium text-gray-900 truncate">
                        {escrow.buyerId.fullName}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">
                        {escrow.buyerId.email}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500">Seller</p>
                      <p className="font-medium text-gray-900 truncate">
                        {escrow.sellerId.fullName}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">
                        {escrow.sellerId.email}
                      </p>
                    </div>
                    <div className="sm:col-span-2 lg:col-span-1">
                      <p className="text-xs sm:text-sm text-gray-500">Amount</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">
                        ₦{escrow.price.toLocaleString()}
                      </p>
                      {escrow.paymentIntentId && (
                        <p className="text-xs text-gray-500 truncate">
                          ID: {escrow.paymentIntentId}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-0">
                      <span>
                        Created:{" "}
                        {new Date(escrow.createdAt).toLocaleDateString()}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span>
                        Updated:{" "}
                        {new Date(escrow.updatedAt).toLocaleDateString()}
                      </span>
                      {daysUntilRelease !== null && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Release in {daysUntilRelease} days</span>
                          </span>
                        </>
                      )}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden sm:flex flex-col lg:flex-row lg:space-y-0 lg:space-x-2 space-y-2">
                      <button
                        onClick={() => {
                          setSelectedEscrow(escrow);
                          setShowDetailsModal(true);
                        }}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2 text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Details</span>
                      </button>

                      {escrow.isDisputed && (
                        <button
                          onClick={() => setSelectedDispute(escrow)}
                          className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-2 text-sm"
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>Handle</span>
                        </button>
                      )}

                      {escrow.status === "funded" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(escrow._id, "delivered")
                          }
                          className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                        >
                          Mark Delivered
                        </button>
                      )}

                      {escrow.status === "delivered" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(escrow._id, "released")
                          }
                          className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors text-sm"
                        >
                          Release
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Mobile Actions Row */}
                  <div className="flex sm:hidden flex-wrap gap-2">
                    {escrow.status === "funded" && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(escrow._id, "delivered")
                        }
                        className="bg-purple-100 text-purple-700 px-3 py-2 rounded-lg hover:bg-purple-200 transition-colors text-sm flex-1"
                      >
                        Mark Delivered
                      </button>
                    )}

                    {escrow.status === "delivered" && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(escrow._id, "released")
                        }
                        className="bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors text-sm flex-1"
                      >
                        Release Funds
                      </button>
                    )}

                    <button className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center space-x-1 text-sm flex-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>Contact</span>
                    </button>

                    {escrow.deliveryProof && (
                      <button className="bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center space-x-1 text-sm flex-1">
                        <FileText className="w-4 h-4" />
                        <span>Proof</span>
                      </button>
                    )}
                  </div>

                  {escrow.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Notes:</strong> {escrow.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredEscrows.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No escrows found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedEscrow && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Escrow Details
                  </h4>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedEscrow(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3">
                      Transaction Info
                    </h5>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">Item:</span>
                        <p className="font-medium break-words">
                          {selectedEscrow.itemId.title}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">
                          Description:
                        </span>
                        <p className="break-words">
                          {selectedEscrow.itemId.description}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Amount:</span>
                        <p className="text-lg font-bold">
                          ₦{selectedEscrow.price.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Status:</span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 ${getStatusColor(
                            selectedEscrow.status
                          )}`}
                        >
                          {selectedEscrow.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3">
                      Parties
                    </h5>
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm text-gray-500">Buyer:</span>
                        <p className="font-medium break-words">
                          {selectedEscrow.buyerId.fullName}
                        </p>
                        <p className="text-sm text-gray-600 break-all">
                          {selectedEscrow.buyerId.email}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Seller:</span>
                        <p className="font-medium break-words">
                          {selectedEscrow.sellerId.fullName}
                        </p>
                        <p className="text-sm text-gray-600 break-all">
                          {selectedEscrow.sellerId.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedEscrow.deliveryProof && (
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3">
                      Delivery Proof
                    </h5>
                    <a
                      href={selectedEscrow.deliveryProof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 break-all"
                    >
                      <FileText className="w-4 h-4 flex-shrink-0" />
                      <span className="break-all">View Delivery Proof</span>
                    </a>
                  </div>
                )}

                {selectedEscrow.notes && (
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3">Notes</h5>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg break-words">
                      {selectedEscrow.notes}
                    </p>
                  </div>
                )}

                <div>
                  <h5 className="font-semibold text-gray-900 mb-3">Timeline</h5>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Created:</span>
                      <p className="break-words">
                        {new Date(selectedEscrow.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">
                        Last Updated:
                      </span>
                      <p className="break-words">
                        {new Date(selectedEscrow.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    {selectedEscrow.releaseDate && (
                      <div>
                        <span className="text-sm text-gray-500">
                          Auto-release Date:
                        </span>
                        <p className="break-words">
                          {new Date(
                            selectedEscrow.releaseDate
                          ).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dispute Modal */}
        {selectedDispute && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold text-red-700">
                    Dispute Resolution
                  </h4>
                  <button
                    onClick={() => {
                      setSelectedDispute(null);
                      setDisputeEvidence("");
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="font-medium text-red-900 mb-2">
                    Transaction Details
                  </p>
                  <div className="space-y-1 text-sm">
                    <p className="text-red-700 break-words">
                      <strong>Item:</strong> {selectedDispute.itemId.title}
                    </p>
                    <p className="text-red-700">
                      <strong>Amount:</strong> ₦
                      {selectedDispute.price.toLocaleString()}
                    </p>
                    <p className="text-red-700 break-words">
                      <strong>Buyer:</strong> {selectedDispute.buyerId.fullName}
                    </p>
                    <p className="text-red-700 break-words">
                      <strong>Seller:</strong>{" "}
                      {selectedDispute.sellerId.fullName}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Evidence & Resolution Notes
                  </label>
                  <textarea
                    value={disputeEvidence}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setDisputeEvidence(e.target.value)
                    }
                    placeholder="Describe the issue, provide evidence links, and outline resolution steps..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Upload className="w-4 h-4 flex-shrink-0" />
                  <span>You can also upload supporting documents</span>
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handleDisputeSubmit}
                    disabled={!disputeEvidence.trim()}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white py-2 rounded-lg transition-colors"
                  >
                    Submit Resolution
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDispute(null);
                      setDisputeEvidence("");
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
