// backend/src/socket.ts  (new file for Socket.io setup)
import { Server, Socket } from 'socket.io';

let io: Server | null = null;

export const setIO = (socketIO: Server) => {
  io = socketIO;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

export const setupSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join', (userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};