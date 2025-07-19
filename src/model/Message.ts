import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
    file: {
      url: { type: String },
      type: { type: String, enum: ["image", "pdf", "document"] },
      name: { type: String },
    },
    type: {
      type: String,
      enum: ["text", "file", "call"],
      default: "text",
    },
    callDetails: {
      status: {
        type: String,
        enum: ["attempted", "connected", "failed", "rejected", "ended", "unavailable"],
      },
      callType: {
        type: String,
        enum: ["audio", "video"],
      },
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    seenAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message;