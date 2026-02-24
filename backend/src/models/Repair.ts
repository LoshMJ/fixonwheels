// backend/src/models/Repair.ts
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type RepairStatus =
  | "pending"
  | "accepted"
  | "in_progress"
  | "completed"
  | "paid";

export interface IStepProgress {
  stepId: string;
  label: string;
  completed: boolean;
  completedAt?: Date;
  notes?: string;
  photoUrl?: string;
}

export interface IRepair extends Document {
  customer: Types.ObjectId;
  technician?: Types.ObjectId;
  deviceModel: string;
  issue: string;
  description?: string;
  address: string;
  status: RepairStatus;

  // Added missing fields
  customerConfirmedHandover: boolean;
  technicianConfirmedHandover: boolean;
  stepsProgress: IStepProgress[];

  createdAt: Date;
  updatedAt: Date;
}

const stepProgressSchema = new Schema<IStepProgress>({
  stepId: { type: String, required: true },
  label: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedAt: Date,
  notes: String,
  photoUrl: String,
});

const repairSchema = new Schema<IRepair>(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    deviceModel: { type: String, required: true },
    issue: { type: String, required: true },
    description: String,
    address: String,
    status: {
      type: String,
      enum: ["pending", "accepted", "in_progress", "completed", "paid"],
      default: "pending",
    },

    // FIX: Add these fields
    customerConfirmedHandover: { type: Boolean, default: false },
    technicianConfirmedHandover: { type: Boolean, default: false },
    stepsProgress: {
      type: [stepProgressSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const Repair: Model<IRepair> = mongoose.model<IRepair>('Repair', repairSchema);