"use client";

import { FaFacebook } from "react-icons/fa";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Globe,
  MessageCircle,
  Building2,
  FileText,
  Hash,
  Search,
  RefreshCw,
  Link2,
} from "lucide-react";

// ==========================================
// Types
// ==========================================
interface SettingsData {
  // General
  site_name: string;
  site_description: string;
  site_keywords: string;

  // Contact
  contact_phone: string;
  contact_email: string;
  contact_location: string;
  contact_whatsapp: string;

  // Social
  social_facebook: string;
  social_github: string;
  social_twitter: string;

  // SEO
  seo_title: string;
  seo_description: string;
  seo_keywords: string;

  [key: string]: string;
}

// ==========================================
// Tabs Configuration
// ==========================================
const tabs = [
  { id: "general", label: "عام", icon: Building2 },
  { id: "contact", label: "التواصل", icon: Phone },
  { id: "social", label: "السوشيال", icon: Globe },
  { id: "seo", label: "SEO", icon: Search },
] as const;

type TabId = (typeof tabs)[number]["id"];

// ==========================================
// Main Component
// ==========================================
export default function SettingsManager() {
  const [settings, setSettings] = useState<SettingsData>({
    site_name: "",
    site_description: "",
    site_keywords: "",
    contact_phone: "",
    contact_email: "",
    contact_location: "",
    contact_whatsapp: "",
    social_facebook: "",
    social_github: "",
    social_twitter: "",
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
  });
  const [originalSettings, setOriginalSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("general");

  // ==========================================
  // Fetch Settings
  // ==========================================
  const fetchSettings = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/settings");
      const data = await res.json();

      if (res.ok && data.settings) {
        setSettings((prev) => ({ ...prev, ...data.settings }));
        setOriginalSettings({ ...settings, ...data.settings });
      } else {
        setError(data.error || "فشل في جلب الإعدادات");
      }
    } catch (err) {
      console.error("Fetch settings error:", err);
      setError("تعذر الاتصال بالخادم");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================================
  // Handle Save
  // ==========================================
  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setOriginalSettings({ ...settings });
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.error || "فشل الحفظ");
      }
    } catch {
      setError("تعذر الاتصال بالخادم");
    }

    setSaving(false);
  };

  // ==========================================
  // Handle Change
  // ==========================================
  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // ==========================================
  // Check if Changed
  // ==========================================
  const hasChanges =
    originalSettings &&
    JSON.stringify(settings) !== JSON.stringify(originalSettings);

  // ==========================================
  // Render
  // ==========================================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              الإعدادات
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              إدارة إعدادات الموقع العامة
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchSettings}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            تحديث
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-bold transition shadow-lg"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                حفظ التغييرات
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 dark:bg-green-500/10 border-2 border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl flex items-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5" />
          تم حفظ الإعدادات بنجاح!
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border-2 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-2 border border-slate-100 dark:border-slate-700 flex gap-2 flex-wrap">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 space-y-5"
        >
          {/* General Tab */}
          {activeTab === "general" && (
            <>
              <SettingField
                icon={Building2}
                label="اسم الموقع"
                value={settings.site_name}
                onChange={(v) => handleChange("site_name", v)}
                placeholder="Code Tech"
                description="يظهر في جميع الصفحات"
              />

              <SettingField
                icon={FileText}
                label="وصف الموقع"
                value={settings.site_description}
                onChange={(v) => handleChange("site_description", v)}
                placeholder="شركة تطوير برمجيات يمنية متخصصة..."
                description="يظهر في نتائج البحث"
                multiline
              />

              <SettingField
                icon={Hash}
                label="الكلمات المفتاحية"
                value={settings.site_keywords}
                onChange={(v) => handleChange("site_keywords", v)}
                placeholder="كود تك، تطوير مواقع، اليمن، صنعاء"
                description="افصل بفاصلة بين كل كلمة"
              />
            </>
          )}

          {/* Contact Tab */}
          {activeTab === "contact" && (
            <>
              <SettingField
                icon={Phone}
                label="رقم الهاتف"
                value={settings.contact_phone}
                onChange={(v) => handleChange("contact_phone", v)}
                placeholder="+967 775566442"
                dir="ltr"
              />

              <SettingField
                icon={Mail}
                label="البريد الإلكتروني"
                value={settings.contact_email}
                onChange={(v) => handleChange("contact_email", v)}
                placeholder="info@codetech.ye"
                dir="ltr"
              />

              <SettingField
                icon={MapPin}
                label="العنوان"
                value={settings.contact_location}
                onChange={(v) => handleChange("contact_location", v)}
                placeholder="اليمن - صنعاء"
              />

              <SettingField
                icon={MessageCircle}
                label="رابط واتساب"
                value={settings.contact_whatsapp}
                onChange={(v) => handleChange("contact_whatsapp", v)}
                placeholder="https://wa.me/967775566442"
                dir="ltr"
              />
            </>
          )}

          {/* Social Tab */}
          {activeTab === "social" && (
            <>
              <SettingField
                icon={FaFacebook}
                label="فيسبوك"
                value={settings.social_facebook}
                onChange={(v) => handleChange("social_facebook", v)}
                placeholder="https://www.facebook.com/CodeTech.ye"
                dir="ltr"
              />

              <SettingField
                icon={Link2}
                label="GitHub"
                value={settings.social_github}
                onChange={(v) => handleChange("social_github", v)}
                placeholder="https://github.com/yasser77a"
                dir="ltr"
              />

              <SettingField
                icon={Globe}
                label="تويتر / X"
                value={settings.social_twitter}
                onChange={(v) => handleChange("social_twitter", v)}
                placeholder="https://twitter.com/..."
                dir="ltr"
              />
            </>
          )}

          {/* SEO Tab */}
          {activeTab === "seo" && (
            <>
              <SettingField
                icon={Search}
                label="عنوان SEO"
                value={settings.seo_title}
                onChange={(v) => handleChange("seo_title", v)}
                placeholder="Code Tech | شركة تطوير برمجيات في اليمن"
                description="يظهر في نتيجة البحث (60 حرفاً)"
              />

              <SettingField
                icon={FileText}
                label="وصف SEO"
                value={settings.seo_description}
                onChange={(v) => handleChange("seo_description", v)}
                placeholder="نطوّر مواقع وتطبيقات وأنظمة برمجية في اليمن..."
                description="يظهر في نتيجة البحث (160 حرفاً)"
                multiline
              />

              <SettingField
                icon={Hash}
                label="كلمات SEO المفتاحية"
                value={settings.seo_keywords}
                onChange={(v) => handleChange("seo_keywords", v)}
                placeholder="تطوير مواقع، اليمن، صنعاء"
                description="افصل بفاصلة"
              />
            </>
          )}
        </motion.div>
      )}

      {/* Save Button (Bottom) */}
      {hasChanges && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/5 border-2 border-amber-200 dark:border-amber-500/30 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3 shadow-lg backdrop-blur"
        >
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <AlertCircle className="w-5 h-5" />
            <span className="font-bold">لديك تغييرات غير محفوظة</span>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2.5 rounded-xl font-bold transition shadow-lg flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                حفظ الآن
              </>
            )}
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ==========================================
// Setting Field Component
// ==========================================
function SettingField({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  description,
  multiline,
  dir,
}: {
  icon: any;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  description?: string;
  multiline?: boolean;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
        <Icon className="w-4 h-4 text-slate-400" />
        {label}
      </label>

      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          dir={dir}
          className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:text-white resize-none transition"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          dir={dir}
          className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:text-white transition"
        />
      )}

      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {description}
        </p>
      )}
    </div>
  );
}