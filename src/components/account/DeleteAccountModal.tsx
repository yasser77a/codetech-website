"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trash2,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Lock,
} from "lucide-react";

interface Props {
  onClose: () => void;
}

export default function DeleteAccountModal({ onClose }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const CONFIRM_WORD = "حذف";

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("أدخل كلمة المرور لتأكيد الحذف");
      return;
    }

    if (confirmText.trim() !== CONFIRM_WORD) {
      setError(`اكتب "${CONFIRM_WORD}" بالضبط للتأكيد`);
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/visitor/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل حذف الحساب");
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع");
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden"
          dir="rtl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              حذف الحساب نهائياً
            </h2>
            <button
              onClick={onClose}
              disabled={saving}
              className="p-2 rounded-xl hover:bg-white/20 transition disabled:opacity-50"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Success overlay */}
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-3"
            >
              <CheckCircle2 className="w-16 h-16 text-green-500" />
              <p className="font-black text-slate-900 dark:text-white">
                تم حذف الحساب بنجاح
              </p>
              <p className="text-xs text-slate-400">
                جاري تحويلك للصفحة الرئيسية...
              </p>
            </motion.div>
          )}

          <div className="p-6">
            {/* ========== Step 1: Warning ========== */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                {/* Warning box */}
                <div className="bg-red-50 dark:bg-red-500/10 border-2 border-red-200 dark:border-red-500/20 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-black text-red-700 dark:text-red-400 mb-2">
                        تحذير: هذا الإجراء لا يمكن التراجع عنه!
                      </h3>
                      <p className="text-sm text-red-600 dark:text-red-300 leading-relaxed">
                        عند حذف حسابك، سيتم إزالة جميع البيانات التالية نهائياً:
                      </p>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2 text-sm text-red-700 dark:text-red-300">
                    {[
                      "جميع تعليقاتك على المشاريع والمقالات",
                      "جميع إعجاباتك",
                      "جميع استفساراتك ورسائلك",
                      "معلومات حسابك الشخصية",
                      "سجل نشاطك بالكامل",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-sm text-slate-600 dark:text-slate-400 text-center">
                  هل أنت متأكد من رغبتك في المتابعة؟
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl font-bold border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 rounded-xl font-bold bg-red-500 hover:bg-red-600 text-white transition inline-flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    متابعة الحذف
                  </button>
                </div>
              </motion.div>
            )}

            {/* ========== Step 2: Confirm ========== */}
            {step === 2 && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleDelete}
                className="space-y-5"
              >
                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 border-2 border-red-200 dark:border-red-500/20 rounded-xl p-3 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Password */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    كلمة المرور الحالية
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={saving}
                      placeholder="••••••••"
                      dir="ltr"
                      className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition text-slate-900 dark:text-white text-left disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Confirm Text */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    اكتب كلمة{" "}
                    <span className="text-red-500 font-black">
                      "{CONFIRM_WORD}"
                    </span>{" "}
                    للتأكيد
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    disabled={saving}
                    placeholder={CONFIRM_WORD}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition text-slate-900 dark:text-white disabled:opacity-50"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={saving}
                    className="flex-1 py-3 rounded-xl font-bold border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition disabled:opacity-50"
                  >
                    رجوع
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 rounded-xl font-bold bg-red-500 hover:bg-red-600 text-white transition disabled:opacity-50 inline-flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        جاري الحذف...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        حذف نهائي
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}