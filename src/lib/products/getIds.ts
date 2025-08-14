
import { BASEURL } from '@/constants/url';
import apiService from '../service/apiService';

export default async function getProductIds({ signal }: { signal?: AbortSignal }) {
    const { response } = await apiService<{ ids: string[] }>({
        endpoint: `${BASEURL}/api/product/ids`,
        method: 'GET',
        signal,
        // requiresAuth: true,
    });
    return response.data;
}
