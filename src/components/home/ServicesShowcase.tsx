"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Monitor, 
  Globe, 
  Smartphone, 
  Shield, 
  Palette, 
  GraduationCap, 
  Download 
} from "lucide-react";

// ==========================================
// 📦 7 خدمات مع 3 صور لكل خدمة
// ==========================================
const services = [
  {
    id: "web",
    title: "تطوير المواقع",
    titleEn: "Web Development",
    description: "مواقع احترافية سريعة ومتوافقة مع محركات البحث ومتجاوبة مع كل الأجهزة",
    images: [
      "/images/services/web-development.jpg",
      "/images/services/web-development1.jpg",
      "/images/services/web-development2.jpg",
    ],
    icon: Globe,
    color: "from-blue-500 to-cyan-500",
    accentColor: "#3B82F6",
  },
  {
    id: "mobile",
    title: "تطبيقات الجوال",
    titleEn: "Mobile Apps",
    description: "تطبيقات أندرويد وآيفون بأداء عالي وتصميم عصري يلبي احتياجاتك",
    images: [
      "/images/services/mobile-apps.jpg",
      "/images/services/mobile-apps1.jpg",
      "/images/services/mobile-apps2.jpg",
    ],
    icon: Smartphone,
    color: "from-green-500 to-emerald-500",
    accentColor: "#10B981",
  },
  {
    id: "systems",
    title: "الأنظمة البرمجية",
    titleEn: "Software Systems",
    description: "أنظمة إدارية متكاملة للمؤسسات والشركات بأعلى معايير الأمان والأداء",
    images: [
      "/images/services/systems.jpg",
      "/images/services/systems1.jpg",
      "/images/services/systems2.jpg",
    ],
    icon: Monitor,
    color: "from-purple-500 to-indigo-500",
    accentColor: "#8B5CF6",
  },
  {
    id: "security",
    title: "أنظمة الحماية",
    titleEn: "Security Systems",
    description: "أنظمة برمجية بحماية فائقة وتشفير متقدم لحماية بياناتك",
    images: [
      "/images/services/security.jpg",
      "/images/services/security1.jpg",
      "/images/services/security2.jpg",
    ],
    icon: Shield,
    color: "from-red-500 to-rose-500",
    accentColor: "#EF4444",
  },
  {
    id: "design",
    title: "تصاميم جرافيكس",
    titleEn: "Graphic Design",
    description: "هويات بصرية وتصاميم إبداعية تعكس شخصية علامتك التجارية",
    images: [
      "/images/services/graphics.jpg",
      "/images/services/graphics1.jpg",
      "/images/services/graphics2.jpg",
    ],
    icon: Palette,
    color: "from-orange-500 to-amber-500",
    accentColor: "#F97316",
  },
  {
    id: "graduation",
    title: "مشاريع التخرج",
    titleEn: "Graduation Projects",
    description: "مشاريع تخرج وبحوثات للطلاب والطالبات بإشراف كادر متخصص",
    images: [
      "/images/services/graduation.jpg",
      "/images/services/graduation1.jpg",
      "/images/services/graduation2.jpg",
    ],
    icon: GraduationCap,
    color: "from-teal-500 to-cyan-500",
    accentColor: "#14B8A6",
  },
  {
    id: "downloads",
    title: "مكتبة التحميلات",
    titleEn: "Downloads Library",
    description: "مكتبة شاملة للبرامج والأدوات والموارد التقنية التي تحتاجها",
    images: [
      "/images/services/downloads-library.jpg",
      "/images/services/downloads-library1.jpg",
      "/images/services/downloads-library2.jpg",
    ],
    icon: Download,
    color: "from-cyan-500 to-blue-500",
    accentColor: "#06B6D4",
  },
];

export default function ServicesShowcase() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [stage, setStage] = useState<0 | 1 | 2>(0);
    const [isPaused, setIsPaused] = useState(false);
  
    // 🆕 التمرير التلقائي بين المراحل
    useEffect(() => {
      const timer = setInterval(() => {
        setStage((prev) => ((prev + 1) % 3) as 0 | 1 | 2);
      }, 3000); // كل 4 ثواني
  
      return () => clearInterval(timer);
    }, [activeIndex]); // إعادة البدء عند تغيير الخدمة
  
    const activeService = services[activeIndex];

  const cycleStage = () => {
    setStage((prev) => ((prev + 1) % 3) as 0 | 1 | 2);
  };

  return (
    <section className="relative bg-slate-950 py-32 overflow-hidden">
      {/* خلفية متوهجة */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[150px]" />
      </div>

      {/* العنوان */}
      <div className="text-center relative z-10 mb-20 px-4">
        <span className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-full font-bold text-sm mb-6 backdrop-blur">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          خدماتنا المتميزة
        </span>
        <h2 className="text-5xl lg:text-7xl font-black text-white mb-6 tracking-tight">
          حلول{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
            برمجية ذكية
          </span>
        </h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          اكتشف مجموعة شاملة من الخدمات التقنية الاحترافية
        </p>
      </div>

      {/* المحتوى */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* عرض الصور المتحركة */}
          <div className="relative h-[500px] md:h-[600px] flex items-center justify-center order-2 lg:order-1">
            
            {/* هالة متوهجة */}
            <motion.div
              key={`halo-${activeIndex}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.4, scale: 1 }}
              className="absolute inset-0 rounded-full blur-[100px] pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${activeService.accentColor} 0%, transparent 70%)`,
              }}
            />

            {/* الصور الثلاث */}
            <div className="relative w-full max-w-2xl aspect-square" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeIndex}-${stage}`}
                  initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 1.1, rotateY: 20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeService.images[stage]}
                    alt={`${activeService.title} - المرحلة ${stage + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={stage === 0}
                    className="object-contain drop-shadow-[0_0_60px_rgba(59,130,246,0.5)]"
                  />
                </motion.div>
              </AnimatePresence>

              {/* بطاقة معلومات */}
              <motion.div
                key={`info-${activeIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-0 right-0 bg-slate-900/90 backdrop-blur border border-white/10 rounded-2xl p-4 z-10"
              >
                <div className="text-xs text-slate-400 mb-1">
                  {activeService.titleEn}
                </div>
                <div className="text-lg font-bold text-white">
                  {activeService.title}
                </div>
                <div className="text-xs mt-1" style={{ color: activeService.accentColor }}>
                  المرحلة: {stage === 0 ? "عرض عام" : stage === 1 ? "تفاصيل" : "تفكيك كامل"}
                </div>
              </motion.div>

              {/* أزرار المراحل */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {[0, 1, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStage(s as 0 | 1 | 2)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all backdrop-blur ${
                      stage === s
                        ? "bg-white text-slate-900 scale-110 shadow-lg"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {s + 1}
                  </button>
                ))}
              </div>

              {/* زر التالي */}
              <button
                onClick={cycleStage}
                className="absolute top-1/2 -translate-y-1/2 -right-4 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110 z-10"
                aria-label="المرحلة التالية"
              >
                <ArrowLeft className="w-6 h-6 rotate-180" />
              </button>
            </div>
          </div>

          {/* قائمة الخدمات */}
          <div className="order-1 lg:order-2 space-y-4">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isActive = index === activeIndex;
              return (
                <motion.button
                  key={service.id}
                  onClick={() => {
                    setActiveIndex(index);
                    setStage(0);
                  }}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className={`w-full text-right p-5 rounded-2xl border transition-all duration-500 group relative overflow-hidden ${
                    isActive
                      ? "bg-white/10 border-white/30 shadow-2xl"
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <div
                    className={`absolute top-0 right-0 h-full w-1 transition-all duration-500 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ background: service.accentColor }}
                  />

                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0 shadow-lg transition-transform duration-500 ${
                        isActive ? "scale-110" : "group-hover:scale-105"
                      }`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-lg font-bold mb-1 transition-colors ${
                          isActive ? "text-white" : "text-slate-300"
                        }`}
                      >
                        {service.title}
                      </h3>
                      <p
                        className={`text-xs leading-relaxed transition-colors line-clamp-1 ${
                          isActive ? "text-slate-300" : "text-slate-500"
                        }`}
                      >
                        {service.description}
                      </p>
                    </div>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-shrink-0"
                      >
                        <ArrowLeft 
                          className="w-5 h-5" 
                          style={{ color: service.accentColor }} 
                        />
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}