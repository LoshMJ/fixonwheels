import { Router } from "express";
import Product from "../models/Product";
import RecentItem from "../models/RecentItem";
import PromoPost from "../models/PromoPost";
import { upload } from "../middleware/upload.middleware";

import {
  requireAuth,
  requireRole,
  AuthRequest,
} from "../middleware/auth.middleware";

import { User } from "../models/User";
import { Order } from "../models/Order";
import { Repair } from "../models/Repair";
import bcrypt from "bcryptjs";

import { buildInvoicePdf } from "../utils/invoice";
import { sendOrderCompletedEmail } from "../utils/mailer";

import type { Request } from "express";

type MulterRequest = Request & {
  file?: any;
}

const router = Router();

router.use(requireAuth);
router.use(requireRole("admin"));

const daysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* =====================================================
   ✅ DASHBOARD STATS (NUMBERS + CHARTS)
   GET /api/admin/stats
===================================================== */
router.get("/stats", async (_req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "customer" });
    const technicians = await User.countDocuments({ role: "technician" });

    const totalOrders = await Order.countDocuments({ isDeleted: false });
    const cancelledOrders = await Order.countDocuments({
      isDeleted: false,
      status: "cancelled",
    });

    const totalRepairs = await Repair.countDocuments();

    // ✅ Orders last 7 days (fill missing days with 0)
    const from = new Date();
    from.setDate(from.getDate() - 6);
    from.setHours(0, 0, 0, 0);

    const ordersAgg = await Order.aggregate([
      { $match: { isDeleted: false, createdAt: { $gte: from } } },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" }, // 1..7 (Sun..Sat)
          orders: { $sum: 1 },
        },
      },
    ]);

    const dayMap = new Map<number, number>();
    ordersAgg.forEach((x: any) => dayMap.set(x._id, x.orders));

    const ordersLast7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(from);
      d.setDate(from.getDate() + i);

      const dow = d.getDay(); // 0..6
      const label = daysShort[dow];

      // Mongo: Sun=1..Sat=7
      const mongoDow = dow === 0 ? 1 : dow + 1;
      return { day: label, orders: dayMap.get(mongoDow) ?? 0 };
    });

    // ✅ Order status breakdown
    const statusAgg = await Order.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: "$status", value: { $sum: 1 } } },
    ]);

    const orderStatusBreakdown = statusAgg.map((s: any) => ({
      name: s._id,
      value: s.value,
    }));

    // ✅ Repairs by type
    let repairsByType: { name: string; value: number }[] = [];
    try {
      const repairTypeAgg = await Repair.aggregate([
        { $group: { _id: "$issueType", value: { $sum: 1 } } },
        { $sort: { value: -1 } },
        { $limit: 8 },
      ]);
      repairsByType = repairTypeAgg
        .filter((r: any) => r._id)
        .map((r: any) => ({ name: r._id, value: r.value }));
    } catch {
      repairsByType = [];
    }

    return res.json({
      totalUsers,
      technicians,
      totalTechnicians: technicians,
      totalOrders,
      totalRepairs,
      cancelledOrders,
      ordersLast7Days,
      orderStatusBreakdown,
      repairsByType,
    });
  } catch (err: any) {
    console.error("admin stats error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* REVENUE ANALYTICS
   GET /api/admin/analytics/revenue?days=30 */
router.get("/analytics/revenue", async (req, res) => {
  try {
    const days = Math.min(365, Math.max(7, Number(req.query.days || 30)));

    const from = new Date();
    from.setDate(from.getDate() - (days - 1));
    from.setHours(0, 0, 0, 0);

    const agg = await Order.aggregate([
      {
        $match: {
          isDeleted: false,
          paymentStatus: "paid",
          createdAt: { $gte: from },
        },
      },
      {
        $group: {
          _id: {
            y: { $year: "$createdAt" },
            m: { $month: "$createdAt" },
            d: { $dayOfMonth: "$createdAt" },
          },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.y": 1, "_id.m": 1, "_id.d": 1 } },
    ]);

    const points = agg.map((x: any) => ({
      date: `${x._id.y}-${String(x._id.m).padStart(2, "0")}-${String(
        x._id.d
      ).padStart(2, "0")}`,
      revenue: x.revenue,
      orders: x.orders,
    }));

    return res.json({ days, from, points });
  } catch (err: any) {
    console.error("revenue analytics error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   ✅ USERS
===================================================== */
router.get("/users", async (_req, res) => {
  try {
    const users = await User.find().select("_id name email role createdAt");
    return res.json(users);
  } catch (err: any) {
    console.error("admin users error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/technicians", async (_req, res) => {
  try {
    const techs = await User.find({ role: "technician" }).select(
      "_id name email role technicianStatus createdAt"
    );
    return res.json(techs);
  } catch (err: any) {
    console.error("admin technicians error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ APPROVE technician
router.patch("/technicians/:id/approve", async (req, res) => {
  try {
    const updated = await User.findOneAndUpdate(
      { _id: req.params.id, role: "technician" },
      { technicianStatus: "approved" },
      { new: true }
    ).select("_id name email role technicianStatus");

    if (!updated) return res.status(404).json({ message: "Technician not found" });
    return res.json(updated);
  } catch (err: any) {
    console.error("approve technician error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ REJECT technician
router.patch("/technicians/:id/reject", async (req, res) => {
  try {
    const updated = await User.findOneAndUpdate(
      { _id: req.params.id, role: "technician" },
      { technicianStatus: "rejected" },
      { new: true }
    ).select("_id name email role technicianStatus");

    if (!updated) return res.status(404).json({ message: "Technician not found" });
    return res.json(updated);
  } catch (err: any) {
    console.error("reject technician error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});



router.patch("/users/:id", async (req, res) => {
  try {
    const { role } = req.body ?? {};
    if (!["customer", "technician", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("_id name email role");

    if (!updated) return res.status(404).json({ message: "User not found" });
    return res.json(updated);
  } catch (err: any) {
    console.error("admin update user error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ ok: true });
  } catch (err: any) {
    console.error("admin delete user error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   ✅ ORDERS (PAGINATION + FILTER + SEARCH)
===================================================== */
router.get("/orders", async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(5, Number(req.query.limit || 10)));
    const status = String(req.query.status || "");
    const q = String(req.query.q || "").trim();

    const filter: any = { isDeleted: false };

    if (
      status &&
      ["pending", "confirmed", "completed", "cancelled", "refunded"].includes(status)
    ) {
      filter.status = status;
    }

    if (q) {
      const matchedUsers = await User.find({
        $or: [
          { name: { $regex: q, $options: "i" } },
          { email: { $regex: q, $options: "i" } },
        ],
      }).select("_id");

      const userIds = matchedUsers.map((u) => u._id);

      filter.$or = [
        { "items.title": { $regex: q, $options: "i" } },
        ...(userIds.length ? [{ user: { $in: userIds } }] : []),
      ];
    }

    const totalCount = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user", "name email role");

    return res.json({
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      orders,
    });
  } catch (err: any) {
    console.error("admin orders list error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.patch("/orders/:id", async (req, res) => {
  try {
    const { status, paymentStatus } = req.body ?? {};
    const patch: any = {};

    if (status) {
      if (!["pending", "confirmed", "completed", "cancelled", "refunded"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      patch.status = status;

      if (status === "completed") {
        patch.paymentStatus = "paid";
      }
    }

    if (paymentStatus) {
      if (!["unpaid", "paid", "refunded"].includes(paymentStatus)) {
        return res.status(400).json({ message: "Invalid payment status" });
      }
      patch.paymentStatus = paymentStatus;
    }

    const updated = await Order.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      patch,
      { new: true }
    ).populate("user", "name email role");

    if (!updated) return res.status(404).json({ message: "Order not found" });

    if (status === "completed" && updated.user && (updated.user as any).email) {
      await sendOrderCompletedEmail((updated.user as any).email, updated._id.toString());
    }

    return res.json(updated);
  } catch (err: any) {
    console.error("admin update order error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/orders/:id/refund", async (req, res) => {
  try {
    const { reason } = req.body ?? {};

    const order = await Order.findOne({ _id: req.params.id, isDeleted: false }).populate(
      "user",
      "name email"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.paymentMethod === "cod") {
      return res.status(400).json({ message: "COD orders can't be refunded (unpaid)" });
    }

    if (order.paymentStatus === "refunded" || order.status === "refunded") {
      return res.status(400).json({ message: "Order already refunded" });
    }

    order.paymentStatus = "refunded";
    order.status = "refunded";
    order.refundedAt = new Date();
    order.refundReason = reason || "Refunded by admin";
    await order.save();

    return res.json({ ok: true, order });
  } catch (err: any) {
    console.error("refund error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/orders/:id/invoice", async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, isDeleted: false }).populate(
      "user",
      "name email"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice-${order._id}.pdf`);

    const doc = buildInvoicePdf(order);
    doc.pipe(res);
    doc.end();
  } catch (err: any) {
    console.error("invoice error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.delete("/orders/:id", async (req, res) => {
  try {
    const updated = await Order.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Order not found" });
    return res.json({ ok: true });
  } catch (err: any) {
    console.error("soft delete order error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   ✅ REPAIRS
===================================================== */
router.get("/repairs", async (_req, res) => {
  try {
    const repairs = await Repair.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email role")
      .populate("technician", "name email role");

    return res.json(repairs);
  } catch (err: any) {
    console.error("admin repairs error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.patch("/repairs/:id", async (req, res) => {
  try {
    const { status, technicianId } = req.body ?? {};
    const patch: any = {};

    if (status) patch.status = status;
    if (technicianId) patch.technician = technicianId;

    const updated = await Repair.findByIdAndUpdate(req.params.id, patch, { new: true })
      .populate("user", "name email role")
      .populate("technician", "name email role");

    if (!updated) return res.status(404).json({ message: "Repair not found" });
    return res.json(updated);
  } catch (err: any) {
    console.error("admin update repair error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.delete("/repairs/:id", async (req, res) => {
  try {
    await Repair.findByIdAndDelete(req.params.id);
    return res.json({ ok: true });
  } catch (err: any) {
    console.error("admin delete repair error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   ✅ PRODUCTS / RECENT ITEMS / PROMOS
===================================================== */

/* ✅ NEW: GET PRODUCTS LIST for Admin Category Posting
   GET /api/admin/products?category=cases&q=iphone
*/
router.get("/products", async (req, res) => {
  try {
    const category = String(req.query.category || "").trim();
    const q = String(req.query.q || "").trim();

    const filter: any = {};

    if (category) filter.category = category;

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    return res.json(products);
  } catch (err: any) {
    console.error("admin products list error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/products", upload.single("image"), async (req, res) => {
  try {
    const r = req as MulterRequest;
    const imagePath = r.file ? `/uploads/${r.file.filename}` : undefined;

    const created = await Product.create({
      ...req.body,
      img: imagePath,
    });

    return res.status(201).json(created);
  } catch (err: any) {
    console.error("Create product error:", err);
    return res.status(400).json({ message: err?.message || "Failed to create product" });
  }
});

router.put("/products/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(updated);
  } catch (err: any) {
    console.error("Update product error:", err);
    return res.status(400).json({ message: err?.message || "Failed to update product" });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.json({ ok: true });
  } catch (err: any) {
    console.error("Delete product error:", err);
    return res.status(400).json({ message: err?.message || "Failed to delete product" });
  }
});

router.delete("/recent-items/:id", async (req, res) => {
  try {
    await RecentItem.findByIdAndDelete(req.params.id);
    return res.json({ ok: true });
  } catch (err: any) {
    console.error("Delete recent item error:", err);
    return res.status(400).json({ message: err?.message || "Failed to delete recent item" });
  }
});

router.post("/promos", async (req, res) => {
  try {
    const created = await PromoPost.create(req.body);
    return res.status(201).json(created);
  } catch (err: any) {
    console.error("Create promo error:", err);
    return res.status(400).json({ message: err?.message || "Failed to create promo" });
  }
});

router.put("/promos/:id", async (req, res) => {
  try {
    const updated = await PromoPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(updated);
  } catch (err: any) {
    console.error("Update promo error:", err);
    return res.status(400).json({ message: err?.message || "Failed to update promo" });
  }
});

router.delete("/promos/:id", async (req, res) => {
  try {
    await PromoPost.findByIdAndDelete(req.params.id);
    return res.json({ ok: true });
  } catch (err: any) {
    console.error("Delete promo error:", err);
    return res.status(400).json({ message: err?.message || "Failed to delete promo" });
  }
});

// ✅ CHANGE PASSWORD (Admin)
router.patch("/change-password", async (req: any, res) => {
  try {
    const { currentPassword, newPassword } = req.body ?? {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Missing currentPassword/newPassword" });
    }

    // get admin user + password (because password is select:false)
    const user = await User.findById(req.user.userId).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(401).json({ message: "Current password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (err: any) {
    console.error("change-password error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;