"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  Reply,
  X,
} from "lucide-react";

// ==========================================
// Types
// ==========================================
interface Comment {
  id: string;
  name: string;
  email: string;
  content: string;
  status: string;
  adminReply: string | null;
  repliedAt: string | null;
  repliedBy: { id: string; fullName: string; avatar: string | null } | null;
  replies: Comment[];
  createdAt: string;
}

interface CommentSectionProps {
  targetType: "PROJECT" | "BLOG_POST" | "GENERAL";
  targetId?: string;
  title?: string;
}

// ==========================================
// Main Component
// ==========================================
export default function CommentSection({
  targetType,
  targetId,
  title = "التعليقات",
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    content: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  // ==========================================
  // Fetch Comments
  // ==========================================
  const fetchComments = async () => {
    setLoading(true);
    try {
      const url = targetId
        ? `/api/comments?targetType=${targetType}&targetId=${targetId}`
        : `/api/comments?targetType=${targetType}`;

      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error("Fetch comments error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetType, targetId]);

  // ==========================================
  // Submit Comment
  // ==========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    // التحقق
    const newErrors: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      newErrors.name = "الاسم مطلوب (حرفان على الأقل)";
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "بريد إلكتروني صحيح مطلوب";
    }
    if (!form.content.trim() || form.content.trim().length < 5) {
      newErrors.content = "التعليق قصير جداً (5 أحرف على الأقل)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    try {
      const payload: any = {
        name: form.name.trim(),
        email: form.email.trim(),
        content: form.content.trim(),
        targetType,
        targetId: targetId || null,
      };

      if (replyTo) {
        payload.parentId = replyTo.id;
      }

      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setForm({ name: "", email: "", content: "" });
        setReplyTo(null);
        setTimeout(() => {
          setSuccess(false);
          setShowForm(false);
        }, 4000);
      } else {
        setServerError(data.error || "فشل إرسال التعليق");
      }
    } catch {
      setServerError("تعذر الاتصال بالخادم");
    }

    setSubmitting(false);
  };

  // ==========================================
  // Format Date
  // ==========================================
  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "الآن";
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 30) return `منذ ${days} يوم`;

    return d.toLocaleDateString("ar-YE");
  };

  // ==========================================
  // Render
  // ==========================================
  return (
    <section className="py-16 bg-slate-50 dark:bg-[#0a0a0f] transition-colors">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                {title}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {comments.length} {comments.length === 1 ? "تعليق" : "تعليقات"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-5 py-3 rounded-xl font-bold transition flex items-center gap-2 shadow-lg hover:scale-105"
          >
            {showForm ? (
              <>
                <X className="w-4 h-4" />
                إلغاء
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4" />
                أضف تعليقاً
              </>
            )}
          </button>
        </div>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-white dark:bg-[#12121a] rounded-2xl p-6 border-2 border-blue-100 dark:border-blue-500/20 shadow-lg">
                {success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                      تم إرسال تعليقك!
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      سيظهر بعد موافقة الأدمن — شكراً لك
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Reply to */}
                    {replyTo && (
                      <div className="bg-blue-50 dark:bg-blue-500/10 border-2 border-blue-200 dark:border-blue-500/20 rounded-xl p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Reply className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-slate-700 dark:text-slate-300">
                            رداً على: <strong>{replyTo.name}</strong>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setReplyTo(null)}
                          className="p-1 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-lg transition"
                        >
                          <X className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </button>
                      </div>
                    )}

                    {/* Name + Email */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          الاسم <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => {
                            setForm({ ...form, name: e.target.value });
                            setErrors({ ...errors, name: "" });
                          }}
                          className={`w-full bg-slate-50 dark:bg-[#0a0a0f] border-2 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none transition ${
                            errors.name
                              ? "border-red-300 focus:border-red-500"
                              : "border-slate-200 dark:border-white/10 focus:border-blue-500"
                          }`}
                          placeholder="اسمك الكريم"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          البريد <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => {
                            setForm({ ...form, email: e.target.value });
                            setErrors({ ...errors, email: "" });
                          }}
                          className={`w-full bg-slate-50 dark:bg-[#0a0a0f] border-2 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none transition ${
                            errors.email
                              ? "border-red-300 focus:border-red-500"
                              : "border-slate-200 dark:border-white/10 focus:border-blue-500"
                          }`}
                          dir="ltr"
                          placeholder="you@example.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                        تعليقك <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        value={form.content}
                        onChange={(e) => {
                          setForm({ ...form, content: e.target.value });
                          setErrors({ ...errors, content: "" });
                        }}
                        className={`w-full bg-slate-50 dark:bg-[#0a0a0f] border-2 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none transition resize-none ${
                          errors.content
                            ? "border-red-300 focus:border-red-500"
                            : "border-slate-200 dark:border-white/10 focus:border-blue-500"
                        }`}
                        placeholder="شاركنا رأيك..."
                        maxLength={2000}
                      />
                      <div className="flex items-center justify-between mt-1">
                        {errors.content && (
                          <p className="text-red-500 text-xs">{errors.content}</p>
                        )}
                        <p className="text-xs text-slate-400 mr-auto">
                          {form.content.length} / 2000
                        </p>
                      </div>
                    </div>

                    {/* Server Error */}
                    {serverError && (
                      <div className="bg-red-50 dark:bg-red-500/10 border-2 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {serverError}
                      </div>
                    )}

                    {/* Note */}
                    <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-xl text-xs">
                      💡 سيظهر تعليقك بعد موافقة الأدمن
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          إرسال التعليق
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comments List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <div className="bg-white dark:bg-[#12121a] rounded-2xl p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
            <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-bold mb-1">
              لا توجد تعليقات بعد
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              كن أول من يشارك رأيه!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment, i) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-[#12121a] rounded-2xl p-5 border-2 border-slate-100 dark:border-white/10"
              >
                {/* Comment */}
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-black flex-shrink-0">
                    {comment.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-black text-slate-900 dark:text-white">
                        {comment.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                      {comment.content}
                    </p>

                    {/* Admin Reply */}
                    {comment.adminReply && (
                      <div className="mt-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/5 border-2 border-blue-100 dark:border-blue-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-black text-xs">
                            {comment.repliedBy?.fullName?.[0] || "أ"}
                          </div>
                          <span className="text-sm font-black text-blue-700 dark:text-blue-400">
                            رد Code Tech
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                          {comment.adminReply}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <button
                      onClick={() => {
                        setReplyTo(comment);
                        setShowForm(true);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="mt-3 flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      رد
                    </button>
                  </div>
                </div>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 mr-8 md:mr-14 space-y-3 border-r-2 border-slate-200 dark:border-slate-700 pr-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xs flex-shrink-0">
                          {reply.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {reply.name}
                            </span>
                            <span className="text-xs text-slate-400">
                              {formatDate(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}