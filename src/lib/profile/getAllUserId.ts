import { BASEURL } from "@/constants/url";

export default async function getAllUserId() {
    const res = await fetch(`${BASEURL}/api/profile/all-userid`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to fetch users Id");

    const data: { usersId: string[]; status: string } = await res.json();
    return data;
}