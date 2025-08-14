import apiService from '../service/apiService';

export default async function deleteProductApi(id: string) {
  const { response } = await apiService<{ success: boolean; message: string }>({
    endpoint: `/api/product/delete-item?id=${id}`,
    method: 'DELETE',
    requiresAuth: true,
  });

  return response.data;
}
