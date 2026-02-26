import mongoose, { Schema, Document } from "mongoose";

export type UserRole = "customer" | "technician" | "admin";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  profileImage?: string;
}
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["customer", "technician", "admin"],
      required: true,
    },

    profileImage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);