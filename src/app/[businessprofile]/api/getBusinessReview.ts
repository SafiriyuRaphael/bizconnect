
import apiService from '@/lib/service/apiService';
import { BusinessReviewsProps } from '../../../../types';

export default async function getBusinessReview(data: { businessId: string }) {
    const { response } = await apiService<{ reviews: BusinessReviewsProps[]; status: string }, { businessId: string }>({
        endpoint: `/api/reviews/get-by-business`,
        method: 'POST',
        body: data,
    });
    return response.data;
}
