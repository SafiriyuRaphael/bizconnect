import mongoose, { Schema, model, models } from "mongoose";

const userCollectionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    refId: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ["wishlist", "favorite"], required: true },
  },
  { timestamps: true }
);

userCollectionSchema.index({ userId: 1, refId: 1, type: 1 }, { unique: true });

export const UserCollection =
  models.UserCollection || model("UserCollection", userCollectionSchema);
