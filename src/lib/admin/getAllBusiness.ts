import { AllBusinessData, BusinessQueryParams } from "../../../types";

export default async function getAllBusiness(params: BusinessQueryParams = {}) {
    const query = new URLSearchParams();

    if (params.category) query.set("category", params.category);
    if (params.search) query.set("search", params.search);
    if (params.rating) query.set("rating", params.rating.toString());
    if (params.deliveryTime) query.set("deliveryTime", params.deliveryTime.toString());
    if (params.sort) query.set("sort", params.sort);
    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());
    if (params.maxPrice) query.set("maxPrice", params.maxPrice.toString());
    if (params.minPrice) query.set("minPrice", params.minPrice.toString());

    const res = await fetch(
        `/api/admin/all-business?${query.toString()}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            // cache: "no-store",
        }
    );

    if (!res.ok) throw new Error("Failed to fetch businesses");

    const data: AllBusinessData = await res.json();
    return data;
}
