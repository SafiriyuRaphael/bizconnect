import { LucideIcon } from "lucide-react";

type EscrowStatus = "pending" | "funded" | "delivered" | "disputed" | "released" | "refunded";
type StatusFilter = EscrowStatus | "all";
type DisputeFilter = "all" | "normal" | "disputed";

interface EscrowQueryParams {
    search?: string;
    status?: StatusFilter;
    dispute?: DisputeFilter;
}

interface EscrowUserResponse {
    escrows: IEscrow[];
    summary: {
        totalEscrows: number;
        totalValue: number;
        disputed: number;
        active: number;
    };
}

// type DisputeResponse = {
//     userId: string;
//     role: "buyer" | "seller";
//     message?: string;
//     evidence: string[];
//     submittedAt: string; // ISO date
// };


type DisputeType = {
    _id: string;
    reason: string;
    responded: boolean;
    status: "open" | "in_review" | "resolved" | "rejected";
    createdAt: string;
    updatedAt: string;
    resolvedBy?: string;
    resolvedAt?: string;
    resolution?: string;
    raisedBy: string;
};

interface IEscrow {
    _id: string;
    itemId: EscrowItem;
    buyerId: EscrowUser;
    sellerId: EscrowUser;
    price: number;
    quantity: number;
    status: EscrowStatus;
    isDisputed: boolean;
    releaseDate?: string;
    paymentIntentId?: string;
    deliveryProof?: string[];
    notes?: string[];
    disputeId?: string;
    dispute?: DisputeType | null;
    createdAt: string;
    updatedAt: string;
}

interface EscrowItem {
    _id: string;
    title: string;
    description: string;
}

interface EscrowUser {
    _id: string;
    fullName: string;
    email: string;
    logo: string
    rating: number
    businessName: string;
}


interface PayloadProps {
    escrowId: string;
    action: "delivered" | "released"
    deliveryProof?: string[]
}

interface UpdateResponse {
    message: string;
    escrow: IEscrow;
    transaction: { [key: string]: any }
}

interface StatProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    iconBgColor?: string;
    valueColor?: string;
};

interface IStatusConfig {
    icon: LucideIcon;
    dot: string;
    color: string
}

type AddNotePayloadProps = {
    escrowId: string;
    note: string
}


type OpenPayload = {
    escrowId: string;
    reason: string;
    details?: string;
    evidence?: string[];
    action: "open"
};

type RespondPayload = {
    disputeId: string;
    message: string;
    evidence?: string[];
    action: "respond"
};

type UploadedFile = {
    id: number;
    file: File;
    name: string;
    size: number;
    type: string;
    preview: string | null;
};