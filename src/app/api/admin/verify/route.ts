// src/app/api/escrow-payment/route.ts
import { connectToDatabase } from '@/lib/mongo/initDB';
import { Escrow } from '@/model/Escrow';
import { Wallet } from '@/model/Wallet';
import { WalletTransaction } from '@/model/WalletTransaction';
import { auth } from "@/auth";
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { paymentProvider, tx_ref, itemId, buyerId, sellerId, price, quantity } = await req.json();

    if (!paymentProvider || !['flutterwave', 'paystack'].includes(paymentProvider) || !tx_ref || !itemId || !buyerId || !sellerId || !price || !quantity) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }


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
        return NextResponse.json({ message: 'Payment verification failed' }, { status: 400 });
      }
      if (paymentData.data.amount < Number(price) * Number(quantity)) {
        return NextResponse.json({ message: 'Payment amount mismatch' }, { status: 400 });
      }
    } else if (paymentProvider === 'paystack') {
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
        return NextResponse.json({ message: 'Payment verification failed' }, { status: 400 });
      }
      if (paymentData.data.amount / 100 < Number(price) * Number(quantity)) {
        return NextResponse.json({ message: 'Payment amount mismatch' }, { status: 400 });
      }
    }

    // Verify buyer wallet
    const buyerWallet = await Wallet.findOne({ userId: buyerId });
    if (!buyerWallet) {
      return NextResponse.json({ message: 'Buyer wallet not found' }, { status: 400 });
    }

    // Create escrow record
    const totalAmount = Number(price) * Number(quantity);
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

    // Lock funds in buyer's wallet
    buyerWallet.locked += totalAmount;
    await buyerWallet.save();

    // Log wallet transaction
    await WalletTransaction.create({
      walletId: buyerWallet._id,
      userId: buyerId,
      type: 'escrow_lock',
      amount: totalAmount,
      balanceAfter: buyerWallet.balance,
      reference: tx_ref,
      metadata: { escrowId: escrow._id, itemId },
    });

    return NextResponse.json({ message: 'Payment processed and funds held in escrow', escrowId: escrow._id });
  } catch (err) {
    console.error('[ESCROW PAYMENT ERROR]', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}