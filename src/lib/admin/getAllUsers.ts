import { AllUserData, UserQueryParams } from "../../../types";

export default async function getAllUsers(params: UserQueryParams = {}) {
    const query = new URLSearchParams();

    if (params.role) query.set("role", params.role);
    if (params.search) query.set("search", params.search);
    if (params.userType) query.set("userType", params.userType.toString());
    if (params.sortBy) query.set("sortBy", params.sortBy.toString());
    if (params.sortOrder) query.set("sortOrder", params.sortOrder);
    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());
    if (params.verified) query.set("verified", params.verified.toString());

    const res = await fetch(
        `/api/admin/all-user?${query.toString()}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        }
    );

    if (!res.ok) throw new Error("Failed to fetch Users");

    const data: AllUserData = await res.json();
    return data;
}
