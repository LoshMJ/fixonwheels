// src/controllers/auth.controller.ts
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

function signToken(payload: { userId: string; role: string }) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing in .env");
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body ?? {};

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Missing fields",
        required: ["name", "email", "password", "role"],
      });
    }

    // only customer/technician can register publicly
    if (role !== "customer" && role !== "technician") {
      return res.status(400).json({ message: "Invalid role" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    // ✅ technician starts as pending
    const technicianStatus = role === "technician" ? "pending" : "approved";

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      technicianStatus,
    });

    // ✅ If technician: do NOT give token (must wait for admin approval)
    if (role === "technician") {
      return res.status(201).json({
        message: "Registered successfully. Waiting for admin approval.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          technicianStatus: user.technicianStatus,
        },
      });
    }

    // ✅ customers can login immediately
    const token = signToken({ userId: user._id.toString(), role: user.role });

    return res.status(201).json({
      message: "Registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.error("register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // ✅ IMPORTANT: force-select password
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.password) {
      console.error("login error: password not returned from DB (select:false issue)");
      return res.status(500).json({ message: "Server error" });
    }

    // ✅ Block technician login until approved
    if (user.role === "technician") {
      const status = user.technicianStatus || "pending";

      if (status === "pending") {
        return res.status(403).json({
          message: "Technician account is pending approval by admin.",
        });
      }

      if (status === "rejected") {
        return res.status(403).json({
          message: "Technician account was rejected by admin.",
        });
      }
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken({ userId: user._id.toString(), role: user.role });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        technicianStatus: user.role === "technician" ? user.technicianStatus : undefined,
      },
    });
  } catch (err: any) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}