import { BASEURL } from "@/constants/url";
import { BusinessReviewsProps } from "../../../types";

export default async function getBusinessReviews({ businessId }: { businessId: string }) {
    const res = await fetch(`/api/reviews/get-by-business`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            businessId
        }),
    });

    if (res.ok) {
        const data: { reviews: BusinessReviewsProps[]; status: string } = await res.json();
        return data;
    }

    if (!res.ok) throw new Error("Failed to get review");
}
