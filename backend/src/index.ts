import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

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