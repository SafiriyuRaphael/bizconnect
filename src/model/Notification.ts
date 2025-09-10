import mongoose from 'mongoose';
import { Schema, model, Types, } from "mongoose";

const notificationSchema = new Schema(
    {
        userId: { type: Types.ObjectId, ref: "User", required: true },

        // 📌 Who triggered it (optional: system can be null)
        senderId: { type: Types.ObjectId, ref: "User", default: null },

        // 📌 Category of notification
        type: {
            type: String,
            enum: [
                "NEW_ESCROW",
                "ESCROW_RELEASED",
                "ESCROW_DISPUTED",     // order created
                "ESCROW_UPDATED",    // status changed
                "PAYMENT_HELD",     // escrow locked
                "PAYMENT_RELEASED", // escrow released
                "PAYMENT_FAILED",   // payment error/dispute
                "REVIEW_RECEIVED",  // buyer left a review
                "SYSTEM",           // admin/system notification
            ],
            required: true,
        },

        // 📌 Short headline for UI (dropdown/page)
        title: { type: String, required: true },

        // 📌 Optional extra text/details
        message: { type: String, default: "" },

        // 📌 Reference to entity (order, chat, payment, etc)
        entityId: { type: Types.ObjectId },

        // 📌 What module it belongs to (helps UI routing)
        entityType: {
            type: String,
            enum: ["OFFER", "ESCROW", "PAYMENT", "REVIEW", "SYSTEM"],
        },

        // 📌 Read status
        isRead: { type: Boolean, default: false },

        // 📌 Priority (useful for escrow/payment alerts)
        priority: {
            type: String,
            enum: ["LOW", "NORMAL", "HIGH"],
            default: "NORMAL",
        },

        // 📌 Optional deep link (direct route in frontend)
        link: { type: String, default: null },
    },
    { timestamps: true }
);

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

export default Notification;
