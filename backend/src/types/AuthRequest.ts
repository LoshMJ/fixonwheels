import { Request } from "express";
import { UserRole } from "../models/User";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email?: string;
    role: UserRole;
  };
}