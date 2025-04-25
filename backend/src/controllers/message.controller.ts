import { Request, Response } from "express";
import { Message } from "../models/message.model";
import { User } from "../models/user.model";

interface CustomRequest extends Request {
  user?: {
    id: string;
    email?: string;
    [key: string]: any;
  };
}

export const getMessages = async (req: Request, res: Response) => {
  try {
    const customReq = req as CustomRequest;
    const userId = customReq.user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 200;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    }).sort({ createdAt: 1 })
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
    const { sender, message } = req.body;

    if (!sender || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Sender and message are required." });
    }

    const user = await User.findOne({ _id: sender });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Sender not found in the system.",
      });
    }

    // const newMessage = await Message.create({
    //   sender: user._id,
    //   message,
    // });

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
