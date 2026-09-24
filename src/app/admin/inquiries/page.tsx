"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MessageSquare, Search, Filter, Eye, Trash2, CheckCircle } from "lucide-react";

const initialInquiries = [
  { id: 1, name: "أحمد علي", phone: "+967771234567", email: "ahmed@example.com", service: "موقع متجر", message: "أريد متجر إلكتروني كامل مع دفع إلكتروني", status: "new", date: "2026-09-23 10:30" },
  { id: 2, name: "سارة محمد", phone: "+967772345678", email: "sara@example.com", service: "تطبيق جوال", message: "أريد تطبيق توصيل طلبات للأندرويد والآيفون", status: "new", date: "2026-09-23 09:15" },
  { id: 3, name: "خالد يوسف", phone: "+967773456789", email: "khaled@example.com", service: "نظام إداري", message: "أحتاج نظام إدارة مستشفى", status: "in-progress", date: "2026-09-22 14:20" },
  { id: 4, name: "فاطمة الزهراء", phone: "+967774567890", email: "fatima@example.com", service: "مشروع تخرج", message: "أحتاج مساعدة في مشروع تخرجي - ذكاء اصطناعي", status: "replied", date: "2026-09-22 11:00" },
  { id: 5, name: "محمد الحميري", phone: "+967775678901", email: "m.alhimyri@example.com", service: "موقع ويب", message: "موقع شخصي احترافي", status: "replied", date: "2026-09-21 16:45" },
];

const statusMap: Record<string, { label: string; color: string; icon: string }> = {
  new: { label: "جديد", color: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400", icon: "🔵" },
  "in-progress": { label: "قيد المعالجة", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400", icon: "🟡" },
  replied: { label: "تم الرد", color: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400", icon: "🟢" },
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<typeof initialInquiries[0] | null>(null);

  const filtered = inquiries.filter((i) => {
    const matchSearch = i.name.includes(search) || i.service.includes(search);
    const matchFilter = filter === "all" || i.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">الاستفسارات</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {inquiries.filter((i) => i.status === "new").length} استفسار جديد
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 dark:text-white"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm dark:text-white"
        >
          <option value="all">الكل</option>
          <option value="new">جديد</option>
          <option value="in-progress">قيد المعالجة</option>
          <option value="replied">تم الرد</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filtered.map((inq) => (
          <motion.div
            key={inq.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 hover:shadow-lg transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-black flex-shrink-0">
                  {inq.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-slate-900 dark:text-white">{inq.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${statusMap[inq.status].color}`}>
                      {statusMap[inq.status].icon} {statusMap[inq.status].label}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                    {inq.service} • {inq.date}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                    {inq.message}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1" dir="ltr">
                      <Phone className="w-3 h-3" /> {inq.phone}
                    </span>
                    <span className="flex items-center gap-1" dir="ltr">
                      <Mail className="w-3 h-3" /> {inq.email}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSelected(inq)}
                  className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-600 rounded-lg transition"
                  title="عرض"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <a
                  href={`https://wa.me/${inq.phone.replace(/\+/g, "")}`}
                  target="_blank"
                  className="p-2 hover:bg-green-50 dark:hover:bg-green-500/10 text-green-600 rounded-lg transition"
                  title="رد واتساب"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
                <button className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 rounded-lg transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal عرض التفاصيل */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">تفاصيل الاستفسار</h2>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-red-500 text-2xl">×</button>
            </div>
            <div className="space-y-3">
              <div><strong className="text-slate-700 dark:text-slate-300">الاسم:</strong> <span className="text-slate-900 dark:text-white">{selected.name}</span></div>
              <div><strong className="text-slate-700 dark:text-slate-300">الهاتف:</strong> <span dir="ltr" className="text-slate-900 dark:text-white">{selected.phone}</span></div>
              <div><strong className="text-slate-700 dark:text-slate-300">البريد:</strong> <span dir="ltr" className="text-slate-900 dark:text-white">{selected.email}</span></div>
              <div><strong className="text-slate-700 dark:text-slate-300">الخدمة:</strong> <span className="text-slate-900 dark:text-white">{selected.service}</span></div>
              <div>
                <strong className="text-slate-700 dark:text-slate-300">الرسالة:</strong>
                <p className="mt-1 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl text-slate-700 dark:text-slate-300">
                  {selected.message}
                </p>
              </div>
              <a
                href={`https://wa.me/${selected.phone.replace(/\+/g, "")}?text=${encodeURIComponent(`مرحباً ${selected.name}، بخصوص استفسارك عن ${selected.service}`)}`}
                target="_blank"
                className="block text-center bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition"
              >
                💬 الرد عبر واتساب
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}