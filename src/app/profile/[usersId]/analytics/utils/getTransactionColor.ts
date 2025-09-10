
export default function getTransactionTypeColor(type: RecentTransaction["type"]): string {
    const colors: Record<RecentTransaction["type"], string> = {
        deposit: "text-green-600 bg-green-50",
        withdrawal: "text-red-600 bg-red-50",
        escrow_lock: "text-yellow-600 bg-yellow-50",
        escrow_release: "text-purple-600 bg-purple-50",
        refund: "text-gray-600 bg-gray-50",
    };
    return colors[type] || "text-gray-600 bg-gray-50";
};
