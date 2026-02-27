import mongoose, { Schema, Document } from "mongoose";

export type UserRole = "customer" | "technician" | "admin";
export type TechnicianStatus = "pending" | "approved" | "rejected";

export interface IUser extends Document {
  name: string;
  email: string;

  phone?: string;        // ✅ optional (safe)
  avatarUrl?: string;    // ✅ optional (safe)

  password: string;
  role: UserRole;

  // ✅ new: technician approval workflow
  technicianStatus?: TechnicianStatus;

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },

    phone: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },

    // ✅ hide password by default
    password: { type: String, required: true, select: false },

    role: { type: String, enum: ["customer", "technician", "admin"], required: true },

    // ✅ only important for technician
    technicianStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved", // customers/admin treated as approved
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);