"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  UserPlus,
  CheckCircle2,
} from "lucide-react";

export default function VisitorRegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: "" });
    setServerError("");
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.fullName.trim() || form.fullName.trim().length < 3) {
      newErrors.fullName = "الاسم يجب أن يكون 3 أحرف على الأقل";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim() || !emailRegex.test(form.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    const phoneClean = form.phone.replace(/[^\d+]/g, "");
    if (!phoneClean || phoneClean.length < 8) {
      newErrors.phone = "رقم الجوال غير صحيح";
    }

    if (!form.password || form.password.length < 8) {
      newErrors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "كلمتا المرور غير متطابقتين";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/visitor/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "فشل التسجيل");
        setLoading(false);
        return;
      }

      // ✅ نجح التسجيل
      // إذا كان الوضع display → الرمز موجود في data.displayedCode
      const params = new URLSearchParams({
        email: data.email,
      });

      if (data.emailMode === "display" && data.displayedCode) {
        params.set("code", data.displayedCode);
        params.set("display", "true");
      }

      router.push(`/verify-otp?${params.toString()}`);
    } catch {
      setServerError("تعذر الاتصال بالخادم");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* الاسم */}
      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
          الاسم الكامل <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            suppressHydrationWarning
            type="text"
            value={form.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="أدخل اسمك الكامل"
            className={`w-full bg-slate-50 dark:bg-slate-900 border-2 rounded-xl pr-10 pl-4 py-3 text-slate-900 dark:text-white focus:outline-none transition ${
              errors.fullName
                ? "border-red-300 dark:border-red-500/50"
                : "border-slate-200 dark:border-slate-700 focus:border-indigo-500"
            }`}
          />
        </div>
        {errors.fullName && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.fullName}
          </p>
        )}
      </div>

      {/* البريد */}
      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
          البريد الإلكتروني <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            suppressHydrationWarning
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="you@example.com"
            dir="ltr"
            className={`w-full bg-slate-50 dark:bg-slate-900 border-2 rounded-xl pr-10 pl-4 py-3 text-slate-900 dark:text-white focus:outline-none transition ${
              errors.email
                ? "border-red-300 dark:border-red-500/50"
                : "border-slate-200 dark:border-slate-700 focus:border-indigo-500"
            }`}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.email}
          </p>
        )}
      </div>

      {/* الجوال */}
      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
          رقم الجوال <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            suppressHydrationWarning
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+967 7XX XXX XXX"
            dir="ltr"
            className={`w-full bg-slate-50 dark:bg-slate-900 border-2 rounded-xl pr-10 pl-4 py-3 text-slate-900 dark:text-white focus:outline-none transition ${
              errors.phone
                ? "border-red-300 dark:border-red-500/50"
                : "border-slate-200 dark:border-slate-700 focus:border-indigo-500"
            }`}
          />
        </div>
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.phone}
          </p>
        )}
      </div>

      {/* كلمة المرور */}
      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
          كلمة المرور <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            suppressHydrationWarning
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="8 أحرف على الأقل"
            dir="ltr"
            className={`w-full bg-slate-50 dark:bg-slate-900 border-2 rounded-xl pr-10 pl-11 py-3 text-slate-900 dark:text-white focus:outline-none transition ${
              errors.password
                ? "border-red-300 dark:border-red-500/50"
                : "border-slate-200 dark:border-slate-700 focus:border-indigo-500"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.password}
          </p>
        )}
      </div>

      {/* تأكيد كلمة المرور */}
      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
          تأكيد كلمة المرور <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            suppressHydrationWarning
            type={showConfirm ? "text" : "password"}
            value={form.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            placeholder="أعد كتابة كلمة المرور"
            dir="ltr"
            className={`w-full bg-slate-50 dark:bg-slate-900 border-2 rounded-xl pr-10 pl-11 py-3 text-slate-900 dark:text-white focus:outline-none transition ${
              errors.confirmPassword
                ? "border-red-300 dark:border-red-500/50"
                : "border-slate-200 dark:border-slate-700 focus:border-indigo-500"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            {showConfirm ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* ملاحظة */}
      <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-xl p-3 text-xs text-indigo-700 dark:text-indigo-300 flex items-start gap-2">
        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>
          سيتم إرسال رمز تحقق إلى بريدك الإلكتروني لتأكيد حسابك.
        </span>
      </div>

      {/* Server Error */}
      {serverError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-500/10 border-2 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-2 text-sm"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {serverError}
        </motion.div>
      )}

      {/* زر التسجيل */}
      <button
        suppressHydrationWarning
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            جاري إنشاء الحساب...
          </>
        ) : (
          <>
            <UserPlus className="w-5 h-5" />
            إنشاء الحساب
          </>
        )}
      </button>
    </form>
  );
}