import apiService from '@/lib/service/apiService'

export default async function createReport({ reason, title, targetType, targetId }: { reason: string; title: string; targetType: 'user' | 'product' | 'message' | 'review'; targetId: string }) {
    const { response } = await apiService({
        endpoint: "api/report/create",
        method: "POST",
        body: { reason, title, targetType, targetId }
    })
    return response.data
}
