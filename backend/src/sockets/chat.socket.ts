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
  "What made you feel that way?",
  "I'm listening 👂",
  "Go on, I'm curious!",
  "Haha, that's funny 😄",
  "Hmm, that's something to think about.",
  "Sounds like a great idea!",
  "Do you want to dive deeper into that?",
  "Oh wow, tell me everything!",
  "I'm glad you shared that.",
  "That must've been exciting!",
  "What happened next?",
  "You always have the best stories!",
  "I'm taking notes! 📝",
  "That's really cool 😎",
  "You seem passionate about that!",
  "That's a unique perspective.",
  "I appreciate you sharing that.",
  "Mind explaining it a bit more?",
  "Interesting point of view!",
  "Nice one! Want to keep going?",
  "Now I'm curious 👀",
  "You've got me thinking!",
  "Let's keep this going!",
  "So what's your take on it?",
  "I didn't expect that!",
  "That's deep!",
  "Thanks for telling me 😊",
  "Wow, that's impressive!",
  "You're full of surprises!",
  "That's quite something!",
  "You always keep things interesting!",
  "Aha! That's clever.",
  "You're making my day better 💬",
  "That's a new one for me!",
  "You're good at this!",
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
          message:
            predefinedReplies[
              Math.floor(Math.random() * predefinedReplies.length)
            ],
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
