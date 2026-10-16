"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
  Copy,
  Sparkles,
} from "lucide-react";

export default function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const displayCode = searchParams.get("code") || "";
  const isDisplay = searchParams.get("display") === "true";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [displayedCode, setDisplayedCode] = useState(displayCode);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // عدّاد تنازلي لإعادة الإرسال
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleCopyCode = async () => {
    if (!displayedCode) return;
    try {
      await navigator.clipboard.writeText(displayedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code || code.length !== 6) {
      setError("أدخل الرمز المكون من 6 أرقام");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/visitor/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "فشل التحقق");
        setLoading(false);
        return;
      }

      setSuccess(true);

      // توجيه إلى الحساب بعد 2 ثانية
      setTimeout(() => {
        router.push("/account");
        router.refresh();
      }, 2000);
    } catch {
      setError("تعذر الاتصال بالخادم");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending || countdown > 0) return;

    setResending(true);
    setError("");

    try {
      const res = await fetch("/api/visitor/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "فشل إعادة الإرسال");
        setResending(false);
        return;
      }

      if (data.displayedCode) {
        setDisplayedCode(data.displayedCode);
      }

      setCountdown(60);
      setResending(false);
    } catch {
      setError("تعذر الاتصال بالخادم");
      setResending(false);
    }
  };

  // ==========================================
  // حالة النجاح
  // ==========================================
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-500/30">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
          تم تفعيل حسابك! 🎉
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          جاري توجيهك إلى حسابك...
        </p>
        <Loader2 className="w-6 h-6 text-green-500 animate-spin mx-auto" />
      </motion.div>
    );
  }

  // ==========================================
  // حالة العرض
  // ==========================================
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Badge display mode */}
      {isDisplay && displayedCode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-500/10 dark:to-orange-500/10 border-2 border-yellow-200 dark:border-yellow-500/30 rounded-2xl p-5 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-yellow-700 dark:text-yellow-400 mb-3">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-bold">وضع العرض — Development Mode</span>
          </div>
          <p className="text-xs text-yellow-600 dark:text-yellow-300 mb-3">
            (لن يُرسل بريد — الرمز معروض هنا للاختبار)
          </p>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border-2 border-dashed border-yellow-300 dark:border-yellow-500/30">
            <div className="text-3xl font-black tracking-[8px] text-yellow-700 dark:text-yellow-400 font-mono mb-2">
              {displayedCode}
            </div>
            <button
              type="button"
              onClick={handleCopyCode}
              className="text-xs font-bold text-yellow-700 dark:text-yellow-400 hover:underline flex items-center gap-1 mx-auto"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  تم النسخ!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  نسخ الرمز
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* البريد */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
        <Mail className="w-5 h-5 text-indigo-500 flex-shrink-0" />
        <div className="min-w-0">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            تم الإرسال إلى
          </div>
          <div className="font-bold text-slate-900 dark:text-white truncate text-sm" dir="ltr">
            {email}
          </div>
        </div>
      </div>

      {/* إدخال الرمز */}
      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 text-center">
          أدخل رمز التحقق المكوّن من 6 أرقام
        </label>
        <input
          suppressHydrationWarning
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            setCode(val);
            setError("");
          }}
          placeholder="000000"
          dir="ltr"
          className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-5 text-center text-3xl font-black tracking-[12px] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition font-mono"
          autoFocus
        />
      </div>

      {/* Server Error */}
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

      {/* زر التحقق */}
      <button
        suppressHydrationWarning
        type="submit"
        disabled={loading || code.length !== 6}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            جاري التحقق...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5" />
            تأكيد الحساب
          </>
        )}
      </button>

      {/* إعادة الإرسال */}
      <div className="text-center text-sm">
        <span className="text-slate-600 dark:text-slate-400">لم يصلك الرمز؟ </span>
        <button
          type="button"
          onClick={handleResend}
          disabled={resending || countdown > 0}
          className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold disabled:opacity-50 inline-flex items-center gap-1"
        >
          {resending ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              جاري الإرسال...
            </>
          ) : countdown > 0 ? (
            <>
              <RefreshCw className="w-3 h-3" />
              إعادة الإرسال بعد {countdown}s
            </>
          ) : (
            <>
              <RefreshCw className="w-3 h-3" />
              إعادة الإرسال
            </>
          )}
        </button>
      </div>

      {/* رابط التسجيل */}
      <div className="text-center text-xs">
        <button
          type="button"
          onClick={() => router.push("/register")}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 mx-auto"
        >
          <ArrowLeft className="w-3 h-3" />
          العودة للتسجيل
        </button>
      </div>
    </form>
  );
}