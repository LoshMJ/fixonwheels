// backend/src/index.ts
import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

import repairRoutes from "./routes/repair.routes";
import authRoutes from "./routes/auth.routes";
import publicRoutes from "./routes/public";
import adminRoutes from "./routes/admin";

import { connectDB } from "./config/db";
import { seedAdmin } from "./seed/seedAdmin";
import { setupSocket, setIO } from "./socket";
import path from "path";

dotenv.config();

const app = express();
const server = http.createServer(app);

/* ================= SOCKET.IO SETUP ================= */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your frontend dev URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Make io available globally
setIO(io);

// Setup socket event handlers (join, disconnect, etc.)
setupSocket(io);

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

/* ================= ROUTES ================= */
app.use("/api", publicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/repairs", repairRoutes);
app.use("/api/admin", adminRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/uploads", express.static("uploads"));
/* ================= START SERVER ================= */
const PORT = Number(process.env.PORT) || 5000;

(async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log("MongoDB connected successfully");

    // Seed admin user if needed
    await seedAdmin();

    // Start the HTTP + Socket.io server
    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  }
})();