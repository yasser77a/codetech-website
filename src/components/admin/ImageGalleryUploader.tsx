"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, ImageIcon, Loader2, AlertCircle, Plus } from "lucide-react";

// ============================================
// Types
// ============================================
interface ImageGalleryUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  label?: string;
  maxImages?: number;
  description?: string;
}

// ============================================
// Component
// ============================================
export default function ImageGalleryUploader({
  value = [],
  onChange,
  folder = "projects/gallery",
  label = "صور الواجهات",
  maxImages = 10,
  description = "أضف صور لواجهات النظام (حد أقصى 10 صور)",
}: ImageGalleryUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  // ==========================================
  // Upload one file
  // ==========================================
  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل الرفع");
      }

      return data.url;
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    }
  };

  // ==========================================
  // Handle multiple files
  // ==========================================
  const handleFiles = useCallback(
    async (files: FileList) => {
      if (files.length === 0) return;

      const remaining = maxImages - value.length;
      if (remaining <= 0) {
        setError(`الحد الأقصى ${maxImages} صور`);
        return;
      }

      const filesToUpload = Array.from(files).slice(0, remaining);

      setError("");
      setUploading(true);
      setProgress(0);

      const newUrls: string[] = [];
      const totalFiles = filesToUpload.length;

      for (let i = 0; i < filesToUpload.length; i++) {
        const url = await uploadFile(filesToUpload[i]);
        if (url) {
          newUrls.push(url);
        } else {
          setError(`فشل رفع الصورة ${i + 1}`);
        }
        setProgress(Math.round(((i + 1) / totalFiles) * 100));
      }

      if (newUrls.length > 0) {
        onChange([...value, ...newUrls]);
      }

      setUploading(false);
      setProgress(0);
    },
    [value, onChange, maxImages, folder]
  );

  // ==========================================
  // Handle file input change
  // ==========================================
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
      // Reset input
      e.target.value = "";
    }
  };

  // ==========================================
  // Handle drag & drop
  // ==========================================
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // ==========================================
  // Remove image
  // ==========================================
  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const canAddMore = value.length < maxImages;

  // ==========================================
  // Render
  // ==========================================
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
        {label}
        <span className="text-xs text-slate-400 font-normal mr-2">
          ({value.length} / {maxImages})
        </span>
      </label>

      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          {description}
        </p>
      )}

      {/* Gallery Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-4">
          <AnimatePresence>
            {value.map((url, index) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-square rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700"
              >
                <img
                  src={url}
                  alt={`صورة ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-1.5 left-1.5 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100 shadow-lg"
                  aria-label="حذف"
                >
                  <X className="w-4 h-4" />
                </button>
                {/* Number badge */}
                <div className="absolute bottom-1.5 right-1.5 bg-black/60 backdrop-blur text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {index + 1}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
            uploading
              ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 opacity-70 cursor-wait"
              : "border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleInputChange}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                جاري الرفع... {progress}%
              </p>
              <div className="w-full max-w-xs h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  اسحب الصور أو اضغط للاختيار
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  يمكنك رفع حتى {maxImages - value.length} صور إضافية
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Max reached */}
      {!canAddMore && (
        <div className="bg-amber-50 dark:bg-amber-500/10 border-2 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          تم الوصول للحد الأقصى ({maxImages} صور)
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-3 bg-red-50 dark:bg-red-500/10 border-2 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
          <button
            type="button"
            onClick={() => setError("")}
            className="text-red-700 dark:text-red-400 hover:text-red-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}