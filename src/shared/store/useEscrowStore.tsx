import { create } from "zustand";
import {
  AlertCircle,
  CheckCircle,
  Clock3,
  DollarSign,
  Package,
  XCircle,
} from "lucide-react";
import { Escrow } from "../../../types";

interface EscrowState {
  selectedDispute: Partial<Escrow> | null;
  selectedEscrow: Escrow | null;
  escrows: Escrow[];
  searchTerm: string;
  statusFilter: "all" | Escrow["status"];
  disputeFilter: "all" | "disputed" | "normal";
  disputeEvidence: string;
  showDetailsModal: boolean;
  setSelectedDispute: (dispute: Partial<Escrow> | null) => void;
  setSelectedEscrow: (escrow: Escrow | null) => void;
  setEscrows: (escrows: Escrow[]) => void;
  setSearchTerm: (searchTerm: string) => void;
  setStatusFilter: (statusFilter: "all" | Escrow["status"]) => void;
  setDisputeFilter: (disputeFilter: "all" | "disputed" | "normal") => void;
  setDisputeEvidence: (disputeEvidence: string) => void;
  setShowDetailsModal: (show: boolean) => void;
  getStatusIcon: (status: Escrow["status"]) => typeof Clock3;
  getStatusColor: (status: Escrow["status"]) => string;
  getDaysUntilRelease: (releaseDate: string | Date | null) => number | null;
  filteredEscrows: () => Escrow[];
  statusCounts: () => {
    total: number;
    disputed: number;
    [key: string]: number;
  };
  totalValue: () => number;
}

export const useEscrowStore = create<EscrowState>((set, get) => ({
  selectedDispute: null,
  selectedEscrow: null,
  escrows: [],
  searchTerm: "",
  statusFilter: "all",
  disputeFilter: "all",
  disputeEvidence: "",
  showDetailsModal: false,
  setSelectedDispute: (dispute) => set({ selectedDispute: dispute }),
  setSelectedEscrow: (escrow) => set({ selectedEscrow: escrow }),
  setEscrows: (escrows) => set({ escrows }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setDisputeFilter: (disputeFilter) => set({ disputeFilter }),
  setDisputeEvidence: (disputeEvidence) => set({ disputeEvidence }),
  setShowDetailsModal: (show) => set({ showDetailsModal: show }),
  getStatusIcon: (status) => {
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
  },
  getStatusColor: (status) => {
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
  },
  getDaysUntilRelease: (releaseDate) => {
    if (!releaseDate) return null;
    const days = Math.ceil(
      (new Date(releaseDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return days > 0 ? days : 0;
  },
  filteredEscrows: () => {
    const { escrows, searchTerm, statusFilter, disputeFilter } = get();
    return escrows.filter((escrow) => {
      const matchesSearch =
        escrow.itemId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        escrow.buyerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        escrow.sellerId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || escrow.status === statusFilter;
      const matchesDispute =
        disputeFilter === "all" ||
        (disputeFilter === "disputed" && escrow.isDisputed) ||
        (disputeFilter === "normal" && !escrow.isDisputed);
      return matchesSearch && matchesStatus && matchesDispute;
    });
  },
  statusCounts: () => {
    const { escrows } = get();
    return escrows.reduce(
      (acc, escrow) => {
        acc[escrow.status] = (acc[escrow.status] || 0) + 1;
        acc.total += 1;
        if (escrow.isDisputed) acc.disputed += 1;
        return acc;
      },
      { total: 0, disputed: 0 } as {
        total: number;
        disputed: number;
        [key: string]: number;
      }
    );
  },
  totalValue: () => {
    const { escrows } = get();
    return escrows.reduce((sum, escrow) => sum + escrow.price, 0);
  },
}));
