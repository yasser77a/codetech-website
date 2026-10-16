import { Suspense } from "react";
import Image from "next/image";
import VerifyOtpForm from "@/components/auth/VerifyOtpForm";
import { Loader2 } from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "التحقق من البريد",
  description: "أدخل رمز التحقق لتفعيل حسابك",
};

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 p-4 relative overflow-hidden" dir="rtl">
      {/* خلفية */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* دوائر */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/20 rounded-full blur-[120px]" />

      {/* المحتوى */}
      <div className="relative z-10 w-full max-w-md my-8">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* الشعار */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <Image
                src="/logo.png"
                alt="Code Tech"
                fill
                sizes="80px"
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              🔐 التحقق من الحساب
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              أدخل الرمز الذي أرسلناه إلى بريدك
            </p>
          </div>

          {/* النموذج */}
          <Suspense
            fallback={
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              </div>
            }
          >
            <VerifyOtpForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}