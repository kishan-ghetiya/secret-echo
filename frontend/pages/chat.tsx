import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../utils/AuthContext";
import { socket } from "../utils/socket";
import {
  fetchMessages,
  sendMessage as sendToAPI,
} from "../services/authService";

interface Message {
  sender: string;
  message: string;
  createdAt: string;
}

interface APImessage {
  _id: string;
  message: string;
  sender?: string;
  createdAt: string;
}

export default function ChatPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    socket.auth = { token: localStorage.getItem("token") };
    socket.connect();

    // Load existing messages from API and normalize format
    fetchMessages().then((res) => {
      const transformed = res.data.data.map((msg: APImessage) => ({
        sender: msg.sender || "ai",
        message: msg.message,
        createdAt: msg.createdAt,
      }));
      setMessages(transformed);
    });

    // Handle receiving new messages via socket
    socket.on("receive_message", (msg: Message) => {
      if (msg.sender === "ai") {
        setTyping(true);
        setTimeout(() => {
          setMessages((prev) => [...prev, msg]);
          setTyping(false);
        }, 1000);
      } else {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.disconnect();
      socket.off("receive_message");
    };
  }, [user]);

  useEffect(() => {
    socket.on("typing", (data) => {
      if (data.userId === "AI Bot") {
        setTyping(data.isTyping);
      }
    });

    return () => {
      socket.off("typing");
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      sender: user?.id || "user",
      message: input,
      createdAt: new Date().toISOString(),
    };

    socket.emit("send_message", newMessage);
    await sendToAPI(newMessage);
    // setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  return (
    <div className="chat-container">
      {/* Chat Messages */}
      <div className="chat-messages">
        {messages.map((msg, i) => {
          const isUser = msg.sender === user?.id;
          const isAI = msg.sender === "ai";
          return (
            <div
              key={i}
              className={`message-wrapper ${
                isUser ? "message-right" : "message-left"
              }`}
            >
              {isAI && <div className="text-sm mb-1">🤖 AI Bot</div>}
              <div
                className={`message-bubble ${
                  isUser
                    ? "message-user"
                    : isAI
                    ? "message-ai"
                    : "message-default"
                }`}
              >
                {msg.message}
              </div>
              <div className="timestamp">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </div>
            </div>
          );
        })}
        {typing && <div className="ai-typing">🤖 AI Bot is typing...</div>}
        <div ref={bottomRef} />
      </div>

      {/* Input Box */}
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
