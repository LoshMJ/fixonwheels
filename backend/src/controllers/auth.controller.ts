// backend/src/controllers/auth.controller.ts
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

// Define the exact payload shape your middleware expects
interface JwtPayload {
  userId: string;
  email: string;           // Now required - we include it in token
  role: "customer" | "technician";
}

/**
 * Helper to sign JWT - consistent across login/register
 */
function signToken(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is missing in environment variables");
  }

  return jwt.sign(payload, secret, {
    expiresIn: "7d", // Adjust as needed (e.g., "24h" for shorter sessions)
  });
}

/**
 * POST /api/auth/register
 * Body: { name, email, password, role: "customer" | "technician" }
 */
export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body ?? {};

    // Stronger validation
    if (!name?.trim() || !email?.trim() || !password?.trim() || !role) {
      return res.status(400).json({
        message: "All fields are required",
        required: ["name", "email", "password", "role"],
      });
    }

    if (role !== "customer" && role !== "technician") {
      return res.status(400).json({
        message: "Role must be either 'customer' or 'technician'",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: trimmedEmail,
      password: hashedPassword,
      role,
    });

    // Generate JWT with full payload
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Success response
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
    console.error("[register] Error:", err.message || err);
    return res.status(500).json({
      message: "Server error during registration",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
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

    const trimmedEmail = email.trim().toLowerCase();

    // Find user
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password.trim(), user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT with full payload
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Success response
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
    console.error("[login] Error:", err.message || err);
    return res.status(500).json({
      message: "Server error during login",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
}