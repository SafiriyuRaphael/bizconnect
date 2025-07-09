import { AnyUser } from "../../../types";

export default async function getUserByUsername(username: string) {
    try {
        const res = await fetch("http://localhost:3000/api/profile/get-users-by-username", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        const user:AnyUser= data.user;
        return user
    }
    catch (err) {
        console.error("Error fetching data:", err);
    }
}