import { BASEURL } from '@/constants/url';
import { BusinessReviewsProps } from '../../../types';

export default async function getUserReviews({ businessId, userId }: { businessId: string; userId: string }) {
    const res = await fetch(`${BASEURL}/api/reviews/get-user-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, userId }),
    });

    if (res.ok) {
        const data: { review: BusinessReviewsProps; status: string } = await res.json();
        return data;
    }
    if (res.status === 404) {
        return null
    }

    if (!res.ok) throw new Error("Failed to fetch users Id");

}
