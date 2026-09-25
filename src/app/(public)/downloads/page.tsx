"use client";

import { motion } from "framer-motion";
import { Download, FileText, Package, Shield, Zap, MessageCircle } from "lucide-react";

export default function DownloadsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur border border-blue-400/30 px-5 py-2.5 rounded-full mb-6"
          >
            <Package className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold">مكتبة التحميلات</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-6xl font-black mb-4"
          >
            مكتبة شاملة
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              {" "}للبرامج والأدوات
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-300 max-w-2xl mx-auto"
          >
            كل ما تحتاجه من برامج وأدوات وموارد تقنية في مكان واحد
          </motion.p>
        </div>
      </section>

      {/* قريباً */}
      <section className="container mx-auto px-4 py-20 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center shadow-lg border border-slate-100 dark:border-slate-800"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Download className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
            قريباً...
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            نعمل حالياً على تجهيز مكتبة شاملة من البرامج والأدوات والموارد 
            التقنية. تابعنا قريباً للحصول على كل ما تحتاجه.
          </p>

          <a
            href="https://wa.me/967775566442"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-lg"
          >
            <MessageCircle className="w-5 h-5" />
            اطلب برنامجاً معيناً
          </a>
        </motion.div>

        {/* معلومات إضافية */}
        <div className="grid md:grid-cols-3 gap-4 mt-12">
          {[
            { icon: Package, title: "برامج متنوعة", color: "from-blue-500 to-cyan-500" },
            { icon: Shield, title: "آمنة ومضمونة", color: "from-green-500 to-emerald-500" },
            { icon: Zap, title: "روابط سريعة", color: "from-orange-500 to-red-500" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 text-center border border-slate-100 dark:border-slate-800"
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}