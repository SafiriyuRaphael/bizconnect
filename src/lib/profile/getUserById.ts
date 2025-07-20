import { BASEURL } from "@/constants/url";
import { AnyUser } from "../../../types";

export default async function getUserById(_id: string) {
    try {
        const res = await fetch(`${BASEURL}/api/profile/get-users-by-id`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ _id }),
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        const user: AnyUser = data.user;
        return user
    }
    catch (err) {
        console.error("Error fetching data:", err);
    }
}