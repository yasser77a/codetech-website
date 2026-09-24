"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Clock, Calendar, MessageSquare, Star, UserPlus, AlertCircle, Check } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface Notification {
  id: string;
  type: "inquiry" | "review" | "user" | "system";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const initialNotifications: Notification[] = [
  { id: "1", type: "inquiry", title: "استفسار جديد", message: "أحمد علي أرسل استفساراً عن موقع متجر", read: false, createdAt: "منذ 5 د" },
  { id: "2", type: "review", title: "تقييم جديد", message: "سارة محمد أضافت تقييماً 5 نجوم", read: false, createdAt: "منذ ساعة" },
  { id: "3", type: "user", title: "مستخدم جديد", message: "تم إنشاء حساب جديد", read: false, createdAt: "منذ 3 س" },
  { id: "4", type: "system", title: "تحديث النظام", message: "تم تحديث النظام بنجاح", read: true, createdAt: "أمس" },
];

const typeIcons = {
  inquiry: MessageSquare,
  review: Star,
  user: UserPlus,
  system: AlertCircle,
};

const typeColors = {
  inquiry: "from-blue-500 to-cyan-500",
  review: "from-yellow-500 to-orange-500",
  user: "from-purple-500 to-pink-500",
  system: "from-slate-500 to-slate-700",
};

export default function AdminHeader() {
  const router = useRouter();
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [user, setUser] = useState<{ fullName: string; role: string } | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ✅ الوقت والتاريخ
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("ar-YE", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
      setDate(
        now.toLocaleDateString("ar-YE", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ جلب المستخدم
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  // ✅ إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const goToNotifications = () => {
    setShowNotifications(false);
    router.push("/admin/notifications");
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        
        {/* الوقت والتاريخ */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">
              {time}
            </span>
          </div>
          <div className="w-px h-5 bg-slate-300 dark:bg-slate-600" />
          <div className="hidden md:flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-slate-600 dark:text-slate-300">
              {date}
            </span>
          </div>
        </div>

        {/* الإجراءات */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* 🔔 الإشعارات - قائمة منسدلة */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition border border-slate-200 dark:border-slate-700"
              aria-label="الإشعارات"
            >
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute left-0 mt-2 w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
                  dir="rtl"
                >
                  {/* الرأس */}
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-blue-500" />
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        الإشعارات
                      </h3>
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        تعليم الكل
                      </button>
                    )}
                  </div>

                  {/* القائمة */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.slice(0, 5).map((n) => {
                      const Icon = typeIcons[n.type];
                      const colorClass = typeColors[n.type];
                      return (
                        <div
                          key={n.id}
                          className={`p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition cursor-pointer ${
                            !n.read ? "bg-blue-50/50 dark:bg-blue-500/5" : ""
                          }`}
                          onClick={() => markAsRead(n.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                                  {n.title}
                                </h4>
                                {!n.read && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                                {n.message}
                              </p>
                              <div className="text-xs text-slate-400 mt-1">
                                {n.createdAt}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <button
                    onClick={goToNotifications}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 text-center text-sm font-bold text-blue-600 dark:text-blue-400 transition"
                  >
                    عرض كل الإشعارات ←
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* المستخدم */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-1.5 border border-slate-200 dark:border-slate-700">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.fullName?.[0] || "ي"}
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {user?.fullName || "ياسر العشرم"}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {user?.role === "admin" ? "مدير عام" : "مستخدم"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}