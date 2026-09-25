"use client";

import { motion } from "framer-motion";
import { Monitor, Globe, Smartphone, Shield, Palette, GraduationCap, ArrowLeft } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: Monitor,
      title: "أنظمة سطح المكتب",
      description: "أنظمة إدارية متكاملة للمؤسسات والشركات بأعلى معايير الأمان والأداء",
      color: "from-blue-500 to-blue-700",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      icon: Globe,
      title: "مواقع الويب",
      description: "مواقع احترافية سريعة ومتوافقة مع محركات البحث ومتجاوبة مع كل الأجهزة",
      color: "from-purple-500 to-purple-700",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      icon: Smartphone,
      title: "تطبيقات الجوال",
      description: "تطبيقات أندرويد وآيفون بأداء عالي وتصميم عصري يلبي احتياجاتك",
      color: "from-green-500 to-green-700",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      icon: Shield,
      title: "أنظمة الحماية",
      description: "أنظمة برمجية بحماية فائقة وتشفير متقدم لحماية بياناتك",
      color: "from-red-500 to-red-700",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      icon: Palette,
      title: "تصاميم جرافيكس",
      description: "هويات بصرية وتصاميم إبداعية تعكس شخصية علامتك التجارية",
      color: "from-orange-500 to-orange-700",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      icon: GraduationCap,
      title: "مشاريع التخرج",
      description: "مشاريع تخرج وبحوثات للطلاب والطالبات بإشراف كادر متخصص",
      color: "from-teal-500 to-teal-700",
      bgColor: "bg-teal-50",
      textColor: "text-teal-600",
    },
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        
        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-bold text-sm mb-4 border border-blue-100">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            خدماتنا المتميزة
          </span>
          <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mb-6 leading-[1.3]">
            حلول برمجية
            <span className="block mt-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 pb-2">
              متكاملة واحترافية
            </span>
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed">
            نقدم مجموعة شاملة من الخدمات التقنية بأعلى معايير الجودة
            وأسعار منافسة مع إمكانية التسديد بالأقساط
          </p>
        </motion.div>

        {/* الشبكة */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 overflow-hidden"
              >
                {/* خلفية متدرجة عند التحويم */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                {/* الأيقونة */}
                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                </div>

                {/* العنوان */}
                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>

                {/* الوصف */}
                <p className="text-slate-600 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* الرابط */}
                <a
                  href={`https://wa.me/967775566442?text=${encodeURIComponent(`مرحباً، أريد استشارة حول: ${service.title}`)}`}
                  target="_blank"
                  className={`inline-flex items-center gap-2 ${service.textColor} font-bold group-hover:gap-3 transition-all`}
                >
                  اطلب الخدمة
                  <ArrowLeft className="w-4 h-4" />
                </a>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <a
            href="/services"
            className="inline-flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-xl"
          >
            🎯 عرض كل الخدمات
            <ArrowLeft className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}