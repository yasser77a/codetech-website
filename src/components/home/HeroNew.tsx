"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Zap, 
  Shield, 
  Code2, 
  Clock, 
  Headphones,
  Rocket 
} from "lucide-react";

export default function HeroNew() {
  const features = [
    { icon: Clock, label: "تسليم في الوقت", desc: "المحدد" },
    { icon: Code2, label: "تقنيات حديثة", desc: "ومتطورة" },
    { icon: Shield, label: "جودة عالية", desc: "في التنفيذ" },
    { icon: Headphones, label: "دعم فني", desc: "مستمر" },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden hero-section-light transition-colors duration-500">
      
      {/* ============ الخلفية الزخرفية ============ */}
      <div className="absolute inset-0 pointer-events-none">
        {/* دوائر ضوئية */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-400/20 dark:bg-blue-500/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-red-400/20 dark:bg-red-500/20 rounded-full blur-[150px]" />
        
        {/* خطوط منحنية */}
        <svg className="absolute bottom-0 left-0 w-full opacity-30" viewBox="0 0 1440 320" fill="none">
          <path d="M0,160 C320,300 720,0 1440,160 L1440,320 L0,320 Z" fill="url(#gradient)" />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1976D2" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#E31E24" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* ============ النص (يسار) ============ */}
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
              className="inline-flex items-center gap-2 bg-white/80 dark:bg-white/10 backdrop-blur-lg border border-blue-200 dark:border-blue-500/30 px-5 py-2.5 rounded-full shadow-sm"
            >
              <Zap className="w-4 h-4 text-red-500 fill-red-500" />
              <span className="text-sm font-semibold text-blue-900 dark:text-white">
                شريكك في التحول الرقمي
              </span>
            </motion.div>

            {/* العنوان */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] tracking-tight"
              >
                <span className="block text-blue-900 dark:text-white">
                  نحوّل أفكارك إلى
                </span>
                <span className="block mt-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-400 dark:to-cyan-400">
                    حلول برمجية
                  </span>
                  {" "}
                  <span className="text-red-600 dark:text-red-500">
                    متكاملة
                  </span>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg lg:text-xl text-slate-700 dark:text-slate-300 max-w-xl leading-relaxed"
              >
                نطوّر لك مواقع وتطبيقات وأنظمة رقمية باحترافية، من الفكرة إلى الإطلاق. 
                مع{" "}
                <span className="font-bold text-blue-700 dark:text-blue-400">
                  CodeTech
                </span>
                ، شريكك في صناعة مستقبل رقمي أفضل.
              </motion.p>
            </div>

            {/* الأزرار */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="https://wa.me/967775566442"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all hover:scale-105 shadow-xl shadow-red-500/30 text-lg overflow-hidden"
              >
                <Rocket className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />
                <span className="relative z-10">اطلب خدمتك الآن</span>
              </a>
              
              <Link
                href="/services"
                className="group bg-white dark:bg-white/10 hover:bg-blue-50 dark:hover:bg-white/20 border-2 border-blue-300 dark:border-blue-500/30 hover:border-blue-500 px-8 py-4 rounded-2xl font-bold text-blue-700 dark:text-white transition-all hover:scale-105 text-lg flex items-center gap-3 shadow-sm"
              >
                <span>استكشف خدماتنا</span>
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* 4 مميزات */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8"
            >
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-500/30 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-700 dark:text-blue-400" />
                    </div>
                    <div className="text-sm font-bold text-blue-900 dark:text-white">
                      {feature.label}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {feature.desc}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* ============ الصورة (يمين) ============ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center items-center"
          >
            {/* حلقات ضوئية */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="w-[500px] h-[500px] border-2 border-blue-500/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute w-[400px] h-[400px] border-2 border-red-500/20 rounded-full"
              />
            </div>

            {/* الصورة الرئيسية - صورة الشعار أو Hero الجديدة */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full max-w-xl"
            >
              <Image
                src="/logo.png"
                alt="CodeTech"
                width={600}
                height={600}
                priority
                className="w-full h-auto drop-shadow-[0_20px_60px_rgba(25,118,210,0.4)]"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-blue-500/40 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-blue-500/60 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}