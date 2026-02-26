import mongoose, { Schema, Document, Model, Types } from "mongoose";

/* ==============================
   STATUS FLOW
============================== */

export type RepairStatus =
  | "pending"
  | "accepted"
  | "in_progress"
  | "awaiting_payment"
  | "paid"
  | "completed";

export type PaymentMethod = "card" | "paypal" | "cod";

export type PaymentStatus =
  | "pending"
  | "awaiting_payment"
  | "paid";
/* ==============================
   STEP PROGRESS
============================== */

export interface IStepProgress {
  stepId: string;
  label: string;
  completed: boolean;
  completedAt?: Date;
  notes?: string;
  photoUrl?: string;
}

/* ==============================
   MAIN REPAIR INTERFACE
============================== */

export interface IRepair extends Document {
  customer: Types.ObjectId;
  technician?: Types.ObjectId;
  deviceModel: string;
  issue: string;
  description?: string;
  address: string;
  status: RepairStatus;
  rating?: number;
  ratingNote?: string;

  customerConfirmedHandover: boolean;
  technicianConfirmedHandover: boolean;
  stepsProgress: IStepProgress[];

  // 🔥 ADD THESE EXACTLY HERE
  paymentMethod?: "card" | "paypal" | "cod";
  paymentStatus?: "pending" | "awaiting_payment" | "paid";
  paidAt?: Date;
  amount?: number;

  createdAt: Date;
  updatedAt: Date;
}

/* ==============================
   STEP SCHEMA
============================== */

const stepProgressSchema = new Schema<IStepProgress>({
  stepId: { type: String, required: true },
  label: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedAt: Date,
  notes: String,
  photoUrl: String,
});

/* ==============================
   REPAIR SCHEMA
============================== */

const repairSchema = new Schema<IRepair>(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    deviceModel: { type: String, required: true },
    issue: { type: String, required: true },
    description: String,
    address: String,

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "in_progress",
        "awaiting_payment",
        "paid",
        "completed",
      ],
      default: "pending",
    },
    rating: { type: Number, default: null },
    ratingNote: { type: String, default: "" },

    customerConfirmedHandover: { type: Boolean, default: false },
    technicianConfirmedHandover: { type: Boolean, default: false },

    stepsProgress: {
      type: [stepProgressSchema],
      default: [],
    },

    /* ==============================
       🔥 PAYMENT FIELDS
    ============================== */

    paymentMethod: {
      type: String,
      enum: ["card", "paypal", "cod"],
      default: null,
    },

paymentStatus: {
  type: String,
  enum: ["pending", "awaiting_payment", "paid"],
  default: "pending",
},
    paidAt: { type: Date },
    amount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Repair: Model<IRepair> = mongoose.model<IRepair>(
  "Repair",
  repairSchema
);