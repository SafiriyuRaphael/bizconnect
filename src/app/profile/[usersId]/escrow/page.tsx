"use client";
import { DollarSign, AlertTriangle, Shield, Activity } from "lucide-react";
import useEscrow from "./hooks";
import { useSession } from "next-auth/react";
import formatPrice from "@/shared/utils/formatPrice";
import Loader from "@/shared/components/ui/Loader";
import Header from "./components/layout/Header";
import StatGrid from "./components/composite/StatGrid";
import Filter from "./components/composite/Filter";
import getStatusConfig from "./utils/getStatusConfig";
import ListView from "./components/composite/ListView";
import { useEscrowStore } from "./store";
import GridView from "./components/composite/GridView";
import EmptyState from "./components/composite/EmptyState";
import DeliveryModal from "./components/modals/DeliveryModal";
import DetailsModal from "./components/modals/DetailsModal";
import DisputeModal from "./components/modals/DisputeModal";
import { useEditProfileStore } from "@/shared/store/useEditProfileStore";

export default function CleanEscrowDashboard() {
  const { data: session } = useSession();

  const { allEscrows, isFetchingEscrows, handleParamsChange } = useEscrow();
  const {
    viewMode,
    selectedDispute,
    selectedEscrow,
    showDeliveryModal,
    showDetailsModal,
  } = useEscrowStore();
  const { editMode } = useEditProfileStore();

  const stats = [
    {
      title: "Total Escrows",
      value: allEscrows ? allEscrows.summary.totalEscrows : 0,
      icon: <Shield />,
      iconColor: "text-gray-400",
    },
    {
      title: "Total Value",
      value: allEscrows ? formatPrice(allEscrows.summary.totalValue) : "$0.00",
      icon: <DollarSign />,
      iconColor: "text-gray-400",
    },
    {
      title: "Disputed",
      value: allEscrows ? allEscrows.summary.disputed : 0,
      icon: <AlertTriangle />,
      iconColor: "text-red-400",
    },
    {
      title: "Active",
      value: allEscrows ? allEscrows.summary.active : 0,
      icon: <Activity />,
      iconColor: "text-blue-400",
    },
  ];

  if (editMode) return null;

  return (
    <div
      className={`${
        allEscrows && !isFetchingEscrows ? "min-h-screen" : "min-h-[20vh]"
      } bg-gray-50`}
    >
      {/* Header */}
      <Header />

      <div className="max-w-7xl mx-auto py-6 space-y-6">
        {/* Stats Grid */}
        {!isFetchingEscrows && allEscrows && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => {
              const { icon, title, value, iconColor } = stat;
              return (
                <StatGrid
                  icon={icon}
                  title={title}
                  value={value}
                  iconBgColor={iconColor}
                  key={i}
                />
              );
            })}
          </div>
        )}

        {/* Filters & Search */}
        <Filter handleParamsChange={handleParamsChange} />

        {/* Escrow Items */}
        {isFetchingEscrows ? (
          <div className="flex items-center justify-center h-[30vh]">
            <Loader
              size="lg"
              variant="bars"
              text="Getting escrows transactions"
            />
          </div>
        ) : (
          <div
            className={`${
              viewMode === "grid"
                ? "grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6"
                : "space-y-4"
            }`}
          >
            {allEscrows?.escrows.map((escrow) => {
              const statusConfig = getStatusConfig(
                escrow.status,
                escrow.isDisputed
              );
              if (viewMode === "list") {
                return (
                  <ListView
                    escrow={escrow}
                    statusConfig={statusConfig}
                    key={escrow._id}
                  />
                );
              }

              return (
                <GridView
                  escrow={escrow}
                  session={session?.user}
                  statusConfig={statusConfig}
                  key={escrow._id}
                />
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isFetchingEscrows && allEscrows?.escrows.length === 0 && (
          <EmptyState />
        )}

        {/* Mark as Delivered Modal */}
        {showDeliveryModal && selectedEscrow && <DeliveryModal />}

        {/* Details Modal */}
        {showDetailsModal && selectedEscrow && <DetailsModal />}

        {/* Dispute Modal */}
        {selectedDispute && <DisputeModal />}
      </div>
    </div>
  );
}
