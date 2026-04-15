import React from 'react'
import apiService from '../service/apiService';
import { ProductItemsResponse } from '../../../types';

export default async function getProducts({ signal }: { signal?: AbortSignal }) {
    const { response } = await apiService<ProductItemsResponse>({
        endpoint: '/api/product/overview',
        method: 'GET',
        signal,
    });
    return response.data;
}
