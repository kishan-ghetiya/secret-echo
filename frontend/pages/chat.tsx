import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../utils/AuthContext";
import { socket } from "../utils/socket";

export default function ChatPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<
    { sender: string; content: string; timestamp: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    socket.auth = { token: localStorage.getItem("token") };
    socket.connect();

    // Listen for incoming messages
    socket.on("newMessage", (msg) => {  // Changed to "newMessage"
      const sender = msg.sender || "AI Bot";
      const timestamp = new Date().toLocaleTimeString();

      if (sender === "AI Bot") {
        setTyping(true);
        setTimeout(() => {
          setMessages((prev) => [...prev, { ...msg, sender, timestamp }]);
          setTyping(false);
        }, 1200);
      } else {
        setMessages((prev) => [...prev, { ...msg, sender, timestamp }]);
      }
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      socket.off("newMessage");  // Changed to "newMessage"
    };
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() === "") return;

    const timestamp = new Date().toLocaleTimeString();
    const message = { senderId: "AI", content: input, timestamp };
    
    socket.emit("sendMessage", message);
    
    setMessages((prev) => [
      ...prev,
      { sender: "AI", content: input, timestamp },
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 ${
              msg.sender === user.email ? "text-right" : "text-left"
            }`}
          >
            {msg.sender === "AI Bot" && (
              <div className="text-sm text-gray-500 mb-1">🤖 AI Bot</div>
            )}
            <div
              className={`inline-block px-4 py-2 rounded-lg max-w-[70%] ${
                msg.sender === user.email
                  ? "bg-blue-500 text-white"
                  : msg.sender === "AI Bot"
                  ? "bg-gray-300 text-black"
                  : "bg-white border"
              }`}
            >
              {msg.content}
            </div>
            <div className="text-xs text-gray-400">{msg.timestamp}</div>
          </div>
        ))}
        {typing && (
          <div className="text-sm italic text-gray-500">
            🤖 AI Bot is typing...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Box */}
      <div className="p-4 border-t flex items-center bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded mr-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
