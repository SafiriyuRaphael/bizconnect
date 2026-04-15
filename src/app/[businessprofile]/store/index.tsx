import { create } from "zustand";
import getBusinessReviews from "@/lib/reviews/getBusinessReviews";
import getUserReviews from "@/lib/reviews/getUserReviews";
import { AnyUser, BusinessReviewsProps, SessionUser } from "../../../../types";

interface UserDashboardState {
  user: AnyUser | null;
  comments: BusinessReviewsProps[];
  averageRating: number;
  newComment: string;
  newRating: number;
  isEditable: boolean;
  selectedImageIndex: number | null;
  openFullGallery: boolean;
  copied: boolean;
  currentView: "grid" | "all";
  viewMode: "grid" | "list";
  setUser: (user: AnyUser) => void;
  setComments: (
    comments:
      | BusinessReviewsProps[]
      | ((prev: BusinessReviewsProps[]) => BusinessReviewsProps[])
  ) => void;
  setNewComment: (comment: string) => void;
  setNewRating: (rating: number) => void;
  setIsEditable: (isEditable: boolean) => void;
  setSelectedImageIndex: (index: number | null) => void;
  setOpenFullGallery: (open: boolean) => void;
  setCopied: (copied: boolean) => void;
  fetchInitialData: (params: {
    user: AnyUser;
    session: SessionUser;
  }) => Promise<void>;
  setCurrentView: (view: "grid" | "all") => void;
  setViewMode: (view: "grid" | "list") => void;
}

export const useUserDashboardStore = create<UserDashboardState>((set, get) => ({
  user: null,
  comments: [],
  averageRating: 0,
  newComment: "",
  newRating: 5,
  isEditable: true,
  selectedImageIndex: null,
  openFullGallery: false,
  copied: false,
  currentView: "grid",
  viewMode: "grid",
  setUser: (user: AnyUser) => set({ user }),
  setComments: (comments) => {
    if (typeof comments === "function") {
      set((state) => {
        const updated = comments(state.comments);
        return {
          comments: updated,
          averageRating:
            updated.length > 0
              ? updated.reduce((acc, c) => acc + c.rating, 0) / updated.length
              : 0,
        };
      });
    } else {
      set({
        comments,
        averageRating:
          comments.length > 0
            ? comments.reduce((acc, c) => acc + c.rating, 0) / comments.length
            : 0,
      });
    }
  },

  setNewComment: (newComment) => set({ newComment }),
  setCurrentView: (view) => set({ currentView: view }),
  setViewMode: (view) => set({ viewMode: view }),
  setNewRating: (newRating) => set({ newRating }),
  setIsEditable: (isEditable) => set({ isEditable }),
  setSelectedImageIndex: (selectedImageIndex) => set({ selectedImageIndex }),
  setOpenFullGallery: (openFullGallery) => set({ openFullGallery }),
  setCopied: (copied) => set({ copied }),

  fetchInitialData: async ({ user, session }) => {
    try {
      if (session.id !== user._id) {
        const userReview = await getUserReviews({
          businessId: user._id,
          userId: session.id,
        });
        if (userReview) {
          set({
            isEditable: false,
            newRating: userReview.review.rating,
            newComment: userReview.review.comment,
          });
        } else {
          set({ isEditable: true });
        }
      }

      if (user.userType === "business") {
        const reviews = await getBusinessReviews({
          businessId: user._id,
        });
        const reviewsList = reviews?.reviews || [];
        set({
          comments: reviewsList,
          averageRating:
            reviewsList.length > 0
              ? reviewsList.reduce((acc, c) => acc + c.rating, 0) /
                reviewsList.length
              : 0,
        });
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  },
}));
