import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import type { UserRole } from "../models/User"; // ← recommended: move UserRole to a shared types file

/* =============================================
   JWT PAYLOAD & AUTHENTICATED REQUEST
============================================= */

export interface JwtPayload {
  userId: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

/* =============================================
   1. Authentication Middleware
   Verifies JWT and attaches user to request
============================================= */

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authentication required - Bearer token missing" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

/* =============================================
   2. Role Authorization Middleware (flexible)
   Usage examples:
   - router.use(requireRole("admin"))
   - router.use(requireRole(["admin", "technician"]))
============================================= */

export const requireRole = (allowed: UserRole | UserRole[]) => {
  const allowedRoles = Array.isArray(allowed) ? allowed : [allowed];

  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        message: `Access denied. Required role: ${allowedRoles.join(" or ")}. Your role: ${req.user.role}`,
      });
      return;
    }

    next();
  };
};

/* =============================================
   3. Convenience wrappers (optional)
   Use these if you prefer named middlewares
============================================= */

export const requireAdmin = requireRole("admin");
export const requireTechnician = requireRole("technician");
export const requireCustomer = requireRole("customer");

// Bonus: if you ever need to allow multiple roles explicitly
export const requireAdminOrTechnician = requireRole(["admin", "technician"]);