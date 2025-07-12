// models/User.js
import mongoose from "mongoose";
// import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      enum: ["customer", "business"],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"],
    },
    phone: {
      type: String,
      required: true,
      match: [/^[\+]?[\d\s\-\(\)]{10,}$/, "Invalid phone number"],
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // Never return password in queries
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    agreedToTerms: {
      type: Boolean,
      required: true,
      default: false,
      validate: {
        validator: (v: boolean) => v === true,
        message: "You must agree to terms",
      },
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpiry: {
      type: Date,
      default: null,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    logo: {
      type: String,
      default: ""
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true, discriminatorKey: '__t' }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User 
