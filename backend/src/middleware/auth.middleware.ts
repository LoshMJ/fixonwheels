import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type UserRole = "customer" | "technician" | "admin";

interface JwtPayload {
  userId: string;
  email?: string;
  role: UserRole;
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    (req as any).user = decoded; // ← bypass typing
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const requireCustomer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if ((req as any).user?.role !== "customer") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

export const requireTechnician = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if ((req as any).user?.role !== "technician") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if ((req as any).user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};