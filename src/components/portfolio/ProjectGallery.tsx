"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

// ============================================
// Types
// ============================================
interface ProjectGalleryProps {
  images: string[];
  title: string;
  categoryColor: string;
}

// ============================================
// Component
// ============================================
export default function ProjectGallery({
  images,
  title,
  categoryColor,
}: ProjectGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % images.length
        );
      }
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev - 1 + images.length) % images.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, images.length]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

  if (images.length === 0) {
    return (
      <div className="aspect-[16/9] rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-2">🖼️</div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            لا توجد صور
          </p>
        </div>
      </div>
    );
  }

  const goNext = () => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev + 1) % images.length
    );
  };

  const goPrev = () => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev - 1 + images.length) % images.length
    );
  };

  return (
    <>
      {/* ============================================ */}
      {/* Gallery Grid */}
      {/* ============================================ */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {images.map((img, i) => {
          // First image is bigger (main image)
          const isMain = i === 0;
          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setLightboxIndex(i)}
              className={`group relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-transparent transition-all ${
                isMain
                  ? "col-span-2 md:col-span-2 md:row-span-2 aspect-square md:aspect-auto"
                  : "aspect-square"
              }`}
              style={{
                // @ts-ignore
                "--tw-border-color": undefined,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = categoryColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "";
              }}
            >
              <img
                src={img}
                alt={`${title} - صورة ${i + 1}`}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Main Badge */}
              {isMain && (
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white text-xs px-2.5 py-1 rounded-full font-bold border border-white/20 z-10">
                  🌟 الرئيسية
                </div>
              )}

              {/* Zoom Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/40">
                  <ZoomIn className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Image Number */}
              {!isMain && (
                <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-md text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {i + 1}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* ============================================ */}
      {/* Lightbox */}
      {/* ============================================ */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div
            className="fixed inset-0 bg-black/95 backdrop-blur-lg z-[100] flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-xl transition-all hover:scale-110 z-10"
              aria-label="إغلاق"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md text-white text-sm px-4 py-2 rounded-full font-bold border border-white/20">
              {lightboxIndex + 1} / {images.length}
            </div>

            {/* Main Image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={lightboxIndex}
                src={images[lightboxIndex]}
                alt={`${title} - صورة ${lightboxIndex + 1}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>

            {/* Nav Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all hover:scale-110"
                  aria-label="السابق"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all hover:scale-110"
                  aria-label="التالي"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </>
            )}

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-4 py-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(i);
                    }}
                    className={`flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden transition-all ${
                      lightboxIndex === i
                        ? "ring-2 ring-white scale-110"
                        : "opacity-40 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}