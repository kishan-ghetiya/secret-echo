import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./middleware/logger";
import authRoutes from "./routes/auth.routes";
import messageRoutes from "./routes/message.routes";
import { registerSocketHandlers } from "./sockets/chat.socket";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Rate limiting (before routes!)
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Secret Echo API is running 🚀');
});

// Socket Setup
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("error", (err) => console.error("Socket error:", err));
  registerSocketHandlers(socket, io);
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "", {})
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 3002;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
