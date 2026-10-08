"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Eye, Star, ArrowUpRight, TrendingUp } from "lucide-react";
import ImageLightbox from "@/components/ui/ImageLightbox";

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

interface BentoProjectCardProps {
  project: Project;
  index: number;
  size: "big" | "tall" | "normal";
}

// ============================================
// Category Color Map
// ============================================
const categoryColors: Record<string, { from: string; to: string; label: string }> = {
  WEBSITES: { from: "from-blue-600", to: "to-cyan-600", label: "موقع" },
  APPS: { from: "from-green-600", to: "to-emerald-600", label: "تطبيق" },
  SYSTEMS: { from: "from-purple-600", to: "to-violet-600", label: "نظام" },
  GRADUATION: { from: "from-orange-600", to: "to-red-600", label: "تخرج" },
};

// ============================================
// Bento Size Styles
// ============================================
const sizeStyles = {
  big: "md:col-span-2 md:row-span-2",
  tall: "md:row-span-2",
  normal: "",
};

export default function BentoProjectCard({
  project,
  index,
  size,
}: BentoProjectCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const category = categoryColors[project.category] || categoryColors.WEBSITES;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.5 }}
        className={`relative group ${sizeStyles[size]} overflow-hidden rounded-3xl bg-slate-900 cursor-pointer`}
      >
        {/* ============================================ */}
        {/* Background Image */}
        {/* ============================================ */}
        {project.coverImage ? (
          <>
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              unoptimized
              sizes={
                size === "big"
                  ? "(max-width: 768px) 100vw, 66vw"
                  : size === "tall"
                  ? "(max-width: 768px) 100vw, 33vw"
                  : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              }
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </>
        ) : (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${category.from} ${category.to}`}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl lg:text-9xl font-black text-white/20">
                {project.title[0]}
              </span>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* Gradient Overlay (always) */}
        {/* ============================================ */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

        {/* ============================================ */}
        {/* Hover Colored Overlay */}
        {/* ============================================ */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${category.from} ${category.to} opacity-0 group-hover:opacity-40 transition-opacity duration-500 mix-blend-multiply`}
        />

        {/* ============================================ */}
        {/* Top Badges */}
        {/* ============================================ */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {project.featured && (
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl font-bold border-2 border-white/30 backdrop-blur"
            >
              <Star className="w-3 h-3 fill-white" />
              مميز
            </motion.div>
          )}
        </div>

        {/* ============================================ */}
        {/* Category Badge (top-left) */}
        {/* ============================================ */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-bold border border-white/20">
            <TrendingUp className="w-3 h-3" />
            {category.label}
          </span>
        </div>

        {/* ============================================ */}
        {/* Content (always visible at bottom) */}
        {/* ============================================ */}
        <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6 z-10">
          {/* Title */}
          <h3
            className={`font-black text-white mb-2 leading-tight ${
              size === "big"
                ? "text-2xl lg:text-3xl"
                : size === "tall"
                ? "text-xl lg:text-2xl"
                : "text-lg lg:text-xl"
            }`}
          >
            {project.title}
          </h3>

          {/* Description (only on big or hover) */}
          <p
            className={`text-slate-300 text-sm mb-3 line-clamp-2 transition-all duration-500 ${
              size === "big"
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-20"
            }`}
          >
            {project.description}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.slice(0, size === "big" ? 5 : 3).map((tech, i) => (
              <span
                key={i}
                className="text-xs bg-white/10 backdrop-blur-md text-white px-2.5 py-1 rounded-lg font-bold border border-white/20"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > (size === "big" ? 5 : 3) && (
              <span className="text-xs bg-white/10 backdrop-blur-md text-white px-2.5 py-1 rounded-lg font-bold border border-white/20">
                +{project.technologies.length - (size === "big" ? 5 : 3)}
              </span>
            )}
          </div>

          {/* Footer Info + Action */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            {/* Views */}
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <Eye className="w-3.5 h-3.5" />
              <span className="font-bold">
                {project.views.toLocaleString("en-US")}
              </span>
              <span className="text-slate-500">مشاهدة</span>
            </div>

            {/* View Details Button */}
            <Link
              href={`/portfolio/${project.slug}`}
              className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-blue-300 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <span>التفاصيل</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ============================================ */}
        {/* Whole Card Click → Lightbox */}
        {/* ============================================ */}
        {project.coverImage && (
          <div
            onClick={() => setLightboxOpen(true)}
            className="absolute inset-0 z-[5]"
            aria-label="فتح الصورة"
          />
        )}
      </motion.div>

      {/* Lightbox */}
      {project.coverImage && (
        <ImageLightbox
          src={lightboxOpen ? project.coverImage : null}
          alt={project.title}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}