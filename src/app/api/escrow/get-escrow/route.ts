import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongo/initDB";
import mongoose from "mongoose";
import { Escrow } from "@/model/Escrow";

type EscrowStatus = "pending" | "funded" | "delivered" | "disputed" | "released" | "refunded";
type StatusFilter = EscrowStatus | "all";
type DisputeFilter = "all" | "normal" | "disputed";

export async function GET(req: Request) {
    const session = await auth();
    const userIdStr = session?.user?.id;

    if (!userIdStr) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const search = (searchParams.get("search") || "").trim();
    const status = (searchParams.get("status") || "all") as StatusFilter;
    const dispute = (searchParams.get("dispute") || "all") as DisputeFilter;

    const userId = new mongoose.Types.ObjectId(userIdStr);

    const pipeline: any[] = [
        { $match: { $or: [{ buyerId: userId }, { sellerId: userId }] } },
        { $lookup: { from: "items", localField: "itemId", foreignField: "_id", as: "item" } },
        { $unwind: "$item" },
        { $lookup: { from: "users", localField: "buyerId", foreignField: "_id", as: "buyer" } },
        { $unwind: "$buyer" },
        { $lookup: { from: "users", localField: "sellerId", foreignField: "_id", as: "seller" } },
        { $unwind: "$seller" },

        // ✅ Lookup the dispute if it exists
        { $lookup: { from: "disputes", localField: "disputeId", foreignField: "_id", as: "dispute" } },
        { $unwind: { path: "$dispute", preserveNullAndEmptyArrays: true } },
    ];

    if (status !== "all") pipeline.push({ $match: { status } });
    if (dispute === "disputed") pipeline.push({ $match: { isDisputed: true } });
    if (dispute === "normal") pipeline.push({ $match: { isDisputed: false } });

    if (search) {
        const rx = new RegExp(search, "i");
        pipeline.push({
            $match: {
                $or: [
                    { "item.title": rx },
                    { "buyer.fullName": rx },
                    { "seller.fullName": rx },
                ],
            },
        });
    }

    pipeline.push({ $sort: { createdAt: -1 } });

    const escrows = await Escrow.aggregate(pipeline);

    // Format to match frontend expectation
    const formattedEscrows = escrows.map((e: any) => ({
        _id: e._id,
        itemId: {
            _id: e.item._id,
            title: e.item.title,
            description: e.item.description,
        },
        buyerId: {
            _id: e.buyer._id,
            fullName: e.buyer.fullName,
            email: e.buyer.email,
            logo: e.buyer.logo,
            businessName: e.buyer.businessName,
        },
        sellerId: {
            _id: e.seller._id,
            fullName: e.seller.fullName,
            email: e.seller.email,
            logo: e.seller.logo,
            businessName: e.seller.businessName,
            reviews: Array.isArray(e.reviews) && e.reviews.length > 0
                ? e.reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / e.reviews.length
                : 0,
        },
        price: e.price,
        quantity: e.quantity,
        status: e.status,
        isDisputed: e.isDisputed,
        releaseDate: e.releaseDate,
        paymentIntentId: e.paymentIntentId,
        notes: e.notes,
        dispute: e.dispute
            ? {
                _id: e.dispute._id,
                reason: e.dispute.reason,
                // details: e.dispute.details,
                // evidence: e.dispute.evidence,
                responded: e.dispute.responses.length > 0 ? true : false,
                status: e.dispute.status,
                createdAt: e.dispute.createdAt,
                updatedAt: e.dispute.updatedAt,
                resolvedBy: e.dispute.resolvedBy,
                resolvedAt: e.dispute.resolvedAt,
                resolution: e.dispute.resolution,
                raisedBy: e.dispute.raisedBy,
            }
            : null,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
    }));

    // summary reflects the *filtered* result set
    const totalEscrows = formattedEscrows.length;
    const totalValue = formattedEscrows.reduce(
        (sum: number, e: any) => sum + e.price * (e.quantity ?? 1),
        0
    );
    const disputed = formattedEscrows.filter((e: any) => e.isDisputed).length;
    const active = formattedEscrows.filter(
        (e: any) => ["pending", "funded", "delivered"].includes(e.status) && !e.isDisputed
    ).length;

    return NextResponse.json({
        escrows: formattedEscrows,
        summary: { totalEscrows, totalValue, disputed, active },
    });
}
