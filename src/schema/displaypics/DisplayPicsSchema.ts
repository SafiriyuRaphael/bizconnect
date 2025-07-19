import mongoose from "mongoose";

export const displayPicSchema = new mongoose.Schema({
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    name: { type: String },
    uploadedAt: { type: Date, default: Date.now },
}, { _id: false });
