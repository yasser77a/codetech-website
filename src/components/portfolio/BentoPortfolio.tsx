"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Smartphone, Monitor, GraduationCap, Search, X } from "lucide-react";
import BentoProjectCard from "./BentoProjectCard";

type Category = "all" | "WEBSITES" | "APPS" | "SYSTEMS" | "GRADUATION";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  client: string | null;
  technologies: string[];
  coverImage: string | null;
  featured: boolean;
  views: number;
  createdAt: Date;
}

interface BentoPortfolioProps {
  projects: {
    websites: Project[];
    apps: Project[];
    systems: Project[];
    graduation: Project[];
  };
}

const categories: { key: Category; label: string; icon: any; color: string }[] = [
  { key: "all", label: "الكل", icon: Globe, color: "from-slate-600 to-slate-800" },
  { key: "WEBSITES", label: "مواقع", icon: Globe, color: "from-blue-500 to-cyan-500" },
  { key: "APPS", label: "تطبيقات", icon: Smartphone, color: "from-green-500 to-emerald-500" },
  { key: "SYSTEMS", label: "أنظمة", icon: Monitor, color: "from-purple-500 to-violet-500" },
  { key: "GRADUATION", label: "تخرج", icon: GraduationCap, color: "from-orange-500 to-red-500" },
];

export default function BentoPortfolio({ projects }: BentoPortfolioProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");

  const allProjects = useMemo(
    () => [
      ...projects.websites,
      ...projects.apps,
      ...projects.systems,
      ...projects.graduation,
    ],
    [projects]
  );

  const filtered = useMemo(() => {
    let result =
      activeCategory === "all"
        ? allProjects
        : activeCategory === "WEBSITES"
        ? projects.websites
        : activeCategory === "APPS"
        ? projects.apps
        : activeCategory === "SYSTEMS"
        ? projects.systems
        : projects.graduation;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.client || "").toLowerCase().includes(q) ||
          p.technologies.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [activeCategory, search, projects, allProjects]);

  return (
    <section className="py-20 lg:py-28 bg-slate-50 dark:bg-[#0a0a0f] relative">
      <div className="container mx-auto px-4">
        {/* ============================================ */}
        {/* Filter Tabs */}
        {/* ============================================ */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.key;
            const count =
              cat.key === "all"
                ? allProjects.length
                : cat.key === "WEBSITES"
                ? projects.websites.length
                : cat.key === "APPS"
                ? projects.apps.length
                : cat.key === "SYSTEMS"
                ? projects.systems.length
                : projects.graduation.length;

            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                suppressHydrationWarning
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-xl scale-105`
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    isActive
                      ? "bg-white/20"
                      : "bg-slate-100 dark:bg-slate-800"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ============================================ */}
        {/* Search Bar */}
        {/* ============================================ */}
        <div className="max-w-lg mx-auto mb-12">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن مشروع..."
              suppressHydrationWarning
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pr-12 pl-12 py-4 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
                aria-label="مسح"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ============================================ */}
        {/* Bento Grid */}
        {/* ============================================ */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={activeCategory + search}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5 auto-rows-[280px] lg:auto-rows-[320px]"
            >
              {filtered.map((project, i) => {
                // ============================================
                // Bento Sizes Logic
                // ============================================
                // كل 6 مشاريع، الأول يكون كبير (2x2)
                const isBig = i % 6 === 0;
                // الثاني والثالث عموديين (1x2)
                const isTall = i % 6 === 1 || i % 6 === 2;

                return (
                  <BentoProjectCard
                    key={project.id}
                    project={project}
                    index={i}
                    size={isBig ? "big" : isTall ? "tall" : "normal"}
                  />
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32"
            >
              <div className="inline-flex w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 items-center justify-center mb-6">
                <Search className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                لا توجد نتائج
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}