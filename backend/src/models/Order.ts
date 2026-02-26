import mongoose, { Schema, Document } from "mongoose";

export type OrderStatus = "pending" | "confirmed" | "completed" | "cancelled" | "refunded";
export type PaymentMethod = "cod" | "paypal" | "card";
export type PaymentStatus = "unpaid" | "paid" | "refunded";

export interface IOrderItem {
  productId: string;
  title: string;
  price: number;
  qty: number;
  img?: string;
  model?: string;
  color?: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  total: number;

  status: OrderStatus;

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;

  refundedAt?: Date;
  refundReason?: string;

  isDeleted: boolean;
  deletedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
    img: { type: String },
    model: { type: String },
    color: { type: String },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [OrderItemSchema], required: true },
    total: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled", "refunded"],
      default: "confirmed",
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "paypal", "card"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },

    refundedAt: { type: Date },
    refundReason: { type: String },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", OrderSchema);