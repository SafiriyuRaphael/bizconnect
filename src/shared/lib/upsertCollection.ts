import apiService from "@/lib/service/apiService"

export default async function upsertCollection({ refId, type }: { refId: string; type: "wishlist" | "favorite" }) {
  const { response } = await apiService({
    endpoint: "api/user-collections/upsert",
    method: "POST",
    body: { refId, type }
  })
  return response.data
}
