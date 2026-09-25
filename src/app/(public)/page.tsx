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
} from "lucide-react";
import Services from "@/components/home/Services";
import WhyUs from "@/components/home/WhyUs";
import ServicesShowcase from "@/components/home/ServicesShowcase";
import PortfolioTabs from "@/components/home/PortfolioTabs";
import Reviews from "@/components/home/Reviews";
import CTA from "@/components/home/CTA";

// ==========================================
// 🖼️ شرائح الـ Hero
// ==========================================
const heroSlides = [
  { src: "/logo.png", alt: "Code Tech Logo", label: "Code Tech", isLogo: true },
  { src: "/images/hero/web-development.jpg", alt: "Web Development", label: "تطوير المواقع" },
  { src: "/images/hero/mobile-apps.jpg", alt: "Mobile Apps", label: "تطبيقات الجوال" },
  { src: "/images/hero/systems.jpg", alt: "Systems", label: "الأنظمة البرمجية" },
  { src: "/images/hero/security.jpg", alt: "Security", label: "أنظمة الحماية" },
  { src: "/images/hero/graphics.jpg", alt: "Graphics", label: "تصاميم جرافيكس" },
  { src: "/images/hero/graduation.jpg", alt: "Graduation", label: "مشاريع التخرج" },
  { src: "/images/hero/downloads-library.jpg", alt: "Downloads", label: "مكتبة التحميلات" },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const activeSlide = heroSlides[currentSlide];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">

      {/* ==================== HERO ==================== */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden flex items-center">
        
        {/* شبكة */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Blur */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[150px]" />

        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* النص */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-lg border border-blue-400/30 px-5 py-2.5 rounded-full">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold">شركة برمجية رائدة في اليمن</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight">
                نبني أنظمة
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
                  برمجية ذكية
                </span>
              </h1>

              <p className="text-xl text-slate-300 max-w-xl leading-relaxed">
                شريكك التقني في صنعاء لتطوير أنظمة، تطبيقات، ومواقع إلكترونية بأحدث التقنيات وأعلى معايير الجودة.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://wa.me/967775566442"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all hover:scale-105 shadow-2xl text-white"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span>تواصل عبر واتساب</span>
                </a>
                <Link
                  href="/portfolio"
                  className="bg-white/5 hover:bg-white/10 backdrop-blur-lg border-2 border-white/10 hover:border-white/30 px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 flex items-center gap-3"
                >
                  <span>تصفح أعمالنا</span>
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
                {[
                  { icon: Star, value: "4.5/5", label: "2,084 مراجعة", color: "text-yellow-400" },
                  { icon: TrendingUp, value: "+100", label: "مشروع منجز", color: "text-green-400" },
                  { icon: CreditCard, value: "أقساط", label: "تسديد مرن", color: "text-blue-400" },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                      <div>
                        <div className="text-xl font-black">{stat.value}</div>
                        <div className="text-xs text-slate-400">{stat.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* الصور */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative flex justify-center items-center"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-[500px] h-[500px] border border-blue-500/20 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute w-[400px] h-[400px] border border-purple-500/20 rounded-full"
                />
              </div>

              <div className="relative w-full max-w-md aspect-square">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 flex items-center justify-center p-8"
                  >
                    <Image
                      src={activeSlide.src}
                      alt={activeSlide.alt}
                      width={500}
                      height={500}
                      priority={currentSlide === 0}
                      className="object-contain w-full h-full drop-shadow-[0_0_60px_rgba(59,130,246,0.4)]"
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur border border-white/10 rounded-full px-4 py-1.5">
                  <span className="text-xs font-semibold text-white">{activeSlide.label}</span>
                </div>
              </div>

              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === currentSlide ? "w-8 bg-blue-400" : "w-2 bg-white/30 hover:bg-white/50"
                    }`}
                    aria-label={`الشريحة ${i + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* مؤشر التمرير */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ==================== الأقسام ==================== */}
      <Services />
      <WhyUs />
      <ServicesShowcase />
      <PortfolioTabs />
      <Reviews />
      <CTA />
    </div>
  );
}