import mongoose, { Schema, Document } from "mongoose";

export type UserRole = "customer" | "technician" | "admin";

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;        // ✅ add
  avatarUrl: string;    // ✅ add
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },

    // ✅ hide password by default
    password: { type: String, required: true, select: false },

    role: { type: String, enum: ["customer", "technician", "admin"], required: true },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);