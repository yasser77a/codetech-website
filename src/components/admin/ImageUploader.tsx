"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, ImageIcon, Loader2, AlertCircle } from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  required?: boolean;
  label?: string;
}

export default function ImageUploader({
  value,
  onChange,
  folder = "projects",
  required = false,
  label = "صورة المشروع",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setError("");
      setUploading(true);

      try {
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "فشل الرفع");
          setUploading(false);
          return;
        }

        onChange(data.url);
      } catch {
        setError("تعذر الاتصال بالخادم");
      }
      setUploading(false);
    },
    [folder, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled: uploading,
  });

  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>

      <AnimatePresence mode="wait">
        {value ? (
          // عرض الصورة
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative group rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700"
          >
            <img
              src={value}
              alt="Preview"
              className="w-full h-56 object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
              <button
                type="button"
                onClick={() => onChange("")}
                className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl transition-all flex items-center gap-2 font-bold"
              >
                <X className="w-5 h-5" />
                حذف الصورة
              </button>
            </div>
          </motion.div>
        ) : (
          // منطقة الرفع
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                isDragActive
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                  : "border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              } ${uploading ? "opacity-50 cursor-wait" : ""}`}
            >
              <input {...getInputProps()} />

              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                  <p className="text-slate-700 dark:text-slate-300 font-bold">
                    جاري الرفع...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    {isDragActive ? (
                      <Upload className="w-8 h-8 text-white" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white mb-1">
                      {isDragActive ? "أفلت الصورة هنا" : "اسحب الصورة أو اضغط للاختيار"}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      PNG, JPG, WEBP, GIF, SVG - الحد الأقصى 5MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="mt-2 flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {required && !value && (
        <div className="mt-2 flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          الصورة مطلوبة
        </div>
      )}
    </div>
  );
}