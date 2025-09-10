import formatPrice from "@/lib/static/formatPrice";
import ProfileImage from "@/shared/components/composites/ProfileImage";
import {
  AlertTriangle,
  Clock,
  DollarSign,
  ExternalLink,
  MessageSquare,
  Package,
  Send,
  Star,
  Timer,
  X,
} from "lucide-react";
import React, { useState } from "react";
import getHoursUntilRelease from "../../utils/getHoursUntilRelease";
import getDaysUntilRelease from "../../utils/getDaysUntilRelease";
import { useEscrowStore } from "../../store";
import getStatusConfig from "../../utils/getStatusConfig";
import useEscrow from "../../hooks";

export default function DetailsModal() {
  const {
    activeTab,
    selectedEscrow,
    setActiveTab,
    setSelectedEscrow,
    setShowDetailsModal,
    newNote,
    setNewNote,
  } = useEscrowStore();

  const { noteMutation } = useEscrow();

  const daysUntilRelease = getDaysUntilRelease(
    selectedEscrow?.releaseDate || null
  );

  const hoursUntilRelease = getHoursUntilRelease(
    selectedEscrow?.releaseDate || null
  );

  if (!selectedEscrow) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h4 className="text-xl font-semibold text-gray-900">
              Transaction Details
            </h4>
            <p className="text-gray-500">{selectedEscrow.itemId.title}</p>
          </div>
          <button
            onClick={() => {
              setShowDetailsModal(false);
              setSelectedEscrow(null);
            }}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex space-x-8">
            {(["overview", "timeline", "communications"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              )
            )}
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Status Alert */}
              {selectedEscrow.status === "delivered" &&
                !selectedEscrow.isDisputed && (
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-start space-x-3">
                      <Timer className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-amber-900 mb-1">
                          Auto-release Schedule
                        </p>
                        <p className="text-sm text-amber-800">
                          {selectedEscrow.releaseDate &&
                          daysUntilRelease &&
                          daysUntilRelease > 0
                            ? `Funds will automatically release in ${getDaysUntilRelease(
                                selectedEscrow.releaseDate
                              )} day${
                                getDaysUntilRelease(
                                  selectedEscrow.releaseDate
                                ) !== 1
                                  ? "s"
                                  : ""
                              }`
                            : selectedEscrow.releaseDate &&
                              hoursUntilRelease &&
                              hoursUntilRelease > 0
                            ? `Funds will automatically release in ${getHoursUntilRelease(
                                selectedEscrow.releaseDate
                              )} hour${
                                getHoursUntilRelease(
                                  selectedEscrow.releaseDate
                                ) !== 1
                                  ? "s"
                                  : ""
                              }`
                            : "Funds will release shortly"}{" "}
                          unless the buyer disputes the delivery.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {/* Dispute Alert */}
              {selectedEscrow.isDisputed && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-red-900 mb-1">
                        Transaction Disputed
                      </p>
                      <p className="text-sm text-red-800">
                        This transaction is currently under dispute.
                        Auto-release has been suspended pending resolution.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Project Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-4">
                    Project Information
                  </h5>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Title</p>
                      <p className="font-medium text-gray-900">
                        {selectedEscrow.itemId.title}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Description</p>
                      <p className="text-gray-900">
                        {selectedEscrow.itemId.description}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Amount</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {formatPrice(selectedEscrow.price)}
                      </p>
                    </div>
                    {selectedEscrow.deliveryProof &&
                      selectedEscrow.deliveryProof.length > 0 && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">
                            Delivery Proof
                          </p>
                          {selectedEscrow.deliveryProof.map((proof) => (
                            <a
                              href={proof}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex pr-2 items-center text-blue-600 hover:text-blue-700 font-medium"
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              View Proof
                            </a>
                          ))}
                        </div>
                      )}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-4">
                    Status & Timeline
                  </h5>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">
                        Current Status
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium ${
                          getStatusConfig(
                            selectedEscrow.status,
                            selectedEscrow.isDisputed
                          ).color
                        }`}
                      >
                        {selectedEscrow.isDisputed
                          ? "DISPUTED"
                          : selectedEscrow.status.toUpperCase()}
                      </span>
                    </div>
                    {selectedEscrow.releaseDate &&
                      !selectedEscrow.isDisputed && (
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">
                            Auto-release Date
                          </span>
                          <span className="text-sm text-gray-900">
                            {new Date(
                              selectedEscrow.releaseDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">
                        Last Updated
                      </span>
                      <span className="text-sm text-gray-900">
                        {new Date(
                          selectedEscrow.updatedAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Participants */}
              <div>
                <h5 className="font-medium text-gray-900 mb-4">Participants</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <ProfileImage
                        user={{
                          businessName: selectedEscrow.buyerId.businessName,
                          fullName: selectedEscrow.buyerId.fullName,
                        }}
                        logo={selectedEscrow.buyerId.logo}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">Buyer</p>
                        <p className="font-medium text-gray-900">
                          {selectedEscrow.buyerId.businessName ||
                            selectedEscrow.buyerId.fullName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedEscrow.buyerId.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <ProfileImage
                        user={{
                          businessName: selectedEscrow.sellerId.businessName,
                          fullName: selectedEscrow.sellerId.fullName,
                        }}
                        logo={selectedEscrow.sellerId.logo}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">Seller</p>
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium text-gray-900">
                            {selectedEscrow.sellerId.businessName ||
                              selectedEscrow.sellerId.fullName}
                          </p>
                          {selectedEscrow.sellerId.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">
                                {selectedEscrow.sellerId.rating}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {selectedEscrow.sellerId.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes - Only show the most recent note in overview */}
              {selectedEscrow.notes && selectedEscrow.notes.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-4">
                    {selectedEscrow.isDisputed
                      ? "Dispute Information"
                      : "Latest Note"}
                  </h5>
                  <div
                    className={`p-4 rounded-lg ${
                      selectedEscrow.isDisputed
                        ? "bg-red-50 border border-red-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <p
                      className={`${
                        selectedEscrow.isDisputed
                          ? "text-red-800"
                          : "text-gray-700"
                      }`}
                    >
                      {selectedEscrow.isDisputed
                        ? `${selectedEscrow.dispute?.reason
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (char) => char.toUpperCase())}`
                        : ` ${
                            selectedEscrow.notes[
                              selectedEscrow.notes.length - 1
                            ]
                          }`}
                    </p>
                    {!selectedEscrow.isDisputed &&
                      selectedEscrow.notes.length > 1 && (
                        <button
                          onClick={() => setActiveTab("communications")}
                          className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View all notes ({selectedEscrow.notes.length})
                        </button>
                      )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-6">
              <h5 className="font-medium text-gray-900 mb-4">
                Transaction Timeline
              </h5>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Transaction Created
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedEscrow.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Escrow initiated by buyer
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Funds Secured</p>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedEscrow.updatedAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatPrice(selectedEscrow.price)} held in escrow
                    </p>
                  </div>
                </div>
                {selectedEscrow.status === "delivered" && (
                  <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Marked as Delivered
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedEscrow.updatedAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Seller confirmed delivery completion
                      </p>
                      {selectedEscrow.releaseDate &&
                        !selectedEscrow.isDisputed && (
                          <p className="text-sm text-amber-600 mt-1">
                            Auto-release scheduled for{" "}
                            {new Date(
                              selectedEscrow.releaseDate
                            ).toLocaleDateString()}
                          </p>
                        )}
                    </div>
                  </div>
                )}
                {selectedEscrow.isDisputed && (
                  <div className="flex items-start space-x-4 p-4 bg-red-50 rounded-lg">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Dispute Opened
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedEscrow.updatedAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Transaction requires manual resolution
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "communications" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-gray-900">
                  Escrow Transaction Notes
                </h5>
                {selectedEscrow.notes && selectedEscrow.notes.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {selectedEscrow.notes.length} note
                    {selectedEscrow.notes.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Add Note Form */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h6 className="font-medium text-blue-900 mb-3">Add New Note</h6>
                <div className="space-y-3">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter your note or message here..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    disabled={noteMutation.isPending}
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() =>
                        noteMutation.mutate({
                          escrowId: selectedEscrow._id,
                          note: newNote,
                        })
                      }
                      disabled={!newNote.trim() || noteMutation.isPending}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {noteMutation.isPending ? "Adding..." : "Add Note"}
                    </button>
                  </div>
                </div>
              </div>

              {selectedEscrow.notes && selectedEscrow.notes.length > 0 ? (
                <div className="space-y-4">
                  {selectedEscrow.notes.map((note, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-900">
                              Note #{index + 1}
                            </p>
                            <span className="text-xs text-gray-500">
                              {/* You might want to add timestamps for notes in your schema */}
                              {new Date(
                                selectedEscrow.updatedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <p
                            className="text-sm text-gray-700"
                          >
                            {note}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No notes yet</p>
                  <p className="text-sm text-gray-400">
                    Add your first note using the form above
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
