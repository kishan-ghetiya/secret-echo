import { Server, Socket } from "socket.io";
import { Message } from "../models/message.model";
import { Types } from "mongoose";

const predefinedReplies = [
  "That's interesting!",
  "Can you tell me more?",
  "I'm here for you 😊",
  "That sounds fun!",
  "Wow, really?",
  "Let's talk more!",
];

export const registerSocketHandlers = (socket: Socket, io: Server) => {
  // Handle typing event from user
  socket.on("typing", () => {
    socket.broadcast.emit("typing", {
      userId: socket.id,
      isTyping: true,
    });
  });

  // Handle sending of user message
  socket.on("send_message", async ({ sender, message }) => {
    try {
      // Save user message      
      const savedMessage = await Message.create({
        sender: new Types.ObjectId(sender),
        message: message,
        isAI: false,
      });
      io.emit("receive_message", savedMessage);

      // Simulate AI is typing
      io.emit("typing", { userId: "AI Bot", isTyping: true });

      // Simulate delay then AI response
      setTimeout(async () => {
        // Stop typing indicator
        io.emit("typing", { userId: "AI Bot", isTyping: false });

        const aiReply = await Message.create({
          sender: new Types.ObjectId(sender),
          message: predefinedReplies[Math.floor(Math.random() * predefinedReplies.length)],
        });

        io.emit("receive_message", aiReply);
      }, 1500);
    } catch (error) {
      console.error("Message error:", error);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
};
