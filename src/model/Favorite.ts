import mongoose, { Schema, model, models } from "mongoose";

const favoriteSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true },
    },
    { timestamps: true }
);

favoriteSchema.index({ userId: 1, businessId: 1 }, { unique: true });

export const Favorite = models.Favorite || model("Favorite", favoriteSchema);
