import { AddReviewProps, AnyUser, BusinessReviewHelpfulProps, BusinessReviewsProps, SessionUser } from '../../../../types';
import { useUserDashboardStore } from '../store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMessageModalStore } from '@/shared/store/useMessageModalStore';
import addReview from '../api/addReview';
import toggleUserHelpful from '../api/toggleUserHelpful';
import getUserReview from '../api/getUserReview';
import getBusinessReview from '../api/getBusinessReview';
import { useRouter } from 'next/navigation';
import { BASEURL } from '@/shared/constants/url';
import slugify from '@/shared/utils/slugify';

export default function useUserDashboardActions() {
  const router = useRouter()
  const { setComments, setIsEditable, setNewRating, setNewComment, setSelectedImageIndex, newComment, newRating, setCopied } = useUserDashboardStore();
  const queryClient = useQueryClient();

  const submitReview = useMutation<{
    message: string;
    status: string;
    reviews: BusinessReviewsProps[];
  }, Error, AddReviewProps>({
    mutationFn: addReview,
    onSuccess: (data) => {
      setComments(data?.reviews || []);
      useMessageModalStore.getState().onOpen({
        title: "Success",
        message: "Review posted successfully!",
        type: "success",
      });
      setIsEditable(false);
    },
  });

  const helpfulToggle = useMutation<
    { helpful: BusinessReviewHelpfulProps; message: string },
    Error,
    { businessId: string; reviewId: string; userId: string }, { previousComments: BusinessReviewsProps[] }
  >({
    mutationFn: toggleUserHelpful,
    // optimistic update
    onMutate: async ({ reviewId, userId }) => {
      await queryClient.cancelQueries({ queryKey: ["businessReviews"] });

      const previousComments = useUserDashboardStore.getState().comments;

      useUserDashboardStore.getState().setComments((prev) =>
        prev.map((comment) =>
          comment._id === reviewId
            ? {
              ...comment,
              helpful: {
                ...comment.helpful,
                voters: comment.helpful?.voters?.includes(userId)
                  ? comment.helpful.voters.filter((id) => id !== userId)
                  : [...(comment.helpful?.voters || []), userId],
                count:
                  (comment.helpful?.count || 0) +
                  (comment.helpful?.voters?.includes(userId) ? -1 : 1),
              },
            }
            : comment
        )
      );

      return { previousComments };
    },
    onError: (err, _vars, context) => {
      // rollback if API fails
      if (context?.previousComments) {
        useUserDashboardStore.getState().setComments(context.previousComments);
      }

    },
    onSettled: () => {
      // optionally refetch actual server state to sync
      queryClient.invalidateQueries({ queryKey: ["businessReviews"] });
    },
  });


  const userReview = useMutation<{
    review: BusinessReviewsProps; status: string;
  }, Error, { businessId: string; userId: string }>({
    mutationFn: getUserReview,
    onSuccess: (data) => {
      if (!data) {
        setIsEditable(true)
      } else {
        setIsEditable(false)
        setNewRating(data.review.rating)
        setNewComment(data.review.comment)
      }
    },
  });

  const profileReview = useMutation<{
    reviews: BusinessReviewsProps[]; status: string;
  }, Error, { businessId: string }>({
    mutationFn: getBusinessReview,
    onSuccess: (data) => {
      setComments(data.reviews || [])
    }
  });


  // const handleMakePayment = (item: ProductsItem, userId: string) => {
  //   router.push(
  //     `/payments?itemId=${item._id}&userId=${userId}&amount=${item.price}`
  //   );
  // };

  const handleViewItem = (itemId?: string, itemTitle?: string) => {
    if (!itemId || !itemTitle) return;
    router.push(`/items/${slugify(itemTitle)}-${itemId}`);
  };

  const handleChatClick = (user: AnyUser) => {
    router.push(`/chat?recipientId=${user._id}`);
  };

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleSubmitComment = ({ user, session }: { user: AnyUser; session: SessionUser }) => {
    if (!newComment.trim() || session.id === user._id) return;
    const businessName = session.businessName || session.name;
    const name = session.name;
    submitReview.mutate({
      businessId: user._id,
      userId: session.id,
      displayPic: session.logo || "",
      username: session.username,
      rating: newRating,
      comment: newComment,
      fullName: businessName || name,
    });
  }

  // const handleToggleHelpFul = ({ reviewId, businessId, userId }: { reviewId: string, businessId: string, userId: string }) => {

  //   if (!reviewId || !businessId || !userId) return
  //   helpfulToggle.mutate({ reviewId, businessId, userId }, {
  //     onSuccess: (data) => {
  //       setComments((prev) =>
  //         prev.map((comment) =>
  //           comment._id === reviewId
  //             ? { ...comment, helpful: data.helpful }
  //             : comment
  //         )
  //       )
  //     }
  //   })

  // }

  const handleToggleHelpFul = ({ reviewId, businessId, userId }: { reviewId: string, businessId: string, userId: string }) => {
    if (!reviewId || !businessId || !userId) return;
    helpfulToggle.mutate({ reviewId, businessId, userId });
  };


  const fetchInitialData = ({ user, session }: { user: AnyUser, session: SessionUser }) => {
    try {
      if (session.id !== user._id) {
        userReview.mutate({ businessId: user._id, userId: session.id })
      }

      if (user.userType === "business") {
        profileReview.mutate({ businessId: user._id })
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }

  const handleCopy = async (username: string) => {
    try {
      await navigator.clipboard.writeText(`${BASEURL}/${username}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Failed to copy link");
    }
  }


  return { submitReview, helpfulToggle, profileReview, userReview, handleViewItem, handleChatClick, openImageModal, router, handleSubmitComment, handleToggleHelpFul, fetchInitialData, handleCopy }
}
