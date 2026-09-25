"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MessageCircle,
  Sparkles,
  Star,
  TrendingUp,
  CreditCard,
  Zap,
} from "lucide-react";
import Services from "@/components/home/Services";
import WhyUs from "@/components/home/WhyUs";
import ServicesShowcase from "@/components/home/ServicesShowcase";
import PortfolioTabs from "@/components/home/PortfolioTabs";
import Reviews from "@/components/home/Reviews";
import CTA from "@/components/home/CTA";

// ==========================================
// 🖼️ شرائح الـ Hero (الشعار + 7 صور)
// ==========================================
const heroSlides = [
  {
    type: "logo",
    src: "/logo.png",
    alt: "Code Tech Logo",
    label: "Code Tech",
    bgGlow: "rgba(59, 130, 246, 0.5)",
    darkBgGlow: "rgba(59, 130, 246, 0.3)",
  },
  {
    type: "image",
    src: "/images/hero/web-main.png",
    alt: "Web Development",
    label: "تطوير المواقع",
    bgGlow: "rgba(59, 130, 246, 0.5)",
    darkBgGlow: "rgba(59, 130, 246, 0.3)",
  },
  {
    type: "image",
    src: "/images/hero/mobile-main.png",
    alt: "Mobile Apps",
    label: "تطبيقات الجوال",
    bgGlow: "rgba(16, 185, 129, 0.5)",
    darkBgGlow: "rgba(16, 185, 129, 0.3)",
  },
  {
    type: "image",
    src: "/images/hero/system-main.png",
    alt: "Software Systems",
    label: "الأنظمة البرمجية",
    bgGlow: "rgba(139, 92, 246, 0.5)",
    darkBgGlow: "rgba(139, 92, 246, 0.3)",
  },
  {
    type: "image",
    src: "/images/hero/security-main.png",
    alt: "Security Systems",
    label: "أنظمة الحماية",
    bgGlow: "rgba(239, 68, 68, 0.5)",
    darkBgGlow: "rgba(239, 68, 68, 0.3)",
  },
  {
    type: "image",
    src: "/images/hero/graphics-main.png",
    alt: "Graphic Design",
    label: "تصاميم جرافيكس",
    bgGlow: "rgba(249, 115, 22, 0.5)",
    darkBgGlow: "rgba(249, 115, 22, 0.3)",
  },
  {
    type: "image",
    src: "/images/hero/graduation-main.png",
    alt: "Graduation Projects",
    label: "مشاريع التخرج",
    bgGlow: "rgba(20, 184, 166, 0.5)",
    darkBgGlow: "rgba(20, 184, 166, 0.3)",
  },
  {
    type: "image",
    src: "/images/hero/downloads-main.png",
    alt: "Downloads Library",
    label: "مكتبة التحميلات",
    bgGlow: "rgba(6, 182, 212, 0.5)",
    darkBgGlow: "rgba(6, 182, 212, 0.3)",
  },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDark, setIsDark] = useState(false);

  // ✅ مراقبة الوضع الليلي/النهاري
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();

    // مراقبة التغييرات
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // ✅ التبديل التلقائي كل 3 ثواني
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const activeSlide = heroSlides[currentSlide];
  const currentGlow = isDark ? activeSlide.darkBgGlow : activeSlide.bgGlow;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500">
      {/* ==================== HERO ==================== */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden flex items-center transition-colors duration-500">

        {/* شبكة متحركة */}
        <div className="absolute inset-0 opacity-30 dark:opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: isDark
                ? `linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)`
                : `linear-gradient(rgba(37,99,235,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.05) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Blur effects - تختلف حسب الوضع */}
        {isDark ? (
          <>
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[150px]" />
          </>
        ) : (
          <>
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-300/30 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-300/30 rounded-full blur-[150px]" />
          </>
        )}

        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* ==================== النص ==================== */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* شارة */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/80 dark:bg-white/10 backdrop-blur-lg border border-blue-300 dark:border-blue-400/30 px-5 py-2.5 rounded-full shadow-sm dark:shadow-none transition-colors"
              >
                <Sparkles className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                <span className="text-sm font-semibold text-blue-900 dark:text-white">
                  شركة برمجية رائدة في اليمن
                </span>
              </motion.div>

              {/* العنوان */}
              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight"
                >
                  <span className="text-blue-950 dark:text-white transition-colors">
                    نبني أنظمة
                  </span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 dark:from-blue-400 dark:via-cyan-400 dark:to-blue-500">
                    برمجية ذكية
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-slate-700 dark:text-slate-300 max-w-xl leading-relaxed transition-colors"
                >
                  شريكك التقني في صنعاء لتطوير أنظمة، تطبيقات، ومواقع إلكترونية
                  بأحدث التقنيات وأعلى معايير الجودة.
                </motion.p>
              </div>

              {/* المميزات السريعة */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-3 gap-3 max-w-lg"
              >
                {[
                  { icon: Zap, label: "سريع" },
                  { icon: Star, label: "موثوق" },
                  { icon: CreditCard, label: "تقسيط" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white/80 dark:bg-white/5 backdrop-blur border border-blue-200 dark:border-white/10 rounded-2xl p-3 flex items-center gap-2 shadow-sm dark:shadow-none transition-colors"
                  >
                    <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-semibold text-blue-950 dark:text-white">
                      {item.label}
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* الأزرار */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4 pt-2"
              >
                <a
                  href="https://wa.me/967775566442"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all hover:scale-105 shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 text-lg overflow-hidden text-white"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <MessageCircle className="w-6 h-6 relative z-10" />
                  <span className="relative z-10">اطلب خدمتك الآن</span>
                </a>
                <Link
                  href="/portfolio"
                  className="group bg-white dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-white/10 backdrop-blur-lg border-2 border-blue-300 dark:border-white/10 hover:border-blue-500 dark:hover:border-white/30 px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 text-lg flex items-center gap-3 text-blue-900 dark:text-white"
                >
                  <span>تصفح أعمالنا</span>
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              {/* الإحصائيات */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="grid grid-cols-3 gap-6 pt-8 border-t border-blue-200 dark:border-white/10 transition-colors"
              >
                {[
                  { icon: Star, value: "4.5/5", label: "2,084 مراجعة", color: "text-yellow-500 dark:text-yellow-400" },
                  { icon: TrendingUp, value: "+100", label: "مشروع منجز", color: "text-green-500 dark:text-green-400" },
                  { icon: CreditCard, value: "أقساط", label: "تسديد مرن", color: "text-blue-600 dark:text-blue-400" },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <div>
                      <div className="text-xl font-black text-blue-950 dark:text-white">
                        {stat.value}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* ==================== الصور المتحركة ==================== */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative flex justify-center items-center"
            >
              {/* حلقات مضيئة */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-[500px] h-[500px] border border-blue-400/30 dark:border-blue-500/20 rounded-full transition-colors"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute w-[400px] h-[400px] border border-purple-400/30 dark:border-purple-500/20 rounded-full transition-colors"
                />
              </div>

              {/* هالة متوهجة (تتغير مع الشريحة والوضع) */}
              <motion.div
                key={`glow-${currentSlide}-${isDark}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: isDark ? 0.7 : 0.5, scale: 1 }}
                transition={{ duration: 1 }}
                className="absolute w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${currentGlow} 0%, transparent 70%)`,
                }}
              />

              {/* الصور (Slideshow) */}
              <div className="relative w-full max-w-lg aspect-square">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 0.85, rotateY: -15 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.85, rotateY: 15 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Image
                      src={activeSlide.src}
                      alt={activeSlide.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={currentSlide === 0}
                      className={`object-contain ${
                        activeSlide.type === "logo"
                          ? "animate-float drop-shadow-[0_0_80px_rgba(59,130,246,0.5)]"
                          : "dark:mix-blend-screen dark:brightness-110 dark:contrast-110 drop-shadow-[0_0_60px_rgba(59,130,246,0.3)]"
                      }`}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* اسم الشريحة */}
                <motion.div
                  key={`label-${currentSlide}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-900/90 dark:bg-slate-900/80 backdrop-blur border border-white/20 dark:border-white/10 rounded-full px-4 py-1.5 transition-colors"
                >
                  <span className="text-xs font-semibold text-white">
                    {activeSlide.label}
                  </span>
                </motion.div>
              </div>

              {/* نقاط التنقل */}
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === currentSlide
                        ? "w-8 bg-blue-600 dark:bg-blue-400"
                        : "w-2 bg-blue-300 dark:bg-white/30 hover:bg-blue-400 dark:hover:bg-white/50"
                    }`}
                    aria-label={`الشريحة ${i + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* مؤشر التمرير للأسفل */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-blue-400/40 dark:border-white/30 rounded-full flex items-start justify-center p-2 transition-colors">
            <div className="w-1.5 h-3 bg-blue-600 dark:bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ==================== بقية الأقسام ==================== */}
      <Services />
      <WhyUs />
      <ServicesShowcase />
      <PortfolioTabs />
      <Reviews />
      <CTA />
    </div>
  );
}