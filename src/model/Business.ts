// models/Business.js
import mongoose from 'mongoose';
import User from './User';
import { reviewSchema } from '@/schema/business-schema/ReviewSchema';
import { displayPicSchema } from '@/schema/displaypics/DisplayPicsSchema';


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
  priceRange: {
    min: {
      type: Number,
      default: 0,
      required: true,
    },
    max: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  deliveryTime: {
    type: Number,
    default: 0,
  },
  reviews: [reviewSchema],
  displayPics: {
    type: [displayPicSchema],
    default: [],
  },
  verifiedBusiness: {
    type: Boolean,
    default: false
  }
});

export const Business = mongoose.models.Business || User.discriminator('Business', businessSchema);