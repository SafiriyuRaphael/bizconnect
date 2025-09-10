
import apiService from '@/lib/service/apiService';
import { AddReviewProps, BusinessReviewsProps } from '../../../../types';

export default async function addReview(review: AddReviewProps) {
    const { response } = await apiService<{
        message: string;
        status: string;
        reviews: BusinessReviewsProps[];
    }, AddReviewProps>({
        endpoint: `/api/reviews/upsert`,
        method: 'POST',
        body: review,
        requiresAuth: true,
    });
    return response.data;

}
