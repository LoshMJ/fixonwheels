import { Schema, model } from "mongoose";

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    models: { type: [String], default: [] },
    badge: { type: String, default: "" },
  },
  { timestamps: true }
);

export default model("Product", ProductSchema);