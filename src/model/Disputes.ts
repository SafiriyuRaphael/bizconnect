// models/Dispute.js
import mongoose, { Schema, model, models } from "mongoose";

const responseSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['buyer', 'seller'], required: true },
    message: { type: String },
    evidence: [String], // file/image URLs
    submittedAt: { type: Date, default: Date.now },
});

const disputeSchema = new Schema({
    escrowId: { type: Schema.Types.ObjectId, ref: 'Escrow', required: true, unique: true },

    raisedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    raisedByRole: { type: String, enum: ['buyer', 'seller'], required: true },

    reason: { type: String, required: true },
    details: { type: String },
    evidence: [String],

    responses: [responseSchema],

    status: {
        type: String,
        enum: ['open', 'in_review', 'resolved', 'rejected'],
        default: 'open',
    },

    resolution: { type: String },
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date },

}, { timestamps: true });

export const Dispute = models.Dispute || model('Dispute', disputeSchema);
