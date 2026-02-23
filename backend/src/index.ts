import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();

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
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🔥 Server running on http://localhost:${PORT}`);
    console.log(`✅ Health check: http://localhost:${PORT}/health`);
  });
})();