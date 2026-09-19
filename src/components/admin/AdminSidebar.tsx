"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PusherClient from "pusher-js";
import {
  LayoutDashboard,
  CalendarCheck,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Gift,
  MapPin,
  Menu,
  X,
  Sun,
  Moon,
  User,
  Wifi,
  WifiOff,
  Calendar,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/calendar", label: "Calendar", icon: Calendar },
  { href: "/admin/tours", label: "Excursions", icon: MapPin },
  { href: "/admin/chat", label: "Live Chat", icon: MessageSquare },
  { href: "/admin/gifts", label: "Roulette Gifts", icon: Gift },
  { href: "/admin/winners", label: "Winners", icon: User },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

type IncomingNotif = {
  id: string;
  sessionId: string;
  text: string;
  timestamp: string;
};

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifs, setNotifs] = useState<IncomingNotif[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Persist dark mode
  useEffect(() => {
    const saved = localStorage.getItem("admin-dark-mode");
    if (saved === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("admin-dark-mode", String(next));
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Real-time Pusher listener for incoming client messages
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY) return;

    const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const adminChannel = pusher.subscribe("admin-chat");
    adminChannel.bind("pusher:subscription_succeeded", () => setConnected(true));
    adminChannel.bind("pusher:subscription_error", () => setConnected(false));

    adminChannel.bind(
      "new-message",
      (data: { sessionId: string; from: string; text: string; timestamp: string }) => {
        // Only notify on user messages (not AI or admin)
        if (data.from !== "user") return;

        const notif: IncomingNotif = {
          id: `${data.sessionId}-${data.timestamp}`,
          sessionId: data.sessionId,
          text: data.text,
          timestamp: data.timestamp,
        };

        setNotifs((prev) => [notif, ...prev].slice(0, 20));
        setUnreadCount((c) => c + 1);

        // Browser notification if permitted
        if (Notification.permission === "granted") {
          new Notification("💬 New Client Message", {
            body: data.text.slice(0, 80),
            icon: "/favicon.ico",
            tag: data.sessionId,
          });
        }
      }
    );

    return () => {
      pusher.unsubscribe("admin-chat");
      pusher.disconnect();
    };
  }, []);

  // Request browser notification permission
  useEffect(() => {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Close notif dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      window.location.href = "/admin/login";
    }
  };

  const openNotifs = () => {
    setNotifOpen(!notifOpen);
    setUnreadCount(0);
  };

  const formatTime = (ts: string) =>
    new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 h-16 fixed top-0 left-0 right-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0F4C81] rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="font-bold text-slate-800 dark:text-white text-sm">Hotel Karim</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile notif bell */}
          <button onClick={openNotifs} className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative top-0 left-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-xl md:shadow-none transition-all duration-300 z-40 flex flex-col shrink-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} ${collapsed ? "md:w-20" : "w-64"}`}>
        
        {/* Logo */}
        <div className="hidden md:flex items-center gap-3 px-4 h-20 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="w-10 h-10 bg-[#0F4C81] rounded-xl flex items-center justify-center shrink-0 shadow-inner">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-slate-800 dark:text-white font-bold text-base leading-tight">Hotel Karim</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest font-semibold mt-0.5">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Mobile top spacer */}
        <div className="h-16 md:hidden shrink-0 border-b border-slate-100 dark:border-slate-800 flex items-center px-4 mb-2">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Navigation</span>
        </div>

        {/* Status indicator */}
        {!collapsed && (
          <div className={`mx-3 mt-2 mb-1 px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold transition-colors ${connected ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
            {connected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            {connected ? "Listening for messages…" : "Connecting…"}
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 px-3 space-y-1 py-2 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            // Show unread badge on chat item
            const isChatWithBadge = item.href === "/admin/chat" && unreadCount > 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative ${
                  isActive
                    ? "bg-[#0F4C81]/10 dark:bg-[#0F4C81]/20 text-[#0F4C81] dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
                title={collapsed ? item.label : undefined}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#0F4C81] dark:bg-blue-400 rounded-r-full" />}
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#0F4C81] dark:text-blue-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`} />
                <span className={`font-medium flex-1 ${collapsed ? "md:hidden" : ""} ${isActive ? "font-bold" : ""}`}>
                  {item.label}
                </span>
                {isChatWithBadge && !collapsed && (
                  <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 shrink-0 space-y-1">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className={`flex items-center gap-3 px-3 py-3 w-full rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors ${collapsed ? "justify-center" : ""}`}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun className="w-5 h-5 shrink-0" /> : <Moon className="w-5 h-5 shrink-0" />}
            {!collapsed && <span className="font-medium">{darkMode ? "Light Mode" : "Dark Mode"}</span>}
          </button>

          {/* Collapse (desktop only) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center gap-3 px-3 py-3 w-full rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5 shrink-0" />}
            {!collapsed && <span className="font-medium">Collapse</span>}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-3 w-full rounded-xl text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors group ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile top spacer */}
      <div className="h-16 md:hidden shrink-0" />

      {/* Notification Dropdown Panel */}
      {notifOpen && (
        <div
          ref={notifRef}
          className="fixed top-16 md:top-20 right-4 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#0F4C81] dark:text-blue-400" />
              <span className="font-bold text-slate-800 dark:text-white text-sm">Live Notifications</span>
            </div>
            {notifs.length > 0 && (
              <button onClick={() => setNotifs([])} className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 font-semibold transition">
                Clear all
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {notifs.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="font-semibold text-slate-600 dark:text-slate-400 text-sm">All quiet!</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Client messages will appear here instantly.</p>
              </div>
            ) : (
              notifs.map((n) => (
                <Link
                  key={n.id}
                  href="/admin/chat"
                  onClick={() => setNotifOpen(false)}
                  className="flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-[#0F4C81]/10 dark:bg-[#0F4C81]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-[#0F4C81] dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Guest #{n.sessionId.slice(0, 8).toUpperCase()}
                      </p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">{formatTime(n.timestamp)}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 truncate leading-snug">{n.text}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            <Link
              href="/admin/chat"
              onClick={() => setNotifOpen(false)}
              className="block w-full text-center text-xs font-bold text-[#0F4C81] dark:text-blue-400 hover:underline py-1"
            >
              Open Live Chat →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

// Light/Dark aware TopBar
export function AdminTopBar({ title }: { title: string }) {
  return (
    <header className="h-16 md:h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 shrink-0 sticky top-0 z-30">
      <h1 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0F4C81] to-[#1a6bb5] flex items-center justify-center text-white font-bold shadow-md text-sm">
          A
        </div>
      </div>
    </header>
  );
}
