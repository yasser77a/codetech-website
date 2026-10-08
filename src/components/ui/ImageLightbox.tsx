"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download } from "lucide-react";

interface ImageLightboxProps {
  src: string | null;
  alt?: string;
  onClose: () => void;
}

export default function ImageLightbox({
  src,
  alt = "صورة",
  onClose,
}: ImageLightboxProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);

    if (src) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [src, onClose]);

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
          dir="rtl"
        >
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur text-white p-3 rounded-full transition"
            aria-label="إغلاق"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Download Button */}
          <a
            href={src}
            download
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 left-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur text-white p-3 rounded-full transition"
            aria-label="تحميل"
          >
            <Download className="w-5 h-5" />
          </a>

          {/* Image */}
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Caption */}
          {alt && alt !== "صورة" && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white text-center max-w-2xl px-4">
              <h3 className="text-lg font-bold">{alt}</h3>
            </div>
          )}

          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm bg-black/40 px-4 py-2 rounded-full backdrop-blur">
            اضغط ESC أو انقر خارج الصورة للإغلاق
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}