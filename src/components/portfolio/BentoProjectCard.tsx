"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  Star,
  ArrowUpRight,
  TrendingUp,
  Heart,
  MessageSquare,
  Share2,
  Palette,
} from "lucide-react";
import ImageLightbox from "@/components/ui/ImageLightbox";

// ============================================
// Types
// ============================================
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
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  createdAt: Date;
}

interface BentoProjectCardProps {
  project: Project;
  index: number;
  size: "big" | "tall" | "normal";
}

// ============================================
// Category Color + Slug Map
// ============================================
const categoryInfo: Record<
  string,
  { from: string; to: string; label: string; slug: string }
> = {
  WEBSITES: {
    from: "from-blue-600",
    to: "to-cyan-600",
    label: "موقع",
    slug: "websites",
  },
  APPS: {
    from: "from-green-600",
    to: "to-emerald-600",
    label: "تطبيق",
    slug: "apps",
  },
  SYSTEMS: {
    from: "from-purple-600",
    to: "to-violet-600",
    label: "نظام",
    slug: "systems",
  },
  GRADUATION: {
    from: "from-orange-600",
    to: "to-red-600",
    label: "تخرج",
    slug: "graduation",
  },
  GRAPHICS: {
    from: "from-pink-600",
    to: "to-rose-600",
    label: "تصميم",
    slug: "graphics",
  },
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
  const [stats, setStats] = useState({
    likesCount: project.likesCount || 0,
    commentsCount: project.commentsCount || 0,
    sharesCount: project.sharesCount || 0,
  });

  const category = categoryInfo[project.category] || categoryInfo.WEBSITES;

  // ✅ جلب الإحصائيات المحدّثة
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/public/projects/stats?id=${project.id}&type=PROJECT`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data.likesCount !== undefined) {
          setStats({
            likesCount: data.likesCount || 0,
            commentsCount: data.commentsCount || 0,
            sharesCount: data.sharesCount || 0,
          });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [project.id]);

  const detailUrl = `/portfolio/${category.slug}/${project.slug}`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.5 }}
        className={`relative group ${sizeStyles[size]} overflow-hidden rounded-3xl bg-slate-900`}
      >
        {/* ============================================ */}
        {/* Background Image */}
        {/* ============================================ */}
        {project.coverImage ? (
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
        {/* Gradient Overlay */}
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
        {/* Category Badge */}
        {/* ============================================ */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-bold border border-white/20">
            <TrendingUp className="w-3 h-3" />
            {category.label}
          </span>
        </div>

        {/* ============================================ */}
        {/* Content */}
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

          {/* Description */}
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
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.technologies
              .slice(0, size === "big" ? 5 : 3)
              .map((tech, i) => (
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

          {/* ============================================ */}
          {/* Stats Bar: Likes, Comments, Shares, Views */}
          {/* ============================================ */}
          <div className="flex items-center gap-3 mb-3 text-xs text-slate-300">
            <div className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-red-400" />
              <span className="font-bold">{stats.likesCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-bold">{stats.commentsCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5 text-green-400" />
              <span className="font-bold">{stats.sharesCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold">
                {project.views.toLocaleString("en-US")}
              </span>
            </div>
          </div>

          {/* ============================================ */}
          {/* Actions: Details + Lightbox */}
          {/* ============================================ */}
          <div className="flex items-center gap-2 pt-3 border-t border-white/10">
            {/* View Details */}
            <Link
              href={detailUrl}
              className={`flex-1 flex items-center justify-center gap-2 bg-gradient-to-r ${category.from} ${category.to} text-white font-bold text-sm py-2.5 px-4 rounded-xl transition-all hover:scale-[1.02] shadow-lg`}
              onClick={(e) => e.stopPropagation()}
            >
              <span>عرض التفاصيل</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            {/* Lightbox Button */}
            {project.coverImage && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxOpen(true);
                }}
                className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-xl transition-all border border-white/20"
                title="عرض الصورة"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
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