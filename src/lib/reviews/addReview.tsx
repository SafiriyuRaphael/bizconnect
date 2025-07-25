import { AddReviewProps, BusinessReviewsProps } from "../../../types";

export default async function addReview({
  businessId,
  userId,
  username,
  displayPic,
  rating,
  comment,
  fullName,
}: AddReviewProps) {
  const res = await fetch(`/api/reviews/upsert`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      businessId,
      userId,
      username,
      displayPic,
      rating,
      comment,
      fullName,
    }),
  });

  if (res.ok) {
    const data: {
      message: string;
      status: string;
      reviews: BusinessReviewsProps[];
    } = await res.json();
    return data;
  }

  if (!res.ok) throw new Error("Failed to update user review");
}
