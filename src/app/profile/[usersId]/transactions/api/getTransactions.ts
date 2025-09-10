import apiService from '@/lib/service/apiService'

export default async function getTransactions(params: TransactionQuery) {
    const { response } = await apiService<TransactionResponse>({
        endpoint: "/api/payments/get-all-transactions",
        method: "GET",
        requiresAuth: true,
        params: params as unknown as Record<string, string | number | boolean>
    })
    return response.data
}
