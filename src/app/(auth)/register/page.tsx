import Link from "next/link";
import Image from "next/image";
import VisitorRegisterForm from "@/components/auth/VisitorRegisterForm";
import { Sparkles, ArrowLeft } from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إنشاء حساب جديد",
  description: "سجل حساباً جديداً في Code Tech",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 p-4 relative overflow-hidden" dir="rtl">
      {/* خلفية شبكية */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* دوائر ضوئية */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/20 rounded-full blur-[120px]" />

      {/* المحتوى */}
      <div className="relative z-10 w-full max-w-md my-8">
        {/* زر العودة */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-sm transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>العودة للموقع</span>
        </Link>

        {/* البطاقة */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* الشعار */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <Image
                src="/logo.png"
                alt="Code Tech"
                fill
                sizes="80px"
                priority
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              إنشاء حساب
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              انضم إلى Code Tech واستفد من خدماتنا
            </p>
          </div>

          {/* النموذج */}
          <VisitorRegisterForm />

          {/* رابط الدخول */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              لديك حساب بالفعل؟{" "}
              <Link
                href="/visitor-login"
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
              >
                سجّل الدخول
              </Link>
            </p>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="mt-6 text-center text-slate-500 dark:text-slate-400 text-xs">
          © 2026 Code Tech — جميع الحقوق محفوظة
        </div>
      </div>
    </div>
  );
}