"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Search, Filter, Mail, Phone, Calendar, User as UserIcon,
  Trash2, Eye, X, CheckCircle2, Clock, XCircle, AlertTriangle, Save,
  Loader2, Inbox, RefreshCw, TrendingUp, Send,
} from "lucide-react";

// ============================================
// Types
// ============================================
type InquiryStatus = "NEW" | "IN_PROGRESS" | "REPLIED" | "CLOSED" | "SPAM";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  serviceType: string | null;
  budget: string | null;
  status: InquiryStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  assignedTo: { id: string; fullName: string; avatar: string | null } | null;
}

// ============================================
// Status Configuration
// ============================================
const statusConfig: Record<InquiryStatus, {
  label: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  NEW: {
    label: "جديد",
    icon: AlertTriangle,
    color: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-500/20",
    borderColor: "border-blue-200 dark:border-blue-500/30",
  },
  IN_PROGRESS: {
    label: "قيد المعالجة",
    icon: Clock,
    color: "text-yellow-700 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-500/20",
    borderColor: "border-yellow-200 dark:border-yellow-500/30",
  },
  REPLIED: {
    label: "تم الرد",
    icon: CheckCircle2,
    color: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-500/20",
    borderColor: "border-green-200 dark:border-green-500/30",
  },
  CLOSED: {
    label: "مغلق",
    icon: XCircle,
    color: "text-slate-700 dark:text-slate-300",
    bgColor: "bg-slate-100 dark:bg-slate-700",
    borderColor: "border-slate-200 dark:border-slate-600",
  },
  SPAM: {
    label: "مزعج",
    icon: XCircle,
    color: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-500/20",
    borderColor: "border-red-200 dark:border-red-500/30",
  },
};

// ============================================
// Main Component
// ============================================
export default function InquiriesManager() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | "all">("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  // ============================================
  // Load Inquiries
  // ============================================
  const loadInquiries = useCallback(async () => {
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
    } catch {
      setError("تعذر الاتصال بالخادم");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  // ============================================
  // Filter
  // ============================================
  const filtered = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchSearch =
        inq.name.toLowerCase().includes(search.toLowerCase()) ||
        inq.email.toLowerCase().includes(search.toLowerCase()) ||
        inq.message.toLowerCase().includes(search.toLowerCase()) ||
        (inq.subject || "").toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === "all" || inq.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [inquiries, search, statusFilter]);

  // ============================================
  // Stats
  // ============================================
  const stats = useMemo(() => {
    return {
      total: inquiries.length,
      new: inquiries.filter((i) => i.status === "NEW").length,
      inProgress: inquiries.filter((i) => i.status === "IN_PROGRESS").length,
      replied: inquiries.filter((i) => i.status === "REPLIED").length,
      closed: inquiries.filter((i) => i.status === "CLOSED").length,
    };
  }, [inquiries]);

  // ============================================
  // Handlers
  // ============================================
  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الاستفسار؟")) return;

    const res = await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
    if (res.ok) {
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
    } else {
      const data = await res.json();
      alert(data.error || "فشل الحذف");
    }
  };

  const handleStatusChange = async (id: string, newStatus: InquiryStatus) => {
    const res = await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
      );
      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
    }
  };

  const openDetails = (inq: Inquiry) => {
    setSelectedInquiry(inq);
    // تحديث الحالة إلى "قيد المعالجة" إذا كانت جديدة
    if (inq.status === "NEW") {
      handleStatusChange(inq.id, "IN_PROGRESS");
    }
  };

  // ============================================
  // Render
  // ============================================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              الاستفسارات
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {stats.total} استفسار • {stats.new} جديد
            </p>
          </div>
        </div>

        <button
          onClick={loadInquiries}
          disabled={loading}
          className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          تحديث
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { key: "all", label: "الكل", value: stats.total, status: null },
          { key: "NEW", label: "جديد", value: stats.new, status: "NEW" as const },
          { key: "IN_PROGRESS", label: "قيد المعالجة", value: stats.inProgress, status: "IN_PROGRESS" as const },
          { key: "REPLIED", label: "تم الرد", value: stats.replied, status: "REPLIED" as const },
          { key: "CLOSED", label: "مغلق", value: stats.closed, status: "CLOSED" as const },
        ].map((stat) => {
          const isActive = statusFilter === (stat.status || "all");
          const config = stat.status ? statusConfig[stat.status] : null;

          return (
            <button
              key={stat.key}
              onClick={() => setStatusFilter(stat.status || "all")}
              className={`rounded-xl p-3 text-right transition border-2 ${
                isActive
                  ? config
                    ? `${config.bgColor} ${config.borderColor}`
                    : "bg-blue-100 dark:bg-blue-500/20 border-blue-300 dark:border-blue-500/40"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              <div className={`text-2xl font-black ${config ? config.color : "text-slate-900 dark:text-white"}`}>
                {stat.value}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {stat.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم، البريد، الرسالة..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 dark:text-white"
          >
            <option value="all">كل الحالات</option>
            <option value="NEW">جديد</option>
            <option value="IN_PROGRESS">قيد المعالجة</option>
            <option value="REPLIED">تم الرد</option>
            <option value="CLOSED">مغلق</option>
            <option value="SPAM">مزعج</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
          <button onClick={loadInquiries} className="text-sm font-bold hover:underline">
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Inquiries List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-16 text-center border border-slate-100 dark:border-slate-700">
          <Inbox className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 text-lg font-bold">
            {search || statusFilter !== "all" ? "لا توجد نتائج مطابقة" : "لا توجد استفسارات بعد"}
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            ستظهر هنا الاستفسارات الواردة من الموقع
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((inquiry) => {
              const config = statusConfig[inquiry.status];
              const StatusIcon = config.icon;

              return (
                <motion.div
                  key={inquiry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`bg-white dark:bg-slate-800 rounded-2xl p-5 border-2 transition hover:shadow-lg cursor-pointer ${config.borderColor}`}
                  onClick={() => openDetails(inquiry)}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                        {inquiry.name[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-900 dark:text-white truncate">
                            {inquiry.name}
                          </h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${config.bgColor} ${config.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {config.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                          <span className="flex items-center gap-1" dir="ltr">
                            <Mail className="w-3 h-3" />
                            {inquiry.email}
                          </span>
                          {inquiry.phone && (
                            <span className="flex items-center gap-1" dir="ltr">
                              <Phone className="w-3 h-3" />
                              {inquiry.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="text-xs text-slate-400 hidden md:block">
                        {new Date(inquiry.createdAt).toLocaleDateString("ar-YE")}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(inquiry.id);
                        }}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 rounded-lg transition"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 text-sm line-clamp-2 mb-2">
                    {inquiry.message}
                  </p>

                  {inquiry.subject && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span className="font-bold">الموضوع:</span> {inquiry.subject}
                    </div>
                  )}

                  {inquiry.serviceType && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-bold">الخدمة:</span> {inquiry.serviceType}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Details Modal */}
      {selectedInquiry && (
        <InquiryDetailsModal
          inquiry={selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          onDelete={() => handleDelete(selectedInquiry.id)}
          onStatusChange={(status) => handleStatusChange(selectedInquiry.id, status)}
        />
      )}
    </div>
  );
}

// ============================================
// Details Modal
// ============================================
function InquiryDetailsModal({
  inquiry,
  onClose,
  onDelete,
  onStatusChange,
}: {
  inquiry: Inquiry;
  onClose: () => void;
  onDelete: () => void;
  onStatusChange: (status: InquiryStatus) => void;
}) {
  const [notes, setNotes] = useState(inquiry.notes || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const config = statusConfig[inquiry.status];
  const StatusIcon = config.icon;

  const handleSaveNotes = async () => {
    setSaving(true);
    const res = await fetch(`/api/inquiries/${inquiry.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const mailtoLink = `mailto:${inquiry.email}?subject=${encodeURIComponent(
    `رداً على استفسارك - Code Tech`
  )}&body=${encodeURIComponent(`مرحباً ${inquiry.name},\n\n`)}`;

  const whatsappLink = inquiry.phone
    ? `https://wa.me/${inquiry.phone.replace(/\D/g, "")}`
    : null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl my-8"
      >
        {/* Header */}
        <div className={`p-6 border-b-2 ${config.borderColor} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-black text-xl">
              {inquiry.name[0]}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {inquiry.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${config.bgColor} ${config.color}`}>
                  <StatusIcon className="w-3 h-3" />
                  {config.label}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(inquiry.createdAt).toLocaleString("ar-YE")}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Contact Info */}
          <div className="grid md:grid-cols-2 gap-3">
            <a
              href={`mailto:${inquiry.email}`}
              className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <div className="text-sm min-w-0">
                <div className="text-xs text-slate-500 dark:text-slate-400">البريد</div>
                <div className="font-bold text-slate-900 dark:text-white truncate" dir="ltr">
                  {inquiry.email}
                </div>
              </div>
            </a>

            {inquiry.phone && (
              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
                <div className="text-sm min-w-0">
                  <div className="text-xs text-slate-500 dark:text-slate-400">الهاتف</div>
                  <div className="font-bold text-slate-900 dark:text-white" dir="ltr">
                    {inquiry.phone}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              الرسالة
            </h3>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
              {inquiry.message}
            </div>
          </div>

          {/* Subject & Service */}
          {(inquiry.subject || inquiry.serviceType || inquiry.budget) && (
            <div className="grid md:grid-cols-3 gap-3">
              {inquiry.subject && (
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">الموضوع</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {inquiry.subject}
                  </div>
                </div>
              )}
              {inquiry.serviceType && (
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">الخدمة</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {inquiry.serviceType}
                  </div>
                </div>
              )}
              {inquiry.budget && (
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">الميزانية</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {inquiry.budget}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Status Change */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              تغيير الحالة
            </h3>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(statusConfig) as InquiryStatus[]).map((status) => {
                const cfg = statusConfig[status];
                const Icon = cfg.icon;
                const isActive = inquiry.status === status;

                return (
                  <button
                    key={status}
                    onClick={() => onStatusChange(status)}
                    className={`px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition ${
                      isActive
                        ? `${cfg.bgColor} ${cfg.color} border-2 ${cfg.borderColor}`
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              ملاحظاتك (داخلية)
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="أضف ملاحظات داخلية عن هذا الاستفسار..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:text-white resize-none"
            />
            <button
              onClick={handleSaveNotes}
              disabled={saving}
              className="mt-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  تم الحفظ
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  حفظ الملاحظات
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex flex-wrap gap-3">
          <a
            href={mailtoLink}
            className="flex-1 min-w-[150px] bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            الرد بالبريد
          </a>

          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[150px] bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              واتساب
            </a>
          )}

          <button
            onClick={() => {
              if (confirm("حذف هذا الاستفسار نهائياً؟")) {
                onDelete();
                onClose();
              }
            }}
            className="px-4 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 py-3 rounded-xl font-bold transition flex items-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}