"use client";

import { motion } from "framer-motion";
import { Shield, Target, Users, DollarSign, FileCheck, Headphones } from "lucide-react";

export default function WhyUs() {
  const features = [
    { icon: Shield, title: "حماية فائقة", description: "أنظمة مؤمّنة بأحدث المعايير العالمية" },
    { icon: Target, title: "دقة عالية", description: "تطبيقات فائقة الدقة بدون أخطاء" },
    { icon: Users, title: "كادر متخصص", description: "فريق برمجي متميز بخبرة سنوات" },
    { icon: DollarSign, title: "أسعار مناسبة", description: "أفضل الأسعار مع إمكانية التقسيط" },
    { icon: FileCheck, title: "التزام بالعقد", description: "تسليم في المدة المحددة بالضبط" },
    { icon: Headphones, title: "دعم مستمر", description: "صيانة ومتابعة مجانية بعد التسليم" },
  ];

  const stats = [
    { number: "100+", label: "مشروع منجز" },
    { number: "4.5", label: "تقييم العملاء" },
    { number: "2,084", label: "مراجعة" },
    { number: "24/7", label: "دعم فني" },
  ];

  return (
    <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
      {/* خلفية */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59,130,246,0.5) 1px, transparent 0)`,
               backgroundSize: '40px 40px'
             }} 
        />
      </div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* النص */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 px-4 py-2 rounded-full font-bold text-sm mb-6">
              ⚡ لماذا تختارنا؟
            </span>
            <h2 className="text-4xl lg:text-6xl font-black mb-6 leading-tight tracking-tight">
              لماذا{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Code Tech
              </span>
              ؟
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed mb-10">
              نحن لسنا مجرد شركة برمجية – نحن شركاء نجاحك. نلتزم بتقديم
              أعلى مستويات الجودة والاحترافية في كل مشروع.
            </p>

            {/* الإحصائيات */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl lg:text-4xl font-black text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* المميزات */}
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-blue-400/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feature.description}
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