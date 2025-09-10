import { SessionUser } from "../../../../../../types";
import { IEscrow } from "../types/escrow";

export default function canRespondToDispute({ escrow, session }: { escrow: IEscrow; session: SessionUser }) {
    if (!escrow.dispute || !session) return false;

    // User who raised the dispute cannot respond
    if (escrow.dispute.raisedBy === session.id) return false;

    // If already responded, can't respond again
    if (escrow.dispute.responded) return false;

    // Only open disputes can be responded to
    return escrow.dispute.status === "open";
};