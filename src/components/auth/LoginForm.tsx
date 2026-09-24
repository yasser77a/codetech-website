"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User, Eye, EyeOff, Loader2, LogIn } from "lucide-react";

export default function LoginForm({ defaultPassword }: { defaultPassword?: string }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "حدث خطأ");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("تعذر الاتصال بالخادم");
      setLoading(false);
    }
  };

  const fillDefault = () => {
    setUsername("yasser alashram");
    setPassword(defaultPassword || "CodeTech@2026");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      
      {/* اسم المستخدم */}
      <div>
        <label className="block text-sm font-bold text-blue-100 mb-2">
          اسم المستخدم
        </label>
        <div className="relative">
          <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="yasser alashram"
            className="w-full bg-white/5 border border-white/10 rounded-xl pr-11 pl-4 py-3 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition"
            required
            dir="ltr"
          />
        </div>
      </div>

      {/* كلمة المرور */}
      <div>
        <label className="block text-sm font-bold text-blue-100 mb-2">
          كلمة المرور
        </label>
        <div className="relative">
          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-white/5 border border-white/10 rounded-xl pr-11 pl-11 py-3 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition"
            required
            dir="ltr"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* الخطأ */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-sm text-center"
        >
          ⚠️ {error}
        </motion.div>
      )}

      {/* الأزرار */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>جاري التحقق...</span>
          </>
        ) : (
          <>
            <LogIn className="w-5 h-5" />
            <span>تسجيل الدخول</span>
          </>
        )}
      </button>

      {/* زر التعبئة السريعة */}
      <button
        type="button"
        onClick={fillDefault}
        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-blue-200 py-2.5 rounded-xl text-sm transition"
      >
        🚀 تعبئة بيانات الدخول الافتراضية
      </button>
    </form>
  );
}