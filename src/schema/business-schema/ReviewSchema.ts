import mongoose from "mongoose";

export const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      maxlength: 1000,
    },
    fullName: {
      type: String,
      maxlength: 1000,
    },
    displayPic: {
      type: String,
      maxlength: 1000,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 1000,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: { type: Date },
    helpful: {
      count: { type: Number, default: 0 },
      voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },

  },
  { _id: true }
);
