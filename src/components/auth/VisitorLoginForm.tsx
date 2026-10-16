"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  LogIn,
} from "lucide-react";

export default function VisitorLoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNeedsVerification(false);
    setLoading(true);

    try {
      const res = await fetch("/api/visitor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "فشل تسجيل الدخول");
        if (data.needsVerification) {
          setNeedsVerification(true);
        }
        setLoading(false);
        return;
      }

      router.push("/account");
      router.refresh();
    } catch {
      setError("تعذر الاتصال بالخادم");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* البريد */}
      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
          البريد الإلكتروني
        </label>
        <div className="relative">
          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            suppressHydrationWarning
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            dir="ltr"
            required
            className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl pr-10 pl-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* كلمة المرور */}
      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
          كلمة المرور
        </label>
        <div className="relative">
          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            suppressHydrationWarning
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
            dir="ltr"
            required
            className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl pr-10 pl-11 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition"
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
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-500/10 border-2 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-2 text-sm"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </motion.div>
      )}

      {/* Needs Verification */}
      {needsVerification && (
        <a
          href={`/verify-otp?email=${encodeURIComponent(form.email)}`}
          className="block bg-yellow-50 dark:bg-yellow-500/10 border-2 border-yellow-200 dark:border-yellow-500/20 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded-xl text-sm text-center font-bold hover:bg-yellow-100 dark:hover:bg-yellow-500/20 transition"
        >
          ✉️ اضغط هنا للتحقق من بريدك
        </a>
      )}

      {/* زر الدخول */}
      <button
        suppressHydrationWarning
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            جاري الدخول...
          </>
        ) : (
          <>
            <LogIn className="w-5 h-5" />
            تسجيل الدخول
          </>
        )}
      </button>
    </form>
  );
}