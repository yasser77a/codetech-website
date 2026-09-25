"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Sparkles, Star, TrendingUp, CreditCard, Zap } from "lucide-react";
import Services from "@/components/home/Services";
import WhyUs from "@/components/home/WhyUs";
import PortfolioTabs from "@/components/home/PortfolioTabs";
import Reviews from "@/components/home/Reviews";
import CTA from "@/components/home/CTA";
import ServicesShowcase from "@/components/home/ServicesShowcase";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ==================== HERO ==================== */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900 text-white overflow-hidden flex items-center">
        
        {/* شبكة متحركة */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" 
               style={{
                 backgroundImage: `linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)`,
                 backgroundSize: '60px 60px',
               }} 
          />
        </div>

        {/* Blur effects */}
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
              {/* شارة */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg border border-blue-400/30 px-5 py-2.5 rounded-full"
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold">شركة برمجية رائدة في اليمن</span>
              </motion.div>

              {/* العنوان */}
              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight"
                >
                  نبني أنظمة
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
                    برمجية ذكية
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-slate-300 max-w-xl leading-relaxed"
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
                  <div key={i} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-3 flex items-center gap-2">
                    <item.icon className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-semibold">{item.label}</span>
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
                  className="group relative bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all hover:scale-105 shadow-2xl shadow-green-500/30 text-lg overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <MessageCircle className="w-6 h-6 relative z-10" />
                  <span className="relative z-10">تواصل عبر واتساب</span>
                </a>
                <Link
                  href="/portfolio"
                  className="group bg-white/5 hover:bg-white/10 backdrop-blur-lg border-2 border-white/10 hover:border-white/30 px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 text-lg flex items-center gap-3"
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
                className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10"
              >
                {[
                  { icon: Star, value: "4.5/5", label: "2,084 مراجعة", color: "text-yellow-400" },
                  { icon: TrendingUp, value: "+100", label: "مشروع منجز", color: "text-green-400" },
                  { icon: CreditCard, value: "أقساط", label: "تسديد مرن", color: "text-blue-400" },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <div>
                      <div className="text-xl font-black">{stat.value}</div>
                      <div className="text-xs text-slate-400">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* الشعار */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative flex justify-center"
            >
              {/* حلقات مضيئة */}
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
              
              <motion.img
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                src="/logo.png"
                alt="Code Tech"
                className="relative w-full max-w-lg drop-shadow-[0_0_80px_rgba(59,130,246,0.5)]"
              />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
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

      <Services />
      <WhyUs />
      <ServicesShowcase />
      <PortfolioTabs />
      <Reviews />
      <CTA />
    </div>
  );
}