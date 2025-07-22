import mongoose, { Schema, model, models } from "mongoose";

const verificationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    businessName: {
        type: String,
        required: true,
    },
    businessAddress: {
        type: String,
        required: true,
    },
    businessPhone: {
        type: String,
        required: true,
    },
    documentUrl: {
        type: String, // optional supporting doc (CAC or invoice or whatever)
    },
    selfieUrl: {
        type: String,
    },
    idDocument: {
        idUrl: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },
        idType: {
            type: String,
            required: true,
            enum: ["driver_license", "national_id_card", "voters_card", "international_passport"],
        },
    },
    businessLogo: {
        type: String,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    reason: {
        type: String,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    verifiedAt: {
        type: Date,
    },
}, { timestamps: true });

export const Verification =
    models.Verification || model("Verification", verificationSchema);
