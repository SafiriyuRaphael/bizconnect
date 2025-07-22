// models/VerificationLog.ts
import mongoose, { Schema, model, models } from "mongoose";

const verificationLogSchema = new Schema({
    verificationId: {
        type: Schema.Types.ObjectId,
        ref: "Verification",
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    fullName: String,
    businessName: String,
    businessAddress: String,
    businessPhone: String,
    documentUrl: String,
    selfieUrl: String,
    idDocument: {
        idUrl: String,
        public_id: String,
        idType: {
            type: String,
            enum: ["driver_license", "national_id_card", "voters_card", "international_passport"],
        },
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
    },
    businessLogo: String,
    reason: String,
    submittedAt: Date,
    verifiedAt: Date,
    modifiedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

export const VerificationLog =
    models.VerificationLog || model("VerificationLog", verificationLogSchema);
