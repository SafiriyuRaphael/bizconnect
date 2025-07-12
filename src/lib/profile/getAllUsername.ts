import { BASEURL } from "@/constants/url";
import { AllUsernames } from "../../../types";

export default async function getAllUsername() {
    const res = await fetch(`${BASEURL}/api/profile/all-username`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to fetch username");

    const data: AllUsernames = await res.json();
    return data;
}
