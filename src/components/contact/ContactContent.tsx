"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFacebook } from "react-icons/fa";
import {
  MessageCircle,
  Phone,
  MapPin,
  Mail,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Clock,
} from "lucide-react";

// ==========================================
// Types
// ==========================================
interface FormData {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

// ==========================================
// 🎯 معلومات التواصل
// ==========================================
const contactInfo = [
  {
    icon: MessageCircle,
    title: "واتساب",
    value: "+967 775566442",
    href: "https://wa.me/967775566442",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-100 dark:bg-green-500/20",
    textColor: "text-green-600 dark:text-green-400",
  },
  {
    icon: Phone,
    title: "الهاتف",
    value: "+967 775566442",
    href: "tel:+967775566442",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-100 dark:bg-blue-500/20",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: MapPin,
    title: "العنوان",
    value: "صنعاء — الدائري، حي جامعة صنعاء القديمة",
    href: null,
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-100 dark:bg-red-500/20",
    textColor: "text-red-600 dark:text-red-400",
  },
  {
    icon: FaFacebook,
    title: "فيسبوك",
    value: "CodeTech.ye",
    href: "https://www.facebook.com/CodeTech.ye",
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-100 dark:bg-indigo-500/20",
    textColor: "text-indigo-600 dark:text-indigo-400",
  },
];

// ==========================================
// 🎯 الخدمات
// ==========================================
const serviceOptions = [
  "موقع ويب",
  "تطبيق جوال",
  "نظام برمجي (ERP)",
  "تصميم UI/UX",
  "مشروع تخرج",
  "استشارة تقنية",
  "أخرى",
];

// ==========================================
// 🏠 المكوّن الرئيسي
// ==========================================
export default function ContactContent() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  // ==========================================
  // التحقق
  // ==========================================
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim() || form.name.trim().length < 3) {
      newErrors.name = "الاسم يجب أن يكون 3 أحرف على الأقل";
    }

    if (!form.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    if (!form.message.trim() || form.message.trim().length < 10) {
      newErrors.message = "الرسالة يجب أن تكون 10 أحرف على الأقل";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==========================================
  // الإرسال
  // ==========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          subject: form.serviceType ? `استفسار عن ${form.serviceType}` : null,
          message: form.message.trim(),
          serviceType: form.serviceType || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "فشل إرسال الرسالة");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        serviceType: "",
        message: "",
      });
    } catch (err) {
      console.error("Contact form error:", err);
      setServerError("تعذر الاتصال بالخادم");
    }

    setLoading(false);
  };

  return (
    <div className="bg-slate-50 dark:bg-[#0a0a0f] transition-colors duration-300">
      {/* ============================================ */}
      {/* Hero */}
      {/* ============================================ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-400/30 dark:bg-purple-500/20 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-400/30 dark:bg-blue-500/20 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 py-24 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-purple-200/50 dark:border-white/10 px-5 py-2.5 rounded-full mb-6 shadow-lg">
            <Sparkles className="w-4 h-4 text-purple-500 dark:text-purple-400" />
            <span className="text-sm font-bold text-purple-700 dark:text-purple-100">
              نحن هنا لمساعدتك
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="text-slate-900 dark:text-white">تواصل </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400">
              معنا
            </span>
          </h1>

          <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            نحن هنا للإجابة على استفساراتك — تواصل معنا بالطريقة التي تناسبك
          </p>
        </div>
      </section>

      {/* ============================================ */}
      {/* المحتوى */}
      {/* ============================================ */}
      <section className="py-24 bg-white dark:bg-[#0a0a0f] transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
            {/* ============================================ */}
            {/* معلومات التواصل (2/5) */}
            {/* ============================================ */}
            <div className="lg:col-span-2 space-y-4">
              <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                  معلومات التواصل
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  اختر الطريقة الأنسب لك
                </p>
                <div className="h-1 w-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mt-4" />
              </div>

              {contactInfo.map((info, i) => {
                const Icon = info.icon;
                const Wrapper = info.href ? motion.a : motion.div;
                const wrapperProps = info.href
                  ? {
                      href: info.href,
                      target: info.href.startsWith("http") ? "_blank" : undefined,
                      rel: info.href.startsWith("http") ? "noopener noreferrer" : undefined,
                    }
                  : {};

                return (
                  <Wrapper
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    {...wrapperProps}
                    className={`flex items-start gap-4 bg-white dark:bg-[#12121a] rounded-2xl p-5 border border-slate-200 dark:border-white/10 transition-all ${
                      info.href
                        ? "hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${info.bgColor} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className={`w-6 h-6 ${info.textColor}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-900 dark:text-white mb-1">
                        {info.title}
                      </div>
                      <div
                        className={`text-sm break-words ${
                          info.href
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-slate-600 dark:text-slate-400"
                        }`}
                        dir={info.title === "الهاتف" || info.title === "واتساب" ? "ltr" : "rtl"}
                      >
                        {info.value}
                      </div>
                    </div>
                  </Wrapper>
                );
              })}

              {/* ساعات العمل */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/5 rounded-2xl p-5 border-2 border-purple-100 dark:border-purple-500/20 mt-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="font-black text-slate-900 dark:text-white">
                    ساعات العمل
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      السبت — الخميس
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      9:00 — 18:00
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      الجمعة
                    </span>
                    <span className="font-bold text-red-500">مغلق</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================ */}
            {/* نموذج التواصل (3/5) */}
            {/* ============================================ */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-[#12121a] dark:via-purple-500/5 dark:to-[#0a0a0f] rounded-3xl p-8 md:p-10 border-2 border-purple-100 dark:border-purple-500/20 shadow-xl">
                {success ? (
                  // ============================================
                  // نجاح
                  // ============================================
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-500/30">
                      <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
                      تم إرسال رسالتك بنجاح!
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-8">
                      سنتواصل معك في أقرب وقت ممكن — شكراً لثقتك بنا
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-2xl font-bold transition-all hover:scale-105"
                    >
                      إرسال رسالة أخرى
                    </button>
                  </motion.div>
                ) : (
                  // ============================================
                  // النموذج
                  // ============================================
                  <>
                    <div className="mb-8">
                      <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">
                        أرسل لنا رسالة
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        املأ النموذج وسنعود إليك قريباً
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* الاسم + البريد */}
                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            الاسم الكامل <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={form.name}
                            onChange={(e) => {
                              setForm({ ...form, name: e.target.value });
                              setErrors({ ...errors, name: "" });
                            }}
                            className={`w-full bg-white dark:bg-[#0a0a0f] border-2 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none transition ${
                              errors.name
                                ? "border-red-300 dark:border-red-500/50 focus:border-red-500"
                                : "border-slate-200 dark:border-white/10 focus:border-purple-500"
                            }`}
                            placeholder="أدخل اسمك"
                          />
                          {errors.name && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors.name}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            البريد الإلكتروني <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) => {
                              setForm({ ...form, email: e.target.value });
                              setErrors({ ...errors, email: "" });
                            }}
                            className={`w-full bg-white dark:bg-[#0a0a0f] border-2 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none transition ${
                              errors.email
                                ? "border-red-300 dark:border-red-500/50 focus:border-red-500"
                                : "border-slate-200 dark:border-white/10 focus:border-purple-500"
                            }`}
                            dir="ltr"
                            placeholder="your@email.com"
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors.email}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* الجوال + الخدمة */}
                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            رقم الجوال
                          </label>
                          <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) =>
                              setForm({ ...form, phone: e.target.value })
                            }
                            className="w-full bg-white dark:bg-[#0a0a0f] border-2 border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition"
                            dir="ltr"
                            placeholder="+967 7XX XXX XXX"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            نوع الخدمة
                          </label>
                          <select
                            value={form.serviceType}
                            onChange={(e) =>
                              setForm({ ...form, serviceType: e.target.value })
                            }
                            className="w-full bg-white dark:bg-[#0a0a0f] border-2 border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition"
                          >
                            <option value="">اختر الخدمة</option>
                            {serviceOptions.map((opt, i) => (
                              <option key={i} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* الرسالة */}
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                          تفاصيل مشروعك <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={5}
                          value={form.message}
                          onChange={(e) => {
                            setForm({ ...form, message: e.target.value });
                            setErrors({ ...errors, message: "" });
                          }}
                          className={`w-full bg-white dark:bg-[#0a0a0f] border-2 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none transition resize-none ${
                            errors.message
                              ? "border-red-300 dark:border-red-500/50 focus:border-red-500"
                              : "border-slate-200 dark:border-white/10 focus:border-purple-500"
                          }`}
                          placeholder="أخبرنا عن مشروعك بالتفصيل..."
                        />
                        {errors.message && (
                          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.message}
                          </p>
                        )}
                      </div>

                      {/* خطأ السيرفر */}
                      {serverError && (
                        <div className="bg-red-50 dark:bg-red-500/10 border-2 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 flex-shrink-0" />
                          {serverError}
                        </div>
                      )}

                      {/* زر الإرسال */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-black text-lg transition-all hover:scale-[1.02] shadow-xl shadow-purple-500/20 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            جاري الإرسال...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            إرسال الرسالة
                          </>
                        )}
                      </button>

                      {/* ملاحظة */}
                      <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                        أو تواصل معنا مباشرة عبر{" "}
                        <a
                          href="https://wa.me/967775566442"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-500 font-bold hover:underline"
                        >
                          واتساب
                        </a>
                      </p>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}