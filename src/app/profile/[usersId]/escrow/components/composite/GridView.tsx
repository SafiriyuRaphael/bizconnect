import ProfileImage from "@/shared/components/composites/ProfileImage";
import {
  AlertCircle,
  AlertTriangle,
  Clock3,
  ExternalLink,
  Eye,
  FileText,
  MessageSquare,
  Star,
  Timer,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import React from "react";
import { IEscrow, IStatusConfig } from "../../types/escrow";
import formatPrice from "@/shared/utils/formatPrice";
import canMarkDelivered from "../../utils/canMarkDelivered";
import { SessionUser } from "../../../../../../../types";
import canReleaseFunds from "../../utils/canReleaseFunds";
import canDispute from "../../utils/canDispute";
import { useEscrowStore } from "../../store";
import useEscrow from "../../hooks";
import getDaysUntilRelease from "../../utils/getDaysUntilRelease";
import getHoursUntilRelease from "../../utils/getHoursUntilRelease";
import { useRouter } from "next/navigation";
import canRespondToDispute from "../../utils/canRespondToDispute";
import getDisputeStatusConfig from "../../utils/getDisputeStatusCofig";

export default function GridView({
  escrow,
  statusConfig,
  session,
}: {
  escrow: IEscrow;
  statusConfig: IStatusConfig;
  session?: SessionUser | null;
}) {
  const router = useRouter();
  const otherUserId =
    session?.id === escrow.sellerId._id
      ? escrow.buyerId._id
      : escrow.sellerId._id;

  const { setSelectedDispute, setSelectedEscrow, setShowDetailsModal } =
    useEscrowStore();
  const {
    handleMarkDelivered,
    updateMutation,
    isFetchingEscrows,
    handleOpenDispute,
  } = useEscrow();

  const StatusIcon = statusConfig.icon;
  const daysUntilRelease = getDaysUntilRelease(escrow.releaseDate || null);
  const hoursUntilRelease = getHoursUntilRelease(escrow.releaseDate || null);

  if (!session) return null;

  return (
    <div
      key={escrow._id}
      className={`bg-white rounded-lg border hover:shadow-md transition-all duration-200 h-full flex flex-col ${
        escrow.isDisputed ? "border-red-200 bg-red-50/30" : "border-gray-200"
      }`}
    >
      <div className="p-4 md:p-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-base md:text-lg font-medium text-gray-900 truncate">
                {escrow.itemId.title}
              </h3>
              {escrow.isDisputed && (
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {escrow.itemId.description}
            </p>
            <div className="flex items-center space-x-2 flex-wrap gap-1">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${statusConfig.color}`}
              >
                <StatusIcon className="w-4 h-4 mr-1" />
                {escrow.isDisputed
                  ? "Disputed"
                  : escrow.status.charAt(0).toUpperCase() +
                    escrow.status.slice(1)}
              </span>

              {/* Dispute Status Badge */}
              {escrow.isDisputed && escrow.dispute && (
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                    getDisputeStatusConfig(escrow.dispute.status).color
                  }`}
                >
                  {React.createElement(
                    getDisputeStatusConfig(escrow.dispute.status).icon,
                    {
                      className: "w-3 h-3 mr-1",
                    }
                  )}
                  {escrow.dispute.status.charAt(0).toUpperCase() +
                    escrow.dispute.status.slice(1).replace("_", " ")}
                </span>
              )}

              {escrow.status === "delivered" &&
                escrow.deliveryProof &&
                escrow.deliveryProof.length > 0 &&
                escrow.deliveryProof.map((proof, index) => (
                  <a
                    key={index}
                    href={proof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-2 py-1 text-xs text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Proof
                  </a>
                ))}
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedEscrow(escrow);
              setShowDetailsModal(true);
            }}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-50 ml-2 flex-shrink-0"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Auto-release warning for delivered items */}
        {escrow.status === "delivered" &&
          !escrow.isDisputed &&
          escrow.releaseDate && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Timer className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800">
                    Auto-release Pending
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    {daysUntilRelease && daysUntilRelease > 0
                      ? `Funds will automatically release in ${daysUntilRelease} day${
                          daysUntilRelease !== 1 ? "s" : ""
                        }`
                      : hoursUntilRelease && hoursUntilRelease > 0
                      ? `Funds will automatically release in ${hoursUntilRelease} hour${
                          hoursUntilRelease !== 1 ? "s" : ""
                        }`
                      : "Funds will release shortly"}{" "}
                    unless disputed.
                  </p>
                </div>
              </div>
            </div>
          )}

        {/* Participants */}
        <div className="grid grid-cols-1 gap-3 mb-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <ProfileImage
              user={{
                businessName: escrow.buyerId.businessName,
                fullName: escrow.buyerId.fullName,
              }}
              logo={escrow.buyerId.logo}
              className="w-8 h-8 rounded-full flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">Buyer</p>
              <p className="font-medium text-gray-900 text-sm truncate">
                {escrow.buyerId.businessName || escrow.buyerId.fullName}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <ProfileImage
              user={{
                businessName: escrow.sellerId.businessName,
                fullName: escrow.sellerId.fullName,
              }}
              logo={escrow.sellerId.logo}
              className="w-8 h-8 rounded-full flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">Seller</p>
              <div className="flex items-center space-x-1">
                <p className="font-medium text-gray-900 text-sm truncate">
                  {escrow.sellerId.businessName || escrow.sellerId.fullName}
                </p>
                {escrow.sellerId.rating && (
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600">
                      {escrow.sellerId.rating}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dispute Information or Notes Section */}
        {escrow.isDisputed && escrow.dispute ? (
          <div className="mb-4 p-3 rounded-lg border bg-red-50 border-red-200">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium mb-1 text-red-700">
                  Dispute Reason
                </p>
                <p className="text-sm leading-relaxed text-red-800 mb-2">
                  {escrow.dispute.reason
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                </p>
                <p className="text-xs text-red-600">
                  Raised by:{" "}
                  {escrow.dispute.raisedBy === escrow.buyerId._id
                    ? escrow.buyerId.businessName || escrow.buyerId.fullName
                    : escrow.sellerId.businessName || escrow.sellerId.fullName}
                </p>

                {/* Show resolution info if resolved */}
                {escrow.dispute.status === "resolved" &&
                  escrow.dispute.resolution && (
                    <div className="mt-2 pt-2 border-t border-red-200">
                      <p className="text-xs font-medium text-green-700 mb-1">
                        Resolution
                      </p>
                      <p className="text-sm text-green-800">
                        {escrow.dispute.resolution.length > 100
                          ? `${escrow.dispute.resolution.slice(0, 97)}...`
                          : escrow.dispute.resolution}
                      </p>
                      {escrow.dispute.resolvedBy && (
                        <p className="text-xs text-green-600 mt-1">
                          Resolved by: {escrow.dispute.resolvedBy}
                        </p>
                      )}
                    </div>
                  )}
              </div>
            </div>
          </div>
        ) : (
          /* Regular Notes Section */
          escrow.notes &&
          escrow.notes.length > 0 && (
            <div className="mb-4 p-3 rounded-lg border bg-gray-50 border-gray-200">
              <div className="flex items-start space-x-2">
                <FileText className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium mb-1 text-gray-600">
                    Project Notes
                  </p>
                  <p className="text-sm leading-relaxed text-gray-700">
                    {escrow.notes[0].length > 100
                      ? `${escrow.notes[0].slice(0, 97)}...`
                      : escrow.notes[0]}
                  </p>
                </div>
              </div>
            </div>
          )
        )}

        {/* Flex spacer to push amount & actions to bottom */}
        <div className="flex-1"></div>

        {/* Amount & Actions */}
        <div className="flex flex-col space-y-3 md:flex-row md:items-end md:justify-between md:space-y-0 pt-4 border-t border-gray-200 mt-auto">
          <div className="flex-shrink-0">
            <p className="text-sm text-gray-500">Amount</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatPrice(escrow.price)}
            </p>
            {daysUntilRelease !== null && escrow.status === "delivered" && (
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <Clock3 className="w-3 h-3 mr-1" />
                {daysUntilRelease > 0
                  ? `${daysUntilRelease} days to auto-release`
                  : hoursUntilRelease && hoursUntilRelease > 0
                  ? `${hoursUntilRelease} hours to auto-release`
                  : "Auto-releasing soon"}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2 flex-wrap gap-2 justify-end">
            {canMarkDelivered(escrow, session) && (
              <button
                onClick={() => handleMarkDelivered(escrow._id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
              >
                <Truck className="w-4 h-4" />
                <span>Mark Delivered</span>
              </button>
            )}

            {canReleaseFunds(escrow, session) && (
              <button
                onClick={() =>
                  updateMutation.mutate({
                    escrowId: escrow._id,
                    action: "released",
                  })
                }
                disabled={updateMutation.isPending || isFetchingEscrows}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateMutation.isPending ? "Releasing..." : "Release Funds"}
              </button>
            )}

            {/* Dispute Actions */}
            {escrow.isDisputed ? (
              <div className="flex items-center space-x-2">
                {/* Respond to Dispute button for the other party */}
                {canRespondToDispute({ escrow, session }) && (
                  <button
                    onClick={() => setSelectedDispute(escrow)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    Respond to Dispute
                  </button>
                )}

                {/* Show status for disputes that can't be acted upon */}
                {!canRespondToDispute({ session, escrow }) &&
                  escrow.dispute && (
                    <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                      {escrow.dispute.status === "resolved"
                        ? "Dispute Resolved"
                        : escrow.dispute.responded
                        ? "Awaiting Review"
                        : escrow.dispute.raisedBy === session.id
                        ? "Dispute Raised"
                        : "Pending Response"}
                    </span>
                  )}
              </div>
            ) : (
              canDispute(escrow) && (
                <button
                  onClick={() => handleOpenDispute(escrow)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Open Dispute
                </button>
              )
            )}

            <button
              className="text-gray-500 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 flex-shrink-0"
              onClick={() => router.push(`/chat?recipientId=${otherUserId}`)}
              title="Send message"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
