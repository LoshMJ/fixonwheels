import { Schema, model } from "mongoose";

const RecentItemSchema = new Schema(
  {
    image: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
  },
  { timestamps: true }
);

export default model("RecentItem", RecentItemSchema);