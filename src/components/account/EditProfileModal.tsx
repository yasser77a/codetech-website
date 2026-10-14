"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  Phone,
  Globe,
  FileText,
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trash2,
} from "lucide-react";

// ==========================================
// Types
// ==========================================
interface Visitor {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  bio: string | null;
  website: string | null;
  avatar: string | null;
}

interface Props {
  visitor: Visitor;
  onClose: () => void;
  onSave: (updated: Partial<Visitor>) => void;
}

export default function EditProfileModal({ visitor, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    fullName: visitor.fullName || "",
    email: visitor.email || "",
    phone: visitor.phone || "",
    bio: visitor.bio || "",
    website: visitor.website || "",
    avatar: visitor.avatar || "",
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ==========================================
  // Handlers
  // ==========================================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("حجم الصورة يجب أن يكون أقل من 2MB");
      return;
    }

    // Validate type
    if (!file.type.startsWith("image/")) {
      setError("يجب اختيار ملف صورة صالح");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/visitor/upload-avatar", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل رفع الصورة");
      }

      setForm({ ...form, avatar: data.url });
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = () => {
    setForm({ ...form, avatar: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!form.fullName.trim() || form.fullName.trim().length < 3) {
      setError("الاسم الكامل يجب أن يكون 3 أحرف على الأقل");
      return;
    }

    if (!form.phone.trim() || form.phone.trim().length < 8) {
      setError("رقم الجوال غير صالح (8 أرقام على الأقل)");
      return;
    }

    if (form.website && !/^https?:\/\/.+/.test(form.website)) {
      setError("رابط الموقع يجب أن يبدأ بـ http:// أو https://");
      return;
    }

    setSaving(true);

    try {
      // ⚠️ المسار الصحيح من مشروعك: update-profile
      // ⚠️ لا نرسل email (غير مدعوم في API)
      const res = await fetch("/api/visitor/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          bio: form.bio.trim() || null,
          website: form.website.trim() || null,
          avatar: form.avatar || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل تحديث الملف الشخصي");
      }

      setSuccess(true);
      setTimeout(() => {
        onSave(data.visitor || form);
      }, 800);
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // Render
  // ==========================================
  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
          dir="rtl"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              تعديل الملف الشخصي
            </h2>
            <button
              onClick={onClose}
              disabled={saving}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition disabled:opacity-50"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Success overlay */}
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-3 rounded-3xl"
            >
              <CheckCircle2 className="w-16 h-16 text-green-500" />
              <p className="font-black text-slate-900 dark:text-white">
                تم الحفظ بنجاح
              </p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 border-2 border-red-200 dark:border-red-500/20 rounded-xl p-3 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-black overflow-hidden border-4 border-slate-100 dark:border-slate-700">
                  {form.avatar ? (
                    <img
                      src={form.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    form.fullName?.[0] || "?"
                  )}
                </div>

                {uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-3xl flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-lg transition disabled:opacity-50"
                >
                  <Camera className="w-3.5 h-3.5" />
                  تغيير الصورة
                </button>

                {form.avatar && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-red-100 hover:bg-red-200 dark:bg-red-500/20 dark:hover:bg-red-500/30 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    إزالة
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <p className="text-xs text-slate-400">JPG, PNG — بحد أقصى 2MB</p>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                الاسم الكامل *
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  disabled={saving}
                  className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition text-slate-900 dark:text-white disabled:opacity-50"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>
            </div>

            {/* Email (Read Only) */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  disabled
                  dir="ltr"
                  className="w-full pr-10 pl-4 py-3 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-500 dark:text-slate-400 cursor-not-allowed text-left"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                لا يمكن تغيير البريد الإلكتروني حالياً
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                رقم الجوال *
              </label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  disabled={saving}
                  dir="ltr"
                  className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition text-slate-900 dark:text-white text-left disabled:opacity-50"
                  placeholder="+967 7XX XXX XXX"
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                الموقع الإلكتروني (اختياري)
              </label>
              <div className="relative">
                <Globe className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  disabled={saving}
                  dir="ltr"
                  className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition text-slate-900 dark:text-white text-left disabled:opacity-50"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                نبذة (اختياري)
              </label>
              <div className="relative">
                <FileText className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={3}
                  maxLength={300}
                  disabled={saving}
                  className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition text-slate-900 dark:text-white resize-none disabled:opacity-50"
                  placeholder="اكتب نبذة قصيرة عنك..."
                />
              </div>
              <div className="text-left text-xs text-slate-400 mt-1">
                {form.bio.length}/300
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="flex-1 py-3 rounded-xl font-bold border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={saving || uploading}
                className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90 transition disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  "حفظ التغييرات"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}