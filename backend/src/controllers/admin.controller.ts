import type { Request, Response } from "express";
import { User } from "../models/User";

// If you already have these models, import them.
// If not, keep them commented for now and we’ll add later.
// import { Order } from "../models/Order";
// import { Repair } from "../models/Repair";

function last7DaysLabels() {
  // short day labels to match your frontend chart: Mon..Sun
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
}

export async function getAdminStats(_req: Request, res: Response) {
  try {
    const totalUsers = await User.countDocuments({ role: "customer" });
    const totalTechnicians = await User.countDocuments({ role: "technician" });

    // ✅ If you don’t have Order/Repair models yet, return 0 safely
    let totalOrders = 0;
    let totalRepairs = 0;
    let cancelledOrders = 0;

    // charts
    let ordersLast7Days: { day: string; orders: number }[] = [];
    let orderStatusBreakdown: { name: string; value: number }[] = [];
    let repairsByType: { name: string; value: number }[] = [];

    // --- When you create Order/Repair models, replace this block with real queries ---
    // totalOrders = await Order.countDocuments();
    // totalRepairs = await Repair.countDocuments();
    // cancelledOrders = await Order.countDocuments({ status: "cancelled" });

    // ✅ Return response in EXACT shape your frontend expects
    return res.json({
      totalUsers,
      totalTechnicians,
      totalOrders,
      totalRepairs,
      cancelledOrders,
      ordersLast7Days,
      orderStatusBreakdown,
      repairsByType,
    });
  } catch (err: any) {
    console.error("getAdminStats error:", err?.message || err);
    return res.status(500).json({ message: "Server error" });
  }
}