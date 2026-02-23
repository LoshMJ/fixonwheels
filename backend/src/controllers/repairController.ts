import { Request, Response } from 'express';
import RepairRequest from '../models/RepairRequest';
import { io } from '../index'; // SignalR/socket.io instance

export const createRepair = async (req: Request, res: Response) => {
  try {
    const { description } = req.body;
    const repair = new RepairRequest({
      customerId: req.user.id,
      description,
    });
    await repair.save();
    res.status(201).json(repair);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRepair = async (req: Request, res: Response) => {
  try {
    const repair = await RepairRequest.findById(req.params.id);
    if (!repair) return res.status(404).json({ error: 'Not found' });
    res.json(repair);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateRepair = async (req: Request, res: Response) => {
  try {
    const { status, note } = req.body;
    const repair = await RepairRequest.findById(req.params.id);
    if (!repair) return res.status(404).json({ error: 'Not found' });

    if (status) repair.status = status;
    if (note) repair.notes.push({ text: note, createdAt: new Date() });
    repair.updatedAt = new Date();
    await repair.save();

    // Real-time notification
    io.to(repair.id).emit('repairUpdate', { status: repair.status, note });

    res.json(repair);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addNote = async (req: Request, res: Response) => {
  try {
    const { note } = req.body;
    const repair = await RepairRequest.findById(req.params.id);
    if (!repair) return res.status(404).json({ error: 'Not found' });

    repair.notes.push({ text: note, createdAt: new Date() });
    repair.updatedAt = new Date();
    await repair.save();

    // Real-time notification
    io.to(repair.id).emit('repairUpdate', { status: repair.status, note });

    res.json(repair);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAssignedRepairs = async (req: Request, res: Response) => {
  try {
    const repairs = await RepairRequest.find({ technicianId: req.user.id });
    res.json(repairs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};