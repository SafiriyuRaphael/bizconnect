"use client";
import { AnyUser, SessionUser } from "../../../../types";
import ImageModal from "@/shared/components/modal/ImageModal";
import { useProductStore } from "@/shared/store/useProductsStore";
import { useEffect } from "react";
import { useUserDashboardStore } from "../store";
import useUserDashboardActions from "../hooks";
import Header from "./layouts/Header";
import Main from "./layouts/Main";
import Sidebar from "./layouts/Sidebar";
import PaymentModal from "@/shared/components/modal/Payment";

const UsersProfile = ({
  user,
  session,
}: {
  user: AnyUser;
  session: SessionUser;
}) => {
  useEffect(() => {
    if (user?._id) {
      useProductStore.getState().setUserId(user._id);
      useUserDashboardStore.getState().setUser(user);
    }
  }, [user]);

  const { comments, selectedImageIndex, setSelectedImageIndex } =
    useUserDashboardStore();

  const { fetchInitialData } = useUserDashboardActions();


  const { itemData, showPaymentModal } = useProductStore();

  const averageRating =
    comments.length > 0
      ? comments.reduce((acc, comment) => acc + comment.rating, 0) /
        comments.length
      : 0;

  useEffect(() => {
    fetchInitialData({ user, session });
  }, [user, session]);

  return (
    <div className="min-h-screen bg-gray-50">
      {itemData && showPaymentModal && (
        <PaymentModal productItem={itemData} quantity={1} />
      )}
      {/* Image Modal */}
      {selectedImageIndex !== null && user.displayPics && (
        <ImageModal
          displayPics={user.displayPics}
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
        />
      )}

      {/* Header */}
      <Header/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <Main
            session={session}
          />

          {/* Sidebar */}
          <Sidebar
       
          />
        </div>
      </div>
    </div>
  );
};

export default UsersProfile;
