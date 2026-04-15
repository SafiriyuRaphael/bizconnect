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
      startedAt: { type: Date },
      endedAt: { type: Date },
      duration: { type: Number },
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

messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message;