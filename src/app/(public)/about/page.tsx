import Link from "next/link";
import type { Metadata } from "next";
import {
  Users,
  Target,
  Rocket,
  Heart,
  Award,
  Lightbulb,
  Shield,
  MessageCircle,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Building2,
  Code2,
  Globe,
  Layers,
} from "lucide-react";
import CTA from "@/components/home/CTA";

export const metadata: Metadata = {
  title: "من نحن",
  description:
    "تعرف على قصة Code Tech، رؤيتنا، رسالتنا، وقيمنا في عالم تطوير البرمجيات في اليمن.",
};

// ==========================================
// 📊 القيم
// ==========================================
const values = [
  {
    icon: Award,
    title: "الجودة",
    desc: "لا نساوم على الجودة أبداً — كل سطر كود مكتوب بعناية",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Shield,
    title: "الشفافية",
    desc: "نتعامل بوضوح وصراحة كاملة مع عملائنا في كل مرحلة",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: CheckCircle2,
    title: "الالتزام",
    desc: "نسلّم مشاريعنا في الموعد المحدد مهما كانت التحديات",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Lightbulb,
    title: "الابتكار",
    desc: "نواكب أحدث التقنيات العالمية ونطبقها في مشاريعنا",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Heart,
    title: "الدعم",
    desc: "نقف بجانب عملائنا بعد التسليم — شراكة طويلة الأمد",
    color: "from-red-500 to-pink-500",
  },
  {
    icon: Users,
    title: "الفريق",
    desc: "فريق متكامل من المطورين والمصممين والمتخصصين",
    color: "from-indigo-500 to-purple-500",
  },
];

// ==========================================
// 📈 الإحصائيات
// ==========================================
const stats = [
  { value: "+100", label: "مشروع منجز", icon: Rocket },
  { value: "+200", label: "عميل سعيد", icon: Users },
  { value: "4.5/5", label: "تقييم العملاء", icon: Award },
  { value: "5+", label: "سنوات خبرة", icon: Sparkles },
];

// ==========================================
// 🗺️ الرحلة
// ==========================================
const journey = [
  {
    year: "2019",
    title: "البداية",
    desc: "انطلقنا من صنعاء برؤية واضحة: تقديم حلول برمجية احترافية بمعايير عالمية",
    color: "#3B82F6",
  },
  {
    year: "2021",
    title: "التوسع",
    desc: "وسّعنا خدماتنا لتشمل أنظمة ERP المتكاملة وتطبيقات الجوال",
    color: "#8B5CF6",
  },
  {
    year: "2023",
    title: "الاحتراف",
    desc: "اعتمدنا أحدث التقنيات العالمية وأصبحنا شريكاً موثوقاً لأكثر من 100 عميل",
    color: "#10B981",
  },
  {
    year: "2026",
    title: "الريادة",
    desc: "نستهدف أن نكون الشركة الرائدة في تطوير البرمجيات في اليمن والمنطقة",
    color: "#F59E0B",
  },
];

// ==========================================
// 🏢 المميزات
// ==========================================
const features = [
  {
    icon: Code2,
    title: "تقنيات حديثة",
    desc: "Next.js، React، Node.js، PostgreSQL — نستخدم أفضل ما في السوق",
  },
  {
    icon: Globe,
    title: "حلول متكاملة",
    desc: "من الفكرة إلى الإطلاق — خدمات شاملة تحت سقف واحد",
  },
  {
    icon: Layers,
    title: "أنظمة قابلة للتوسع",
    desc: "نبني حلولاً تنمو مع نمو أعمالك وتتحمل الضغط",
  },
  {
    icon: Building2,
    title: "خبرة محلية",
    desc: "نفهم السوق اليمني ونقدم حلولاً تناسبه",
  },
];

// ==========================================
// 🏠 الصفحة
// ==========================================
export default function AboutPage() {
  return (
    <div className="bg-slate-50 dark:bg-[#0a0a0f] transition-colors duration-300">
      {/* ============================================ */}
      {/* Hero */}
      {/* ============================================ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900">
        {/* Orbs */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-400/30 dark:bg-blue-500/20 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-400/30 dark:bg-purple-500/20 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 py-24 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-blue-200/50 dark:border-white/10 px-5 py-2.5 rounded-full mb-6 shadow-lg">
            <Sparkles className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
            <span className="text-sm font-bold text-blue-700 dark:text-blue-100">
              تعرّف على Code Tech
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="text-slate-900 dark:text-white">من </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 dark:from-blue-400 dark:via-cyan-400 dark:to-purple-400">
              نحن؟
            </span>
          </h1>

          <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-12">
            فريق برمجي يمني متخصص، نصنع أنظمة رقمية تُحدث فرقاً حقيقياً في أعمال عملائنا.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-blue-100 dark:border-white/10 rounded-2xl p-5 shadow-lg dark:shadow-none hover:bg-white dark:hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <Icon className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                  <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* القصة */}
      {/* ============================================ */}
      <section className="py-24 bg-white dark:bg-[#0a0a0f] transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <span className="text-sm text-blue-600 dark:text-blue-400 uppercase tracking-widest font-mono font-bold">
              Our Story
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mt-4 mb-6">
              قصتنا
            </h2>
            <div className="h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
          </div>

          <div className="space-y-6 text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>
              <strong className="text-slate-900 dark:text-white">Code Tech</strong> هي شركة برمجية
              يمنية متخصصة في بناء وتطوير الأنظمة والتطبيقات ومواقع الويب. انطلقنا
              من صنعاء برؤية واضحة: تقديم حلول برمجية احترافية بمعايير عالمية
              وبأسعار مناسبة.
            </p>
            <p>
              نعمل مع عملائنا كشركاء — نستمع لأفكارهم، نحلّل احتياجاتهم، ونصمم حلولاً
              مبتكرة تتجاوز توقعاتهم. من المواقع البسيطة إلى أنظمة ERP المتكاملة،
              نلتزم بأعلى معايير الجودة والأداء.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* الرحلة */}
      {/* ============================================ */}
      <section className="py-24 bg-slate-50 dark:bg-[#0d0d14] transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-sm text-purple-600 dark:text-purple-400 uppercase tracking-widest font-mono font-bold">
              Our Journey
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mt-4 mb-6">
              رحلتنا
            </h2>
            <div className="h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
          </div>

          <div className="max-w-4xl mx-auto relative">
            {/* Vertical line */}
            <div className="absolute top-0 bottom-0 right-8 md:right-1/2 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-30 md:translate-x-1/2" />

            <div className="space-y-12">
              {journey.map((item, i) => (
                <div
                  key={i}
                  className={`relative flex items-center gap-6 md:gap-8 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute right-8 md:right-1/2 w-4 h-4 rounded-full border-4 border-white dark:border-[#0d0d14] md:translate-x-1/2 z-10"
                    style={{
                      background: item.color,
                      boxShadow: `0 0 0 4px ${item.color}30, 0 0 20px ${item.color}60`,
                    }}
                  />

                  {/* Spacer for mobile */}
                  <div className="w-16 md:hidden" />

                  {/* Content */}
                  <div className="flex-1 md:w-1/2">
                    <div
                      className="bg-white dark:bg-[#12121a] rounded-2xl p-6 shadow-lg dark:shadow-none border-2 border-slate-100 dark:border-white/10 transition-all hover:shadow-xl hover:-translate-y-1"
                      style={{ borderColor: `${item.color}30` }}
                    >
                      <div
                        className="inline-block px-3 py-1 rounded-full text-xs font-black mb-3"
                        style={{
                          background: `${item.color}15`,
                          color: item.color,
                        }}
                      >
                        {item.year}
                      </div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Spacer for desktop */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* الرؤية والرسالة */}
      {/* ============================================ */}
      <section className="py-24 bg-white dark:bg-[#0a0a0f] transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* الرؤية */}
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/5 rounded-3xl p-8 border-2 border-blue-100 dark:border-blue-500/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
                رؤيتنا
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                أن نكون الشركة الرائدة في مجال تطوير البرمجيات في اليمن والمنطقة
                العربية، وأن نساهم في التحول الرقمي للمؤسسات والشركات.
              </p>
            </div>

            {/* الرسالة */}
            <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/5 rounded-3xl p-8 border-2 border-purple-100 dark:border-purple-500/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
                رسالتنا
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                تقديم حلول برمجية مبتكرة وعالية الجودة تلبي احتياجات عملائنا، مع
                الالتزام بالمعايير الأخلاقية والمهنية.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* القيم */}
      {/* ============================================ */}
      <section className="py-24 bg-slate-50 dark:bg-[#0d0d14] transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-sm text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-mono font-bold">
              Our Values
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mt-4 mb-6">
              قيمنا
            </h2>
            <div className="h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <div
                  key={i}
                  className="group bg-white dark:bg-[#12121a] rounded-2xl p-6 border border-slate-200 dark:border-white/10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* المميزات */}
      {/* ============================================ */}
      <section className="py-24 bg-white dark:bg-[#0a0a0f] transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-sm text-orange-600 dark:text-orange-400 uppercase tracking-widest font-mono font-bold">
              Why Code Tech
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mt-4 mb-6">
              لماذا تختارنا؟
            </h2>
            <div className="h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-orange-500 to-red-500" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="bg-gradient-to-br from-slate-50 to-white dark:from-[#12121a] dark:to-[#0a0a0f] rounded-2xl p-6 border border-slate-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/30 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTA />
    </div>
  );
}