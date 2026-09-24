"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Search,
  Check,
  X,
  Trash2,
  MessageSquare,
  Clock,
  TrendingUp,
} from "lucide-react";

interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
  service: string;
}

const initialReviews: Review[] = [
  {
    id: "1",
    name: "أحمد الشامي",
    email: "ahmed@example.com",
    rating: 5,
    comment: "تجربة رائعة! الفريق احترافي جداً والتسليم كان في الموعد. أنصح بهم بشدة.",
    approved: true,
    createdAt: "2026-09-22",
    service: "موقع متجر",
  },
  {
    id: "2",
    name: "سارة العمراني",
    email: "sara@example.com",
    rating: 5,
    comment: "أفضل شركة برمجية تعاملت معها في صنعاء. الجودة ممتازة والسعر مناسب.",
    approved: true,
    createdAt: "2026-09-21",
    service: "تطبيق جوال",
  },
  {
    id: "3",
    name: "محمد القباطي",
    email: "m@example.com",
    rating: 4,
    comment: "ساعدوني في مشروع تخرجي وكانوا متعاونين جداً. شكراً Code Tech.",
    approved: false,
    createdAt: "2026-09-20",
    service: "مشروع تخرج",
  },
  {
    id: "4",
    name: "خالد يوسف",
    email: "k@example.com",
    rating: 5,
    comment: "خدمة ممتازة ودعم فني متواصل. أنصح بالتعامل معهم.",
    approved: true,
    createdAt: "2026-09-19",
    service: "نظام إداري",
  },
  {
    id: "5",
    name: "نورة محمد",
    email: "n@example.com",
    rating: 3,
    comment: "الخدمة جيدة لكن التسليم تأخر قليلاً.",
    approved: false,
    createdAt: "2026-09-18",
    service: "موقع شخصي",
  },
];

export default function ReviewsManager() {
  const [reviews, setReviews] = useState(initialReviews);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const filtered = reviews.filter((r) => {
    const matchSearch = r.name.includes(search) || r.comment.includes(search);
    const matchFilter =
      filter === "all" ? true : filter === "approved" ? r.approved : !r.approved;
    return matchSearch && matchFilter;
  });

  const stats = {
    total: reviews.length,
    approved: reviews.filter((r) => r.approved).length,
    pending: reviews.filter((r) => !r.approved).length,
    avg: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
  };

  const approve = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, approved: true } : r))
    );
  };

  const reject = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, approved: false } : r))
    );
  };

  const remove = (id: string) => {
    if (confirm("حذف هذا التقييم؟")) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* الرأس */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
          <Star className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            التقييمات
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            إدارة تقييمات العملاء
          </p>
        </div>
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: MessageSquare,
            label: "الإجمالي",
            value: stats.total,
            color: "from-blue-500 to-cyan-500",
          },
          {
            icon: Check,
            label: "المعتمدة",
            value: stats.approved,
            color: "from-green-500 to-teal-500",
          },
          {
            icon: Clock,
            label: "قيد المراجعة",
            value: stats.pending,
            color: "from-yellow-500 to-orange-500",
          },
          {
            icon: TrendingUp,
            label: "متوسط التقييم",
            value: stats.avg,
            color: "from-purple-500 to-pink-500",
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 hover:shadow-lg transition"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {stat.label}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* الفلاتر */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "pending", "approved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition ${
                filter === f
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
              }`}
            >
              {f === "all" ? "الكل" : f === "pending" ? "قيد المراجعة" : "المعتمدة"}
            </button>
          ))}
        </div>
      </div>

      {/* القائمة */}
      <div className="grid gap-4">
        {filtered.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-black flex-shrink-0">
                  {review.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {review.name}
                    </h3>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-slate-300 dark:text-slate-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        review.approved
                          ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                      }`}
                    >
                      {review.approved ? "✅ معتمد" : "⏳ قيد المراجعة"}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    {review.service} • {review.createdAt}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {review.comment}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {!review.approved && (
                  <button
                    onClick={() => approve(review.id)}
                    className="p-2 bg-green-50 dark:bg-green-500/20 hover:bg-green-100 text-green-600 rounded-lg transition"
                    title="اعتماد"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                {review.approved && (
                  <button
                    onClick={() => reject(review.id)}
                    className="p-2 bg-yellow-50 dark:bg-yellow-500/20 hover:bg-yellow-100 text-yellow-600 rounded-lg transition"
                    title="إلغاء الاعتماد"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => remove(review.id)}
                  className="p-2 bg-red-50 dark:bg-red-500/20 hover:bg-red-100 text-red-600 rounded-lg transition"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <Star className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>لا توجد تقييمات مطابقة</p>
          </div>
        )}
      </div>
    </div>
  );
}