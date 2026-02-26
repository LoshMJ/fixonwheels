// backend/src/controllers/auth.controller.ts

import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

// 🔐 Role type (must match your User model)
type UserRole = "customer" | "technician" | "admin";

// 🔐 JWT Payload (must match auth.middleware.ts)
interface JwtPayload {
  userId: string;
  role: UserRole;
}

/**
 * Sign JWT helper
 */
function signToken(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing in environment variables");
  }

  return jwt.sign(payload, secret, {
    expiresIn: "7d",
  });
}

/**
 * POST /api/auth/register
 * Body: { name, email, password, role }
 */
export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body ?? {};

    if (!name?.trim() || !email?.trim() || !password?.trim() || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const allowedRoles: UserRole[] = ["customer", "technician", "admin"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const existing = await User.findOne({ email: normalizedEmail });

    if (existing) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    // ✅ JWT now matches middleware (NO email inside token)
    const token = signToken({
      userId: user._id.toString(),
      role: user.role as UserRole,
    });

    return res.status(201).json({
      message: "Registered successfully",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.error("[REGISTER ERROR]", err.message || err);

    return res.status(500).json({
      message: "Server error during registration",
    });
  }
}

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body ?? {};

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password.trim(),
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // ✅ JWT now matches middleware (NO email inside token)
    const token = signToken({
      userId: user._id.toString(),
      role: user.role as UserRole,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.error("[LOGIN ERROR]", err.message || err);

    return res.status(500).json({
      message: "Server error during login",
    });
  }
}