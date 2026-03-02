import { Router } from "express";
import { login, register } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { AuthRequest } from "../types/AuthRequest";
import { User } from "../models/User";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  const user = await User.findById(req.user!.userId).select("-password");
  res.json(user);
});
export default router;