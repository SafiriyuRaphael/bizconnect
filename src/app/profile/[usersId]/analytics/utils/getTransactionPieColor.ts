export default function getTransactionTypePieColor(
    type: RecentTransaction["type"]
): string {
    const colors: Record<RecentTransaction["type"], string> = {
        deposit: "#10B981",
        withdrawal: "#EF4444",
        escrow_lock: "#F59E0B",
        escrow_release: "#8B5CF6",
        refund: "#6B7280",
    };
    return colors[type] || "text-gray-600 bg-gray-50";
};