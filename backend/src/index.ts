import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import publicRoutes from "./routes/public";
import adminRoutes from "./routes/admin";
import authRoutes from "./routes/auth.routes";
import { seedAdmin } from "./seed/seedAdmin";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health route (always keep)
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "backend" });
});

// Base route
app.get("/", (_req, res) => {
  res.send("FixOnWheels backend running 🚀");
});

// Routes
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

(async () => {
  try {
    await connectDB();

    // ✅ create admin after DB is connected
    await seedAdmin();

    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
      console.log(` Health check: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error(" Server failed to start:", err);
    process.exit(1);
  }
})();