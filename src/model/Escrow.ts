import mongoose, { Schema, model, models } from "mongoose";

const escrowSchema = new Schema({
    itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    price: { type: Number, required: true, min: 0 }, // per unit price
    quantity: { type: Number, required: true, default: 1, min: 1 }, // number of items
    status: {
        type: String,
        enum: ['pending', 'funded', 'delivered', 'disputed', 'released', 'refunded'],
        default: 'pending'
    },
    isDisputed: { type: Boolean, default: false },
    releaseDate: { type: Date },
    paymentIntentId: { type: String },
    deliveryProof: {
        type: [String],
        default: [],
        validate: {
            validator: function (val: string[]) {
                return val.length <= 3;
            },
            message: 'You can only upload up to 3 delivery proofs.',
        },
    },
    notes: { type: [String], default: [] },
    disputeId: { type: Schema.Types.ObjectId, ref: 'Dispute' },
}, { timestamps: true });


export const Escrow = models.Escrow || model('Escrow', escrowSchema);
