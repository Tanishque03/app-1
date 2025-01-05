import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// io.on('connection', (socket) => {
//   // Establish a new socket.io connection between the new user and all existing users
//   io.emit('new connection', {
//     userId: socket.handshake.query.userId,
//     socketId: socket.id,
//   });
// });

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {};

io.on("connection", (socket) => {

  const userId = socket.handshake.query.userId
  if(userId) userSocketMap[userId] = socket.id

  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  console.log("A client connected:", {
    socketId: socket.id,
    userId: socket.userId, // If you're tracking user IDs
    timestamp: new Date().toISOString()});

  socket.on("disconnect", () => {
    console.log("A client disconnected:", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export {io, app, server};