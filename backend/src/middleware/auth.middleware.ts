import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  email?: string;
  role: string;             // ← This is the key change
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("[Auth] Missing or invalid Authorization header");
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Token missing" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ message: "Token expired" });
    }

    req.user = decoded;
    console.log(`[Auth] User authenticated: ${decoded.userId} (${decoded.role})`);
    next();
  } catch (error: any) {
    console.error("[Auth] Token verification failed:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.status(401).json({ message: "Authentication failed" });
  }
};

export const requireRole = (allowedRole: "customer" | "technician") => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - No user context" });
    }

    if (req.user.role !== allowedRole) {
      console.log(
        `[Auth] Forbidden: User ${req.user.userId} (${req.user.role}) tried to access ${allowedRole} route`
      );
      return res.status(403).json({
        message: `Forbidden - This action requires ${allowedRole} role`,
      });
    }

    next();
  };
};