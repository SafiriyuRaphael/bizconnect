import apiService from "../service/apiService";
import { ProductsItemsPageProps } from "../../../types";
import { BASEURL } from "@/shared/constants/url";

export default async function getProductsById({
  signal,
  id,
}: {
  signal?: AbortSignal;
  id: string;
}) {
  const { response } = await apiService<{ item: ProductsItemsPageProps }>({
    endpoint: `${BASEURL}/api/product/by-ids?id=${id}`,
    method: "GET",
    signal,
    // requiresAuth: true,
  });
  return response.data;
}
