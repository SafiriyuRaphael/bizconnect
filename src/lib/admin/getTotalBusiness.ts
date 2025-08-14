import { BASEURL } from "@/constants/url";

export default async function getTotalBusiness() {
    try {
        const res = await fetch(`${BASEURL}/api/admin/total-business`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });
        if (!res.ok) {
            throw new Error("failed to get total business");
        }

        const data: { count: number; change: string } = await res.json();
        return data;


    } catch (err: any) {
        console.error("getConnectionsAnalytics error:", err.message || err);
        throw new Error("Something went wrong while fetching connections analytics.");
    }

}
