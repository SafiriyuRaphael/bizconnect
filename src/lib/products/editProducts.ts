
import apiService from '../service/apiService';
import { ProductsItem } from '../../../types';

export default async function editProductsApi(product: ProductsItem) {
    const { response } = await apiService<ProductsItem>({
        endpoint: `/api/product/edit-item`,
        method: 'PATCH',
        body: {
            ...product,
            price: parseFloat(product.price as unknown as string),
            deliveryTime: product.deliveryTime ? parseInt(product.deliveryTime as unknown as string) : null,
        },
        requiresAuth: true,
    });
    return response.data;

}
