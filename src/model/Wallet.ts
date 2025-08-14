import mongoose, { Schema, model, models } from "mongoose";

const walletSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    balance: { type: Number, default: 0 },
    locked: { type: Number, default: 0 },
    currency: { type: String, default: 'NGN' },
    status: { type: String, enum: ['active', 'locked'], default: 'active' }
}, { timestamps: true });

export const Wallet = models.Wallet || model('Wallet', walletSchema);

