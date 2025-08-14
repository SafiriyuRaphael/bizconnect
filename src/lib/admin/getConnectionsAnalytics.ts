import { BASEURL } from "@/constants/url";

export default async function getConnectionsAnalytics() {
  try {
    const res = await fetch(`${BASEURL}/api/admin/connections`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch analytics");
    }

    const data = await res.json();

    return {
      totalConnections: data.totalConnections,
      thisWeekConnections: data.thisWeekConnections,
      lastWeekConnections: data.lastWeekConnections,
      percentageIncrease: data.percentageIncrease,
    };
  } catch (err: any) {
    console.error("getConnectionsAnalytics error:", err.message || err);
    throw new Error("Something went wrong while fetching connections analytics.");
  }
}
