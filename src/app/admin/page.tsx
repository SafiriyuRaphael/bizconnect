import getTotalBusiness from "@/lib/admin/getTotalBusiness";
import AdminDashboard from "./components/AdminDashboard";
import getConnectionsAnalytics from "@/lib/admin/getConnectionsAnalytics";
import getLastBusinessUser from "@/lib/admin/getLastBusiness";

export const dynamic = "force-dynamic";

export default async function page() {
  const allBusinesses = await getTotalBusiness();
  const ConnectionsAnalytics = await getConnectionsAnalytics();
  const lastBusiness = await getLastBusinessUser();

  return (
    <AdminDashboard
      ConnectionsAnalytics={ConnectionsAnalytics}
      allBusinesses={allBusinesses}
      lastBusiness={lastBusiness}
    />
  );
}
