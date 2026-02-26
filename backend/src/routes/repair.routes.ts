import { Router, Request, Response } from "express";
import multer from "multer";
import { AuthRequest } from "../types/AuthRequest";
import { Order } from "../models/Order";
import { Repair } from "../models/Repair";
import {
  createRepair,
  acceptRepair,
  updateRepairStep,
  confirmHandoverCustomer,
  confirmHandoverTechnician,
  getIncomingRepairs,
  getMyRepair,
  getActiveRepairs,
  getRepairById,
  startRepair,
  completeRepair,
  finishRepair,
  getTechnicianPayments,
  getTechnicianHistory,
  confirmCashPayment,
  submitPayment,
  submitRating,
  getTechnicianProfile,
  updateTechnicianProfile,

} from "../controllers/repair.controller";

import {
  requireAuth,
  requireCustomer,
  requireTechnician,
} from "../middleware/auth.middleware";

import { User } from "../models/User";

const router = Router();

/* =====================================
   MULTER CONFIG (Profile Image Upload)
===================================== */

const upload = multer({
  dest: "uploads/",
});

/* =====================================
   CREATE REPAIR (Customer)
===================================== */

router.post("/", requireAuth, requireCustomer, createRepair);

/* =====================================
   TECHNICIAN LIST ROUTES
   (MUST COME BEFORE /:id)
===================================== */

router.get("/incoming", requireAuth, requireTechnician, getIncomingRepairs);
router.get("/active", requireAuth, requireTechnician, getActiveRepairs);
router.get("/payments", requireAuth, requireTechnician, getTechnicianPayments);
router.get("/history", requireAuth, requireTechnician, getTechnicianHistory);
router.get("/my", requireAuth, getMyRepair);

/* =====================================
   TECHNICIAN PROFILE
===================================== */

router.get("/profile", requireAuth, requireTechnician, getTechnicianProfile);

router.patch("/profile", requireAuth, requireTechnician, updateTechnicianProfile);

router.post(
  "/profile/upload",
  requireAuth,
  upload.single("image"),
  async (req: Request & { user?: any; file?: any }, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const technician = await User.findById(req.user.userId);
      if (!technician) {
        return res.status(404).json({ message: "Technician not found" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      technician.profileImage = req.file.filename;
      await technician.save();

      return res.json({ message: "Image uploaded successfully" });
    } catch (err) {
      console.error("Profile upload error:", err);
      return res.status(500).json({ message: "Upload failed" });
    }
  }
);

/* =====================================
   REPAIR ACTIONS
===================================== */

router.post("/:id/accept", requireAuth, requireTechnician, acceptRepair);

router.patch("/:id/start", requireAuth, requireTechnician, startRepair);

router.patch("/:id/step/:stepId", requireAuth, requireTechnician, updateRepairStep);

router.post(
  "/:id/handover/customer",
  requireAuth,
  requireCustomer,
  confirmHandoverCustomer
);

router.post(
  "/:id/handover/technician",
  requireAuth,
  requireTechnician,
  confirmHandoverTechnician
);

router.patch("/:id/finish", requireAuth, requireTechnician, finishRepair);

router.patch("/:id/complete", requireAuth, requireTechnician, completeRepair);

/* =====================================
   PAYMENT & RATING
===================================== */

router.patch("/:id/pay", requireAuth, requireCustomer, submitPayment);

router.patch("/:id/confirm-cash", requireAuth, requireTechnician, confirmCashPayment);

router.patch("/:id/rate", requireAuth, requireCustomer, submitRating);

/* =====================================
   GENERIC ROUTE (ALWAYS LAST)
   VERY IMPORTANT: Prevents CastError
===================================== */

router.get("/:id", requireAuth, getRepairById);



// GET customer profile
router.get("/customer/profile", requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user!.userId).select("-password");

    const repairs = await Repair.find({ customer: req.user!.userId });

    const purchases = await Order.find({ user: req.user!.userId });

    res.json({ user, repairs, purchases });
  } catch (err) {
    res.status(500).json({ message: "Failed to load profile" });
  }
});

// UPDATE customer profile
router.patch("/customer/profile", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, email, password } = req.body;

    const updateData: any = { name, email };

    if (password && password.length > 3) {
      updateData.password = password; // make sure hashing happens in your model pre-save
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user!.userId,
      updateData,
      { new: true }
    ).select("-password");

    res.json({
      user: updatedUser,
      repairs: await Repair.find({ customer: req.user!.userId }),
      purchases: await Order.find({ user: req.user!.userId }),
    });
  } catch (err) {
    res.status(500).json({ message: "Profile update failed" });
  }
});

export default router;