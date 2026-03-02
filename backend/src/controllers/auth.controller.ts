import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

/* ==============================
   TYPES
============================== */

type UserRole = "customer" | "technician" | "admin";

interface JwtPayload {
  userId: string;
  role: UserRole;
}

/* ==============================
   JWT HELPER
============================== */

function signToken(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is missing in environment variables");
  }

  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

/* ==============================
   REGISTER
============================== */

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body ?? {};

    if (!name?.trim() || !email?.trim() || !password?.trim() || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const allowedRoles: UserRole[] = ["customer", "technician"];

    if (!allowedRoles.includes(role as UserRole)) {
      return res.status(400).json({
        message: "Invalid role. Must be 'customer' or 'technician'",
      });
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    // Technician accounts require admin approval
    const technicianStatus = role === "technician" ? "pending" : "approved";

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role as UserRole,
      technicianStatus,
    });

    // Technicians → no token yet, just success message
    if (role === "technician") {
      return res.status(201).json({
        message: "Registered successfully. Waiting for admin approval.",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          technicianStatus: user.technicianStatus,
        },
      });
    }

    // Customers → immediate login token
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

/* ==============================
   LOGIN
============================== */

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body ?? {};

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Explicitly select password (in case schema has select: false)
    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password.trim(), user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Block unapproved / rejected technicians
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
        ...(user.role === "technician" && { technicianStatus: user.technicianStatus }),
      },
    });
  } catch (err: any) {
    console.error("[LOGIN ERROR]", err.message || err);
    return res.status(500).json({
      message: "Server error during login",
    });
  }
}