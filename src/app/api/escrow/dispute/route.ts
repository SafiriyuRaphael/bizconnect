import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { connectToDatabase } from "@/lib/mongo/initDB";
import mongoose from "mongoose";
import { Escrow } from "@/model/Escrow";
import { Dispute } from "@/model/Disputes";
import createNotification from "@/lib/socket/createNotification";


type OpenPayload = {
    escrowId: string;
    reason: string;
    details?: string;
    evidence?: string[];
};

type RespondPayload = {
    disputeId: string;
    message: string;
    evidence?: string[];
};

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const userIdStr = session?.user?.id;

    if (!userIdStr) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const userId = new mongoose.Types.ObjectId(userIdStr);

    try {
        const { action, payload } = (await req.json()) as {
            action: "open" | "respond";
            payload: OpenPayload | RespondPayload;
        };


        // 1. OPEN DISPUTE
        if (action === "open") {
            const { escrowId, reason, details, evidence } = payload as OpenPayload;

            if (!reason || !details) {
                return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
            }

            if (!mongoose.Types.ObjectId.isValid(escrowId)) {
                return NextResponse.json({ error: "Invalid escrowId" }, { status: 400 });
            }

            const escrow = await Escrow.findById(escrowId);
            if (!escrow) {
                return NextResponse.json({ error: "Escrow not found" }, { status: 404 });
            }

            // Who is raising (buyer or seller)?
            let role: "buyer" | "seller";
            if (escrow.buyerId.equals(userId)) {
                role = "buyer";
            } else if (escrow.sellerId.equals(userId)) {
                role = "seller";
            } else {
                return NextResponse.json({ error: "Not authorized for this escrow" }, { status: 403 });
            }

            // Prevent duplicate disputes on same escrow
            const existing = await Dispute.findOne({ escrowId });
            if (existing) {
                return NextResponse.json({ error: "Dispute already exists for this escrow" }, { status: 400 });
            }

            const dispute = new Dispute({
                escrowId,
                raisedBy: userId,
                raisedByRole: role,
                reason,
                details,
                evidence,
            });
            await dispute.save();

            escrow.isDisputed = true;
            escrow.status = "disputed";
            escrow.disputeId = dispute._id;
            await escrow.save();

            // 🔔 Notify the other party
            const otherUserId = role === "buyer" ? escrow.sellerId : escrow.buyerId;
            await createNotification({
                userId: otherUserId.toString(),
                senderId: userId.toString(),
                type: "ESCROW_DISPUTED",
                title: "New Dispute Opened",
                message: `A dispute was opened for escrow #${escrow._id} by ${session.user.businessName || session.user.name} regarding "${reason.replace(/_/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())}".`,
                entityId: dispute._id.toString(),
                entityType: "ESCROW",
                link: `/profile/${otherUserId}/escrow`,
            });

            return NextResponse.json({ message: "Dispute opened", dispute });
        }

        // 2. RESPOND TO DISPUTE
        if (action === "respond") {
            const { disputeId, message, evidence } = payload as RespondPayload;

            if (!message) {
                return NextResponse.json({ error: "Message is required" }, { status: 400 });
            }

            if (!mongoose.Types.ObjectId.isValid(disputeId)) {
                return NextResponse.json({ error: "Invalid disputeId" }, { status: 400 });
            }

            const dispute = await Dispute.findById(disputeId).populate("escrowId");
            if (!dispute) {
                return NextResponse.json({ error: "Dispute not found" }, { status: 404 });
            }

            const escrow: any = dispute.escrowId;
            if (!escrow) {
                return NextResponse.json({ error: "Escrow not found" }, { status: 404 });
            }

            // Must be buyer/seller of this escrow
            let role: "buyer" | "seller";
            if (escrow.buyerId.equals(userId)) {
                role = "buyer";
            } else if (escrow.sellerId.equals(userId)) {
                role = "seller";
            } else {
                return NextResponse.json({ error: "Not authorized for this dispute" }, { status: 403 });
            }

            // Add response
            dispute.responses.push({
                userId,
                role,
                message,
                evidence,
                submittedAt: new Date(),
            });
            await dispute.save();

            // 🔔 Notify the opposite party
            const otherUserId = role === "buyer" ? escrow.sellerId : escrow.buyerId;
            await createNotification({
                userId: otherUserId.toString(),
                senderId: userId.toString(),
                type: "ESCROW_UPDATED",
                title: "Dispute Updated",
                message: `${session.user.businessName || session.user.name} responded to the dispute: "${message.slice(0, 80)}..."`,
                entityId: dispute._id.toString(),
                entityType: "ESCROW",
                link: `/profile/${otherUserId}/escrow`,
            });

            return NextResponse.json({ message: "Response added", dispute });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
