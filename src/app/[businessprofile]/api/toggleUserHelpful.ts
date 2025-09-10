
import apiService from '@/lib/service/apiService';
import { BusinessReviewHelpfulProps } from '../../../../types';

export default async function toggleUserHelpful(data: { businessId: string; reviewId: string; userId: string; }) {
    const { response } = await apiService<{ helpful: BusinessReviewHelpfulProps; message: string }, { businessId: string; reviewId: string; userId: string; }>({
        endpoint: `/api/reviews/helpful`,
        method: 'POST',
        body: data,
        requiresAuth: true,
    });
    return response.data;

}
