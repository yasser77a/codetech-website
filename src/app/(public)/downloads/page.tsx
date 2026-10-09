import type { Metadata } from "next";
import {
  Download,
  FileText,
  Package,
  Shield,
  Zap,
  MessageCircle,
  Sparkles,
  Code2,
  Palette,
  BookOpen,
  Layers,
  Star,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import CTA from "@/components/home/CTA";

export const metadata: Metadata = {
  title: "مكتبة التحميلات",
  description:
    "مكتبة شاملة من البرامج والأدوات والموارد التقنية المجانية من Code Tech.",
};

// ==========================================
// 🎯 الأقسام
// ==========================================
const categories = [
  {
    icon: Code2,
    title: "برامج وأدوات",
    desc: "أدوات تطوير وبرامج مكتبية",
    color: "from-blue-500 to-cyan-500",
    count: "قريباً",
  },
  {
    icon: Palette,
    title: "قوالب تصميم",
    desc: "قوالب UI/UX جاهزة للاستخدام",
    color: "from-pink-500 to-rose-500",
    count: "قريباً",
  },
  {
    icon: BookOpen,
    title: "مصادر تعليمية",
    desc: "كتب ودورات ومقالات تقنية",
    color: "from-green-500 to-emerald-500",
    count: "قريباً",
  },
  {
    icon: Layers,
    title: "مكتبات برمجية",
    desc: "مكتبات أكواد جاهزة للمشاريع",
    color: "from-purple-500 to-indigo-500",
    count: "قريباً",
  },
];

// ==========================================
// ✨ المميزات
// ==========================================
const features = [
  {
    icon: Package,
    title: "محتوى متنوع",
    desc: "برامج وقوالب ومصادر لكل احتياجاتك",
  },
  {
    icon: Shield,
    title: "آمنة ومضمونة",
    desc: "كل الملفات مفحوصة وخالية من الفيروسات",
  },
  {
    icon: Zap,
    title: "روابط سريعة",
    desc: "تحميل مباشر بدون إعلانات مزعجة",
  },
  {
    icon: CheckCircle2,
    title: "مجانية بالكامل",
    desc: "جميع التحميلات مجانية 100%",
  },
];

// ==========================================
// 🏠 الصفحة
// ==========================================
export default function DownloadsPage() {
  return (
    <div className="bg-slate-50 dark:bg-[#0a0a0f] transition-colors duration-300">
      {/* ============================================ */}
      {/* Hero */}
      {/* ============================================ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-slate-900 dark:via-cyan-950 dark:to-slate-900">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-400/30 dark:bg-cyan-500/20 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-400/30 dark:bg-blue-500/20 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 py-24 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-cyan-200/50 dark:border-white/10 px-5 py-2.5 rounded-full mb-6 shadow-lg">
            <Sparkles className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            <span className="text-sm font-bold text-cyan-700 dark:text-cyan-100">
              مكتبة Code Tech
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="text-slate-900 dark:text-white">مكتبة شاملة </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400">
              للبرامج والأدوات
            </span>
          </h1>

          <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            كل ما تحتاجه من برامج وأدوات وموارد تقنية في مكان واحد
          </p>
        </div>
      </section>

      {/* ============================================ */}
      {/* قريباً */}
      {/* ============================================ */}
      <section className="py-24 bg-white dark:bg-[#0a0a0f] transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Main Card */}
          <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-500/10 dark:via-cyan-500/5 dark:to-teal-500/10 rounded-3xl p-10 md:p-16 text-center border-2 border-cyan-100 dark:border-cyan-500/20 shadow-xl">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl">
              <Download className="w-12 h-12 text-white" />
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
              قريباً...
            </h2>

            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-2xl mx-auto">
              نعمل حالياً على تجهيز مكتبة شاملة من البرامج والأدوات والموارد
              التقنية. تابعنا قريباً للحصول على كل ما تحتاجه — مجاناً وبأمان تام.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/967775566442"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-xl shadow-green-500/30"
              >
                <MessageCircle className="w-5 h-5" />
                اطلب برنامجاً معيناً
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-900 dark:text-white px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 border-2 border-slate-200 dark:border-white/10"
              >
                <MessageCircle className="w-5 h-5" />
                تواصل معنا
              </Link>
            </div>
          </div>

          {/* الأقسام */}
          <div className="mt-12">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-8">
              الأقسام القادمة
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {categories.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={i}
                    className="group bg-white dark:bg-[#12121a] rounded-2xl p-6 border border-slate-200 dark:border-white/10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-lg font-black text-slate-900 dark:text-white">
                            {cat.title}
                          </h4>
                          <span className="text-xs bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full font-bold">
                            {cat.count}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {cat.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* المميزات */}
          <div className="mt-12">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-8">
              لماذا مكتبتنا؟
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={i}
                    className="bg-white dark:bg-[#12121a] rounded-2xl p-5 text-center border border-slate-200 dark:border-white/10 hover:border-cyan-300 dark:hover:border-cyan-500/30 transition-all"
                  >
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <h4 className="font-black text-slate-900 dark:text-white text-sm mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {feature.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTA />
    </div>
  );
}