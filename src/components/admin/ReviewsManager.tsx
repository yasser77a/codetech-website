"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Search,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Loader2,
  AlertCircle,
  Filter,
  RefreshCw,
  Quote,
  BadgeCheck,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";

// ==========================================
// Types
// ==========================================
interface Review {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  position: string | null;
  content: string;
  rating: number;
  avatar: string | null;
  isApproved: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// Main Component
// ==========================================
export default function ReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "approved" | "pending" | "featured" | "verified"
  >("all");

  // ==========================================
  // Fetch Reviews
  // ==========================================
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();

      if (res.ok) {
        setReviews(data.reviews || []);
      } else {
        setError(data.error || "فشل في جلب المراجعات");
      }
    } catch (err) {
      console.error("Fetch reviews error:", err);
      setError("تعذر الاتصال بالخادم");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // ==========================================
  // Handlers
  // ==========================================
  const handleToggle = async (
    id: string,
    field: "isApproved" | "isFeatured" | "isVerified",
    currentValue: boolean
  ) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !currentValue }),
      });

      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, [field]: !currentValue } : r))
        );
      }
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه المراجعة؟")) return;

    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });

      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "فشل الحذف");
      }
    } catch {
      alert("تعذر الاتصال بالخادم");
    }
  };

  // ==========================================
  // Filter
  // ==========================================
  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      const matchSearch =
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.content.toLowerCase().includes(search.toLowerCase()) ||
        (r.company || "").toLowerCase().includes(search.toLowerCase());

      let matchStatus = true;
      if (statusFilter === "approved") matchStatus = r.isApproved;
      else if (statusFilter === "pending") matchStatus = !r.isApproved;
      else if (statusFilter === "featured") matchStatus = r.isFeatured;
      else if (statusFilter === "verified") matchStatus = r.isVerified;

      return matchSearch && matchStatus;
    });
  }, [reviews, search, statusFilter]);

  // ==========================================
  // Stats
  // ==========================================
  const stats = useMemo(() => {
    const approved = reviews.filter((r) => r.isApproved);
    const avgRating =
      approved.length > 0
        ? approved.reduce((acc, r) => acc + r.rating, 0) / approved.length
        : 0;

    return {
      total: reviews.length,
      approved: approved.length,
      pending: reviews.filter((r) => !r.isApproved).length,
      featured: reviews.filter((r) => r.isFeatured).length,
      verified: reviews.filter((r) => r.isVerified).length,
      avgRating,
    };
  }, [reviews]);

  // ==========================================
  // Render
  // ==========================================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              التقييمات
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {stats.total} مراجعة • {stats.pending} في الانتظار
            </p>
          </div>
        </div>

        <button
          onClick={fetchReviews}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          تحديث
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          {
            label: "الكل",
            value: stats.total,
            icon: Star,
            status: "all" as const,
            color: "from-blue-500 to-cyan-500",
          },
          {
            label: "معتمد",
            value: stats.approved,
            icon: CheckCircle2,
            status: "approved" as const,
            color: "from-green-500 to-emerald-500",
          },
          {
            label: "معلق",
            value: stats.pending,
            icon: AlertCircle,
            status: "pending" as const,
            color: "from-yellow-500 to-orange-500",
          },
          {
            label: "مميز",
            value: stats.featured,
            icon: Sparkles,
            status: "featured" as const,
            color: "from-purple-500 to-pink-500",
          },
          {
            label: "موثق",
            value: stats.verified,
            icon: BadgeCheck,
            status: "verified" as const,
            color: "from-indigo-500 to-blue-500",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          const isActive = statusFilter === stat.status;
          return (
            <button
              key={stat.label}
              onClick={() => setStatusFilter(stat.status)}
              className={`rounded-2xl p-4 text-right transition border-2 ${
                isActive
                  ? "border-yellow-300 dark:border-yellow-500/40 bg-yellow-50 dark:bg-yellow-500/10"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {stat.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Average Rating */}
      {stats.approved > 0 && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-500/10 dark:to-orange-500/5 rounded-2xl p-6 border-2 border-yellow-100 dark:border-yellow-500/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Star className="w-8 h-8 text-white fill-white" />
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">
                  {stats.avgRating.toFixed(1)}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  من {stats.approved} مراجعة معتمدة
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < Math.round(stats.avgRating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-slate-300 dark:text-slate-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم أو الشركة..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 dark:text-white"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
          <button onClick={fetchReviews} className="text-sm font-bold hover:underline">
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-16 text-center border border-slate-100 dark:border-slate-700">
          <Star className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 text-lg font-bold">
            {search || statusFilter !== "all" ? "لا توجد نتائج" : "لا توجد مراجعات بعد"}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filtered.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`bg-white dark:bg-slate-800 rounded-2xl p-5 border-2 transition ${
                  review.isApproved
                    ? "border-green-100 dark:border-green-500/20"
                    : "border-yellow-100 dark:border-yellow-500/20"
                }`}
              >
                {/* Badges */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {review.isApproved ? (
                    <span className="text-xs bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      معتمد
                    </span>
                  ) : (
                    <span className="text-xs bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-full font-bold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      معلق
                    </span>
                  )}
                  {review.isFeatured && (
                    <span className="text-xs bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 px-2 py-1 rounded-full font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      مميز
                    </span>
                  )}
                  {review.isVerified && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full font-bold flex items-center gap-1">
                      <BadgeCheck className="w-3 h-3" />
                      موثق
                    </span>
                  )}
                </div>

                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                    {review.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-slate-900 dark:text-white">
                      {review.name}
                    </div>
                    {(review.company || review.position) && (
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {review.position && `${review.position} — `}
                        {review.company}
                      </div>
                    )}
                    <div className="flex gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < review.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-slate-300 dark:text-slate-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative mb-4">
                  <Quote className="absolute -top-1 -right-1 w-6 h-6 text-slate-200 dark:text-slate-700" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {review.content}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-700 flex-wrap">
                  <button
                    onClick={() => handleToggle(review.id, "isApproved", review.isApproved)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      review.isApproved
                        ? "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200"
                        : "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-200"
                    }`}
                  >
                    {review.isApproved ? (
                      <>
                        <XCircle className="w-3 h-3" />
                        إلغاء الاعتماد
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        اعتماد
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleToggle(review.id, "isFeatured", review.isFeatured)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      review.isFeatured
                        ? "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 hover:bg-purple-200"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    {review.isFeatured ? "إلغاء التمييز" : "تمييز"}
                  </button>

                  <button
                    onClick={() => handleToggle(review.id, "isVerified", review.isVerified)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      review.isVerified
                        ? "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 hover:bg-blue-200"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    <BadgeCheck className="w-3 h-3" />
                    {review.isVerified ? "إلغاء التوثيق" : "توثيق"}
                  </button>

                  <div className="flex-1" />

                  <button
                    onClick={() => handleDelete(review.id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 rounded-lg transition"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}