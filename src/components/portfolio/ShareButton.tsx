"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, X, Copy, Check, Mail } from "lucide-react";
import {
  FaFacebook,
  FaWhatsapp,
  FaTelegram,
  FaInstagram,
  FaTiktok,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

// ==========================================
// Types
// ==========================================
interface ShareButtonProps {
  projectId: string;
  projectTitle: string;
  projectUrl: string;
  initialCount?: number;
  size?: "sm" | "md" | "lg";
}

// ==========================================
// Platforms
// ==========================================
const platforms = [
  {
    id: "facebook",
    name: "فيسبوك",
    icon: FaFacebook,
    color: "#1877F2",
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: "whatsapp",
    name: "واتساب",
    icon: FaWhatsapp,
    color: "#25D366",
    getUrl: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
  },
  {
    id: "email",
    name: "البريد الإلكتروني",
    icon: Mail,
    color: "#EA4335",
    getUrl: (url: string, title: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`شاهد هذا المشروع الرائع:\n\n${title}\n${url}`)}`,
  },
  {
    id: "twitter",
    name: "X (تويتر)",
    icon: FaTwitter,
    color: "#000000",
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    id: "telegram",
    name: "تليجرام",
    icon: FaTelegram,
    color: "#0088CC",
    getUrl: (url: string, title: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    id: "linkedin",
    name: "لينكد إن",
    icon: FaLinkedin,
    color: "#0A66C2",
    getUrl: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    id: "instagram",
    name: "إنستقرام",
    icon: FaInstagram,
    color: "#E4405F",
    getUrl: () => `https://www.instagram.com/`,
  },
  {
    id: "tiktok",
    name: "تيك توك",
    icon: FaTiktok,
    color: "#000000",
    getUrl: () => `https://www.tiktok.com/`,
  },
];

// ==========================================
// Component
// ==========================================
export default function ShareButton({
  projectId,
  projectTitle,
  projectUrl,
  initialCount = 0,
  size = "md",
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [copied, setCopied] = useState(false);

  const sizes = {
    sm: { button: "px-3 py-1.5 text-xs", icon: "w-3.5 h-3.5" },
    md: { button: "px-4 py-2 text-sm", icon: "w-4 h-4" },
    lg: { button: "px-6 py-3 text-base", icon: "w-5 h-5" },
  };

  const s = sizes[size];

  // تسجيل مشاركة في السيرفر
  const recordShare = async (platform: string) => {
    try {
      await fetch("/api/shares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType: "PROJECT",
          targetId: projectId,
          platform,
        }),
      });
      setCount((c) => c + 1);
    } catch {
      // صامت
    }
  };

  // فتح النافذة
  const handleOpen = () => {
    setOpen(true);
  };

  // مشاركة عبر منصة
  const handlePlatformShare = (platform: (typeof platforms)[0]) => {
    const url = platform.getUrl(projectUrl, projectTitle);

    // للبريد، نستخدم window.location لأن mailto: لا يعمل مع window.open
    if (platform.id === "email") {
      window.location.href = url;
    } else {
      window.open(url, "_blank", "width=600,height=500,noopener,noreferrer");
    }

    recordShare(platform.id);
    setOpen(false);
  };

  // نسخ الرابط
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(projectUrl);
      setCopied(true);
      recordShare("copy");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = projectUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      recordShare("copy");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // مشاركة عبر Web Share API (للمتصفحات المدعومة)
  const handleNativeShare = async () => {
    try {
      if (typeof navigator !== "undefined" && "share" in navigator) {
        await navigator.share({
          title: projectTitle,
          url: projectUrl,
        });
        recordShare("native");
        setOpen(false);
      }
    } catch {
      // المستخدم ألغى المشاركة
    }
  };

  return (
    <>
      {/* زر المشاركة */}
      <button
        onClick={handleOpen}
        className={`flex items-center gap-2 rounded-xl font-bold transition-all bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-2 border-slate-200 dark:border-slate-700 hover:border-green-200 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10 hover:scale-105 ${s.button}`}
      >
        <Share2 className={s.icon} />
        <span>مشاركة</span>
        {count > 0 && <span className="tabular-nums">({count})</span>}
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#12121a] rounded-3xl p-6 w-full max-w-lg shadow-2xl border-2 border-slate-200 dark:border-white/10"
              dir="rtl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-green-500" />
                    مشاركة المشروع
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    شارك هذا المشروع عبر منصتك المفضلة
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                  aria-label="إغلاق"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Copy Link (Top - مهم) */}
              <div className="mb-4">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block">
                  رابط المشروع
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-700 dark:text-slate-300 truncate font-mono">
                    {projectUrl}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap ${
                      copied
                        ? "bg-green-500 text-white"
                        : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        تم
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        نسخ
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                <span className="text-xs font-bold text-slate-400">أو شارك عبر</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              </div>

              {/* Platforms Grid (2 columns) */}
              <div className="grid grid-cols-2 gap-3">
                {platforms.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <motion.button
                      key={platform.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePlatformShare(platform)}
                      className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl p-3 transition border-2 border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10 text-right"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${platform.color}15` }}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{ color: platform.color }}
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {platform.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Native Share (only on supported devices) */}
              {typeof navigator !== "undefined" && "share" in navigator && (
                <button
                  onClick={handleNativeShare}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 rounded-xl font-bold transition"
                >
                  <Share2 className="w-4 h-4" />
                  المزيد من الخيارات...
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}