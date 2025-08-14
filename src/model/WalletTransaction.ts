
import mongoose, { Schema, model, models } from "mongoose";

const walletTransactionSchema = new Schema({
  walletId: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'escrow_lock', 'escrow_release', 'refund'],
    required: true
  },
  amount: { type: Number, required: true },
  balanceAfter: { type: Number }, 
  reference: { type: String }, // like Stripe/Paystack ID or admin note
  metadata: { type: Object }, // optional payload for dev use
}, { timestamps: true });

export const WalletTransaction = models.WalletTransaction || model('WalletTransaction', walletTransactionSchema);
