import { Router } from "express";
import mongoose from "mongoose";
import { requireAuth, requireRole, AuthRequest } from "../middleware/auth.middleware";
import { Order } from "../models/Order";
import Product from "../models/Product"; // ✅ make sure this path matches your Product model file

const router = Router();

/* ✅ ADD THIS ROUTE (BEST SELLERS)
   GET /api/orders/best-sellers?limit=10
   - returns top products based on order items qty
*/
router.get("/best-sellers", async (req, res) => {
  try {
    const limit = Math.min(20, Math.max(1, Number(req.query.limit || 10)));

    const agg = await Order.aggregate([
      { $match: { isDeleted: false } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",       // productId stored inside Order items
          soldCount: { $sum: "$items.qty" },
        },
      },
      { $sort: { soldCount: -1 } },
      { $limit: limit },
    ]);

    if (!agg.length) return res.json([]);

    // Convert productId strings -> ObjectId for Product lookup
    const ids = agg
      .map((x) => x._id)
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    const products = await Product.find({ _id: { $in: ids } }).select(
      "_id title price img"
    );

    const map = new Map(products.map((p: any) => [p._id.toString(), p]));

    const result = agg
      .map((x) => {
        const p = map.get(String(x._id));
        if (!p) return null;

        return {
          _id: p._id.toString(),
          title: p.title,
          price: p.price,
          img: p.img,
          soldCount: x.soldCount,
        };
      })
      .filter(Boolean);

    return res.json(result);
  } catch (err: any) {
    console.error("best-sellers error:", err);
    return res.status(500).json({ message: "Failed to load best sellers" });
  }
});

// ✅ Only customers can place orders (recommended)
router.post(
  "/checkout",
  requireAuth,
  requireRole("customer"),
  async (req: AuthRequest, res) => {
    try {
      const { items, total, paymentMethod } = req.body ?? {};

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Invalid order data (items)" });
      }
      if (typeof total !== "number" || total <= 0) {
        return res.status(400).json({ message: "Invalid order data (total)" });
      }
      if (!["cod", "paypal", "card"].includes(paymentMethod)) {
        return res
          .status(400)
          .json({ message: "Invalid order data (paymentMethod)" });
      }

      const paymentStatus = paymentMethod === "cod" ? "unpaid" : "paid";

      const order = await Order.create({
        user: req.user!.userId,
        items,
        total,
        paymentMethod,
        paymentStatus,
        status: "confirmed",
      });

      return res.status(201).json(order);
    } catch (err: any) {
      console.error("checkout error:", err);
      return res.status(500).json({ message: "Checkout failed" });
    }
  }
);

// ✅ user order history page needs this
router.get("/my", requireAuth, async (req: AuthRequest, res) => {
  try {
    const orders = await Order.find({ user: req.user!.userId, isDeleted: false }).sort({
      createdAt: -1,
    });
    return res.json(orders);
  } catch (err: any) {
    console.error("my orders error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;