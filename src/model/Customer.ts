// models/Customer.js
import User from './User';
import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  deliveryAddress: {
    type: String,
    trim: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
  },
  dateOfBirth: {
    type: Date,
  },
});

export const Customer = mongoose.models.Customer || User.discriminator('Customer', customerSchema);