import mongoose, { Schema, Document } from "mongoose";

export type RepairStatus = "incoming" | "active" | "completed";

export interface IRepair extends Document {
  user: mongoose.Types.ObjectId;
  technician?: mongoose.Types.ObjectId;
  deviceType: string;   // phone/tablet/etc
  issueType: string;    // screen/battery/etc
  description?: string;
  status: RepairStatus;
  createdAt: Date;
  updatedAt: Date;
}

const RepairSchema = new Schema<IRepair>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    technician: { type: Schema.Types.ObjectId, ref: "User" },

    deviceType: { type: String, required: true },
    issueType: { type: String, required: true },
    description: { type: String },

    status: { type: String, enum: ["incoming", "active", "completed"], default: "incoming" },
  },
  { timestamps: true }
);

export const Repair = mongoose.model<IRepair>("Repair", RepairSchema);