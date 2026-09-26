"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ShoppingCart, Package, Building2, Hospital, BookOpen, CreditCard, Bot, Radio, ArrowLeft } from "lucide-react";

const categories = [
  { id: "all", label: "الكل", icon: "🎯" },
  { id: "websites", label: "مواقع الويب", icon: "🌐" },
  { id: "apps", label: "تطبيقات الجوال", icon: "📱" },
  { id: "systems", label: "الأنظمة", icon: "🖥️" },
  { id: "graduation", label: "مشاريع التخرج", icon: "🎓" },
];

const projects = [
  { id: 1, title: "متجر إلكتروني متكامل", category: "websites", icon: ShoppingCart, color: "from-blue-500 to-cyan-500" },
  { id: 2, title: "تطبيق توصيل طلبات", category: "apps", icon: Package, color: "from-green-500 to-teal-500" },
  { id: 3, title: "نظام إدارة مستشفى", category: "systems", icon: Hospital, color: "from-red-500 to-pink-500" },
  { id: 4, title: "موقع شركة عقارية", category: "websites", icon: Building2, color: "from-purple-500 to-indigo-500" },
  { id: 5, title: "تطبيق تعليمي", category: "apps", icon: BookOpen, color: "from-orange-500 to-yellow-500" },
  { id: 6, title: "نظام نقاط بيع POS", category: "systems", icon: CreditCard, color: "from-teal-500 to-cyan-500" },
  { id: 7, title: "مشروع تخرج - AI", category: "graduation", icon: Bot, color: "from-indigo-500 to-purple-500" },
  { id: 8, title: "مشروع تخرج - IoT", category: "graduation", icon: Radio, color: "from-pink-500 to-rose-500" },
];

export default function PortfolioTabs() {
  const [active, setActive] = useState("all");

  const filtered = active === "all" ? projects : projects.filter((p) => p.category === active);

  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-4">
        
        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-purple-50 text-purple-600 px-4 py-2 rounded-full font-bold text-sm mb-4 border border-purple-100">
            ✨ معرض أعمالنا
          </span>
          <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            مشاريع
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}من إنجازنا
            </span>
          </h2>
          <p className="text-xl text-slate-600">
            اكتشف مجموعة متنوعة من مشاريعنا في مختلف المجالات
          </p>
        </motion.div>

        {/* التبويبات */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${
                active === cat.id
                  ? "bg-slate-900 text-white shadow-lg scale-105"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* الشبكة */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => {
              const Icon = project.icon;
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -8 }}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100"
                >
                  {/* الصورة */}
                  <div className={`aspect-video bg-gradient-to-br ${project.color} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                    <Icon className="w-16 h-16 text-white relative z-10 group-hover:scale-125 transition-transform duration-500" strokeWidth={1.5} />
                  </div>

                  {/* المحتوى */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                      {project.title}
                    </h3>
                    <div className="text-sm text-slate-500 mt-1">
                      {categories.find((c) => c.id === project.category)?.label}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* زر */}
        <div className="text-center mt-16">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-xl"
          >
            🖼️ عرض كل المشاريع
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}