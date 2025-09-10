import apiService from '../../../lib/service/apiService';
import { ProductItemsResponse } from '../../../../types';

export default async function getItems({ signal, id, params }: { signal?: AbortSignal; id: string; params: GetUserItemsQuery }) {
    const { response } = await apiService<ProductItemsResponse>({
        endpoint: `/api/product/get-item?id=${id}`,
        method: 'GET',
        signal,
        params: params
    });
    return response.data;
}
