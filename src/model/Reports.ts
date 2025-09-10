import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    required: true
  },
  targetType: {
    type: String,
    enum: ['user', 'product', 'message', 'review'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'resolved', 'ignored'],
    default: 'pending'
  },
  adminNote: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);

export default Report;
