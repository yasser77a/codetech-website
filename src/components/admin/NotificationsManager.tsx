"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, Trash2, MessageSquare, UserPlus, Star, AlertCircle } from "lucide-react";

interface Notification {
  id: string;
  type: "inquiry" | "review" | "user" | "system";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const initialNotifications: Notification[] = [
  { id: "1", type: "inquiry", title: "استفسار جديد", message: "أحمد علي أرسل استفساراً عن موقع متجر", read: false, createdAt: "منذ 5 دقائق" },
  { id: "2", type: "review", title: "تقييم جديد", message: "سارة محمد أضافت تقييماً 5 نجوم", read: false, createdAt: "منذ ساعة" },
  { id: "3", type: "user", title: "مستخدم جديد", message: "تم إنشاء حساب جديد", read: false, createdAt: "منذ 3 ساعات" },
  { id: "4", type: "system", title: "تحديث النظام", message: "تم تحديث النظام بنجاح إلى الإصدار 2.5", read: true, createdAt: "أمس" },
  { id: "5", type: "inquiry", title: "استفسار جديد", message: "خالد يوسف أرسل استفساراً عن نظام إداري", read: true, createdAt: "منذ يومين" },
];

const typeConfig = {
  inquiry: { icon: MessageSquare, color: "from-blue-500 to-cyan-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
  review: { icon: Star, color: "from-yellow-500 to-orange-500", bg: "bg-yellow-50 dark:bg-yellow-500/10" },
  user: { icon: UserPlus, color: "from-purple-500 to-pink-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
  system: { icon: AlertCircle, color: "from-slate-500 to-slate-700", bg: "bg-slate-50 dark:bg-slate-500/10" },
};

export default function NotificationsManager() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filtered = filter === "all" ? notifications : notifications.filter((n) => !n.read);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const remove = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center relative">
            <Bell className="w-6 h-6 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">الإشعارات</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {unreadCount} إشعار غير مقروء
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2"
          >
            <Check className="w-5 h-5" />
            تعليم الكل كمقروء
          </button>
        )}
      </div>

      <div className="flex gap-2">
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition ${
              filter === f
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            }`}
          >
            {f === "all" ? "الكل" : "غير المقروءة"}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((n) => {
            const config = typeConfig[n.type];
            const Icon = config.icon;
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={`bg-white dark:bg-slate-800 rounded-2xl p-5 border transition ${
                  !n.read
                    ? "border-blue-200 dark:border-blue-500/30 shadow-sm"
                    : "border-slate-100 dark:border-slate-700"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 dark:text-white">{n.title}</h3>
                      {!n.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                      {n.message}
                    </p>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {n.createdAt}
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {!n.read && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="p-2 hover:bg-green-50 dark:hover:bg-green-500/10 text-green-600 rounded-lg transition"
                        title="تعليم كمقروء"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => remove(n.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 rounded-lg transition"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500 dark:text-slate-400">
            <Bell className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>لا توجد إشعارات</p>
          </div>
        )}
      </div>
    </div>
  );
}