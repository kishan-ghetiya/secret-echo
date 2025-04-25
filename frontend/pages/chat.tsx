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
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    limit: 50,
  });
  const [hasMore, setHasMore] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    socket.auth = { token: localStorage.getItem("token") };
    socket.connect();

    // Load initial messages
    fetchMessages(pagination.page).then((res) => {
      const transformed = res.data.data.map((msg: APImessage) => ({
        sender: msg.sender || "ai",
        message: msg.message,
        createdAt: msg.createdAt,
      }));
      setMessages(transformed);
      setPagination(res.data.pagination);
    });

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

  useEffect(() => {
    const chatBox = chatBoxRef.current;
    if (!chatBox) return;

    const handleScroll = async () => {
      if (chatBox.scrollTop === 0 && !loadingOlder && hasMore) {
        const currentScrollHeight = chatBox.scrollHeight;
        const currentScrollTop = chatBox.scrollTop;

        setLoadingOlder(true);

        // Fetch older messages
        if (pagination.page < pagination.totalPages) {
          const nextPage = pagination.page + 1;
          const res = await fetchMessages(nextPage);

          const newMessages = res.data.data.map((msg: APImessage) => ({
            sender: msg.sender || "ai",
            message: msg.message,
            createdAt: msg.createdAt,
          }));

          // Add the new messages to the top
          setMessages((prev) => [...newMessages, ...prev]);
          setPagination(res.data.pagination);

          if (nextPage === res.data.pagination.totalPages) {
            setHasMore(false); // No more messages to fetch
          }
        }

        setLoadingOlder(false);

        // After fetching, restore the previous scroll position
        // Ensure the scroll height stays at the top after the update
        chatBox.scrollTop =
          chatBox.scrollHeight - currentScrollHeight + currentScrollTop;
      }
    };

    chatBox.addEventListener("scroll", handleScroll);
    return () => {
      chatBox.removeEventListener("scroll", handleScroll);
    };
  }, [loadingOlder, pagination, hasMore]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      sender: user?.id || "user",
      message: input,
      createdAt: new Date().toISOString(),
    };

    socket.emit("send_message", newMessage);
    await sendToAPI(newMessage);
    setInput("");
  };

  return (
    <div className="chat-container">
      {/* Chat Messages */}
      <div className="chat-messages" ref={chatBoxRef}>
        {loadingOlder && (
          <div className="loading-msg text-center text-gray-400 text-sm">
            Loading older messages...
          </div>
        )}
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
