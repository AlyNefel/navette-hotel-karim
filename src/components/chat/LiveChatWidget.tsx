"use client";

import { useState, useEffect, useRef } from "react";
import PusherClient from "pusher-js";
import { MessageSquare, X, Send, User, Wifi, WifiOff, Minimize2, ArrowRight } from "lucide-react";

type Message = {
  from: "user" | "admin";
  text: string;
  timestamp: string;
};

const sessionId = typeof window !== "undefined"
  ? (sessionStorage.getItem("chat-session") || (() => {
      const id = `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem("chat-session", id);
      return id;
    })())
  : "ssr";

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "admin",
      text: "👋 Hello! Our team is online and ready to help. What can we assist you with today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminIsTyping, setAdminIsTyping] = useState(false);
  const [connected, setConnected] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pusherRef = useRef<PusherClient | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = sessionStorage.getItem("chat-user-name");
      if (savedName) {
        setUserName(savedName);
        setHasJoined(true);
      }
    }
  }, []);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;
    sessionStorage.setItem("chat-user-name", userName.trim());
    setHasJoined(true);
  };

  useEffect(() => {
    if (!isOpen || !hasJoined) return;

    const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    pusherRef.current = pusher;

    const channel = pusher.subscribe(`chat-${sessionId}`);
    channel.bind("pusher:subscription_succeeded", () => setConnected(true));

    channel.bind("message", (data: Message) => {
      if (data.from === "admin") {
        setMessages((prev) => [...prev, data]);
        setAdminIsTyping(false); // Cancel typing indicator when message arrives
      }
    });

    channel.bind("typing", (data: { isTyping: boolean }) => {
      setAdminIsTyping(data.isTyping);
    });

    return () => {
      pusher.unsubscribe(`chat-${sessionId}`);
      pusher.disconnect();
      pusherRef.current = null;
      setConnected(false);
    };
  }, [isOpen, hasJoined]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, hasJoined, adminIsTyping]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      from: "user",
      text: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input.trim(), sessionId, userName }),
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "admin", text: "Sorry, the message failed to send. Please try again.", timestamp: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (ts: string) => new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat Panel */}
      {isOpen && (
        <div className="w-[370px] rounded-2xl shadow-2xl overflow-hidden flex flex-col bg-slate-900 border border-slate-700/60"
          style={{ height: "520px", animation: "slideUp 0.25s ease-out" }}>
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0F4C81] to-[#1a6bb5] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-lg">H</div>
                {hasJoined && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0F4C81]"></span>
                )}
              </div>
              <div>
                <p className="font-bold text-white text-sm">Hotel Karim Team</p>
                {hasJoined && (
                  <p className="text-xs text-white/70 flex items-center gap-1">
                    {connected ? <><Wifi className="w-3 h-3" /> Live Connected</> : <><WifiOff className="w-3 h-3" /> Connecting...</>}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition">
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!hasJoined ? (
            /* Welcome / Name Input Screen */
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-800 relative">
              <div className="w-16 h-16 bg-[#0F4C81]/20 rounded-full flex items-center justify-center mb-4 relative z-10">
                <MessageSquare className="w-8 h-8 text-[#5b9fd4]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">Welcome to Live Chat!</h3>
              <p className="text-sm text-slate-400 mb-8 relative z-10">Please enter your name to start chatting with our concierge team.</p>
              
              <form onSubmit={handleJoin} className="w-full relative z-10">
                <div className="relative flex items-center">
                  <User className="absolute left-4 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81] transition"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={!userName.trim()}
                  className="w-full mt-4 bg-[#0F4C81] hover:bg-[#1a6bb5] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  Start Chatting <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            /* Chat Interface */
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.from !== "user" && (
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 bg-green-600`}>
                        <User className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[80%] group`}>
                      <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.from === "user"
                          ? "bg-[#0F4C81] text-white rounded-tr-sm"
                          : "bg-green-700/40 text-green-100 border border-green-600/30 rounded-tl-sm"
                      }`}>
                        {msg.from === "admin" && <p className="text-xs text-green-400 font-semibold mb-1">Hotel Agent</p>}
                        {msg.text}
                      </div>
                      <p className="text-[10px] text-slate-600 mt-1 px-1 text-right">{formatTime(msg.timestamp)}</p>
                    </div>
                  </div>
                ))}
                
                {adminIsTyping && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="flex gap-2 justify-end">
                    <div className="bg-[#0F4C81]/50 rounded-2xl rounded-tr-sm px-4 py-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <div className="p-3 border-t border-slate-700/50 bg-slate-800/50">
                <div className="flex gap-2 items-center bg-slate-700/50 rounded-xl px-3 py-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
                  />
                  <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="w-8 h-8 rounded-lg bg-[#0F4C81] hover:bg-[#1a6bb5] flex items-center justify-center transition disabled:opacity-40"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-br from-[#0F4C81] to-[#1a6bb5] rounded-full shadow-xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 relative"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>
    </div>
  );
}

// CSS animation - add to globals.css if not present
// @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
