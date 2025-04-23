import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';
import authRoutes from './routes/auth.routes';
import messageRoutes from './routes/message.routes';
import { registerSocketHandlers } from './sockets/chat.socket';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

app.use(cors());
app.use(express.json());

app.use(errorHandler);
app.use(logger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Socket Setup
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  registerSocketHandlers(socket, io);
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || '', {})
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 3002;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
