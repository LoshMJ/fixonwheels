import { Router } from "express";
import { requireAuth, requireRole, AuthRequest } from "../middleware/auth.middleware";
import { Order } from "../models/Order";

const router = Router();

//  PUBLIC: Best seller products (most bought)
router.get("/best-sellers", async (req, res) => {
  try {
    const limitRaw = String(req.query.limit || "10");
    const limit = Math.max(1, Math.min(50, parseInt(limitRaw, 10) || 10));

    const best = await Order.aggregate([
      // only valid orders
      {
        $match: {
          isDeleted: false,
          status: { $nin: ["cancelled", "refunded"] },
        },
      },

      // items breakdown
      { $unwind: "$items" },

      // group by productId
      {
        $group: {
          _id: "$items.productId",
          soldCount: { $sum: "$items.qty" },

          // keep some display fields from order item
          title: { $first: "$items.title" },
          price: { $first: "$items.price" },
          img: { $first: "$items.img" },
        },
      },

      // sort high -> low
      { $sort: { soldCount: -1 } },

      { $limit: limit },
    ]);

    return res.json(best);
  } catch (err: any) {
    console.error("best-sellers error:", err);
    return res.status(500).json({ message: "Failed to load best sellers" });
  }
});

//  Only customers can place orders (recommended)
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

// user order history page needs this
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