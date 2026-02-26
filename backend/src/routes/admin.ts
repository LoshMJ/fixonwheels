import { Router } from "express";
import Product from "../models/Product";
import RecentItem from "../models/RecentItem";
import PromoPost from "../models/PromoPost";

const router = Router();

// PRODUCTS
router.post("/products", async (req, res) => {
  const created = await Product.create(req.body);
  res.json(created);
});
router.put("/products/:id", async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});
router.delete("/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// RECENT ITEMS
router.post("/products", async (req, res) => {
  try {
    const created = await Product.create(req.body);
    return res.status(201).json(created);
  } catch (err: any) {
    console.error("Create product error:", err);
    return res.status(400).json({ message: err?.message || "Failed to create product" });
  }
});
router.delete("/recent-items/:id", async (req, res) => {
  await RecentItem.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// PROMOS
router.post("/promos", async (req, res) => {
  const created = await PromoPost.create(req.body);
  res.json(created);
});
router.put("/promos/:id", async (req, res) => {
  const updated = await PromoPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});
router.delete("/promos/:id", async (req, res) => {
  await PromoPost.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;