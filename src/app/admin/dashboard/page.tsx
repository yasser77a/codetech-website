"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Globe, Smartphone, Monitor, GraduationCap, MessageSquare,
  Star, TrendingUp, Users, FileText, Wrench, Bell,
  ArrowUpRight, Loader2, Inbox
} from "lucide-react";
import type { DashboardStats } from "@/lib/stats";

interface RecentInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  serviceType: string | null;
  message: string;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [inquiries, setInquiries] = useState<RecentInquiry[]>([]);
  const [user, setUser] = useState<{ fullName: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/recent").then((r) => r.json()),
      fetch("/api/auth/me").then((r) => r.json()),
    ])
      .then(([statsData, recentData, meData]) => {
        if (statsData.stats) setStats(statsData.stats);
        if (recentData.inquiries) setInquiries(recentData.inquiries);
        if (meData.user) setUser(meData.user);
      })
      .catch((err) => console.error("Dashboard fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-16 text-slate-500">
        فشل في تحميل الإحصائيات
      </div>
    );
  }

  // ============================================
  // بطاقات الإحصائيات
  // ============================================
  const statCards = [
    {
      icon: Globe,
      label: "المواقع",
      value: stats.projects.websites,
      color: "from-blue-500 to-cyan-500",
      href: "/admin/projects/websites",
    },
    {
      icon: Smartphone,
      label: "التطبيقات",
      value: stats.projects.apps,
      color: "from-green-500 to-teal-500",
      href: "/admin/projects/apps",
    },
    {
      icon: Monitor,
      label: "الأنظمة",
      value: stats.projects.systems,
      color: "from-purple-500 to-indigo-500",
      href: "/admin/projects/systems",
    },
    {
      icon: GraduationCap,
      label: "مشاريع التخرج",
      value: stats.projects.graduation,
      color: "from-orange-500 to-red-500",
      href: "/admin/projects/graduation",
    },
  ];

  return (
    <div className="space-y-6">
      {/* الترحيب */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-blue-600 dark:via-indigo-600 dark:to-cyan-600 rounded-3xl p-8 relative overflow-hidden border border-blue-100 dark:border-blue-500/30"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 dark:bg-blue-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/20 dark:bg-cyan-300/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2 text-slate-900 dark:text-white">
            مرحباً بك، {user?.fullName || "ياسر"} 👋
          </h1>
          <p className="text-slate-600 dark:text-blue-100">
            إليك نظرة سريعة على أداء Code Tech اليوم
          </p>

          {/* شريط الإحصائيات السريعة */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/70 dark:bg-white/10 backdrop-blur rounded-xl p-3 border border-white/50 dark:border-white/20">
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {stats.projects.total}
              </div>
              <div className="text-xs text-slate-600 dark:text-blue-100">
                إجمالي المشاريع
              </div>
            </div>
            <div className="bg-white/70 dark:bg-white/10 backdrop-blur rounded-xl p-3 border border-white/50 dark:border-white/20">
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {stats.inquiries.new}
              </div>
              <div className="text-xs text-slate-600 dark:text-blue-100">
                استفسارات جديدة
              </div>
            </div>
            <div className="bg-white/70 dark:bg-white/10 backdrop-blur rounded-xl p-3 border border-white/50 dark:border-white/20">
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {stats.reviews.total}
              </div>
              <div className="text-xs text-slate-600 dark:text-blue-100">
                المراجعات
              </div>
            </div>
            <div className="bg-white/70 dark:bg-white/10 backdrop-blur rounded-xl p-3 border border-white/50 dark:border-white/20">
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {stats.users.total}
              </div>
              <div className="text-xs text-slate-600 dark:text-blue-100">
                المستخدمون
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* بطاقات الإحصائيات الرئيسية */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.a
              key={i}
              href={stat.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-400" />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
            </motion.a>
          );
        })}
      </div>

      {/* صفان */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* الاستفسارات الأخيرة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                الاستفسارات الأخيرة
              </h2>
            </div>
            <a
              href="/admin/inquiries"
              className="text-sm text-blue-600 hover:underline font-semibold"
            >
              عرض الكل ←
            </a>
          </div>

          {inquiries.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Inbox className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>لا توجد استفسارات بعد</p>
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {inq.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {inq.name}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {inq.serviceType || inq.subject || "استفسار عام"}
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        inq.status === "NEW"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                          : inq.status === "IN_PROGRESS"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                          : "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                      }`}
                    >
                      {inq.status === "NEW"
                        ? "جديد"
                        : inq.status === "IN_PROGRESS"
                        ? "قيد المعالجة"
                        : inq.status === "REPLIED"
                        ? "تم الرد"
                        : "مغلق"}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {new Date(inq.createdAt).toLocaleDateString("ar-YE")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* بطاقات جانبية */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white"
          >
            <Star className="w-8 h-8 mb-3" />
            <div className="text-4xl font-black mb-1">
              {stats.reviews.averageRating.toFixed(1)}
            </div>
            <div className="text-sm opacity-90">متوسط التقييم</div>
            <div className="text-xs opacity-75 mt-1">
              من {stats.reviews.total} مراجعة
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white"
          >
            <FileText className="w-8 h-8 mb-3" />
            <div className="text-4xl font-black mb-1">{stats.posts.total}</div>
            <div className="text-sm opacity-90">المنشورات</div>
            <div className="text-xs opacity-75 mt-1">
              {stats.posts.published} منشور • {stats.posts.draft} مسودة
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-6 text-white"
          >
            <Wrench className="w-8 h-8 mb-3" />
            <div className="text-4xl font-black mb-1">{stats.services.active}</div>
            <div className="text-sm opacity-90">الخدمات النشطة</div>
            <div className="text-xs opacity-75 mt-1">
              من {stats.services.total} خدمة
            </div>
          </motion.div>

          <motion.a
            href="/admin/notifications"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 flex items-center justify-between hover:shadow-lg transition cursor-pointer"
          >
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {stats.notifications.unread}
              </div>
              <div className="text-sm text-slate-500">إشعارات غير مقروءة</div>
            </div>
            <Bell className="w-8 h-8 text-slate-300" />
          </motion.a>
        </div>
      </div>

      {/* ملخص الاستفسارات */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            ملخص الاستفسارات
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-4 border border-blue-100 dark:border-blue-500/20">
            <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
              {stats.inquiries.new}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              جديدة
            </div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-500/10 rounded-xl p-4 border border-yellow-100 dark:border-yellow-500/20">
            <div className="text-3xl font-black text-yellow-600 dark:text-yellow-400">
              {stats.inquiries.inProgress}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              قيد المعالجة
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-500/10 rounded-xl p-4 border border-green-100 dark:border-green-500/20">
            <div className="text-3xl font-black text-green-600 dark:text-green-400">
              {stats.inquiries.replied}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              تم الرد
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
            <div className="text-3xl font-black text-slate-600 dark:text-slate-300">
              {stats.inquiries.closed}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              مغلقة
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}