// models/Business.js
import mongoose from 'mongoose';
import User from './User';

const businessSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    trim: true,
  },
  businessCategory: {
    type: String,
    required: true,
    enum: [
      'fashion', 'electronics', 'beauty',
      'food', 'home', 'health',
      'automotive', 'sports', 'books',
      'art', 'other'
    ],
  },
  businessAddress: {
    type: String,
    required: true,
    trim: true,
  },
  businessDescription: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
    match: [/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 'Invalid URL'],
  },
  logo: {
    type: String, // Store path or URL
  },
});

export const Business = mongoose.models.Business || User.discriminator('Business', businessSchema);