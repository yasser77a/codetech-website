"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowLeft,
  MessageCircle,
  ChevronDown,
  Star,
  TrendingUp,
  CreditCard,
  Globe,
  Smartphone,
  Shield,
  Palette,
  GraduationCap,
  Code2,
  Database,
  Zap,
  Check,
  X,
  Crown,
  Rocket,
  Search,
  PenTool,
  Eye,
  ShoppingCart,
  Layers,
  BarChart3,
} from "lucide-react";

import Services from "@/components/home/Services";
import WhyUs from "@/components/home/WhyUs";
import ServicesShowcase from "@/components/home/ServicesShowcase";
import PortfolioTabs from "@/components/home/PortfolioTabs";
import Reviews from "@/components/home/Reviews";
import CTA from "@/components/home/CTA";

// ==========================================
// 👥 أعضاء الفريق (بعد التعديل)
// ==========================================
const teamMembers = [
  { name: "ياسر الأشرم", role: "Founder & CEO", initial: "ي", color: "#8B5CF6" },
  { name: "علي اليماني", role: "Team Manager", initial: "ع", color: "#3B82F6" },
  { name: "ماجد الشرعبي", role: "CTO", initial: "م", color: "#10B981" },
  { name: "أحمد الفسيل", role: "Senior AI Architect", initial: "أ", color: "#EC4899" },
  { name: "هيام الكميم", role: "Lead UI/UX Designer", initial: "ه", color: "#F59E0B" },
  { name: "محمد العزاني", role: "Cyber Security Analyst", initial: "م", color: "#EF4444" },
  { name: "إسماعيل الشامي", role: "Cloud Operations Manager", initial: "إ", color: "#06B6D4" },
];

// ==========================================
// 🎯 شريط الخدمات
// ==========================================
const servicesMarquee = [
  { label: "تصميم مواقع", icon: Globe },
  { label: "تطبيقات أندرويد", icon: Smartphone },
  { label: "هوية بصرية", icon: Palette },
  { label: "متاجر إلكترونية", icon: ShoppingCart },
  { label: "تصميم جرافيك", icon: PenTool },
  { label: "تطوير واجهات", icon: Code2 },
  { label: "قواعد بيانات", icon: Database },
  { label: "تحسين أداء", icon: Zap },
  { label: "تحليلات متقدمة", icon: BarChart3 },
  { label: "أنظمة ERP", icon: Layers },
  { label: "أمن سيبراني", icon: Shield },
  { label: "مشاريع تخرج", icon: GraduationCap },
];

// ==========================================
// 🖼️ شرائح الـ Hero
// ==========================================
const heroSlides = [
  { src: "/images/hero/web-main.png", alt: "تطوير المواقع", label: "تطوير المواقع" },
  { src: "/images/hero/mobile-main.png", alt: "تطبيقات الجوال", label: "تطبيقات الجوال" },
  { src: "/images/hero/system-main.png", alt: "الأنظمة البرمجية", label: "الأنظمة البرمجية" },
  { src: "/images/hero/security-main.png", alt: "أنظمة الحماية", label: "أنظمة الحماية" },
  { src: "/images/hero/graphics-main.png", alt: "تصاميم جرافيكس", label: "تصاميم جرافيكس" },
  { src: "/images/hero/graduation-main.png", alt: "مشاريع التخرج", label: "مشاريع التخرج" },
  { src: "/images/hero/downloads-main.png", alt: "مكتبة التحميلات", label: "مكتبة التحميلات" },
];

// ==========================================
// 💼 أنظمة ERP (4 أنظمة)
// ==========================================
const erpSystems = [
  {
    id: "inventory",
    label: "المخازن",
    title: "نظام إدارة المخازن والمستودعات",
    subtitle: "نظام شامل لإدارة المخزون، حركات الأصناف، الجرد، والتقارير لحظياً.",
    url: "erp.codetech.ye/inventory",
    brand: "المخازن الرئيسية",
    role: "مدير المخزن",
    stats: [
      { label: "أصناف مُدارة", value: "12,847", change: "+8%", positive: true },
      { label: "حركات اليوم", value: "486", change: "+24%", positive: true },
      { label: "قيمة المخزون", value: "2.4M", change: "+12%", positive: true },
    ],
    chartTitle: "حركة المخزون - آخر 7 أيام",
    chartData: [60, 85, 45, 90, 70, 95, 80],
    chartLabels: ["س", "ح", "ن", "ث", "ر", "خ", "ج"],
    topItems: [
      { name: "إلكترونيات", value: 3420 },
      { name: "ملابس", value: 2810 },
      { name: "أغذية", value: 2240 },
      { name: "أدوات", value: 1890 },
    ],
    features: [
      "إدارة متعددة المستودعات",
      "تتبع حركات الأصناف",
      "نظام باركود QR/Bar",
      "تنبيهات نقص المخزون",
      "تقارير جرد دورية",
      "تكامل مع POS والفواتير",
    ],
    color: "#3B82F6",
    kpis: [
      { value: "+45%", label: "دقة الجرد" },
      { value: "-60%", label: "وقت المراجعة" },
    ],
  },
  {
    id: "hr",
    label: "الموارد البشرية",
    title: "نظام إدارة الموارد البشرية HR",
    subtitle: "إدارة كاملة للموظفين، الحضور، الرواتب، الإجازات، والتقييمات.",
    url: "erp.codetech.ye/hr",
    brand: "شركة Code Tech",
    role: "مدير HR",
    stats: [
      { label: "الموظفين", value: "248", change: "+12%", positive: true },
      { label: "حضور اليوم", value: "236", change: "+4%", positive: true },
      { label: "إجازات", value: "14", change: "-8%", positive: false },
    ],
    chartTitle: "الحضور الأسبوعي",
    chartData: [92, 95, 88, 96, 94, 90, 87],
    chartLabels: ["س", "ح", "ن", "ث", "ر", "خ", "ج"],
    topItems: [
      { name: "قسم التطوير", value: 84 },
      { name: "قسم التصميم", value: 42 },
      { name: "قسم المبيعات", value: 68 },
      { name: "قسم الدعم", value: 54 },
    ],
    features: [
      "إدارة ملفات الموظفين",
      "نظام الحضور والانصراف",
      "حساب الرواتب تلقائياً",
      "إدارة الإجازات والطلبات",
      "تقييم الأداء الدوري",
      "تطبيق موبايل للموظف",
    ],
    color: "#8B5CF6",
    kpis: [
      { value: "+38%", label: "كفاءة HR" },
      { value: "-50%", label: "وقت الرواتب" },
    ],
  },
  {
    id: "sales",
    label: "المبيعات",
    title: "نظام إدارة المبيعات والعملاء",
    subtitle: "إدارة كاملة للعملاء المحتملين، الفرص البيعية، العقود، والعمولات.",
    url: "erp.codetech.ye/sales",
    brand: "Sales Team",
    role: "مدير المبيعات",
    stats: [
      { label: "مبيعات الشهر", value: "486K", change: "+32%", positive: true },
      { label: "عملاء جدد", value: "128", change: "+18%", positive: true },
      { label: "صفقات مغلقة", value: "64", change: "+22%", positive: true },
    ],
    chartTitle: "المبيعات الأسبوعية",
    chartData: [45, 68, 52, 88, 72, 95, 84],
    chartLabels: ["س", "ح", "ن", "ث", "ر", "خ", "ج"],
    topItems: [
      { name: "أحمد الشامي", value: 184 },
      { name: "سارة العمراني", value: 142 },
      { name: "خالد يوسف", value: 118 },
      { name: "نورة محمد", value: 96 },
    ],
    features: [
      "إدارة العملاء المحتملين",
      "متابعة الفرص البيعية",
      "إدارة العقود والفواتير",
      "حساب العمولات تلقائياً",
      "تقارير أداء المندوبين",
      "تطبيق موبايل للمندوبين",
    ],
    color: "#10B981",
    kpis: [
      { value: "+52%", label: "نمو المبيعات" },
      { value: "+28%", label: "معدل الإغلاق" },
    ],
  },
  {
    id: "restaurants",
    label: "المطاعم",
    title: "نظام إدارة المطاعم والكافيهات",
    subtitle: "نظام شامل لإدارة الطلبات، الطاولات، المنيو الرقمي، والتقارير المالية.",
    url: "erp.codetech.ye/restaurants",
    brand: "مطعم النخبة",
    role: "مدير الفرع",
    stats: [
      { label: "طلبات اليوم", value: "342", change: "+18%", positive: true },
      { label: "طاولات", value: "24/32", change: "-3%", positive: false },
      { label: "إيراد اليوم", value: "18.4K", change: "+12%", positive: true },
    ],
    chartTitle: "مبيعات الأسبوع",
    chartData: [40, 65, 45, 80, 55, 90, 70],
    chartLabels: ["س", "ح", "ن", "ث", "ر", "خ", "ج"],
    topItems: [
      { name: "مشاوي مشكل", value: 84 },
      { name: "بيتزا مارغريتا", value: 67 },
      { name: "برجر لحم", value: 52 },
      { name: "باستا ألفريدو", value: 38 },
    ],
    features: [
      "إدارة الطاولات والطلبات",
      "منيو رقمي QR Code",
      "ربط مع تطبيقات التوصيل",
      "تقارير مخزون ومبيعات",
      "تعدد الفروع والكاشير",
      "نظام ولاء ونقاط للعملاء",
    ],
    color: "#F97316",
    kpis: [
      { value: "+42%", label: "سرعة الخدمة" },
      { value: "-70%", label: "وقت الطلب" },
    ],
  },
];

// ==========================================
// 🌐 المواقع
// ==========================================
const websites = [
  { name: "Barmajly Studio", desc: "منصة متكاملة لصناعة التطبيقات بالعربية دون كود", tag: "SaaS", color: "#8B5CF6", icon: "🚀" },
  { name: "RealEstate", desc: "متجر ومعرض عقارات مع لوحة تحكم كاملة", tag: "Real Estate", color: "#3B82F6", icon: "🏢" },
  { name: "MedicCare", desc: "منصة أطباء متخصصة", tag: "Healthcare", color: "#10B981", icon: "🩺" },
  { name: "ZayShop", desc: "متجر فاشون للملابس الفاخرة", tag: "Fashion", color: "#EC4899", icon: "👕" },
  { name: "Audiovox Store", desc: "متجر صوتيات عالية الجودة", tag: "E-commerce", color: "#F59E0B", icon: "🎧" },
  { name: "CHROMEX", desc: "مصنع طلاء معادن", tag: "Corporate", color: "#64748B", icon: "🏭" },
];

// ==========================================
// 📱 التطبيقات
// ==========================================
const apps = [
  { name: "Barmajly Studio", desc: "إنشاء تطبيقات دون برمجة بالعربية", rating: 4.8, downloads: "50K+", color: "#8B5CF6" },
  { name: "AI Booster", desc: "محسن أداء بالذكاء الاصطناعي", rating: 4.7, downloads: "1M+", color: "#3B82F6" },
  { name: "AI Booster Ultra", desc: "نسخة متقدمة من محسن الأداء", rating: 4.9, downloads: "500K+", color: "#06B6D4" },
  { name: "I Am Muslim", desc: "تطبيق إسلامي شامل", rating: 4.9, downloads: "2M+", color: "#10B981" },
  { name: "Face Insight AI", desc: "تحليل الوجه بالذكاء الاصطناعي", rating: 4.6, downloads: "200K+", color: "#EC4899" },
  { name: "AI Game Optimizer", desc: "محسن ألعاب بالذكاء الاصطناعي", rating: 4.5, downloads: "800K+", color: "#F59E0B" },
  { name: "AI GFX", desc: "متخصص في تسريع الألعاب", rating: 4.7, downloads: "300K+", color: "#EF4444" },
  { name: "AI Speaker Cleaner", desc: "تنظيف وتحسين صوت السماعات", rating: 4.6, downloads: "400K+", color: "#8B5CF6" },
];

// ==========================================
// 🚀 خطوات العمل
// ==========================================
const processSteps = [
  {
    icon: Search,
    number: "01",
    title: "الاستكشاف",
    description: "نفهم احتياجاتك وأهدافك بدقة، ونحلل السوق والمنافسين",
    color: "#3B82F6",
  },
  {
    icon: PenTool,
    number: "02",
    title: "التصميم",
    description: "نصمم واجهات UI/UX احترافية تركز على تجربة المستخدم",
    color: "#8B5CF6",
  },
  {
    icon: Code2,
    number: "03",
    title: "التطوير",
    description: "نبني نظامك بأحدث التقنيات مع اختبارات دقيقة وجودة عالية",
    color: "#EC4899",
  },
  {
    icon: Rocket,
    number: "04",
    title: "التسليم",
    description: "نُسلّم مشروعك مع الدعم والصيانة في حال تم الطلب",
    color: "#10B981",
  },
];

// ==========================================
// 💰 باقات الأسعار
// ==========================================
const pricingPlans = [
  {
    name: "الباقة الأساسية",
    subtitle: "مناسبة للمشاريع الناشئة",
    icon: Zap,
    color: "#3B82F6",
    gradient: "from-blue-500 to-cyan-500",
    popular: false,
    features: [
      { text: "استشارة تقنية مجانية", included: true },
      { text: "تصميم متجاوب", included: true },
      { text: "لوحة تحكم أساسية", included: true },
      { text: "دعم فني 3 أشهر", included: true },
      { text: "تدريب أساسي مجاني", included: true },
      { text: "استضافة سنة", included: true },
      { text: "تكامل APIs خارجية", included: false },
      { text: "تطبيق موبايل مرافق", included: false },
    ],
  },
  {
    name: "الباقة الاحترافية",
    subtitle: "الأكثر طلباً",
    icon: Crown,
    color: "#8B5CF6",
    gradient: "from-purple-500 to-pink-500",
    popular: true,
    features: [
      { text: "استشارة تقنية معمقة", included: true },
      { text: "تصميم UI/UX مخصص", included: true },
      { text: "لوحة تحكم متقدمة", included: true },
      { text: "دعم فني 6 أشهر", included: true },
      { text: "تدريب مكثف مجاني", included: true },
      { text: "استضافة سنة", included: true },
      { text: "تكامل APIs خارجية", included: true },
      { text: "تطبيق موبايل مرافق", included: true },
    ],
  },
  {
    name: "الباقة المؤسسية",
    subtitle: "للمؤسسات الكبرى",
    icon: Rocket,
    color: "#F59E0B",
    gradient: "from-amber-500 to-orange-500",
    popular: false,
    features: [
      { text: "استشارة تقنية شاملة", included: true },
      { text: "تصميم مخصص كامل", included: true },
      { text: "لوحة تحكم كاملة", included: true },
      { text: "دعم فني 12 شهر", included: true },
      { text: "تدريب دوري مجاني", included: true },
      { text: "استضافة سنتين", included: true },
      { text: "تكامل APIs متعددة", included: true },
      { text: "تطبيقات موبايل مرافقة", included: true },
    ],
  },
];

// ==========================================
// ❓ الأسئلة الشائعة
// ==========================================
const faqs = [
  {
    question: "كم يستغرق تطوير الموقع أو النظام؟",
    answer: [
      "المواقع الأساسية: 1-2 أسبوع",
      "المواقع المتقدمة: 3-6 أسابيع",
      "الأنظمة المتوسطة: 1-3 أشهر",
      "الأنظمة الكبيرة (ERP): 3-6 أشهر",
      "نُحدّد المدة بدقة في العقد ونلتزم بها",
    ],
  },
  {
    question: "هل يمكنني التسديد بالأقساط؟",
    answer: [
      "نعم، نوفر نظام دفع مرن",
      "عادةً: 40% دفعة أولى",
      "30% عند منتصف المشروع",
      "30% عند التسليم النهائي",
      "يمكن ترتيب جدول مخصص حسب حالتك",
    ],
  },
  {
    question: "ما الذي يشمله الدعم الفني؟",
    answer: [
      "إصلاح الأخطاء البرمجية مجاناً",
      "تحديثات أمنية دورية",
      "استشارات تقنية للاستخدام",
      "دعم عبر واتساب والبريد",
      "فترة الدعم تعتمد على الباقة المختارة",
    ],
  },
  {
    question: "هل يمكنكم تطوير تطبيق لـ iOS و Android؟",
    answer: [
      "نعم، نطور تطبيقات هجينة (React Native / Flutter)",
      "تعمل بكفاءة على النظامين",
      "أو تطبيقات Native منفصلة",
      "نختار الأنسب حسب احتياجك وميزانيتك",
      "نُسلّم الكود المصدري كاملاً",
    ],
  },
  {
    question: "ما التقنيات التي تستخدمونها؟",
    answer: [
      "Frontend: Next.js, React, TypeScript",
      "Backend: Node.js, Python, Laravel",
      "قواعد البيانات: PostgreSQL, MongoDB, MySQL",
      "Mobile: Flutter, React Native",
      "Cloud: AWS, Vercel, DigitalOcean",
    ],
  },
  {
    question: "هل تصبح ملكية الكود لي؟",
    answer: [
      "نعم 100% بعد سداد كامل المبلغ",
      "تحصل على الملكية الكاملة للكود المصدري",
      "جميع حقوق النشر والتعديل لك",
      "نُسلّم نسخة احتياطية كاملة",
      "نُسلّم وثائق المشروع كاملة",
    ],
  },
];

// ==========================================
// 🏠 الصفحة الرئيسية
// ==========================================
export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      <HeroSection />
      <ServicesMarquee />
      <Services />
      <ERPSection />
      <WhyUs />
      <ProcessSection />
      <WebsitesSection />
      <AppsSection />
      <ServicesShowcase />
      <PortfolioTabs />
      <PricingSection />
      <Reviews />
      <FAQSection />
      <CTA />
    </div>
  );
}

// ==========================================
// 🎯 Hero (مع الشعار كخلفية + تقسيم)
// ==========================================
function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const activeSlide = heroSlides[currentSlide];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* 🌌 خلفية أساسية */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]" />

      {/* ⭐ الشعار كخلفية ضخمة (باهتة) */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <img
          src="/logo.png"
          alt=""
          className="w-[700px] md:w-[1000px] lg:w-[1200px] h-auto object-contain blur-[2px]"
        />
      </motion.div>

      {/* هالات ملونة */}
      <motion.div
        className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-purple-600/20 rounded-full blur-[180px] pointer-events-none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[150px] pointer-events-none" />

      {/* شبكة */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* المحتوى الرئيسي - تقسيم عمودي */}
      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ═══ الجانب الأيسر: Slideshow الصور ═══ */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative w-full aspect-square max-w-xl mx-auto">
              {/* هالة ديناميكية */}
              <motion.div
                key={`halo-${currentSlide}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.5, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 rounded-full blur-[100px] bg-purple-500/50 pointer-events-none"
              />

              {/* حلقات دوارة */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-purple-500/20"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 rounded-full border border-blue-500/15"
              />

              {/* الصور */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 0.85, rotateY: -15 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.85, rotateY: 15 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center p-8"
                >
                  <img
                    src={activeSlide.src}
                    alt={activeSlide.alt}
                    className="max-w-full max-h-full object-contain drop-shadow-[0_0_80px_rgba(139,92,246,0.6)]"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Label */}
              <motion.div
                key={`label-${currentSlide}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-full px-5 py-2 shadow-2xl"
              >
                <span className="text-sm font-bold text-white">{activeSlide.label}</span>
              </motion.div>
            </div>
          </motion.div>

          {/* ═══ الجانب الأيمن: النص ═══ */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-1 lg:order-2 space-y-6 text-center lg:text-right"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-xl px-5 py-2.5 rounded-full"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-slate-300">شركة برمجية رائدة في اليمن</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            </motion.div>

            {/* العنوان */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.15] tracking-tight"
            >
              نبني أنظمة رقمية
              <br />
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: "200% auto" }}
              >
                تغيّر قواعد اللعبة
              </motion.span>
            </motion.h1>

            {/* الوصف */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              نطوّر مواقع وتطبيقات وأنظمة رقمية تساعد أعمالك على النمو بثقة.
            </motion.p>

            {/* الأزرار */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2"
            >
              <motion.a
                href="https://wa.me/967775566442"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="relative bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-slate-200 transition-all flex items-center gap-2 overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <MessageCircle className="w-5 h-5 relative z-10" />
                <span className="relative z-10">ابدأ مشروعك</span>
              </motion.a>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/portfolio"
                  className="bg-white/5 border border-white/10 backdrop-blur px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  تصفح الأعمال
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5"
            >
              {[
                { value: "+100", label: "مشروع منجز" },
                { value: "4.5/5", label: "تقييم العملاء" },
                { value: "+200", label: "عميل سعيد" },
              ].map((stat, i) => (
                <div key={i} className="text-center lg:text-right">
                  <div className="text-2xl md:text-3xl font-black text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ═══ الفريق المؤسس (كبير وواضح) ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="pt-20 mt-20 border-t border-white/5"
        >
          <div className="text-center mb-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl md:text-2xl lg:text-3xl font-black text-white tracking-wide mb-3"
            >
              الفريق المؤسس
            </motion.p>
            <div className="h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 max-w-7xl mx-auto">
            {teamMembers.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.08 }}
                whileHover={{ y: -8, scale: 1.05 }}
                className="group flex flex-col items-center gap-3 cursor-pointer"
              >
                <div className="relative">
                  {/* هالة توهج عند التحويم */}
                  <div
                    className="absolute inset-0 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: member.color }}
                  />
                  {/* الحلقة */}
                  <div
                    className="relative w-20 h-20 md:w-24 md:h-24 rounded-full p-[3px] transition-all duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${member.color}, ${member.color}66)`,
                    }}
                  >
                    <div className="w-full h-full rounded-full bg-[#0a0a0f] flex items-center justify-center text-2xl md:text-3xl font-black text-white group-hover:bg-[#12121a] transition-colors">
                      {member.initial}
                    </div>
                  </div>
                  {/* نقطة الحالة */}
                  <div
                    className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[#0a0a0f] group-hover:scale-125 transition-transform"
                    style={{ background: member.color }}
                  />
                </div>
                <div className="text-center">
                  <div className="text-sm md:text-base font-bold text-white whitespace-nowrap group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all">
                    {member.name}
                  </div>
                  <div className="text-[10px] md:text-xs text-slate-500 whitespace-nowrap mt-1">
                    {member.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* مؤشر التمرير */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block"
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-3 bg-white/40 rounded-full"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}

// ==========================================
// 🎯 Marquee
// ==========================================
function ServicesMarquee() {
  // 🎨 ألوان متناوبة للأيقونات
  const iconColors = [
    "#8B5CF6", // Purple
    "#3B82F6", // Blue
    "#06B6D4", // Cyan
    "#10B981", // Green
    "#F59E0B", // Amber
    "#EC4899", // Pink
    "#EF4444", // Red
    "#14B8A6", // Teal
  ];

  return (
    <section className="py-6 border-y border-white/5 bg-gradient-to-r from-[#0a0a0f] via-[#12121a] to-[#0a0a0f] overflow-hidden relative">
      {/* خط علوي متوهج */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      <div className="flex gap-10 animate-marquee whitespace-nowrap py-2">
        {[...servicesMarquee, ...servicesMarquee].map((service, i) => {
          const Icon = service.icon;
          const color = iconColors[i % iconColors.length];

          return (
            <div key={i} className="flex items-center gap-4 group cursor-pointer">
              {/* ── 1. الشرطة (أول عنصر) ── */}
              <span
                className="w-6 h-0.5 rounded-full flex-shrink-0 transition-all duration-300 group-hover:w-10"
                style={{ background: color }}
              />

              {/* ── 2. الأيقونة ── */}
              <motion.div
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="relative w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  background: `linear-gradient(135deg, ${color}30, ${color}10)`,
                  border: `1px solid ${color}40`,
                  boxShadow: `0 0 20px ${color}20`,
                }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </motion.div>

              {/* ── 3. الاسم ── */}
              <span
                className="text-lg md:text-xl font-bold text-slate-300 transition-colors flex-shrink-0"
                style={{ color: "inherit" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = color)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "")}
              >
                {service.label}
              </span>

              {/* ── 4. فاصل صغير بين العناصر ── */}
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 opacity-50"
                style={{ background: color }}
              />
            </div>
          );
        })}
      </div>

      {/* خط سفلي متوهج */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
    </section>
  );
}

// ==========================================
// 💼 ERP (مع إصلاح الرسم البياني)
// ==========================================
function ERPSection() {
  const [activeTab, setActiveTab] = useState(0);
  const active = erpSystems[activeTab];
  const maxValue = Math.max(...active.chartData);

  return (
    <section className="py-24 md:py-32 bg-[#0a0a0f] relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          exit={{ opacity: 0 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[700px] rounded-full blur-[200px] pointer-events-none"
          style={{ background: active.color }}
        />
      </AnimatePresence>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm text-purple-400 uppercase tracking-widest font-mono">
            Enterprise Solutions
          </span>
          <h2 className="text-4xl md:text-6xl font-black mt-4 mb-6">أنظمة ERP المتكاملة</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            أنظمة متكاملة لإدارة كل تفاصيل أعمالك
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {erpSystems.map((sys, i) => (
            <motion.button
              key={sys.id}
              onClick={() => setActiveTab(i)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                i === activeTab
                  ? "bg-white text-black shadow-lg"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10"
              }`}
            >
              {sys.label}
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto bg-gradient-to-br from-[#12121a] to-[#0a0a0f] border border-white/10 rounded-3xl overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid lg:grid-cols-2 gap-8 p-6 md:p-10 lg:p-14"
            >
              <div className="space-y-6 order-2 lg:order-1">
                <div>
                  <div
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
                    style={{ background: `${active.color}20`, color: active.color }}
                  >
                    {active.label}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black mb-3">{active.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{active.subtitle}</p>
                </div>

                <div className="flex gap-4">
                  {active.kpis.map((kpi, i) => (
                    <div key={i} className="flex-1 bg-white/5 rounded-xl p-3 border border-white/5">
                      <div className="text-xl md:text-2xl font-black" style={{ color: active.color }}>
                        {kpi.value}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{kpi.label}</div>
                    </div>
                  ))}
                </div>

                <ul className="space-y-3">
                  {active.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 text-slate-300"
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: `${active.color}20` }}
                      >
                        <Check className="w-3 h-3" style={{ color: active.color }} />
                      </div>
                      <span className="text-sm md:text-base">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Dashboard */}
              <div className="order-1 lg:order-2">
                <div className="rounded-2xl bg-[#0d0d14] border border-white/10 overflow-hidden shadow-2xl">
                  <div className="flex items-center gap-2 px-4 py-3 bg-[#12121a] border-b border-white/5">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-white/5 rounded-md px-3 py-1 text-[10px] md:text-xs text-slate-500 font-mono truncate">
                        {active.url}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 md:p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-500">لوحة التحكم</div>
                        <div className="text-base md:text-lg font-bold">{active.brand}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-[10px] text-slate-500">{active.role}</div>
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: active.color }}
                        >
                          {active.brand[0]}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 md:gap-3">
                      {active.stats.map((stat, i) => (
                        <div key={i} className="bg-white/5 rounded-xl p-2 md:p-3 border border-white/5">
                          <div className="text-[9px] md:text-[10px] text-slate-500 mb-1 truncate">
                            {stat.label}
                          </div>
                          <div className="text-sm md:text-base font-black">{stat.value}</div>
                          <div
                            className={`text-[9px] md:text-[10px] mt-0.5 ${
                              stat.positive ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {stat.change}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* ✅ الرسم البياني المُصلح */}
                    <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-[10px] md:text-xs text-slate-400 font-semibold">
                          {active.chartTitle}
                        </div>
                        <div className="text-[10px] text-slate-600">آخر 7 أيام</div>
                      </div>
                      <div className="flex items-end justify-between gap-2 md:gap-3 h-24 md:h-32">
                        {active.chartData.map((h, i) => {
                          const heightPercent = (h / maxValue) * 100;
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                              <div className="text-[9px] md:text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ color: active.color }}
                              >
                                {h}
                              </div>
                              <div className="w-full h-full flex items-end">
                                <motion.div
                                  initial={{ height: 0 }}
                                  whileInView={{ height: `${heightPercent}%` }}
                                  viewport={{ once: true }}
                                  transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
                                  className="w-full rounded-t-md relative overflow-hidden group-hover:opacity-100 transition-opacity"
                                  style={{
                                    background: `linear-gradient(180deg, ${active.color}, ${active.color}66)`,
                                    minHeight: "8px",
                                  }}
                                >
                                  <motion.div
                                    className="absolute inset-0 bg-white/20"
                                    initial={{ y: "-100%" }}
                                    animate={{ y: "100%" }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
                                  />
                                </motion.div>
                              </div>
                              <div className="text-[9px] md:text-[10px] text-slate-500 font-semibold">
                                {active.chartLabels[i]}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/5">
                      <div className="text-[10px] md:text-xs text-slate-500 mb-3">الأكثر حركة</div>
                      <div className="space-y-2">
                        {active.topItems.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 md:gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] md:text-xs text-slate-300 truncate">
                                  {item.name}
                                </span>
                                <span className="text-[10px] md:text-xs font-bold text-slate-400 mr-2">
                                  {item.value}
                                </span>
                              </div>
                              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{
                                    width: `${(item.value / active.topItems[0].value) * 100}%`,
                                  }}
                                  viewport={{ once: true }}
                                  transition={{ delay: i * 0.1, duration: 0.6 }}
                                  className="h-full rounded-full"
                                  style={{ background: active.color }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="border-t border-white/5 px-6 md:px-10 py-4 flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" />تشفير AES-256</div>
            <div className="flex items-center gap-2"><Database className="w-3.5 h-3.5" />سحابي أو On-Premise</div>
            <div className="flex items-center gap-2"><Code2 className="w-3.5 h-3.5" />API مفتوح للتكامل</div>
            <div className="flex items-center gap-2"><Smartphone className="w-3.5 h-3.5" />تطبيق موبايل في طلب العميل</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// 🔄 Process
// ==========================================
function ProcessSection() {
  return (
    <section className="py-24 md:py-32 bg-[#0d0d14] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-blue-600/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm text-blue-400 uppercase tracking-widest font-mono">Our Process</span>
          <h2 className="text-4xl md:text-6xl font-black mt-4 mb-6">كيف نعمل؟</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">4 خطوات واضحة من الفكرة إلى الإطلاق</p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          <div className="absolute top-16 right-0 left-0 h-0.5 bg-gradient-to-l from-blue-500/50 via-purple-500/50 to-green-500/50 hidden lg:block" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {processSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative text-center"
                >
                  <motion.div className="relative w-32 h-32 mx-auto mb-6" whileHover={{ scale: 1.05 }}>
                    <div className="absolute inset-0 rounded-full blur-[40px] opacity-30" style={{ background: step.color }} />
                    <div
                      className="relative w-full h-full rounded-full flex items-center justify-center border-4 border-[#0d0d14] shadow-xl"
                      style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}99)` }}
                    >
                      <Icon className="w-14 h-14 text-white" />
                    </div>
                    <div
                      className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-[#0a0a0f] border-2 flex items-center justify-center text-lg font-black"
                      style={{ borderColor: step.color, color: step.color }}
                    >
                      {step.number}
                    </div>
                  </motion.div>
                  <h3 className="text-2xl font-black mb-3">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 🌐 Websites
// ==========================================
function WebsitesSection() {
  return (
    <section className="py-24 md:py-32 bg-[#0a0a0f] relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm text-cyan-400 uppercase tracking-widest font-mono">Our Websites</span>
          <h2 className="text-4xl md:text-6xl font-black mt-4 mb-6">مواقعنا الإلكترونية</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">مشاريع حقيقية تم تطويرها بأحدث التقنيات</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto">
          {websites.map((site, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="group relative bg-[#12121a] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#0a0a0f] flex items-center justify-center p-6">
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl transition-transform group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${site.color}30, ${site.color}10)`,
                    boxShadow: `0 20px 60px ${site.color}40`,
                  }}
                >
                  {site.icon}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base md:text-lg font-black">{site.name}</h3>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-mono"
                    style={{ background: `${site.color}20`, color: site.color }}
                  >
                    {site.tag}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-400 line-clamp-2">{site.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 📱 Apps
// ==========================================
function AppsSection() {
  return (
    <section className="py-24 md:py-32 bg-[#0d0d14] relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-600/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm text-cyan-400 uppercase tracking-widest font-mono">Our Apps</span>
          <h2 className="text-4xl md:text-6xl font-black mt-4 mb-6">تطبيقاتنا</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">تطبيقات ذكية مع تقييمات عالية وملايين التحميلات</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {apps.map((app, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="group bg-[#12121a] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${app.color}, ${app.color}99)`,
                  boxShadow: `0 10px 30px ${app.color}40`,
                }}
              >
                <span className="text-2xl font-black text-white">{app.name[0]}</span>
              </div>
              <h3 className="text-base font-black mb-1 truncate">{app.name}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-4 h-8">{app.desc}</p>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-bold">{app.rating}</span>
                </div>
                <div className="text-slate-500">{app.downloads}</div>
              </div>
              <button
                className="w-full mt-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 hover:scale-105"
                style={{ background: `${app.color}15`, color: app.color }}
              >
                <Eye className="w-3.5 h-3.5" />
                عرض التفاصيل
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 💰 Pricing
// ==========================================
function PricingSection() {
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  return (
    <section className="py-24 md:py-32 bg-[#0a0a0f] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-purple-600/10 rounded-full blur-[200px] pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm text-purple-400 uppercase tracking-widest font-mono">Pricing Plans</span>
          <h2 className="text-4xl md:text-6xl font-black mt-4 mb-6">باقات تناسب احتياجك</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            مميزات متكاملة لكل باقة — تواصل معنا لمعرفة التفاصيل والأسعار
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, i) => {
            const Icon = plan.icon;
            const isPopular = plan.popular;
            const isHovered = hoveredPlan === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                onMouseEnter={() => setHoveredPlan(i)}
                onMouseLeave={() => setHoveredPlan(null)}
                className={`relative rounded-3xl p-8 transition-all duration-500 ${
                  isPopular
                    ? "bg-gradient-to-br from-purple-500/20 via-[#12121a] to-[#0a0a0f] border-2 border-purple-500/50 scale-105 lg:scale-110 shadow-2xl shadow-purple-500/30"
                    : "bg-[#12121a] border border-white/10"
                } ${isHovered && !isPopular ? "scale-105 shadow-2xl" : ""}`}
              >
                {isPopular && (
                  <div className="absolute -top-4 right-1/2 translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Crown className="w-3 h-3" />
                    الأكثر طلباً
                  </div>
                )}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-1">{plan.name}</h3>
                <p className="text-sm text-slate-400 mb-8">{plan.subtitle}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li
                      key={j}
                      className={`flex items-center gap-3 text-sm ${
                        feature.included ? "text-slate-300" : "text-slate-600 line-through"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          feature.included ? "bg-green-500/20" : "bg-white/5"
                        }`}
                      >
                        {feature.included ? (
                          <Check className="w-3 h-3 text-green-400" />
                        ) : (
                          <X className="w-3 h-3 text-slate-600" />
                        )}
                      </div>
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={`https://wa.me/967775566442?text=${encodeURIComponent(`مرحباً، أريد الاستفسار عن ${plan.name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full text-center py-4 rounded-xl font-bold transition-all ${
                    isPopular
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-2xl hover:shadow-purple-500/50"
                      : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                  }`}
                >
                  اطلب هذه الباقة
                </a>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12 text-sm text-slate-500 flex flex-wrap items-center justify-center gap-4"
        >
          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /><span>تسديد بالأقساط</span></div>
          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /><span>تدريب مجاني</span></div>
          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /><span>دعم فني لفترة محددة</span></div>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// ❓ FAQ
// ==========================================
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 md:py-32 bg-[#0d0d14] relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm text-blue-400 uppercase tracking-widest font-mono">FAQ</span>
          <h2 className="text-4xl md:text-6xl font-black mt-4 mb-6">الأسئلة الشائعة</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">إجابات على أكثر الأسئلة التي تصلنا</p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`bg-[#12121a] border rounded-2xl overflow-hidden transition-all ${
                  isOpen ? "border-purple-500/40" : "border-white/10"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-6 text-right hover:bg-white/5 transition-colors"
                >
                  <span className={`text-base md:text-lg font-bold transition-colors ${isOpen ? "text-purple-400" : "text-white"}`}>
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isOpen ? "bg-purple-500/20" : "bg-white/5"
                    }`}
                  >
                    <ChevronDown className={`w-4 h-4 ${isOpen ? "text-purple-400" : "text-slate-400"}`} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-white/5 pt-4">
                        <ul className="space-y-2.5">
                          {faq.answer.map((point, j) => (
                            <li key={j} className="flex items-start gap-3 text-slate-400 text-sm md:text-base">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-slate-400 mb-4">لم تجد إجابتك؟</p>
          <a
            href="https://wa.me/967775566442"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-full font-bold hover:shadow-2xl hover:shadow-green-500/30 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            اسألنا مباشرة
          </a>
        </motion.div>
      </div>
    </section>
  );
}