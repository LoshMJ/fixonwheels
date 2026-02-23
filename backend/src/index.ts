import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import publicRoutes from "./routes/public";
import adminRoutes from "./routes/admin";

dotenv.config();

// ✅ Create app FIRST
const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("FixOnWheels backend running 🚀");
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🔥 Server running on http://localhost:${PORT}`);
  });
})();