import { Schema, model } from "mongoose";

const PromoPostSchema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    image: { type: String, required: true },
    ctaText: { type: String, default: "" },
    link: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model("PromoPost", PromoPostSchema);