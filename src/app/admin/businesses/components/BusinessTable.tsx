import getCategoryColor from "@/lib/business/getCategoryColor";
import { AllBusinessProps } from "../../../../../types";
import {
  Column,
  GenericTable,
  GenericTableProps,
} from "../../components/layout/GenericTable";
import ProfileImage from "@/app/components/layout/ProfileImage";
import { getBusinessCategoryDetails } from "@/lib/business/getBusinessCategoryDetails";
import getVerificationDetails from "@/lib/business/getVerificationDetails";

export default function BusinessTable({
  filteredBusinesses,
  activeUsers,
  handleView,
  handleEdit,
  handleDeleteModal,
  total,
  limit,
  currentPage,
  onPageChange,
}: GenericTableProps<AllBusinessProps> & {
  filteredBusinesses: AllBusinessProps[];
  activeUsers: string[];
}) {
  const columns: Column<AllBusinessProps>[] = [
    {
      header: "Business",
      accessor: "businessName",
      render: (business) => (
        <div className="flex items-center">
          <div className="relative mr-4">
            <ProfileImage
              logo={business.logo}
              user={business}
              className="w-12 h-12 rounded-xl object-cover border-2 border-gray-100"
            />
            {activeUsers.includes(business._id) && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {business.businessName}
            </div>
            <div className="text-sm text-gray-600">{business.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: "businessCategory",
      render: (business) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            getCategoryColor ? getCategoryColor(business.businessCategory) : ""
          }`}
        >
          {getBusinessCategoryDetails
            ? getBusinessCategoryDetails(business.businessCategory).name
            : business.businessCategory}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (business) => {
        const verificationStatus = getVerificationDetails
          ? getVerificationDetails(business)
          : { icon: null, text: "", color: "", bgColor: "", borderColor: "" };
        return (
          <div className="flex items-center">
            {verificationStatus.icon}
            <span
              className={`ml-2 px-2 py-1 text-xs font-medium rounded-full border ${verificationStatus.color} ${verificationStatus.bgColor} ${verificationStatus.borderColor}`}
            >
              {verificationStatus.text}
            </span>
          </div>
        );
      },
    },
    {
      header: "Contacts",
      accessor: "contactCount",
    },
  ];

  return (
    <GenericTable
      data={filteredBusinesses}
      columns={columns}
      total={total}
      limit={limit}
      currentPage={currentPage}
      onPageChange={onPageChange}
      activeUsers={activeUsers}
      handleView={handleView}
      handleEdit={handleEdit}
      handleDeleteModal={handleDeleteModal}
    />
  );
}
