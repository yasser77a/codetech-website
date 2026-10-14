"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Key,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lock,
} from "lucide-react";

interface Props {
  onClose: () => void;
}

export default function ChangePasswordModal({ onClose }: Props) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // ==========================================
  // Password strength
  // ==========================================
  const getStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(form.newPassword);
  const strengthInfo = [
    { label: "ضعيفة جداً", color: "bg-red-500", width: "20%" },
    { label: "ضعيفة", color: "bg-orange-500", width: "40%" },
    { label: "متوسطة", color: "bg-yellow-500", width: "60%" },
    { label: "قوية", color: "bg-lime-500", width: "80%" },
    { label: "قوية جداً", color: "bg-green-500", width: "100%" },
  ][Math.max(0, Math.min(4, strength - 1))];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.currentPassword) {
      setError("أدخل كلمة المرور الحالية");
      return;
    }

    if (form.newPassword.length < 8) {
      setError("كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    if (form.currentPassword === form.newPassword) {
      setError("كلمة المرور الجديدة يجب أن تختلف عن الحالية");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/visitor/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل تغيير كلمة المرور");
      }

      setSuccess(true);
      setTimeout(() => onClose(), 1500);
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
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden"
          dir="rtl"
        >
          {/* Header */}
          <div className="border-b border-slate-100 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-500" />
              تغيير كلمة المرور
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
              className="absolute inset-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-3"
            >
              <CheckCircle2 className="w-16 h-16 text-green-500" />
              <p className="font-black text-slate-900 dark:text-white">
                تم تغيير كلمة المرور بنجاح
              </p>
              <p className="text-xs text-slate-400">
                سيتم إغلاق النافذة تلقائياً...
              </p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 border-2 border-red-200 dark:border-red-500/20 rounded-xl p-3 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Current Password */}
            <PasswordField
              label="كلمة المرور الحالية"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              show={show.current}
              toggleShow={() => setShow({ ...show, current: !show.current })}
              placeholder="••••••••"
              disabled={saving}
            />

            {/* New Password */}
            <div>
              <PasswordField
                label="كلمة المرور الجديدة"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                show={show.new}
                toggleShow={() => setShow({ ...show, new: !show.new })}
                placeholder="8 أحرف على الأقل"
                disabled={saving}
              />

              {/* Strength Bar */}
              {form.newPassword && (
                <div className="mt-2">
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: strengthInfo.width }}
                      className={`h-full ${strengthInfo.color} transition-all`}
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    القوة:{" "}
                    <span className="font-bold">{strengthInfo.label}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <PasswordField
              label="تأكيد كلمة المرور"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              show={show.confirm}
              toggleShow={() => setShow({ ...show, confirm: !show.confirm })}
              placeholder="أعد إدخال كلمة المرور"
              match={
                form.confirmPassword
                  ? form.newPassword === form.confirmPassword
                  : null
              }
              disabled={saving}
            />

            {/* Requirements */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 space-y-1.5">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                متطلبات كلمة المرور:
              </p>
              {[
                {
                  check: form.newPassword.length >= 8,
                  label: "8 أحرف على الأقل",
                },
                {
                  check: /[A-Z]/.test(form.newPassword),
                  label: "حرف كبير (A-Z)",
                },
                {
                  check: /[0-9]/.test(form.newPassword),
                  label: "رقم (0-9)",
                },
              ].map((req, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 text-xs ${
                    req.check
                      ? "text-green-600 dark:text-green-400"
                      : "text-slate-400"
                  }`}
                >
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      req.check ? "opacity-100" : "opacity-30"
                    }`}
                  />
                  <span>{req.label}</span>
                </div>
              ))}
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
                disabled={saving}
                className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90 transition disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    جاري التغيير...
                  </>
                ) : (
                  "تغيير كلمة المرور"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ==========================================
// Password Field Component
// ==========================================
function PasswordField({
  label,
  name,
  value,
  onChange,
  show,
  toggleShow,
  placeholder,
  match,
  disabled,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  show: boolean;
  toggleShow: () => void;
  placeholder?: string;
  match?: boolean | null;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          dir="ltr"
          className={`w-full pr-10 pl-10 py-3 bg-slate-50 dark:bg-slate-900 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition text-slate-900 dark:text-white text-left disabled:opacity-50 ${
            match === true
              ? "border-green-500 focus:border-green-500"
              : match === false
              ? "border-red-500 focus:border-red-500"
              : "border-slate-200 dark:border-slate-700 focus:border-indigo-500"
          }`}
        />
        <button
          type="button"
          onClick={toggleShow}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}