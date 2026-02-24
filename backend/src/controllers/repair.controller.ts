// backend/src/controllers/repair.controller.ts
import { Request, Response } from 'express';
import { Repair } from '../models/Repair';  // ← named import
import { User } from '../models/User';      // ← named import
import { getIO } from '../socket';

export const createRepair = async (req: Request, res: Response) => {
  try {
    const { deviceModel, issue, description, address } = req.body;
    const customerId = (req as any).user?.userId;

    if (!customerId) {
      return res.status(401).json({ message: 'Unauthorized - No user ID' });
    }

    const repair = new Repair({
      customer: customerId,
      deviceModel,
      issue,
      description,
      address,
      status: 'pending',
    });

    await repair.save();

    // Find available technicians
    const availableTechs = await User.find({
      role: 'technician',
      status: 'available',
    }).lean();

    const io = getIO();

    availableTechs.forEach((tech: any) => {
      if (tech._id) {
        io.to(tech._id.toString()).emit('incoming_repair', {
          repairId: repair._id.toString(),
          deviceModel,
          issue,
          description,
          customerId: customerId.toString(),
        });
      }
    });

    res.status(201).json({
      _id: repair._id.toString(),
      status: repair.status,
    });
  } catch (error: any) {
    console.error('Create repair error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getIncomingRepairs = async (req: Request, res: Response) => {
  try {
    const technicianId = (req as any).user?.userId;

    if (!technicianId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(technicianId);
    if (!user || user.role !== "technician") {
      return res.status(403).json({ message: "Forbidden - Only technicians" });
    }

    const pendingRepairs = await Repair.find({
      status: "pending",
      technician: null,
    })
      .populate("customer", "name email")
      .select("deviceModel issue description address createdAt customer");

    res.status(200).json(pendingRepairs);
  } catch (error: any) {
    console.error("Get incoming repairs error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const acceptRepair = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const technicianId = (req as any).user?.userId;

    if (!technicianId) {
      return res.status(401).json({ message: 'Unauthorized - No user ID' });
    }

    const repair = await Repair.findById(id);
    if (!repair) return res.status(404).json({ message: 'Repair not found' });

    if (repair.status !== 'pending') {
      return res.status(400).json({ message: 'Repair is not pending' });
    }

    repair.technician = technicianId;
    repair.status = 'accepted';
    await repair.save();

    await User.findByIdAndUpdate(technicianId, { status: 'busy' });

    const io = getIO();

    io.to(repair.customer.toString()).emit('repair_accepted', {
      repairId: repair._id.toString(),
      technicianId,
      technicianName: (req as any).user?.email || 'Technician',
    });

    res.json({ message: 'Repair accepted successfully' });
  } catch (error: any) {
    console.error('Accept repair error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateRepairStep = async (req: Request, res: Response) => {
  try {
    const { id, stepId } = req.params;
    const { notes, photoUrl } = req.body;
    const technicianId = (req as any).user?.userId;

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
    io.to(repair.customer.toString()).emit('step_updated', {
      repairId: repair._id.toString(),
      stepId,
      completed: true,
      notes: step.notes,
      photoUrl: step.photoUrl,
    });

    res.json({ message: "Step marked complete" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const confirmHandoverCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customerId = (req as any).user?.userId;

    const repair = await Repair.findById(id);
    if (!repair) return res.status(404).json({ message: "Repair not found" });

    if (repair.customer?.toString() !== customerId) {
      return res.status(403).json({ message: "Not your repair" });
    }

    repair.customerConfirmedHandover = true;
    await repair.save();

    const io = getIO();
    if (repair.technician) {
      io.to(repair.technician.toString()).emit('handover_confirmed', {
        repairId: repair._id.toString(),
        by: "customer",
      });
    }

    res.json({ message: "Handover confirmed by customer" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const confirmHandoverTechnician = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const technicianId = (req as any).user?.userId;

    const repair = await Repair.findById(id);
    if (!repair) return res.status(404).json({ message: "Repair not found" });

    if (repair.technician?.toString() !== technicianId) {
      return res.status(403).json({ message: "Not your repair" });
    }

    repair.technicianConfirmedHandover = true;
    await repair.save();

    const io = getIO();
    io.to(repair.customer.toString()).emit('handover_confirmed', {
      repairId: repair._id.toString(),
      by: "technician",
    });

    res.json({ message: "Handover confirmed by technician" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};