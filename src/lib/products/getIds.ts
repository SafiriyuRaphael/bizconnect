
import { BASEURL } from '@/shared/constants/url';
import apiService from '../service/apiService';

export default async function getProductIds({ signal }: { signal?: AbortSignal }) {
    const { response } = await apiService<{ ids: { id: string; title: string }[] }>({
        endpoint: `${BASEURL}/api/product/ids`,
        method: 'GET',
        signal,
    });
    return response.data;
}
