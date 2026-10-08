"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import ProjectCard from "@/components/portfolio/ProjectCard";

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

interface PortfolioTabsProps {
  projects: Project[];
}

const categories = [
  { id: "all", label: "الكل", icon: "🎯" },
  { id: "websites", label: "مواقع الويب", icon: "🌐" },
  { id: "apps", label: "تطبيقات الجوال", icon: "📱" },
  { id: "systems", label: "الأنظمة", icon: "🖥️" },
  { id: "graduation", label: "مشاريع التخرج", icon: "🎓" },
];

// Mapping بين category enum و tabs
const categoryMap: Record<string, string> = {
  WEBSITES: "websites",
  APPS: "apps",
  SYSTEMS: "systems",
  GRADUATION: "graduation",
};

export default function PortfolioTabs({ projects }: PortfolioTabsProps) {
  const [active, setActive] = useState("all");

  const filtered =
    active === "all"
      ? projects.slice(0, 8) // عرض أول 8 فقط في الرئيسية
      : projects
          .filter((p) => categoryMap[p.category] === active)
          .slice(0, 8);

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-white to-slate-50 dark:from-[#0a0a0f] dark:to-[#0f0f18] transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-600 dark:text-purple-400 px-5 py-2.5 rounded-full font-bold text-sm mb-6 border border-purple-200 dark:border-purple-500/20 backdrop-blur"
          >
            <Sparkles className="w-4 h-4" />
            معرض أعمالنا
          </motion.span>

          <h2 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            مشاريع
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              {" "}
              من إنجازنا
            </span>
          </h2>

          <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            اكتشف مجموعة متنوعة من مشاريعنا في مختلف المجالات، مصممة بعناية
            وبأحدث التقنيات
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat, i) => {
            const isActive = active === cat.id;
            const count =
              cat.id === "all"
                ? projects.length
                : projects.filter((p) => categoryMap[p.category] === cat.id)
                    .length;

            return (
              <motion.button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                suppressHydrationWarning
                className={`relative px-5 lg:px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${
                  isActive
                    ? "bg-slate-900 dark:bg-gradient-to-r dark:from-blue-600 dark:to-purple-600 text-white shadow-lg shadow-blue-500/20"
                    : "bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10"
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                <span>{cat.label}</span>
                {count > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? "bg-white/20"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filtered.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  slug={project.slug}
                  title={project.title}
                  description={project.description}
                  client={project.client}
                  technologies={project.technologies}
                  coverImage={project.coverImage}
                  featured={project.featured}
                  views={project.views}
                  index={i}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                لا توجد مشاريع في هذا التصنيف
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-purple-500/20"
          >
            عرض كل المشاريع
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}