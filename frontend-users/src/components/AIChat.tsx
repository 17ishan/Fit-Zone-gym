import { useState } from "react";
import { MessageCircle, X, Send } from 'lucide-react';

type Role = "user" | "assistant" | "system";
type Message = { role: Role; content: string };


const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';


export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: "You are a helpful assistant." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;
    const newMessages = [...messages, { role: "user" as Role, content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Build a compact conversation prompt (keeps context)
      const prompt = newMessages
        .map((m) => {
          const label = m.role === "system" ? "System" : m.role === "user" ? "User" : "Assistant";
          return `${label}: ${m.content}`;
        })
        .join("\n\n");

      const body = {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      };

      if (!API_KEY || API_KEY.length === 0) {
        setMessages((m) => [...m, { role: "assistant", content: "Error: Missing Gemini API key. Please add VITE_GEMINI_API_KEY to your .env file." }]);
        setLoading(false);
        return;
      }

      const resp = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": API_KEY,
          },
          body: JSON.stringify(body),
        }
      );

      // If CORS blocks this request, you'll see a CORS error in the browser console.
      const data = await resp.json().catch(() => null);

      // Defensive parsing: try a few shapes that the GL API might return.
      let assistantText: string | null = null;
      if (data && Array.isArray(data.candidates) && data.candidates[0]?.content?.parts?.[0]?.text) {
        assistantText = data.candidates[0].content.parts[0].text;
      }

      // fallback to show raw response (helps debug)
      if (!assistantText) {
        if (!resp.ok) {
          const errMsg = data?.error?.message || `HTTP ${resp.status}`;
          setMessages((m) => [...m, { role: "assistant", content: `Model API error: ${errMsg}` }]);
          setLoading(false);
          return;
        }
        assistantText = JSON.stringify(data || resp.statusText);
      }

      setMessages((m) => [...m, { role: "assistant", content: assistantText as string }]);
    } catch (err: any) {
      // network/CORS/other errors
      setMessages((m) => [...m, { role: "assistant", content: `Network error: ${err?.message || String(err)}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] ">
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 sm:static  no-scrollbar ">
          {/* Backdrop for mobile */}
          <div className="fixed inset-0 bg-black/40 sm:hidden " onClick={() => setIsOpen(false)} />
          
          <div className="absolute  sm:relative bottom-0 right-0 w-full sm:w-96 h-[85vh] sm:h-[500px] bg-[#111111] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FFFADC] rounded-full flex items-center justify-center shadow-md">
                  <MessageCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-[#FFFADC] font-semibold">Fitness Assistant</h3>
                  <p className="text-[#FFFADC] text-xs opacity-80">Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[#FFFADC] hover:bg-red-700/50 rounded-full p-2 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

          {/* Messages */}
          <div className="flex-1  p-4 bg-black/95 space-y-4 scroll-smooth overflow-y-scroll no-scrollbar">
            {messages
              .filter((m) => m.role !== "system")
              .map((m, i) => (
                <div 
                  key={i} 
                  className={`flex ${m.role === "user" ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}
                >
                  <div 
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 shadow-lg ${
                      m.role === 'user' 
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-[#FFFADC] rounded-br-sm' 
                        : 'bg-[#1a1a1a] text-[#FFFADC] rounded-bl-sm border border-red-900/30'
                    }`}
                  >
                    <div className="text-sm break-words leading-relaxed">{m.content}</div>
                  </div>
                </div>
              ))}
            {loading && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-[#1a1a1a] rounded-2xl rounded-bl-sm px-4 py-3 shadow-lg border border-red-900/30">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-[#111111] border-t border-red-900/30 backdrop-blur-lg">
            <form 
              onSubmit={(e) => { e.preventDefault(); sendMessage(); }} 
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border border-red-900/30 bg-[#1a1a1a] text-[#FFFADC] rounded-full px-4 py-2.5 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-900/50 transition placeholder-gray-500"
                placeholder="Ask about fitness, workouts, nutrition..."
                disabled={loading}
              />
              <button 
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-red-600 to-red-700 text-[#FFFADC] rounded-full p-2.5 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition flex-shrink-0 shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-red-600 to-red-700 text-[#FFFADC] rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shadow-lg hover:opacity-90 active:scale-95 transition-all duration-200"
      >
        {isOpen ? (
          <X className="w-6 h-6 sm:w-7 sm:h-7" />
        ) : (
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
        )}
      </button>
    </div>
  );
}
