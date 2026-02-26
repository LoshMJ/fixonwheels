import { Router } from "express";
import Product from "../models/Product";
import RecentItem from "../models/RecentItem";
import PromoPost from "../models/PromoPost";

const router = Router();

router.get("/products", async (_, res) => {
  const data = await Product.find().sort({ createdAt: -1 });
  res.json(data);
});

router.get("/recent-items", async (_, res) => {
  const data = await RecentItem.find().sort({ createdAt: -1 });
  res.json(data);
});

router.get("/promos", async (req, res) => {
  const active = req.query.active === "true";
  const filter = active ? { isActive: true } : {};
  const data = await PromoPost.find(filter).sort({ createdAt: -1 });
  res.json(data);
});

export default router;