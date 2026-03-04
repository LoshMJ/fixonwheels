import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import path from "path";

import repairRoutes from "./routes/repair.routes";
import authRoutes from "./routes/auth.routes";
import publicRoutes from "./routes/public";
import adminRoutes from "./routes/admin";
import orderRoutes from "./routes/order.routes";

import { connectDB } from "./config/db";
import { seedAdmin } from "./seed/seedAdmin";
import { setupSocket, setIO } from "./socket";

dotenv.config();
// Force Node.js to use reliable public DNS (Google or Cloudflare)
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);     
// or Cloudflare: ['1.1.1.1', '1.0.0.1']
const app = express();
const server = http.createServer(app);

/* GLOBAL MIDDLEWARE */

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

/* STATIC FILES */

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/* BASIC ROUTES */

// Health route
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "backend" });
});

// Base route
app.get("/", (_req, res) => {
  res.send("FixOnWheels backend running 🚀");
});

/*  SOCKET.IO  */

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Make io globally available
setIO(io);
setupSocket(io);

/* API ROUTES */

app.use("/api", publicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/repairs", repairRoutes);
app.use("/api/admin", adminRoutes);

/* START SERVER  */

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

(async () => {
  try {
    await connectDB();
    console.log(" MongoDB connected");

    await seedAdmin();

    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`Health: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error(" Server failed to start:", err);
    process.exit(1);
  }
})();