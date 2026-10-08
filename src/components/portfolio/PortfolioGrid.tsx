"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Smartphone, Monitor, GraduationCap, Search } from "lucide-react";
import ProjectCard from "./ProjectCard";

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

interface PortfolioGridProps {
  projects: {
    websites: Project[];
    apps: Project[];
    systems: Project[];
    graduation: Project[];
  };
  showFilter?: boolean;
  initialCategory?: Category;
}

const categories: { key: Category; label: string; icon: any }[] = [
  { key: "all", label: "الكل", icon: Globe },
  { key: "WEBSITES", label: "مواقع الويب", icon: Globe },
  { key: "APPS", label: "تطبيقات الجوال", icon: Smartphone },
  { key: "SYSTEMS", label: "الأنظمة", icon: Monitor },
  { key: "GRADUATION", label: "مشاريع التخرج", icon: GraduationCap },
];

export default function PortfolioGrid({
  projects,
  showFilter = true,
  initialCategory = "all",
}: PortfolioGridProps) {
  const [activeCategory, setActiveCategory] = useState<Category>(initialCategory);
  const [search, setSearch] = useState("");

  // Combine all projects
  const allProjects = useMemo(
    () => [
      ...projects.websites,
      ...projects.apps,
      ...projects.systems,
      ...projects.graduation,
    ],
    [projects]
  );

  // Filter
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
    <section className="py-16 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        {showFilter && (
          <>
            {/* Filter Tabs */}
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
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg scale-105"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{cat.label}</span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20"
                          : "bg-slate-100 dark:bg-slate-700"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="max-w-md mx-auto mb-10">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحث في المشاريع..."
                  suppressHydrationWarning
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pr-11 pl-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>
          </>
        )}

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={activeCategory + search}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
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
              className="text-center py-20 text-slate-500 dark:text-slate-400"
            >
              <Globe className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-bold">لا توجد مشاريع</p>
              <p className="text-sm mt-1">
                {search ? "جرب البحث بكلمات أخرى" : "ستظهر المشاريع هنا قريباً"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}