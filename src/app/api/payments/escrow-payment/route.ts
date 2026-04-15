// src/app/api/escrow-payment/route.ts
import { connectToDatabase } from '@/lib/mongo/initDB';
import { Escrow } from '@/model/Escrow';
import { Wallet } from '@/model/Wallet';
import { WalletTransaction } from '@/model/WalletTransaction';
import { auth } from "@/auth";
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import User from '@/model/User';
import { Business } from '@/model/Business';
import createNotification from '@/lib/socket/createNotification';
import { Item } from '@/model/Item';

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { paymentProvider, tx_ref, itemId, sellerId, price, quantity } = await req.json();

        if (session.user.id === sellerId) {
            return NextResponse.json({ message: 'You cannot pay for your own item' }, { status: 400 });
        }

        const item = await Item.findById(itemId).select("title");
        const itemName = item?.title || "the item";

        if (!paymentProvider || !['flutterwave', 'paystack'].includes(paymentProvider) || !tx_ref || !itemId || !sellerId || !price || !quantity) {
            await createNotification({
                userId: session.user.id,
                type: 'PAYMENT_FAILED',
                title: 'Payment Failed',
                message: 'Invalid input provided for the transaction.',
                entityId: tx_ref,
                entityType: 'PAYMENT',
                priority: 'HIGH',
            }
            );
            return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
        }

        const buyerId = session.user.id;


        let paymentData;
        if (paymentProvider === 'flutterwave') {
            const response = await axios.get(
                `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${tx_ref}`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
                    },
                }
            );
            paymentData = response.data;
            if (paymentData.status !== 'success' || paymentData.data.status !== 'successful') {
                await createNotification({
                    userId: buyerId,
                    type: 'PAYMENT_FAILED',
                    title: 'Payment Failed',
                    message: 'Payment verification failed for your transaction.',
                    entityId: tx_ref,
                    entityType: 'PAYMENT',
                    priority: 'HIGH',
                }
                );
                return NextResponse.json({ message: 'Payment verification failed' }, { status: 400 });
            }
            if (paymentData.data.amount < Number(price) * Number(quantity)) {
                await createNotification(
                    {
                        userId: buyerId,
                        type: 'PAYMENT_FAILED',
                        title: 'Payment Failed',
                        message: 'Payment amount mismatch for your transaction.',
                        entityId: tx_ref,
                        entityType: 'PAYMENT',
                        priority: 'HIGH',
                    }
                );
                return NextResponse.json({ message: 'Payment amount mismatch' }, { status: 400 });
            }
            if (paymentData.data.currency !== 'NGN') {
                await createNotification(
                    {
                        userId: buyerId,
                        type: 'PAYMENT_FAILED',
                        title: 'Payment Failed',
                        message: 'Currency mismatch for your transaction.',
                        entityId: tx_ref,
                        entityType: 'PAYMENT',
                        priority: 'HIGH',
                    }
                );
                return NextResponse.json({ message: 'Currency mismatch' }, { status: 400 });
            }
        } else if (paymentProvider === 'paystack') {
            if (!process.env.PAYSTACK_SECRET_KEY) {
                throw new Error("PAYSTACK_SECRET_KEY is not set in environment");
            }

            console.log("Paystack key prefix:", process.env.PAYSTACK_SECRET_KEY?.slice(0, 7));

            const response = await axios.get(
                `https://api.paystack.co/transaction/verify/${tx_ref}`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    },
                }
            );
            paymentData = response.data;
            if (paymentData.status !== true || paymentData.data.status !== 'success') {
                await createNotification({
                    userId: buyerId,
                    type: 'PAYMENT_FAILED',
                    title: 'Payment Failed',
                    message: 'Payment verification failed for your transaction.',
                    entityId: tx_ref,
                    entityType: 'PAYMENT',
                    priority: 'HIGH',
                }
                );
                return NextResponse.json({ message: 'Payment verification failed' }, { status: 400 });
            }
            if (paymentData.data.amount / 100 < Number(price) * Number(quantity)) {
                await createNotification(
                    {
                        userId: buyerId,
                        type: 'PAYMENT_FAILED',
                        title: 'Payment Failed',
                        message: 'Payment amount mismatch for your transaction.',
                        entityId: tx_ref,
                        entityType: 'PAYMENT',
                        priority: 'HIGH',
                    }
                );
                return NextResponse.json({ message: 'Payment amount mismatch' }, { status: 400 });
            }
            if (paymentData.data.currency !== 'NGN') {
                await createNotification(
                    {
                        userId: buyerId,
                        type: 'PAYMENT_FAILED',
                        title: 'Payment Failed',
                        message: 'Currency mismatch for your transaction.',
                        entityId: tx_ref,
                        entityType: 'PAYMENT',
                        priority: 'HIGH'
                    }
                );
                return NextResponse.json({ message: 'Currency mismatch' }, { status: 400 });
            }
        }

        const existingEscrow = await Escrow.findOne({ paymentIntentId: tx_ref });
        if (existingEscrow) {
            await createNotification(
                {
                    userId: buyerId,
                    type: 'PAYMENT_FAILED',
                    title: 'Payment Failed',
                    message: 'Escrow already exists for this payment.',
                    entityId: tx_ref,
                    entityType: 'PAYMENT',
                    priority: 'HIGH'
                }
            );
            return NextResponse.json({ message: 'Escrow already exists for this payment' }, { status: 400 });
        }

        // Verify seller wallet 
        const sellerWallet = await Wallet.findOne({ userId: sellerId });
        if (!sellerWallet) {
            await createNotification(
                {
                    userId: buyerId,
                    type: 'PAYMENT_FAILED',
                    title: 'Payment Failed',
                    message: 'Seller wallet not found.',
                    entityId: tx_ref,
                    entityType: 'PAYMENT',
                    priority: 'HIGH'
                }
            )
            return NextResponse.json({ message: 'Seller wallet not found' }, { status: 400 });
        }
        if (sellerWallet.status !== 'active') {
            await createNotification(
                {
                    userId: buyerId,
                    type: 'PAYMENT_FAILED',
                    title: 'Payment Failed',
                    message: 'Seller wallet is locked.',
                    entityId: tx_ref,
                    entityType: 'PAYMENT',
                    priority: 'HIGH'
                }
            );
            return NextResponse.json({ message: 'Seller wallet is locked' }, { status: 400 });
        }

        // Calculate total amount
        const totalAmount = Number(price) * Number(quantity);

        // Credit seller's wallet with the payment amount (deposit)
        sellerWallet.balance += totalAmount;
        await sellerWallet.save();

        await WalletTransaction.create({
            walletId: sellerWallet._id,
            userId: sellerId,
            type: 'deposit',
            amount: totalAmount,
            balanceAfter: sellerWallet.balance,
            reference: tx_ref,
            metadata: {
                paymentData,
                buyerId,
                itemId
            },
        });


        sellerWallet.locked += totalAmount;
        await sellerWallet.save();

        await WalletTransaction.create({
            walletId: sellerWallet._id,
            userId: sellerId,
            type: 'escrow_lock',
            amount: totalAmount,
            balanceAfter: sellerWallet.balance,
            reference: tx_ref,
            metadata: {
                buyerId,
                itemId,
                paymentData
            },
        });

        // Create escrow record
        const escrow = new Escrow({
            itemId,
            buyerId,
            sellerId,
            price,
            quantity,
            status: 'funded',
            paymentIntentId: tx_ref,
        });

        await escrow.save();

        const [buyer, seller] = await Promise.all([
            User.findById(buyerId).select("fullName userType"),
            User.findById(sellerId).select("fullName userType"),
        ]);
        let buyerName = buyer?.fullName || "Unknown Buyer";
        let sellerName = seller?.fullName || "Unknown Seller";
        if (buyer?.userType === "business") {
            const bizUser = await Business.findById(buyerId).select("businessName");
            buyerName = bizUser?.businessName || buyerName;
        }
        if (seller?.userType === "business") {
            const bizUser = await Business.findById(sellerId).select("businessName");
            sellerName = bizUser?.businessName || sellerName;
        }

        await Promise.all([
            createNotification(
                {
                    userId: buyerId,
                    senderId: sellerId,
                    type: 'PAYMENT_HELD',
                    title: 'Payment Held in Escrow',
                    message: `Your payment of ${totalAmount} NGN for item ${itemName} has been held in escrow.`,
                    entityId: escrow._id.toString(),
                    entityType: 'PAYMENT',
                    priority: 'HIGH',
                    link: `/profile/${buyerId}/escrow`
                }
            ),
            createNotification(
                {
                    userId: sellerId,
                    senderId: buyerId,
                    type: 'PAYMENT_HELD',
                    title: 'Payment Received in Escrow',
                    message: `${buyerName} has paid ${totalAmount} NGN for item ${itemName}, held in escrow.`,
                    entityId: escrow._id.toString(),
                    entityType: 'PAYMENT',
                    priority: 'HIGH',
                    link: `/profile/${sellerId}/escrow`
                }
            ),
        ]);
        return NextResponse.json({ message: 'Payment processed and funds held in escrow', escrowId: escrow._id });
    } catch (err) {
        console.error('[ESCROW PAYMENT ERROR]', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}