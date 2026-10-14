"use client";

import { motion } from "framer-motion";
import {
  Globe,
  Smartphone,
  Monitor,
  GraduationCap,
  Palette,
  Sparkles,
  TrendingUp,
  Award,
  Heart,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

// ============================================
// Types
// ============================================
type CategoryKey =
  | "websites"
  | "apps"
  | "systems"
  | "graduation"
  | "graphics";

interface CategoryHeroProps {
  category: CategoryKey;
  count: number;
  views: number;
  featured: number;
  likes: number;
}

// ============================================
// Category Config
// ============================================
const categoryConfig: Record<
  CategoryKey,
  {
    title: string;
    subtitle: string;
    icon: any;
    gradient: string;
    bgGradient: string;
    border: string;
    textColor: string;
    iconBg: string;
  }
> = {
  websites: {
    title: "مواقع الويب",
    subtitle: "مواقع احترافية بتقنيات حديثة وأداء عالي",
    icon: Globe,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient:
      "from-blue-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900",
    border: "border-blue-100 dark:border-blue-500/20",
    textColor: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
  },
  apps: {
    title: "تطبيقات الجوال",
    subtitle: "تطبيقات Android و iOS بأداء عالٍ",
    icon: Smartphone,
    gradient: "from-green-500 to-emerald-500",
    bgGradient:
      "from-green-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900",
    border: "border-green-100 dark:border-green-500/20",
    textColor: "text-green-600 dark:text-green-400",
    iconBg: "bg-gradient-to-br from-green-500 to-emerald-500",
  },
  systems: {
    title: "الأنظمة البرمجية",
    subtitle: "أنظمة ERP وبرامج إدارة متكاملة",
    icon: Monitor,
    gradient: "from-purple-500 to-violet-500",
    bgGradient:
      "from-purple-50 via-white to-violet-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900",
    border: "border-purple-100 dark:border-purple-500/20",
    textColor: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-gradient-to-br from-purple-500 to-violet-500",
  },
  graduation: {
    title: "مشاريع التخرج",
    subtitle: "مشاريع تخرج جامعية مميزة",
    icon: GraduationCap,
    gradient: "from-orange-500 to-red-500",
    bgGradient:
      "from-orange-50 via-white to-red-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900",
    border: "border-orange-100 dark:border-orange-500/20",
    textColor: "text-orange-600 dark:text-orange-400",
    iconBg: "bg-gradient-to-br from-orange-500 to-red-500",
  },
  graphics: {
    title: "تصاميم جرافيكس",
    subtitle: "هويات بصرية وتصاميم إبداعية",
    icon: Palette,
    gradient: "from-pink-500 to-rose-500",
    bgGradient:
      "from-pink-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900",
    border: "border-pink-100 dark:border-pink-500/20",
    textColor: "text-pink-600 dark:text-pink-400",
    iconBg: "bg-gradient-to-br from-pink-500 to-rose-500",
  },
};

// ============================================
// Component
// ============================================
export default function CategoryHero({
  category,
  count,
  views,
  featured,
  likes,
}: CategoryHeroProps) {
  const config = categoryConfig[category];
  const Icon = config.icon;

  const stats = [
    {
      value: count,
      label: "مشروع",
      icon: Sparkles,
      color: "text-blue-500",
    },
    {
      value: views.toLocaleString("en-US"),
      label: "مشاهدة",
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      value: likes,
      label: "إعجاب",
      icon: Heart,
      color: "text-red-500",
    },
    {
      value: featured,
      label: "مميز",
      icon: Award,
      color: "text-yellow-500",
    },
  ];

  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br ${config.bgGradient} border-b-2 ${config.border}`}
    >
      {/* Orbs */}
      <div
        className={`absolute top-0 right-1/4 w-[400px] h-[400px] ${config.gradient.split(" ")[0].replace("from-", "bg-")}/20 rounded-full blur-[120px] pointer-events-none opacity-40`}
      />
      <div
        className={`absolute bottom-0 left-1/4 w-[400px] h-[400px] ${config.gradient.split(" ")[1].replace("to-", "bg-")}/20 rounded-full blur-[120px] pointer-events-none opacity-40`}
      />

      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-6 flex-wrap">
          <Link href="/" className="hover:text-blue-600 transition">
            الرئيسية
          </Link>
          <span>/</span>
          <Link href="/portfolio" className="hover:text-blue-600 transition">
            أعمالنا
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-bold">
            {config.title}
          </span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Right: Icon + Title */}
          <div className="flex items-center gap-4 md:gap-5">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl ${config.iconBg} flex items-center justify-center shadow-xl flex-shrink-0`}
            >
              <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </motion.div>

            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
                {config.title}
              </h1>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
                {config.subtitle}
              </p>
            </div>
          </div>

          {/* Left: Back button */}
          <Link
            href="/portfolio"
            className="hidden md:flex items-center gap-2 bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 backdrop-blur-xl border-2 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 px-5 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>العودة للتصنيفات</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-8">
          {stats.map((stat, i) => {
            const StatIcon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border-2 border-slate-100 dark:border-white/10 rounded-2xl p-4 shadow-sm hover:bg-white dark:hover:bg-white/10 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                    <StatIcon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}