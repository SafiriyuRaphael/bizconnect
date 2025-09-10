type TransactionType =
    | "deposit"
    | "withdrawal"
    | "escrow_lock"
    | "escrow_release"
    | "refund"
    | "all";

type DateRange = "all" | "today" | "week" | "month";

interface TransactionQuery {
    type?: TransactionType;
    dateRange?: DateRange;
    search?: string;
    page: number;
    limit: number;
}


interface TransactionUser {
    id: string;
    email: string;
    fullName: string;
    username: string;
    businessName?: string | null;
}

interface Transaction {
    _id: string;
    type: Exclude<TransactionType, "all">;
    amount: number;
    balanceAfter?: number;
    reference?: string;
    createdAt: string; // ISO string when sent as JSON
    user: TransactionUser | null;
    balanceAfter: number
}

interface TransactionResponse {
    success: boolean;
    totalValue: number
    page: number;
    limit: number;
    total: number;
    count: number;
    transactions: Transaction[];
}
