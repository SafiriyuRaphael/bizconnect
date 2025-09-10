import apiService from "@/lib/service/apiService";



export default async function getAllTransaction(params: AnalyticsQueryParams) {
    const { response } = await apiService<AnalyticsResponse>({
        endpoint: "api/payments/transactions",
        method: "GET",
        requiresAuth: true,
        params: params as Record<string, string | number | boolean>,
    })
    return response.data.data

}
