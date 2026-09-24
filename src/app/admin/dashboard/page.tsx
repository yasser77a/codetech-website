"use client";

import { motion } from "framer-motion";
import {
  Globe, Smartphone, Monitor, GraduationCap, MessageSquare, Star,
  TrendingUp, Users, ArrowUpRight, ArrowDownRight
} from "lucide-react";

const stats = [
  { icon: Globe, label: "المواقع", value: 24, change: "+12%", trend: "up", color: "from-blue-500 to-cyan-500" },
  { icon: Smartphone, label: "التطبيقات", value: 18, change: "+8%", trend: "up", color: "from-green-500 to-teal-500" },
  { icon: Monitor, label: "الأنظمة", value: 12, change: "+5%", trend: "up", color: "from-purple-500 to-indigo-500" },
  { icon: GraduationCap, label: "مشاريع التخرج", value: 35, change: "+18%", trend: "up", color: "from-orange-500 to-red-500" },
];

const recentInquiries = [
  { id: 1, name: "أحمد علي", service: "موقع متجر", time: "منذ 5 دقائق", status: "جديد" },
  { id: 2, name: "سارة محمد", service: "تطبيق جوال", time: "منذ ساعة", status: "جديد" },
  { id: 3, name: "خالد يوسف", service: "نظام إداري", time: "منذ 3 ساعات", status: "قيد المعالجة" },
  { id: 4, name: "فاطمة الزهراء", service: "مشروع تخرج", time: "أمس", status: "تم الرد" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* الترحيب */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2">مرحباً بك 👋</h1>
          <p className="text-slate-300">
            إليك نظرة سريعة على أداء Code Tech اليوم
          </p>
        </div>
      </motion.div>

      {/* الإحصائيات */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold ${
                  stat.trend === "up" ? "text-green-500" : "text-red-500"
                }`}>
                  <TrendIcon className="w-4 h-4" />
                  {stat.change}
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </motion.div>
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
          className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-bold text-slate-900">الاستفسارات الأخيرة</h2>
            </div>
            <a href="/admin/inquiries" className="text-sm text-blue-600 hover:underline font-semibold">
              عرض الكل ←
            </a>
          </div>

          <div className="space-y-3">
            {recentInquiries.map((inq) => (
              <div
                key={inq.id}
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                    {inq.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{inq.name}</div>
                    <div className="text-sm text-slate-500">{inq.service}</div>
                  </div>
                </div>
                <div className="text-left">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    inq.status === "جديد" ? "bg-blue-100 text-blue-700" :
                    inq.status === "قيد المعالجة" ? "bg-yellow-100 text-yellow-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {inq.status}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{inq.time}</div>
                </div>
              </div>
            ))}
          </div>
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
            <div className="text-4xl font-black mb-1">4.5</div>
            <div className="text-sm opacity-90">متوسط التقييم</div>
            <div className="text-xs opacity-75 mt-1">من 2,084 مراجعة</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white"
          >
            <Users className="w-8 h-8 mb-3" />
            <div className="text-4xl font-black mb-1">+150</div>
            <div className="text-sm opacity-90">عميل سعيد</div>
            <div className="text-xs opacity-75 mt-1">خلال 2025</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-6 text-white"
          >
            <TrendingUp className="w-8 h-8 mb-3" />
            <div className="text-4xl font-black mb-1">98%</div>
            <div className="text-sm opacity-90">نسبة الرضا</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}