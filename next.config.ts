import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ ضغط الصور تلقائياً
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 يوم
  },

  // ✅ ضغط الملفات
  compress: true,

  // ✅ إزالة console.log في production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // ✅ تحسين Turbopack - استيراد حزم أسرع
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "recharts",
    ],
  },

  // ✅ تفعيل Strict Mode
  reactStrictMode: true,

  // ✅ إخفاء الترويسة
  poweredByHeader: false,
};

export default nextConfig;