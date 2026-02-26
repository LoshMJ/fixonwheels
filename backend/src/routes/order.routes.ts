import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { AuthRequest } from "../types/AuthRequest";
import { Order } from "../models/Order";  // <-- THIS ONE
const router = Router();

// ✅ Only customers can place orders (recommended)
router.post("/checkout", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { items, total, paymentMethod } = req.body ?? {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid order data (items)" });
    }
    if (typeof total !== "number" || total <= 0) {
      return res.status(400).json({ message: "Invalid order data (total)" });
    }
    if (!["cod", "paypal", "card"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid order data (paymentMethod)" });
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
});

// ✅ user order history page needs this
router.get("/my", requireAuth, async (req: AuthRequest, res) => {
  try {
    const orders = await Order.find({ user: req.user!.userId, isDeleted: false })
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err: any) {
    console.error("my orders error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;