// backend/src/index.ts  (update your main server file)
import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import repairRoutes from './routes/repair.routes';
import authRoutes from './routes/auth.routes';  // Assuming you have this
import { setupSocket, setIO } from './socket';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',  // Your frontend dev URL
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

setIO(io);  // Make io available globally
setupSocket(io);  // Setup connection handlers

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/repairs', repairRoutes);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});