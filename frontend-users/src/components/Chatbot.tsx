import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X } from "lucide-react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Sample bot responses
  const responses = [
    {
      trigger: ["membership", "join", "pricing"],
      response: "We offer monthly, quarterly, and yearly membership plans starting at ₹999/month.",
    },
    {
      trigger: ["class", "schedule", "timing"],
      response: "Our classes include Yoga, Zumba, and HIIT! Classes run from 6AM to 9PM daily.",
    },
    {
      trigger: ["equipment", "facility", "machines"],
      response: "We provide top-quality equipment including treadmills, squat racks, and free weights.",
    },
    {
      trigger: ["cancel", "refund", "help"],
      response: "You can contact our front desk for membership cancellation or call 1800-123-4567.",
    },
  ];

  // Handle sending a message
  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse =
        responses.find((res) =>
          res.trigger.some((word) => input.toLowerCase().includes(word))
        )?.response || "I'm not sure about that. Please contact our trainer for more info.";

      setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg animate-pulse"
          aria-label="Open chat"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[450px] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-red-600 text-white flex justify-between items-center p-3">
            <h2 className="font-semibold">Gym Assistant</h2>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] p-2 rounded-lg text-sm ${
                    msg.sender === "user"
                      ? "bg-red-600 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && <p className="text-xs text-gray-500">Bot is typing...</p>}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Input Area */}
          <div className="flex items-center border-t border-gray-200 p-2">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 border-none focus:outline-none text-sm p-2"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-2 text-red-600 hover:text-red-700"
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
