"use client";

import { useState, useEffect, useRef } from "react";
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
// 📦 7 خدمات بالترتيب المطلوب
// ==========================================
const services = [
  {
    id: "web",
    title: "تطوير المواقع",
    titleEn: "Web Development",
    description: "مواقع احترافية سريعة ومتوافقة مع محركات البحث ومتجاوبة مع كل الأجهزة",
    images: [
      "/images/services/web-development.png",
      "/images/services/web-development1.png",
      "/images/services/web-development2.png",
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
      "/images/services/mobile-apps.png",
      "/images/services/mobile-apps1.png",
      "/images/services/mobile-apps2.png",
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
      "/images/services/systems.png",
      "/images/services/systems1.png",
      "/images/services/systems2.png",
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
      "/images/services/security.png",
      "/images/services/security1.png",
      "/images/services/security2.png",
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
      "/images/services/graphics.png",
      "/images/services/graphics1.png",
      "/images/services/graphics2.png",
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
      "/images/services/graduation.png",
      "/images/services/graduation1.png",
      "/images/services/graduation2.png",
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
      "/images/services/downloads-library.png",
      "/images/services/downloads-library1.png",
      "/images/services/downloads-library2.png",
    ],
    icon: Download,
    color: "from-cyan-500 to-blue-500",
    accentColor: "#06B6D4",
  },
];

export default function ServicesShowcase() {
  // ==========================================
  // ✅ استخدام useRef لإدارة المؤشر (لضمان عدم إعادة التعيين)
  // ==========================================
  const [activeIndex, setActiveIndex] = useState(0);
  const [stage, setStage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // لحساب الإجمالي الكلي للصور
  const totalImages = services.reduce((acc, s) => acc + s.images.length, 0);
  
  // استخدام useRef لتخزين الموضع الحالي في التسلسل الكلي
  const positionRef = useRef(0);

  const activeService = services[activeIndex];
  const totalStages = activeService.images.length;

  // ==========================================
  // ✅ منطق التنقل التلقائي (مضمون 100%)
  // ==========================================
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      // زيادة الموضع الحالي
      positionRef.current = (positionRef.current + 1) % totalImages;
      
      // إيجاد الخدمة والمرحلة الجديدة
      let counter = 0;
      for (let i = 0; i < services.length; i++) {
        if (positionRef.current < counter + services[i].images.length) {
          setActiveIndex(i);
          setStage(positionRef.current - counter);
          break;
        }
        counter += services[i].images.length;
      }
    }, 2500);

    return () => clearInterval(timer);
  }, [isPaused, totalImages]);

  // ==========================================
  // ✅ عند الضغط على خدمة، انتقل إليها وابدأ من الصورة الأولى
  // ==========================================
  const handleServiceChange = (index: number) => {
    setActiveIndex(index);
    setStage(0);
    // تحديث positionRef ليتوافق مع الموضع الجديد
    let newPosition = 0;
    for (let i = 0; i < index; i++) {
      newPosition += services[i].images.length;
    }
    positionRef.current = newPosition;
  };

  // ==========================================
  // ✅ عند الضغط على نقطة، انتقل لتلك الصورة
  // ==========================================
  const handleStageChange = (index: number) => {
    setStage(index);
    // تحديث positionRef
    let newPosition = 0;
    for (let i = 0; i < activeIndex; i++) {
      newPosition += services[i].images.length;
    }
    positionRef.current = newPosition + index;
  };

  return (
    <section className="services-showcase-section relative bg-slate-50 dark:bg-[#0a0a0f] py-32 overflow-hidden transition-colors duration-300">
      {/* خلفية متوهجة */}
      <div className="absolute inset-0 opacity-30 dark:opacity-30">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[150px]" />
      </div>

      {/* العنوان */}
      <div className="text-center relative z-10 mb-20 px-4">
        <span className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-full font-bold text-sm mb-6 backdrop-blur">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          خدماتنا المتميزة
        </span>
        <h2 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
          حلول{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
            برمجية ذكية
          </span>
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          اكتشف مجموعة شاملة من الخدمات التقنية الاحترافية
        </p>
      </div>

      {/* المحتوى */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* عرض الصور المتحركة */}
          <div className="relative h-[500px] md:h-[600px] flex items-center justify-center order-2 lg:order-1">
            
            {/* ✅ هالة متوهجة مع أنيميشن (تعمل في الوضعين) */}
            <motion.div
              key={`halo-${activeIndex}`}
              animate={{ 
                opacity: [0.4, 0.8, 0.4], 
                scale: [1, 1.2, 1] 
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute inset-0 rounded-full blur-[100px] pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${activeService.accentColor} 0%, transparent 70%)`,
              }}
            />

            {/* ✅ توهج إضافي للوضع النهاري (أبيض/فضي) */}
            <motion.div
              key={`glow-light-${activeIndex}`}
              animate={{ 
                opacity: [0.5, 0.9, 0.5],
                scale: [1, 1.15, 1]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.3
              }}
              className="absolute inset-8 rounded-full blur-[80px] pointer-events-none dark:hidden"
              style={{
                background: `radial-gradient(circle, ${activeService.accentColor} 0%, transparent 70%)`,
              }}
            />

            {/* حلقات دوارة */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 rounded-full border border-slate-400 dark:border-white/10 pointer-events-none"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute inset-12 rounded-full border border-slate-300 dark:border-white/5 pointer-events-none"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 rounded-full border border-slate-400 dark:border-white/10 pointer-events-none"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute inset-12 rounded-full border border-slate-300 dark:border-white/5 pointer-events-none"
            />



            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute w-[420px] h-[420px] rounded-full border-2 border-dashed pointer-events-none border-slate-500/60 dark:border-white/20"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute w-[340px] h-[340px] rounded-full border pointer-events-none
                border-slate-400/50 dark:border-white/15"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute w-[260px] h-[260px] rounded-full border-2 border-dotted pointer-events-none
                border-slate-300/40 dark:border-white/10"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute w-[500px] h-[500px] rounded-full border border-dashed pointer-events-none opacity-40 dark:opacity-20"
              style={{ 
                borderColor: `${activeService.accentColor}80`,
              }}
            />

            <div 
              className="services-showcase-image relative w-full max-w-2xl aspect-square" 
              onMouseEnter={() => setIsPaused(true)} 
              onMouseLeave={() => setIsPaused(false)} 
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeIndex}-${stage}`}
                  initial={{ opacity: 0, scale: 0.85, rotateY: -20 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 1.1, rotateY: 20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center p-8"
                >
                  {/* ✅ استخدام motion.div للتحكم في التوهج بشكل موثوق */}
                  <motion.div
                    animate={{
                      filter: [
                        `drop-shadow(0 0 50px ${activeService.accentColor}CC) drop-shadow(0 0 100px ${activeService.accentColor}80)`,
                        `drop-shadow(0 0 80px ${activeService.accentColor}FF) drop-shadow(0 0 160px ${activeService.accentColor}AA)`,
                        `drop-shadow(0 0 50px ${activeService.accentColor}CC) drop-shadow(0 0 100px ${activeService.accentColor}80)`,
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <img
                      src={activeService.images[stage]}
                      alt={`${activeService.title} - ${stage + 1}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* بطاقة معلومات */}
              <motion.div
                key={`info-${activeIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-slate-200 dark:border-white/10 rounded-2xl p-4 z-10 shadow-lg"
              >
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  {activeService.titleEn}
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {activeService.title}
                </div>
                <div className="text-xs mt-1" style={{ color: activeService.accentColor }}>
                  صورة {stage + 1} من {totalStages}
                </div>
              </motion.div>

              {/* مؤشرات الصور (Dots) */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {activeService.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleStageChange(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === stage 
                        ? "w-8" 
                        : "w-2 bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/40"
                    }`}
                    style={idx === stage ? { background: activeService.accentColor } : undefined}
                    aria-label={`الذهاب إلى الصورة ${idx + 1}`}
                  />
                ))}
              </div>

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
                  onClick={() => handleServiceChange(index)}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className={`services-showcase-item w-full text-right p-5 rounded-2xl border transition-all duration-500 group relative overflow-hidden ${
                    isActive
                      ? "bg-white dark:bg-white/10 border-purple-400 dark:border-white/30 shadow-2xl"
                      : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20"
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
                          isActive ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {service.title}
                      </h3>
                      <p
                        className={`text-xs leading-relaxed transition-colors line-clamp-1 ${
                          isActive ? "text-slate-600 dark:text-slate-300" : "text-slate-500 dark:text-slate-500"
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