import type { Metadata } from "next";
import {
  Globe,
  Smartphone,
  Monitor,
  Palette,
  Database,
  Code2,
  Shield,
  Zap,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  Layers,
} from "lucide-react";
import Link from "next/link";
import Services from "@/components/home/Services";
import CTA from "@/components/home/CTA";

export const metadata: Metadata = {
  title: "خدماتنا",
  description:
    "نقدم مجموعة شاملة من الخدمات التقنية الاحترافية: تطوير المواقع، التطبيقات، الأنظمة، التصميم، والأمن السيبراني.",
};

// ==========================================
// 🎯 الخدمات الرئيسية
// ==========================================
const mainServices = [
  {
    icon: Globe,
    title: "تطوير المواقع",
    desc: "مواقع احترافية سريعة ومتجاوبة بأحدث التقنيات",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Smartphone,
    title: "تطبيقات الجوال",
    desc: "تطبيقات Android و iOS بأداء عالٍ",
    color: "from-green-500 to-teal-500",
  },
  {
    icon: Monitor,
    title: "أنظمة ERP",
    desc: "أنظمة متكاملة: مخازن، HR، مبيعات، مطاعم",
    color: "from-purple-500 to-indigo-500",
  },
  {
    icon: Palette,
    title: "تصميم UI/UX",
    desc: "واجهات عصرية تركز على تجربة المستخدم",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Database,
    title: "قواعد البيانات",
    desc: "تصميم وإدارة قواعد بيانات عالية الأداء",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "الأمن السيبراني",
    desc: "حماية شاملة واختبارات اختراق دورية",
    color: "from-red-500 to-pink-500",
  },
];

// ==========================================
// 📊 المراحل
// ==========================================
const processSteps = [
  { num: "01", title: "الاستكشاف", desc: "نفهم احتياجك بدقة" },
  { num: "02", title: "التصميم", desc: "نصمم واجهات احترافية" },
  { num: "03", title: "التطوير", desc: "نبني بأحدث التقنيات" },
  { num: "04", title: "الاختبار", desc: "اختبارات شاملة" },
  { num: "05", title: "الإطلاق", desc: "نشر ودعم مستمر" },
];

// ==========================================
// ✨ المميزات
// ==========================================
const benefits = [
  {
    icon: Code2,
    title: "كود نظيف",
    desc: "نكتب كوداً منظماً وقابلاً للتطوير",
  },
  {
    icon: Zap,
    title: "أداء عالٍ",
    desc: "مواقع وتطبيقات سريعة جداً",
  },
  {
    icon: Shield,
    title: "أمان تام",
    desc: "حماية متقدمة لبياناتك",
  },
  {
    icon: Layers,
    title: "قابل للتوسع",
    desc: "ينمو مع نمو أعمالك",
  },
  {
    icon: CheckCircle2,
    title: "دعم فني",
    desc: "دعم مستمر بعد التسليم",
  },
  {
    icon: Sparkles,
    title: "جودة عالية",
    desc: "معايير عالمية في كل مشروع",
  },
];

// ==========================================
// 🏠 الصفحة
// ==========================================
export default function ServicesPage() {
  return (
    <div className="bg-slate-50 dark:bg-[#0a0a0f] transition-colors duration-300">
      {/* ============================================ */}
      {/* Hero */}
      {/* ============================================ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-400/30 dark:bg-blue-500/20 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-400/30 dark:bg-purple-500/20 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 py-24 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-blue-200/50 dark:border-white/10 px-5 py-2.5 rounded-full mb-6 shadow-lg">
            <Sparkles className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
            <span className="text-sm font-bold text-blue-700 dark:text-blue-100">
              خدماتنا المتميزة
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="text-slate-900 dark:text-white">حلول تقنية </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 dark:from-blue-400 dark:via-cyan-400 dark:to-purple-400">
              متكاملة
            </span>
          </h1>

          <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            نقدم مجموعة شاملة من الخدمات التقنية الاحترافية لتلبية جميع احتياجاتك
          </p>
        </div>
      </section>

      {/* ============================================ */}
      {/* الخدمات */}
      {/* ============================================ */}
      <section className="py-24 bg-white dark:bg-[#0a0a0f] transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-sm text-blue-600 dark:text-blue-400 uppercase tracking-widest font-mono font-bold">
              Our Services
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mt-4 mb-6">
              ما نقدمه لك
            </h2>
            <div className="h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {mainServices.map((service, i) => {
              const Icon = service.icon;
              return (
                <div
                  key={i}
                  className="group bg-white dark:bg-[#12121a] rounded-3xl p-8 border border-slate-200 dark:border-white/10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* عملية العمل */}
      {/* ============================================ */}
      <section className="py-24 bg-slate-50 dark:bg-[#0d0d14] transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-sm text-purple-600 dark:text-purple-400 uppercase tracking-widest font-mono font-bold">
              Our Process
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mt-4 mb-6">
              كيف نعمل؟
            </h2>
            <div className="h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 max-w-5xl mx-auto">
            {processSteps.map((step, i) => (
              <div key={i} className="relative text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <span className="text-xl font-black text-white">{step.num}</span>
                </div>
                <h3 className="font-black text-slate-900 dark:text-white mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {step.desc}
                </p>

                {i < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/30 to-purple-500/30 -z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* المميزات */}
      {/* ============================================ */}
      <section className="py-24 bg-white dark:bg-[#0a0a0f] transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-sm text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-mono font-bold">
              Why Us
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mt-4 mb-6">
              لماذا خدماتنا؟
            </h2>
            <div className="h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={i}
                  className="bg-gradient-to-br from-slate-50 to-white dark:from-[#12121a] dark:to-[#0a0a0f] rounded-2xl p-6 border border-slate-200 dark:border-white/10 hover:border-emerald-300 dark:hover:border-emerald-500/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {benefit.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Component (الأصلي) */}
      <Services />

      {/* CTA */}
      <CTA />
    </div>
  );
}