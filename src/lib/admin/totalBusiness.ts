export default async function totalBusiness() {
    try {
        const res = await fetch(`/api/admin/total-business`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });
        if (!res.ok) {
            throw new Error("failed to get total business");
        }

        const data: { count: number; formattedChange: string } = await res.json();
        return data;


    } catch (err: any) {
        console.error("getConnectionsAnalytics error:", err.message || err);
        throw new Error("Something went wrong while fetching connections analytics.");
    }

}
