
import { displayPicSchema } from "@/schema/displaypics/DisplayPicsSchema";
import mongoose, { Schema, model, models } from "mongoose";

const itemSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    tags: [String],
    type: { type: String, enum: ['product', 'service'], required: true },
    price: { type: Number, required: true },
    deliveryTime: { type: Number },
    useEscrow: { type: Boolean, default: false },
    media: {
        type: [displayPicSchema],
        validate: [(val: any[]) => val.length <= 5, 'You can only upload up to 5 images.']
    },
    isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

export const Item = models.Item || model('Item', itemSchema);
