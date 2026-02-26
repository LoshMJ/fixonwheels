// backend/src/controllers/repair.controller.ts
import { Request, Response } from "express";
import { Repair } from "../models/Repair";
import { User } from "../models/User";
import { getIO } from "../socket";
import { WORKFLOWS } from "../utils/repairWorkflows"; // ← added this import
import mongoose from "mongoose";
import bcrypt from "bcrypt";
// Helper type for authenticated requests
type AuthenticatedRequest = Request & {
  user?: {
    userId: string;
    email?: string;
    role: string;
  };
};

/* =====================================================
   1. CREATE REPAIR (Customer)
===================================================== */
export const createRepair = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      deviceModel,
      issue,
      description,
      address,
      issueId,
      platform,
    } = req.body;

    const customerId = req.user?.userId;
    if (!customerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Prevent multiple active repairs
    const existing = await Repair.findOne({
      customer: customerId,
      status: { $in: ["pending", "accepted", "in_progress"] },
    });

    if (existing) {
      return res.status(400).json({
        message: "You already have an active repair",
      });
    }

    const repair = await Repair.create({
      customer: customerId,
      deviceModel,
      issue,
      description,
      address,
      status: "pending",
    });

    const availableTechs = await User.find({
      role: "technician",
      status: "available",
    });

    const io = getIO();

    availableTechs.forEach((tech) => {
      io.to(tech._id.toString()).emit("incoming_repair", repair);
    });

    res.status(201).json(repair);
  } catch (err: any) {
    console.error("Create repair error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   2. GET INCOMING REPAIRS (Technician)
===================================================== */
export const getIncomingRepairs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const repairs = await Repair.find({
      status: "pending",
      technician: null,
    })
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.json(repairs);
  } catch (err: any) {
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   3. ACCEPT REPAIR (Technician)
===================================================== */
export const acceptRepair = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const technicianId = req.user?.userId;

    const repair = await Repair.findById(id);
    if (!repair) return res.status(404).json({ message: "Repair not found" });

    if (repair.status !== "pending") {
      return res.status(400).json({ message: "Repair already taken" });
    }

    repair.technician = new mongoose.Types.ObjectId(technicianId);
    repair.status = "accepted";
    await repair.save();

    await User.findByIdAndUpdate(technicianId, { status: "busy" });

    const io = getIO();

    io.to(repair._id.toString()).emit("repair_updated", repair);
    io.to(repair.customer.toString()).emit("repair_updated", repair);

    res.json({ message: "Repair accepted" });
  } catch (err: any) {
    console.error("Accept repair error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   4. START REPAIR (Technician) — FIXED
===================================================== */
export const startRepair = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const technicianId = req.user?.userId;

    const repair = await Repair.findById(id);
    if (!repair) return res.status(404).json({ message: "Repair not found" });

    if (repair.technician?.toString() !== technicianId) {
      return res.status(403).json({ message: "Not your repair" });
    }

    if (repair.status !== "accepted") {
      return res.status(400).json({ message: "Cannot start repair" });
    }

    // 🔥 FIXED WORKFLOW LOOKUP (your requested logic)
    // Normalize issue name to match WORKFLOWS keys (e.g. "Speaker / mic issue" → "speaker_mic_issue")
    const normalizedKey = repair.issue
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

    console.log("Normalized issue key:", normalizedKey);

    const workflowSteps = WORKFLOWS[normalizedKey];

    if (!workflowSteps || workflowSteps.length === 0) {
      return res.status(400).json({
        message: "No workflow found for this issue",
      });
    }

    // Set stepsProgress from WORKFLOWS
    repair.stepsProgress = workflowSteps.map((step) => ({
      stepId: step.id,
      label: step.label,
      completed: false,
    }));

    repair.status = "in_progress";
    await repair.save();

    const io = getIO();
    io.to(repair._id.toString()).emit("repair_updated", repair);

    res.json(repair);
  } catch (err: any) {
    console.error("Start repair error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   5. UPDATE REPAIR STEP (Technician)
===================================================== */
export const updateRepairStep = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id, stepId } = req.params;
    const { notes, photoUrl } = req.body;
    const technicianId = req.user?.userId;

    const repair = await Repair.findById(id);
    if (!repair) return res.status(404).json({ message: "Repair not found" });

    if (repair.technician?.toString() !== technicianId) {
      return res.status(403).json({ message: "Not your repair" });
    }

    const step = repair.stepsProgress.find((s: any) => s.stepId === stepId);
    if (!step) return res.status(400).json({ message: "Invalid step" });

    step.completed = true;
    step.completedAt = new Date();
    step.notes = notes || step.notes;
    step.photoUrl = photoUrl || step.photoUrl;

    await repair.save();

    const io = getIO();
    io.to(repair._id.toString()).emit("repair_updated", repair);

    res.json({ message: "Step updated" });
  } catch (err: any) {
    console.error("Update step error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   6. COMPLETE REPAIR (Technician)
===================================================== */
export const completeRepair = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const technicianId = req.user?.userId;

    const repair = await Repair.findById(id);
    if (!repair) return res.status(404).json({ message: "Repair not found" });

    if (repair.technician?.toString() !== technicianId) {
      return res.status(403).json({ message: "Not your repair" });
    }

    if (repair.status !== "in_progress") {
      return res.status(400).json({ message: "Cannot complete repair" });
    }

    repair.status = "completed";
    await repair.save();

    await User.findByIdAndUpdate(technicianId, { status: "available" });

    const io = getIO();
    io.to(repair._id.toString()).emit("repair_updated", repair);

    res.json({ message: "Repair completed" });
  } catch (err: any) {
    console.error("Complete repair error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   7. CUSTOMER CONFIRM HANDOVER
===================================================== */
export const confirmHandoverCustomer = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const customerId = req.user?.userId;

    const repair = await Repair.findById(id);
    if (!repair) return res.status(404).json({ message: "Repair not found" });

    if (repair.customer?.toString() !== customerId) {
      return res.status(403).json({ message: "Not your repair" });
    }

    repair.customerConfirmedHandover = true;
    await repair.save();

    const io = getIO();

    if (repair.technician) {
      io.to(repair.technician.toString()).emit("handover_confirmed", {
        repairId: repair._id.toString(),
        by: "customer",
      });
    }

    io.to(repair._id.toString()).emit("repair_updated", repair);

    res.json({ message: "Customer confirmed handover" });
  } catch (err: any) {
    console.error("Customer handover error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   8. TECHNICIAN CONFIRM HANDOVER
===================================================== */
export const confirmHandoverTechnician = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const technicianId = req.user?.userId;

    const repair = await Repair.findById(id);
    if (!repair) return res.status(404).json({ message: "Repair not found" });

    if (repair.technician?.toString() !== technicianId) {
      return res.status(403).json({ message: "Not your repair" });
    }

    repair.technicianConfirmedHandover = true;
    await repair.save();

    const io = getIO();

    io.to(repair.customer.toString()).emit("handover_confirmed", {
      repairId: repair._id.toString(),
      by: "technician",
    });

    io.to(repair._id.toString()).emit("repair_updated", repair);

    res.json({ message: "Technician confirmed handover" });
  } catch (err: any) {
    console.error("Technician handover error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   9. GET MY ACTIVE REPAIR (Customer)
===================================================== */
export const getMyRepair = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const repair = await Repair.findOne({
      customer: userId,
      status: { $in: ["pending", "accepted", "in_progress"] },
    }).sort({ createdAt: -1 });

    if (!repair) {
      return res.status(404).json({ message: "No active repair" });
    }

    res.json(repair);
  } catch (err) {
    console.error("Get my repair error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   10. GET ACTIVE REPAIRS (Technician)
===================================================== */
export const getActiveRepairs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const technicianId = req.user?.userId;

    const repairs = await Repair.find({
      technician: technicianId,
      status: { $in: ["accepted", "in_progress"] },
    }).sort({ createdAt: -1 });

    res.json(repairs);
  } catch (err: any) {
    console.error("Get active repairs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   11. PAY REPAIR (Customer)
===================================================== */
export const payRepair = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { method } = req.body;

    const repair = await Repair.findById(id);
    if (!repair) return res.status(404).json({ message: "Repair not found" });

    if (repair.status !== "awaiting_payment") {
      return res.status(400).json({ message: "Repair not ready for payment" });
    }

    repair.paymentMethod = method;

    if (method === "cod") {
      repair.paymentStatus = "pending";
    } else {
      repair.paymentStatus = "paid";
      repair.status = "paid";
    }

    await repair.save();

    const io = getIO();
    io.to(repair._id.toString()).emit("repair_updated", repair);

    res.json(repair);
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   12. FINISH REPAIR (Technician) — sets to awaiting_payment
===================================================== */
export const finishRepair = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const repair = await Repair.findById(id);
    if (!repair) return res.status(404).json({ message: "Not found" });

    if (repair.status !== "in_progress") {
      return res.status(400).json({ message: "Repair not in progress" });
    }

    repair.status = "awaiting_payment";
    await repair.save();

    const io = getIO();
    io.to(repair._id.toString()).emit("repair_updated", repair);

    res.json(repair);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


/* =====================================================
   14. GET SINGLE REPAIR BY ID
===================================================== */
export const getRepairById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const role = req.user?.role;

    const repair = await Repair.findById(id);
    if (!repair) return res.status(404).json({ message: "Repair not found" });

    if (role === "customer" && repair.customer?.toString() !== userId) {
      return res.status(403).json({ message: "Not your repair" });
    }

    if (role === "technician" && repair.technician?.toString() !== userId) {
      return res.status(403).json({ message: "Not your repair" });
    }

    res.json(repair);
  } catch (err: any) {
    console.error("Get repair error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const processPayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { method } = req.body;

    const repair = await Repair.findById(id);
    if (!repair) return res.status(404).json({ message: "Repair not found" });

    if (repair.status !== "awaiting_payment") {
      return res.status(400).json({ message: "Repair not ready for payment" });
    }

    repair.paymentMethod = method;
    repair.paymentStatus = "paid";
    repair.status = "paid";
    repair.paidAt = new Date();

    await repair.save();

    const io = getIO();
    io.to(repair._id.toString()).emit("repair_updated", repair);

    res.json(repair);

  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const confirmCashPayment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const technicianId = req.user?.userId;

    const repair = await Repair.findById(id);
    if (!repair) return res.status(404).json({ message: "Repair not found" });

    if (repair.technician?.toString() !== technicianId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    repair.status = "paid";
    repair.paymentStatus = "paid";
    repair.paidAt = new Date();

    await repair.save();

    res.json(repair);
  } catch (err) {
    console.error("Confirm payment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const submitPayment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { method, amount } = req.body;

    const repair = await Repair.findById(id);
    if (!repair) return res.status(404).json({ message: "Repair not found" });

    repair.paymentMethod = method;
    repair.amount = amount || 0;

    if (method === "cod") {
      repair.status = "awaiting_payment";
      repair.paymentStatus = "awaiting_payment";
    } else {
      repair.status = "paid";
      repair.paymentStatus = "paid";
      repair.paidAt = new Date();
    }

    await repair.save();

    res.json(repair);
  } catch (err) {
    console.error("Submit payment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getTechnicianPayments = async (req: Request, res: Response) => {
  try {
    const technicianId = (req as any).user.userId;

    console.log("=== Payments Debug ===");
    console.log("Logged-in technician ID:", technicianId);
    console.log("ID type:", typeof technicianId);

const repairs = await Repair.find({
  technician: technicianId,
  status: { $in: ["paid", "completed"] }
}).sort({ createdAt: -1 });
    console.log("Found repairs:", repairs.length);
    if (repairs.length > 0) {
      console.log("First repair:", {
        _id: repairs[0]._id,
        status: repairs[0].status,
        technician: repairs[0].technician,
        paymentStatus: repairs[0].paymentStatus || "N/A"
      });
    } else {
      console.log("No matching repairs");
    }

    res.json(repairs);
  } catch (err) {
    console.error("Payments error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const submitRating = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { rating, note } = req.body;

    const repair = await Repair.findById(id);
    if (!repair) return res.status(404).json({ message: "Repair not found" });

    repair.rating = rating;
    repair.ratingNote = note;

    await repair.save();

    res.json(repair);
  } catch (err) {
    console.error("Rating error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getTechnicianHistory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const technicianId = req.user?.userId;

    const repairs = await Repair.find({
      technician: technicianId,
      status: "completed",
    }).sort({ updatedAt: -1 });

    res.json(repairs);
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getTechnicianProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const technicianId = req.user?.userId;

    const technician = await User.findById(technicianId).select(
      "name email profileImage"
    );

    if (!technician) {
      return res.status(404).json({ message: "Technician not found" });
    }

    const completedRepairs = await Repair.find({
      technician: technicianId,
      status: "completed",
    });

    const totalRepairs = completedRepairs.length;

    const ratedRepairs = completedRepairs.filter(r => r.rating !== undefined);

    const avgRating =
      ratedRepairs.length > 0
        ? ratedRepairs.reduce((sum, r) => sum + (r.rating ?? 0), 0) /
          ratedRepairs.length
        : 0;

    let level = "Bronze";

    if (totalRepairs >= 50 && avgRating >= 4.5) level = "Platinum";
    else if (totalRepairs >= 25 && avgRating >= 4.0) level = "Gold";
    else if (totalRepairs >= 10 && avgRating >= 3.5) level = "Silver";

    return res.json({
      technician,
      totalRepairs,
      avgRating,
      level,
    });
  } catch (err) {
    console.error("Profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
export const updateTechnicianProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const technicianId = req.user?.userId;
    const { name, email, password } = req.body;

    const technician = await User.findById(technicianId);
    if (!technician) {
      return res.status(404).json({ message: "Technician not found" });
    }

    if (name) technician.name = name;
    if (email) technician.email = email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      technician.password = hashedPassword;
    }

    await technician.save();

    return res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
