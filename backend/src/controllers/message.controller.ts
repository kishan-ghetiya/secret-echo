import { Request, Response } from "express";
import { Message } from "../models/message.model";

export const getMessages = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const messages = await Message.find()
      .sort({ createdAt: -1 }) // latest messages first
      .skip(skip)
      .limit(limit);

    const totalMessages = await Message.countDocuments();

    res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        total: totalMessages,
        page,
        limit,
        totalPages: Math.ceil(totalMessages / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const postMessage = async (req: Request, res: Response) => {
  try {
    const { sender, content } = req.body;
    if (!sender || !content) {
      return res
        .status(400)
        .json({ success: false, message: "Sender and content are required." });
    }

    const newMessage = await Message.create({ sender, content });

    res.status(201).json({ success: true, data: newMessage });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
