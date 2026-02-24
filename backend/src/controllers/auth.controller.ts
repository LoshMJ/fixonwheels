import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

function signToken(payload: { userId: string; role: string }) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing in .env");

  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

/**
 * POST /api/auth/register
 * Body: { name, email, password, role: "customer" | "technician" }
 */
export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body ?? {};

    // ✅ Fix for your earlier error: req.body undefined
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Missing fields",
        required: ["name", "email", "password", "role"],
      });
    }

    if (role !== "customer" && role !== "technician") {
      return res.status(400).json({ message: "Invalid role" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
    });

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
    console.error("register error:", err?.message || err);
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

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
      },
    });
  } catch (err: any) {
    console.error("login error:", err?.message || err);
    return res.status(500).json({ message: "Server error" });
  }
}