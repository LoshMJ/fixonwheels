import mongoose, { Schema, Document } from "mongoose";

export interface IAdminSettings extends Document {
  siteName: string;
  supportEmail: string;
  contactPhone: string;
  businessAddress: string;

  theme: "dark" | "light";
  accent: "purple" | "blue" | "green";

  notifyOrderPlaced: boolean;
  notifyOrderCancelled: boolean;
  notifyRepairBooked: boolean;
  smsEnabled: boolean;

  updatedAt: Date;
  createdAt: Date;
}

const adminSettingsSchema = new Schema<IAdminSettings>(
  {
    siteName: { type: String, default: "FixOnWheels" },
    supportEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    businessAddress: { type: String, default: "" },

    theme: { type: String, enum: ["dark", "light"], default: "dark" },
    accent: { type: String, enum: ["purple", "blue", "green"], default: "purple" },

    notifyOrderPlaced: { type: Boolean, default: true },
    notifyOrderCancelled: { type: Boolean, default: true },
    notifyRepairBooked: { type: Boolean, default: true },
    smsEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const AdminSettings = mongoose.model<IAdminSettings>(
  "AdminSettings",
  adminSettingsSchema
);