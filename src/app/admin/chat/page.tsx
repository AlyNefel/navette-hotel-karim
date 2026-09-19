"use client";

import { useState, useEffect, useRef } from "react";
import PusherClient from "pusher-js";
import { AdminTopBar } from "@/components/admin/AdminSidebar";
import { MessageSquare, Send, Bot, User, Users, Wifi, WifiOff } from "lucide-react";

type ChatMessage = {
  from: "user" | "ai" | "admin";
  text: string;
  timestamp: string;
};

type Session = {
  id: string;
  userName?: string;
  lastMessage: string;
  unread: number;
  needsHandoff: boolean;
  timestamp: string;
};

export default function AdminChatPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const adminChannel = pusher.subscribe("admin-chat");
    adminChannel.bind("pusher:subscription_succeeded", () => setConnected(true));

    adminChannel.bind("new-message", (data: { sessionId: string; from: string; text: string; timestamp: string; needsHandoff: boolean; userName?: string }) => {
      const { sessionId, from, text, timestamp, needsHandoff, userName } = data;

      setSessions((prev) => {
        const existing = prev.find((s) => s.id === sessionId);
        if (existing) {
          return prev.map((s) =>
            s.id === sessionId
              ? { ...s, lastMessage: text, unread: s.unread + 1, needsHandoff, timestamp, userName: userName || s.userName }
              : s
          );
        }
        return [{ id: sessionId, userName, lastMessage: text, unread: 1, needsHandoff, timestamp }, ...prev];
      });

      setMessages((prev) => ({
        ...prev,
        [sessionId]: [
          ...(prev[sessionId] || []),
          { from: from as "user" | "ai" | "admin", text, timestamp },
        ],
      }));
    });

    return () => {
      pusher.unsubscribe("admin-chat");
      pusher.disconnect();
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeSession]);

  const openSession = (id: string) => {
    setActiveSession(id);
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, unread: 0 } : s)));
  };

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTyping = () => {
    if (!activeSession) return;
    
    // Clear the timeout if it exists
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    } else {
      // If no timeout exists, we weren't typing, so send a typing=true event
      fetch("/api/chat/typing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: activeSession, isTyping: true }),
      }).catch(console.error);
    }

    // Set a timeout to clear the typing status after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      fetch("/api/chat/typing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: activeSession, isTyping: false }),
      }).catch(console.error);
      typingTimeoutRef.current = null;
    }, 2000);
  };

  const handleSend = async () => {
    if (!reply.trim() || !activeSession || sending) return;
    setSending(true);
    
    // Clear typing status immediately
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    const msgText = reply.trim();
    setReply("");

    const adminMsg: ChatMessage = { from: "admin", text: msgText, timestamp: new Date().toISOString() };
    setMessages((prev) => ({
      ...prev,
      [activeSession]: [...(prev[activeSession] || []), adminMsg],
    }));

    try {
      await fetch("/api/chat/admin-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: activeSession, message: msgText }),
      });
    } catch (err) {
      console.error("Failed to send reply:", err);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (ts: string) => new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const activeMessages = activeSession ? (messages[activeSession] || []) : [];

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <AdminTopBar title="Live Chat" />

      <div className="flex flex-1 overflow-hidden">
        {/* Sessions sidebar */}
        <div className="w-72 border-r border-slate-200 flex flex-col bg-white shrink-0">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-bold">Active Chats</span>
              {sessions.length > 0 && (
                <span className="w-5 h-5 bg-[#0F4C81] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {sessions.length}
                </span>
              )}
            </div>
            <div className={`flex items-center gap-1.5 text-xs font-semibold ${connected ? "text-green-600" : "text-slate-400"}`}>
              {connected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              {connected ? "Live" : "Connecting..."}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                  <MessageSquare className="w-7 h-7 text-slate-300" />
                </div>
                <p className="text-sm font-semibold text-slate-600 mb-1">No active chats</p>
                <p className="text-xs text-slate-400">Visitor messages will appear here in real time.</p>
              </div>
            ) : (
              sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => openSession(session.id)}
                  className={`w-full p-4 text-left border-b border-slate-100 hover:bg-slate-50 transition-colors ${activeSession === session.id ? "bg-blue-50 border-l-4 border-l-[#0F4C81]" : "border-l-4 border-l-transparent"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-[#0F4C81]/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-[#0F4C81]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-700 truncate">
                          {session.userName ? session.userName : `Guest #${session.id.slice(0, 8).toUpperCase()}`}
                        </p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{session.lastMessage}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {session.unread > 0 && (
                        <span className="w-5 h-5 bg-[#0F4C81] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {session.unread}
                        </span>
                      )}
                      {session.needsHandoff && (
                        <span className="text-[9px] font-bold text-orange-600 border border-orange-200 bg-orange-50 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                          HUMAN REQ.
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
          {!activeSession ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-5">
                <MessageSquare className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">Select a conversation</h3>
              <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                Pick a session from the left panel to view the conversation and reply to the guest.
              </p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#0F4C81]/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#0F4C81]" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">
                    {sessions.find(s => s.id === activeSession)?.userName || "Guest Session"}
                  </p>
                  <p className="text-xs text-slate-400 font-mono">{activeSession.slice(0, 20)}...</p>
                </div>
                <span className="ml-auto text-xs text-green-700 flex items-center gap-1.5 border border-green-200 bg-green-50 px-3 py-1.5 rounded-full font-semibold">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Live
                </span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {activeMessages.length === 0 && (
                  <p className="text-slate-400 text-sm text-center pt-8">No messages yet in this session.</p>
                )}
                {activeMessages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.from === "user" ? "justify-start" : "justify-end"}`}>
                    {msg.from === "user" && (
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-4 h-4 text-slate-500" />
                      </div>
                    )}
                    <div className="max-w-[70%]">
                      {msg.from === "ai" && (
                        <p className="text-[10px] text-[#0F4C81] font-bold mb-1 px-1 uppercase tracking-wide">AI Concierge (Karim)</p>
                      )}
                      {msg.from === "admin" && (
                        <p className="text-[10px] text-green-600 font-bold mb-1 px-1 uppercase tracking-wide text-right">Hotel Agent</p>
                      )}
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        msg.from === "user"
                          ? "bg-white border border-slate-200 text-slate-700 rounded-tl-sm"
                          : msg.from === "ai"
                          ? "bg-[#0F4C81] text-white rounded-tr-sm"
                          : "bg-green-600 text-white rounded-tr-sm"
                      }`}>
                        {msg.text}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 px-1">{formatTime(msg.timestamp)}</p>
                    </div>
                    {msg.from !== "user" && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${msg.from === "ai" ? "bg-[#0F4C81]" : "bg-green-600"}`}>
                        {msg.from === "ai" ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Reply box */}
              <div className="p-4 border-t border-slate-200 bg-white">
                <div className="flex gap-3 items-end bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 focus-within:border-[#0F4C81] focus-within:ring-2 focus-within:ring-[#0F4C81]/10 transition">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyUp={handleTyping}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Type your reply as a human agent..."
                    rows={2}
                    className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none resize-none"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!reply.trim() || sending}
                    className="w-10 h-10 bg-[#0F4C81] hover:bg-[#1a6bb5] rounded-xl flex items-center justify-center transition disabled:opacity-30 flex-shrink-0 shadow-md"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 text-center">
                  Your reply will be sent directly to the guest's chat window on the website.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
