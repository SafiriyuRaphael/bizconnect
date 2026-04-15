import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongo/initDB";
import { Escrow } from "@/model/Escrow";
import { Wallet } from "@/model/Wallet";
import { WalletTransaction } from "@/model/WalletTransaction";
import { Item } from "@/model/Item";
import { Business } from "@/model/Business";
import mongoose from "mongoose";
import createNotification from "@/lib/socket/createNotification";
import { AllBusinessProps } from "../../../../../types";

type UpdateAction = "delivered" | "released";

export async function POST(req: Request) {
    const session = await auth();
    const userIdStr = session?.user?.id;

    if (!userIdStr) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    try {
        const { escrowId, action, deliveryProof } = (await req.json()) as {
            escrowId: string;
            action: UpdateAction;
            deliveryProof?: string[]
        };

        if (!mongoose.Types.ObjectId.isValid(escrowId)) {
            return NextResponse.json({ error: "Invalid escrow ID" }, { status: 400 });
        }

        if (deliveryProof && deliveryProof.length > 3) {
            return NextResponse.json(
                { error: "You can only upload up to 3 delivery proofs." },
                { status: 400 }
            );
        }

        const escrow = await Escrow.findById(escrowId);
        if (!escrow) {
            return NextResponse.json({ error: "Escrow not found" }, { status: 404 });
        }

        const item = await Item.findById(escrow.itemId);
        const itemName = item ? item.title : "an item";

        const userId = new mongoose.Types.ObjectId(userIdStr);

        // Seller business name
        const seller = await Business.findById(escrow.sellerId).lean<AllBusinessProps>();
        let sellerName = "the seller";
        if (seller?.businessName) sellerName = seller.businessName;

        // ---- DELIVERED ----
        if (action === "delivered") {
            if (!escrow.sellerId.equals(userId)) {
                return NextResponse.json({ error: "Not authorized" }, { status: 403 });
            }

            if (escrow.status !== "funded") {
                return NextResponse.json(
                    { error: "Escrow not in funded state" },
                    { status: 400 }
                );
            }

            escrow.status = "delivered";
            escrow.releaseDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // auto-release in 5d

            if (deliveryProof?.length) {
                escrow.deliveryProof = deliveryProof;
            }

            await escrow.save();

            // Notify buyer & seller
            await createNotification({
                userId: escrow.buyerId,
                senderId: escrow.sellerId,
                type: "ESCROW_UPDATED",
                title: "Item Delivered",
                message: `${sellerName} marked "${itemName}" as delivered.`,
                entityId: escrow._id,
                entityType: "ESCROW",
                link: `/profile/${escrow.buyerId}/escrow`
            });

            await createNotification({
                userId: escrow.sellerId,
                type: "ESCROW_UPDATED",
                title: "Delivery Confirmed",
                message: `You marked "${itemName}" as delivered.`,
                entityId: escrow._id,
                entityType: "ESCROW",
                link: `/profile/${escrow.sellerId}/escrow`
            });

            return NextResponse.json({ message: "Escrow marked delivered", escrow });
        }

        // ---- RELEASED ----
        if (action === "released") {
            if (!escrow.buyerId.equals(userId)) {
                return NextResponse.json({ error: "Not authorized" }, { status: 403 });
            }

            if (escrow.status !== "delivered") {
                return NextResponse.json(
                    { error: "Escrow not in delivered state" },
                    { status: 400 }
                );
            }

            const totalAmount = escrow.price * (escrow.quantity ?? 1);

            // 🔒 Seller Wallet
            const sellerWallet = await Wallet.findOne({ userId: escrow.sellerId });
            if (!sellerWallet) {
                await createNotification({
                    userId: escrow.sellerId,
                    type: "PAYMENT_FAILED",
                    title: "Wallet Missing",
                    message: `You need to verify your account and create a wallet to receive funds for "${itemName}".`,
                    entityId: escrow._id,
                    entityType: "PAYMENT",
                    link: `/profile/${escrow.sellerId}/escrow`,
                    priority: "HIGH"
                });

                return NextResponse.json(
                    { error: `${sellerName} has no wallet, funds cannot be released` },
                    { status: 400 }
                );
            }

            // ✅ Enhanced locked validation
            if (sellerWallet.locked < totalAmount) {
                return NextResponse.json(
                    {
                        error: `Wallet locked balance too low. Expected at least ₦${totalAmount}, found ₦${sellerWallet.locked}.`,
                    },
                    { status: 400 }
                );
            }

            // 🔓 Release (reduce locked only)
            sellerWallet.locked -= totalAmount;
            await sellerWallet.save();

            // Create wallet transaction
            const tx = new WalletTransaction({
                walletId: sellerWallet._id,
                userId: escrow.sellerId,
                type: "escrow_release",
                amount: totalAmount,
                balanceAfter: sellerWallet.balance,
                reference: `escrow-${escrow._id}`,
                metadata: { escrowId: escrow._id },
            });
            await tx.save();

            escrow.status = "released";
            escrow.releaseDate = new Date();
            await escrow.save();

            // 🔔 Notify buyer & seller
            await createNotification({
                userId: escrow.buyerId,
                type: "ESCROW_RELEASED",
                title: "Funds Released",
                message: `You released funds for "${itemName}" to ${sellerName}.`,
                entityId: escrow._id,
                entityType: "ESCROW",
                link: `/profile/${escrow.buyerId}/escrow`
            });

            await createNotification({
                userId: escrow.sellerId,
                type: "ESCROW_RELEASED",
                title: "Funds Received",
                message: `₦${totalAmount} for "${itemName}" has been released to your wallet.`,
                entityId: escrow._id,
                entityType: "ESCROW",
                link: `/profile/${escrow.sellerId}/escrow`
            });

            // 🔔 Transaction notification
            await createNotification({
                userId: escrow.sellerId,
                type: "PAYMENT_RELEASED",
                title: "Escrow Payment Released",
                message: `Your escrow payment of ₦${totalAmount} for "${itemName}" has been unlocked. Transaction ref: ${tx._id}`,
                entityId: tx._id,
                entityType: "PAYMENT",
                link: `/profile/${escrow.sellerId}/escrow`
            });

            return NextResponse.json({
                message: "Funds released successfully",
                escrow,
                transaction: tx,
            });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
