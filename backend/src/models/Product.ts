import mongoose, { Schema, InferSchemaType } from "mongoose";

const ProductSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true },

    // ✅ ADD THIS
    oldPrice: { type: Number },

    // ✅ OPTIONAL fields used in your UI
    rating: { type: Number },
    reviews: { type: Number },
    badge: { type: String },
    category: { type: String },

    // ✅ your image path "/uploads/xxx.jpg"
    img: { type: String, required: true },

    // ✅ arrays
    models: { type: [String], default: [] },
    colors: { type: [String], default: [] },
  },
  { timestamps: true }
);

// ✅ Typescript type from schema
export type ProductDoc = InferSchemaType<typeof ProductSchema>;

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;