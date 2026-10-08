"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Eye, Star, ZoomIn, ArrowLeft, ExternalLink } from "lucide-react";
import ImageLightbox from "@/components/ui/ImageLightbox";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  client: string | null;
  technologies: string[];
  coverImage: string | null;
  featured: boolean;
  views: number;
  slug: string;
  index?: number;
}

export default function ProjectCard({
  title,
  description,
  client,
  technologies,
  coverImage,
  featured,
  views,
  slug,
  index = 0,
}: ProjectCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.4 }}
        whileHover={{ y: -8 }}
        className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
      >
        {/* Image Container */}
        <div
          className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500 cursor-zoom-in"
          onClick={() => coverImage && setLightboxOpen(true)}
        >
          {coverImage ? (
            <>
              {/* Blur Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 animate-pulse" />

              {/* Actual Image */}
              <Image
                src={coverImage}
                alt={title}
                fill
                unoptimized
                priority={index < 6}
                loading="eager"
                decoding="async"
                className="object-cover group-hover:scale-110 transition-transform duration-700 relative z-[1]"
              />

              {/* Gradient Overlay (always) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-[2]" />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 via-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-[3] flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  whileHover={{ scale: 1 }}
                  className="bg-white/20 backdrop-blur-md rounded-full p-4 border-2 border-white/40 shadow-2xl"
                >
                  <ZoomIn className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white text-7xl font-black">
              {title[0]}
            </div>
          )}

          {/* Featured Badge */}
          {featured && (
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl font-bold z-10 border-2 border-white/30 backdrop-blur"
            >
              <Star className="w-3.5 h-3.5 fill-white" />
              مميز
            </motion.div>
          )}

          {/* Views Badge */}
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1.5 z-10 font-bold border border-white/20">
            <Eye className="w-3.5 h-3.5" />
            {views.toLocaleString("en-US")}
          </div>

          {/* Category Badge (bottom) */}
          <div className="absolute bottom-3 right-3 z-[4]">
            <span className="inline-block bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-bold border border-white/30">
              {title.substring(0, 10)}...
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 line-clamp-2 min-h-[56px] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 min-h-[40px]">
            {description}
          </p>

          {/* Client */}
          {client && (
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                العميل:
              </span>
              <span className="truncate">{client}</span>
            </div>
          )}

          {/* Technologies */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {technologies.slice(0, 3).map((tech, i) => (
              <span
                key={i}
                className="text-xs bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-lg font-bold border border-blue-100 dark:border-blue-500/20"
              >
                {tech}
              </span>
            ))}
            {technologies.length > 3 && (
              <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-lg font-bold">
                +{technologies.length - 3}
              </span>
            )}
          </div>

          {/* Action */}
          <Link
            href={`/portfolio/${slug}`}
            className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 group-hover:border-blue-200 dark:group-hover:border-blue-500/30 transition"
          >
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              عرض التفاصيل
            </span>
            <ArrowLeft className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>

      {/* Lightbox */}
      {coverImage && (
        <ImageLightbox
          src={lightboxOpen ? coverImage : null}
          alt={title}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}