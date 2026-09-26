"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Phone, 
  MapPin, 
  Clock,
  Home,
  Users,
  Briefcase,
  Image as ImageIcon,
  Star,
  Code2,
  Globe,
  Smartphone,
  Palette,
  GraduationCap
} from "lucide-react";

// ═══════════════════════════════════════════
// أيقونات مخصصة
// ═══════════════════════════════════════════
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export default function Footer() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isOpen, setIsOpen] = useState(true);
  const logoRef = useRef<HTMLDivElement>(null);

  // ═══════════════════════════════════════════
  // ✅ منطق الحالة (مفتوح/مغلق) - 10 ص إلى 11 م
  // ═══════════════════════════════════════════
  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const currentHour = now.getHours();
      // 10:00 ص = 10 | 11:00 م = 23
      setIsOpen(currentHour >= 10 && currentHour < 23);
    };

    checkStatus();
    // تحديث الحالة كل دقيقة
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // ═══════════════════════════════════════════
  // تتبع الماوس لتحريك الشعار
  // ═══════════════════════════════════════════
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!logoRef.current) return;
      const rect = logoRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const offsetX = (e.clientX - centerX) / 25;
      const offsetY = (e.clientY - centerY) / 25;
      
      const maxOffset = 12;
      setMousePosition({
        x: Math.max(-maxOffset, Math.min(maxOffset, offsetX)),
        y: Math.max(-maxOffset, Math.min(maxOffset, offsetY)),
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const services = [
    { icon: Code2, label: "أنظمة سطح المكتب", color: "#3B82F6" },
    { icon: Globe, label: "مواقع الويب", color: "#8B5CF6" },
    { icon: Smartphone, label: "تطبيقات الجوال", color: "#10B981" },
    { icon: Palette, label: "تصاميم جرافيكس", color: "#F97316" },
    { icon: GraduationCap, label: "مشاريع التخرج", color: "#14B8A6" },
  ];

  const quickLinks = [
    { href: "/", label: "الرئيسية", icon: Home },
    { href: "/about", label: "من نحن", icon: Users },
    { href: "/services", label: "الخدمات", icon: Briefcase },
    { href: "/portfolio", label: "أعمالنا", icon: ImageIcon },
    { href: "/reviews", label: "التقييمات", icon: Star },
  ];

  return (
    <footer className="relative bg-slate-50 dark:bg-[#050508] pt-12 pb-6 mt-20 overflow-hidden transition-colors duration-300">
      {/* طبقات خلفية */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[100px]" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* ═══ الصف الرئيسي: 5 أعمدة ═══ */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 pb-8 mb-6 border-b border-slate-200 dark:border-white/10">
          
          {/* ═══ العمود 1: الشعار + الاسم ═══ */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="group inline-block">
              <div 
                ref={logoRef}
                className="flex items-center gap-3 mb-4 transition-all duration-300 group-hover:scale-105"
              >
                <div 
                  className="relative w-20 h-20 flex items-center justify-center transition-transform duration-300 ease-out"
                  style={{
                    transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                  }}
                >
                  <div className="absolute inset-0 rounded-full bg-blue-500/70 dark:bg-blue-500/80 blur-2xl animate-pulse" />
                  <div className="absolute inset-0 rounded-full bg-red-500/60 dark:bg-red-500/70 blur-xl" />
                  <div className="absolute -inset-1 rounded-full bg-cyan-400/40 dark:bg-cyan-400/30 blur-lg" />
                  
                  <img 
                    src="/logo.png" 
                    alt="Code Tech" 
                    className="relative h-20 w-20 object-contain 
                      drop-shadow-[0_0_25px_rgba(59,130,246,1)] 
                      dark:drop-shadow-[0_0_30px_rgba(59,130,246,1)]" 
                  />
                </div>
                
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                    Code Tech
                  </h2>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-bold">
                    حلول برمجية ذكية
                  </p>
                </div>
              </div>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              نبني أنظمة برمجية بحماية فائقة ودقة عالية. شريكك التقني الموثوق.
            </p>
          </div>

          {/* ═══ العمود 2: خدماتنا ═══ */}
          <div>
            <h3 className="group font-bold text-base mb-4 text-slate-900 dark:text-white flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-110 hover:-translate-y-1 origin-right hover:text-purple-600 dark:hover:text-purple-400">
              <div className="w-1 h-5 bg-purple-500 rounded-full transition-all duration-300 group-hover:h-7 group-hover:w-1.5" />
              خدماتنا
            </h3>
            <ul className="space-y-2.5">
              {services.map((service, i) => {
                const Icon = service.icon;
                return (
                  <li key={i}>
                    <Link
                      href={`/services#${service.label}`}
                      className="group flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 origin-right"
                      style={{ '--hover-color': service.color } as React.CSSProperties}
                    >
                      <Icon 
                        className="w-4 h-4 transition-all duration-300 group-hover:scale-125 group-hover:rotate-6" 
                        style={{ color: service.color }} 
                      />
                      <span className="font-medium transition-colors duration-300 group-hover:text-[var(--hover-color)]">
                        {service.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ═══ العمود 3: روابط سريعة ═══ */}
          <div>
            <h3 className="group font-bold text-base mb-4 text-slate-900 dark:text-white flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-110 hover:-translate-y-1 origin-right hover:text-blue-600 dark:hover:text-blue-400">
              <div className="w-1 h-5 bg-blue-500 rounded-full transition-all duration-300 group-hover:h-7 group-hover:w-1.5" />
              روابط سريعة
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link, i) => {
                const Icon = link.icon;
                return (
                  <li key={i}>
                    <Link 
                      href={link.href} 
                      className="group flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 origin-right"
                    >
                      <Icon className="w-4 h-4 transition-all duration-300 group-hover:scale-125 group-hover:rotate-6 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                      <span className="font-medium transition-colors duration-300">{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ═══ العمود 4: تواصل معنا ═══ */}
          <div>
            <h3 className="group font-bold text-base mb-4 text-slate-900 dark:text-white flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-110 hover:-translate-y-1 origin-right hover:text-green-600 dark:hover:text-green-400">
              <div className="w-1 h-5 bg-green-500 rounded-full transition-all duration-300 group-hover:h-7 group-hover:w-1.5" />
              تواصل معنا
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a 
                  href="https://maps.google.com/?q=Sanaa,Yemen" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 origin-right"
                >
                  <MapPin className="w-4 h-4 text-purple-500 flex-shrink-0 transition-all duration-300 group-hover:scale-125 group-hover:rotate-6" />
                  <span className="font-medium transition-colors duration-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                    اليمن - صنعاء
                  </span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+967775566442" 
                  className="group flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 origin-right"
                >
                  <Phone className="w-4 h-4 text-green-500 flex-shrink-0 transition-all duration-300 group-hover:scale-125 group-hover:rotate-6" />
                  <span 
                    className="font-medium transition-colors duration-300 group-hover:text-green-600 dark:group-hover:text-green-400"
                    style={{ direction: 'ltr', unicodeBidi: 'embed' }}
                  >
                    +967 775566442
                  </span>
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/967775566442" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 origin-right"
                >
                  <WhatsAppIcon className="w-4 h-4 text-green-500 flex-shrink-0 transition-all duration-300 group-hover:scale-125 group-hover:rotate-6" />
                  <span className="font-medium transition-colors duration-300 group-hover:text-green-600 dark:group-hover:text-green-400">
                    واتساب
                  </span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.facebook.com/CodeTech.ye" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 origin-right"
                >
                  <FacebookIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 transition-all duration-300 group-hover:scale-125 group-hover:rotate-6" />
                  <span className="font-medium transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    فيسبوك
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* ═══ العمود 5: أوقات العمل - التصميم 5 (النبض المضيء) ═══ */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="group font-bold text-base mb-4 text-slate-900 dark:text-white flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-110 hover:-translate-y-1 origin-right hover:text-purple-600 dark:hover:text-purple-400">
              <div className="w-1 h-5 bg-purple-500 rounded-full transition-all duration-300 group-hover:h-7 group-hover:w-1.5" />
              أوقات العمل
            </h3>
            
            {/* ✅ التصميم 5: النبض المضيء */}
            <div className="group relative transition-all duration-500 hover:scale-105">
              
              {/* ═══ النبض الخلفي: يتغير حسب الحالة ═══ */}
              <div className={`absolute inset-0 rounded-xl blur-xl transition-all duration-500 ${
                isOpen 
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 opacity-60 animate-pulse" 
                  : "bg-gradient-to-r from-red-500 to-rose-500 opacity-40"
              }`} />
              
              {/* ═══ البطاقة ═══ */}
              <div className="relative rounded-xl bg-white dark:bg-[#12121a] p-3 border border-purple-400/40 dark:border-purple-500/40">
                
                {/* ═══ نقطة الحالة (خضراء أو حمراء) ═══ */}
                <div className="absolute -top-1 -right-1">
                  <div className={`w-3 h-3 rounded-full relative ${
                    isOpen ? "bg-green-500" : "bg-red-500"
                  }`}>
                    {/* حلقة النبض */}
                    <div className={`absolute inset-0 rounded-full animate-ping ${
                      isOpen ? "bg-green-500" : "bg-red-500"
                    }`} />
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  {/* أيقونة الساعة */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isOpen 
                      ? "bg-gradient-to-br from-purple-500 to-blue-500" 
                      : "bg-gradient-to-br from-red-500 to-rose-500"
                  }`}>
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  
                  {/* الأيام */}
                  <div className="text-[11px] font-black text-slate-900 dark:text-white">
                    السبت - الخميس
                  </div>
                  
                  {/* الوقت: 10:00 ص - 11:00 م */}
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-slate-400" style={{ direction: 'rtl' }}>
                    <span>10:00 ص</span>
                    <span className="text-purple-500">→</span>
                    <span>11:00 م</span>
                  </div>

                  {/* ═══ رسالة الحالة ═══ */}
                  <div className={`w-full mt-2 pt-3 border-t transition-colors duration-500 ${
                    isOpen 
                      ? "border-green-300/50 dark:border-green-500/30" 
                      : "border-red-300/50 dark:border-red-500/30"
                  }`}>
                    <div className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-black transition-all duration-500 text-center ${
                      isOpen 
                        ? "bg-green-500/10 dark:bg-green-500/20 text-green-700 dark:text-green-300" 
                        : "bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-300"
                    }`}>
                      {/* أيقونة الحالة */}
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        isOpen ? "bg-green-500" : "bg-red-500"
                      }`}>
                        <div className={`w-full h-full rounded-full animate-ping ${
                          isOpen ? "bg-green-500" : "bg-red-500"
                        }`} />
                      </div>
                      
                      {/* النص المكبّر */}
                      <span className="text-[13px] sm:text-sm leading-tight">
                        {isOpen ? "متصل الآن — تواصل معنا" : "غير متصل حالياً — اترك رسالة"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ الأسفل: الحقوق + صُنع بـ ❤️ ═══ */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <div>© 2026 Code Tech – جميع الحقوق محفوظة</div>
          <div className="flex items-center gap-1">
            صُنع بـ <span className="text-red-500 animate-pulse">❤️</span> في اليمن
          </div>
        </div>
      </div>
    </footer>
  );
}