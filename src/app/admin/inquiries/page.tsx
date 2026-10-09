"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MessageSquare,
  Search,
  Filter,
  Eye,
  Trash2,
  CheckCircle2,
  Loader2,
  AlertCircle,
  RefreshCw,
  X,
  Clock,
  Send,
  User,
  Calendar,
} from "lucide-react";

// ==========================================
// Types
// ==========================================
interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  serviceType: string | null;
  budget: string | null;
  status: "NEW" | "IN_PROGRESS" | "REPLIED" | "CLOSED" | "SPAM";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// Status Config
// ==========================================
const statusMap: Record<
  string,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  NEW: {
    label: "جديد",
    color: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-500/20",
    borderColor: "border-blue-200 dark:border-blue-500/30",
  },
  IN_PROGRESS: {
    label: "قيد المعالجة",
    color: "text-yellow-700 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-500/20",
    borderColor: "border-yellow-200 dark:border-yellow-500/30",
  },
  REPLIED: {
    label: "تم الرد",
    color: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-500/20",
    borderColor: "border-green-200 dark:border-green-500/30",
  },
  CLOSED: {
    label: "مغلق",
    color: "text-slate-700 dark:text-slate-300",
    bgColor: "bg-slate-100 dark:bg-slate-700",
    borderColor: "border-slate-200 dark:border-slate-600",
  },
  SPAM: {
    label: "مزعج",
    color: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-500/20",
    borderColor: "border-red-200 dark:border-red-500/30",
  },
};

// ==========================================
// Main Component
// ==========================================
export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Inquiry | null>(null);

  // ==========================================
  // Fetch Inquiries
  // ==========================================
  const fetchInquiries = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/inquiries");
      const data = await res.json();

      if (res.ok) {
        setInquiries(data.inquiries || []);
      } else {
        setError(data.error || "فشل في جلب الاستفسارات");
      }
    } catch (err) {
      console.error("Fetch inquiries error:", err);
      setError("تعذر الاتصال بالخادم");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // ==========================================
  // Handlers
  // ==========================================
  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الاستفسار؟")) return;

    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setInquiries((prev) => prev.filter((i) => i.id !== id));
        if (selected?.id === id) setSelected(null);
      } else {
        const data = await res.json();
        alert(data.error || "فشل الحذف");
      }
    } catch {
      alert("تعذر الاتصال بالخادم");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status: newStatus as any } : i))
        );
        if (selected?.id === id) {
          setSelected({ ...selected, status: newStatus as any });
        }
      }
    } catch (err) {
      console.error("Status change error:", err);
    }
  };

  // ==========================================
  // Filter
  // ==========================================
  const filtered = inquiries.filter((i) => {
    const matchSearch =
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.email.toLowerCase().includes(search.toLowerCase()) ||
      i.message.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "all" || i.status === filter.toUpperCase();

    return matchSearch && matchFilter;
  });

  // ==========================================
  // Stats
  // ==========================================
  const newCount = inquiries.filter((i) => i.status === "NEW").length;

  // ==========================================
  // Render
  // ==========================================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              الاستفسارات
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {newCount} استفسار جديد • {inquiries.length} إجمالي
            </p>
          </div>
        </div>

        <button
          onClick={fetchInquiries}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          تحديث
        </button>
      </div>

      {/* Filters */}
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
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm dark:text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">الكل</option>
          <option value="NEW">جديد</option>
          <option value="IN_PROGRESS">قيد المعالجة</option>
          <option value="REPLIED">تم الرد</option>
          <option value="CLOSED">مغلق</option>
          <option value="SPAM">مزعج</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
          <button onClick={fetchInquiries} className="text-sm font-bold hover:underline">
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-16 text-center border border-slate-100 dark:border-slate-700">
          <MessageSquare className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 text-lg font-bold">
            {search || filter !== "all" ? "لا توجد نتائج مطابقة" : "لا توجد استفسارات بعد"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {filtered.map((inq) => {
              const config = statusMap[inq.status] || statusMap.NEW;

              return (
                <motion.div
                  key={inq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`bg-white dark:bg-slate-800 rounded-2xl p-5 border-2 ${config.borderColor} hover:shadow-lg transition`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-black flex-shrink-0">
                        {inq.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-bold text-slate-900 dark:text-white">
                            {inq.name}
                          </h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-bold ${config.bgColor} ${config.color}`}
                          >
                            {config.label}
                          </span>
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                          {inq.serviceType || inq.subject || "استفسار عام"} •{" "}
                          {new Date(inq.createdAt).toLocaleDateString("ar-YE")}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 break-words">
                          {inq.message}
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                          {inq.phone && (
                            <span className="flex items-center gap-1" dir="ltr">
                              <Phone className="w-3 h-3" /> {inq.phone}
                            </span>
                          )}
                          <span className="flex items-center gap-1" dir="ltr">
                            <Mail className="w-3 h-3" /> {inq.email}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => setSelected(inq)}
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-600 rounded-lg transition"
                        title="عرض"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {inq.phone && (
                        <a
                          href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-green-50 dark:hover:bg-green-500/10 text-green-600 rounded-lg transition"
                          title="رد واتساب"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(inq.id)}
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
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelected(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg my-8"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                تفاصيل الاستفسار
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-black text-xl">
                  {selected.name[0]}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-lg">
                    {selected.name}
                  </h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      statusMap[selected.status]?.bgColor
                    } ${statusMap[selected.status]?.color}`}
                  >
                    {statusMap[selected.status]?.label}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    البريد:
                  </span>
                  <span dir="ltr" className="text-slate-900 dark:text-white text-sm">
                    {selected.email}
                  </span>
                </div>

                {selected.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      الجوال:
                    </span>
                    <span dir="ltr" className="text-slate-900 dark:text-white text-sm">
                      {selected.phone}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    التاريخ:
                  </span>
                  <span className="text-slate-900 dark:text-white text-sm">
                    {new Date(selected.createdAt).toLocaleString("ar-YE")}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  الرسالة:
                </div>
                <p className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl text-slate-700 dark:text-slate-300 leading-relaxed break-words whitespace-pre-wrap overflow-hidden">
                  {selected.message}
                </p>
              </div>

              {/* Status Change */}
              <div>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  تغيير الحالة:
                </div>
                <div className="flex flex-wrap gap-2">
                  {(["NEW", "IN_PROGRESS", "REPLIED", "CLOSED", "SPAM"] as const).map(
                    (status) => {
                      const cfg = statusMap[status];
                      const isActive = selected.status === status;

                      return (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(selected.id, status)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                            isActive
                              ? `${cfg.bgColor} ${cfg.color} border-2 ${cfg.borderColor}`
                              : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                          }`}
                        >
                          {cfg.label}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex gap-3">
              {selected.phone && (
                <a
                  href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `مرحباً ${selected.name}، بخصوص استفسارك عن ${
                      selected.serviceType || "خدماتنا"
                    }`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  رد واتساب
                </a>
              )}
              <a
                href={`mailto:${selected.email}?subject=${encodeURIComponent(
                  `رداً على استفسارك - Code Tech`
                )}`}
                className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                رد بالبريد
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}