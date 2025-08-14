import apiService from '../service/apiService';
import { ProductItemsResponse } from '../../../types';

export default async function getItems({ signal, id }: { signal?: AbortSignal; id: string }) {
    const { response } = await apiService<ProductItemsResponse>({
        endpoint: `/api/product/get-item?id=${id}`,
        method: 'GET',
        signal,
        requiresAuth: true,
    });
    return response.data;
}
