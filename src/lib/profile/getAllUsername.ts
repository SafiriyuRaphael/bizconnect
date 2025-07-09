import { AllUsernames } from "../../../types";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default async function getAllUsername() {
    const res = await fetch(`${baseUrl}/api/profile/all-username`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to fetch username");

    const data: AllUsernames = await res.json();
    return data;
}
