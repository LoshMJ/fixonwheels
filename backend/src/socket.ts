import { Server, Socket } from "socket.io";

let io: Server | null = null;

export const setIO = (serverIO: Server) => {
  io = serverIO;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

export const setupSocket = (serverIO: Server) => {
  serverIO.on("connection", (socket: Socket) => {
    console.log("Socket connected:", socket.id);

    // User room (customer / technician)
    socket.on("join", (userId: string) => {
      socket.join(userId);
    });

    // Repair room (live workspace sync)
    socket.on("join_repair", (repairId: string) => {
      socket.join(repairId);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};