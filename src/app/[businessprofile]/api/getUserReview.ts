
import apiService from '@/lib/service/apiService';
import { BusinessReviewsProps } from '../../../../types';

export default async function getUserReview(review: { businessId: string; userId: string }) {
    const { response } = await apiService<{ review: BusinessReviewsProps; status: string }, { businessId: string; userId: string }>({
        endpoint: `/api/reviews/get-user-review`,
        method: 'POST',
        body: review,
    });
    return response.data;
}
