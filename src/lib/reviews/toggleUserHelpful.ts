import { BusinessReviewHelpfulProps } from "../../../types";

export default async function toggleUserHelpful({ businessId, reviewId, userId }: { businessId: string; reviewId: string; userId: string; }) {
    const res = await fetch(`/api/reviews/helpful`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, reviewId, userId }),
    });

    if (res.ok) {
        const data: { helpful: BusinessReviewHelpfulProps; message: string } = await res.json();
        return data;
    }

    if (!res.ok) throw new Error("Failed to add helpful vote");
    return
}
