"use client";

import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Heart,
  FileText,
  Edit,
  Key,
  LogOut,
  Trash2,
  Globe,
  CheckCircle2,
  Clock,
  AlertCircle,
  Inbox,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Activity,
  Shield,
  ArrowUpRight,
  LayoutDashboard,
  Settings,
  Bell,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Sun,
  Moon,
  Copy,
  Check,
  Zap,
  Award,
} from "lucide-react";
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";
import DeleteAccountModal from "./DeleteAccountModal";

// ==========================================
// Types
// ==========================================
interface Inquiry {
  id: string;
  subject: string | null;
  serviceType: string | null;
  status: string;
  message: string;
  createdAt: string;
}

interface Comment {
  id: string;
  content: string;
  status: string;
  createdAt: string;
  project: { id: string; title: string; slug: string; category: string } | null;
  blogPost: { id: string; title: string; slug: string } | null;
}

interface Visitor {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  bio: string | null;
  website: string | null;
  avatar: string | null;
  emailVerified: boolean;
  isActive: boolean;
  lastLoginAt: string | null;
  loginCount: number;
  createdAt: string;
  _count: {
    comments: number;
    likes: number;
    inquiries: number;
  };
  recentInquiries: Inquiry[];
  recentComments: Comment[];
}

type TabId = "overview" | "inquiries" | "comments" | "settings";

// ==========================================
// Animated Counter
// ==========================================
function AnimatedCounter({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [value]);

  return <motion.span>{rounded}</motion.span>;
}

// ==========================================
// Copy Button
// ==========================================
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
      title="نسخ"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-500" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-slate-400" />
      )}
    </button>
  );
}

// ==========================================
// Sidebar Content Component
// ==========================================
interface SidebarContentProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobile: boolean;
  onClose: () => void;
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
  menuItems: readonly {
    id: TabId;
    label: string;
    icon: any;
    badge?: number;
  }[];
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
}

function SidebarContent({
  isCollapsed,
  onToggleCollapse,
  isMobile,
  onClose,
  activeTab,
  onTabChange,
  menuItems,
  darkMode,
  onToggleDarkMode,
  onLogout,
}: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className={`flex items-center border-b border-slate-100 dark:border-slate-800 flex-shrink-0 transition-all ${
          isCollapsed && !isMobile
            ? "flex-col gap-2 p-3"
            : "justify-between p-4"
        }`}
      >
        <Link href="/" className="flex items-center gap-3 group min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform flex-shrink-0">
            <Zap className="w-5 h-5 text-white" fill="white" />
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="text-right overflow-hidden">
              <div className="font-black text-slate-900 dark:text-white text-sm whitespace-nowrap">
                Code Tech
              </div>
              <div className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                حساب الزائر
              </div>
            </div>
          )}
        </Link>

        {isMobile ? (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0 transition"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        ) : (
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition flex-shrink-0"
            title={isCollapsed ? "توسيع" : "طي"}
            aria-label={isCollapsed ? "توسيع القائمة" : "طي القائمة"}
          >
            {isCollapsed ? (
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {!isCollapsed && !isMobile && (
          <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
            القائمة الرئيسية
          </div>
        )}

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const badge = item.badge;
          const showLabel = !isCollapsed || isMobile;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={!showLabel ? item.label : undefined}
              className={`relative w-full flex items-center rounded-xl font-bold text-sm transition-all ${
                showLabel ? "gap-3 px-3 py-3" : "justify-center px-3 py-3"
              } ${
                isActive
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />

              {showLabel && (
                <>
                  <span className="flex-1 text-right truncate">
                    {item.label}
                  </span>
                  {badge !== undefined && badge > 0 && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-black flex-shrink-0 ${
                        isActive
                          ? "bg-white/30 text-white"
                          : "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </>
              )}

              {!showLabel && badge !== undefined && badge > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-slate-100 dark:border-slate-800 p-3 space-y-1 flex-shrink-0">
        <button
          onClick={onToggleDarkMode}
          title={
            !isCollapsed || isMobile
              ? undefined
              : darkMode
              ? "الوضع الفاتح"
              : "الوضع الليلي"
          }
          className={`w-full flex items-center rounded-xl font-bold text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition ${
            !isCollapsed || isMobile
              ? "gap-3 px-3 py-3"
              : "justify-center px-3 py-3"
          }`}
        >
          {darkMode ? (
            <Sun className="w-5 h-5 flex-shrink-0" />
          ) : (
            <Moon className="w-5 h-5 flex-shrink-0" />
          )}
          {(!isCollapsed || isMobile) && (
            <span className="text-right flex-1 truncate">
              {darkMode ? "الوضع الفاتح" : "الوضع الليلي"}
            </span>
          )}
        </button>

        <button
          onClick={onLogout}
          title={!isCollapsed || isMobile ? undefined : "تسجيل الخروج"}
          className={`w-full flex items-center rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition ${
            !isCollapsed || isMobile
              ? "gap-3 px-3 py-3"
              : "justify-center px-3 py-3"
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {(!isCollapsed || isMobile) && (
            <span className="text-right flex-1 truncate">تسجيل الخروج</span>
          )}
        </button>
      </div>
    </div>
  );
}

// ==========================================
// Main Component
// ==========================================
export default function AccountDashboard({ visitor }: { visitor: Visitor }) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [currentVisitor, setCurrentVisitor] = useState(visitor);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  const handleLogout = async () => {
    await fetch("/api/visitor/logout", { method: "POST" });
    window.location.href = "/";
  };

  const handleProfileUpdate = (updated: Partial<Visitor>) => {
    setCurrentVisitor({ ...currentVisitor, ...updated });
    setShowEditProfile(false);
  };

  // ==========================================
  // Helpers
  // ==========================================
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ar-YE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString("ar-YE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string; dot: string }> = {
      NEW: {
        label: "جديد",
        color:
          "bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/30",
        dot: "bg-blue-500",
      },
      IN_PROGRESS: {
        label: "قيد المعالجة",
        color:
          "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30",
        dot: "bg-yellow-500",
      },
      REPLIED: {
        label: "تم الرد",
        color:
          "bg-green-50 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-200 dark:border-green-500/30",
        dot: "bg-green-500",
      },
      CLOSED: {
        label: "مغلق",
        color:
          "bg-slate-50 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600",
        dot: "bg-slate-500",
      },
      PENDING: {
        label: "معلق",
        color:
          "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30",
        dot: "bg-yellow-500",
      },
      APPROVED: {
        label: "معتمد",
        color:
          "bg-green-50 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-200 dark:border-green-500/30",
        dot: "bg-green-500",
      },
      REJECTED: {
        label: "مرفوض",
        color:
          "bg-red-50 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-500/30",
        dot: "bg-red-500",
      },
    };
    return map[status] || map.NEW;
  };

  const profileCompletion = (() => {
    let score = 0;
    if (currentVisitor.fullName) score += 20;
    if (currentVisitor.email) score += 20;
    if (currentVisitor.phone) score += 20;
    if (currentVisitor.bio) score += 20;
    if (currentVisitor.avatar) score += 20;
    return score;
  })();

  const menuItems = [
    { id: "overview" as const, label: "نظرة عامة", icon: LayoutDashboard },
    {
      id: "inquiries" as const,
      label: "الاستفسارات",
      icon: MessageSquare,
      badge: currentVisitor._count.inquiries,
    },
    {
      id: "comments" as const,
      label: "التعليقات",
      icon: FileText,
      badge: currentVisitor._count.comments,
    },
    { id: "settings" as const, label: "الإعدادات", icon: Settings },
  ];

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f] flex" dir="rtl">
      {/* ============================================ */}
      {/* Mobile Overlay */}
      {/* ============================================ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ============================================ */}
      {/* Mobile Drawer */}
      {/* ============================================ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-screen w-72 z-50 bg-white dark:bg-slate-900 border-l-2 border-slate-100 dark:border-slate-800 shadow-2xl lg:hidden"
          >
            <SidebarContent
              isCollapsed={false}
              onToggleCollapse={() => {}}
              isMobile={true}
              onClose={() => setMobileMenuOpen(false)}
              activeTab={activeTab}
              onTabChange={(id) => {
                setActiveTab(id);
                setMobileMenuOpen(false);
              }}
              menuItems={menuItems}
              darkMode={darkMode}
              onToggleDarkMode={toggleDarkMode}
              onLogout={handleLogout}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ============================================ */}
      {/* Desktop Sidebar (ALWAYS visible) */}
      {/* ============================================ */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 88 : 288 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden lg:flex sticky top-0 h-screen flex-col bg-white dark:bg-slate-900 border-l-2 border-slate-100 dark:border-slate-800 z-20 overflow-hidden flex-shrink-0"
      >
        <SidebarContent
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          isMobile={false}
          onClose={() => {}}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          menuItems={menuItems}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onLogout={handleLogout}
        />
      </motion.aside>

      {/* ============================================ */}
      {/* Main Content */}
      {/* ============================================ */}
      <main className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between px-4 md:px-6 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="فتح القائمة"
              >
                <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>

              <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2 w-72 border border-transparent focus-within:border-indigo-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="ابحث عن شيء..."
                  className="bg-transparent outline-none text-sm flex-1 text-slate-900 dark:text-white placeholder:text-slate-400"
                />
                <kbd className="hidden lg:inline-flex items-center gap-1 text-[10px] text-slate-400 bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600 font-mono">
                  ⌘K
                </kbd>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="الإشعارات"
              >
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              </button>

              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 pl-3 border border-slate-200 dark:border-slate-700">
                <div className="text-right hidden md:block">
                  <div className="text-xs font-black text-slate-900 dark:text-white max-w-[120px] truncate">
                    {currentVisitor.fullName}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {currentVisitor.emailVerified ? "✓ موثق" : "غير موثق"}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-black overflow-hidden flex-shrink-0">
                  {currentVisitor.avatar ? (
                    <img
                      src={currentVisitor.avatar}
                      alt={currentVisitor.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    currentVisitor.fullName[0]
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Welcome Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6 md:p-8 text-white shadow-2xl">
                  <div className="absolute inset-0 opacity-20">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%),
                                          radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)`,
                      }}
                    />
                  </div>
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                                        linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                      backgroundSize: "30px 30px",
                    }}
                  />

                  <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                      <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 mb-4">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                        <span className="text-xs font-bold">لوحة التحكم</span>
                      </div>
                      <h1 className="text-2xl md:text-4xl font-black mb-2">
                        مرحباً، {currentVisitor.fullName.split(" ")[0]} 👋
                      </h1>
                      <p className="text-white/80 text-sm md:text-base">
                        لديك {currentVisitor._count.inquiries} استفسار و{" "}
                        {currentVisitor._count.comments} تعليق
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowEditProfile(true)}
                      className="flex items-center gap-2 bg-white text-indigo-600 hover:bg-white/90 px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg transition whitespace-nowrap"
                    >
                      <Edit className="w-4 h-4" />
                      تعديل الملف
                    </motion.button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      icon: MessageSquare,
                      value: currentVisitor._count.inquiries,
                      label: "استفسار",
                      color: "from-blue-500 to-cyan-500",
                    },
                    {
                      icon: FileText,
                      value: currentVisitor._count.comments,
                      label: "تعليق",
                      color: "from-purple-500 to-pink-500",
                    },
                    {
                      icon: Heart,
                      value: currentVisitor._count.likes,
                      label: "إعجاب",
                      color: "from-red-500 to-orange-500",
                    },
                    {
                      icon: TrendingUp,
                      value: currentVisitor.loginCount,
                      label: "تسجيل دخول",
                      color: "from-green-500 to-emerald-500",
                    },
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        whileHover={{ y: -4 }}
                        className="group relative bg-white dark:bg-slate-900 rounded-2xl p-4 md:p-5 border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all overflow-hidden"
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-[0.03] transition-opacity`}
                        />
                        <div className="relative">
                          <div
                            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}
                          >
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tabular-nums">
                            <AnimatedCounter value={stat.value} />
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                            {stat.label}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Profile Completion - Wide */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg">
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-900 dark:text-white">
                            اكتمال الملف
                          </h3>
                          <p className="text-xs text-slate-500">
                            أكمل ملفك للحصول على تجربة أفضل
                          </p>
                        </div>
                      </div>
                      <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        <AnimatedCounter value={profileCompletion} />%
                      </div>
                    </div>

                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${profileCompletion}%` }}
                        transition={{
                          duration: 1.5,
                          ease: "easeOut",
                          delay: 0.5,
                        }}
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full relative"
                      >
                        <div className="absolute inset-0 bg-white/30 animate-pulse" />
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {[
                        { label: "الاسم", done: !!currentVisitor.fullName },
                        { label: "البريد", done: !!currentVisitor.email },
                        { label: "الجوال", done: !!currentVisitor.phone },
                        { label: "النبذة", done: !!currentVisitor.bio },
                        { label: "الصورة", done: !!currentVisitor.avatar },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-1.5 text-xs px-2 py-1.5 rounded-lg ${
                            item.done
                              ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400"
                              : "bg-slate-50 dark:bg-slate-800 text-slate-400"
                          }`}
                        >
                          <CheckCircle2
                            className={`w-3.5 h-3.5 ${
                              item.done ? "opacity-100" : "opacity-30"
                            }`}
                          />
                          <span className="font-medium">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Account Info Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 text-white relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />

                    <div className="relative">
                      <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-bold text-white/60">
                          حالة الحساب
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-black text-lg">نشط</div>
                          <div className="text-xs text-white/60">
                            {currentVisitor.isActive
                              ? "الحساب مفعّل"
                              : "غير مفعّل"}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between py-2 border-t border-white/10">
                          <span className="text-white/60">عضو منذ</span>
                          <span className="font-bold">
                            {formatDate(currentVisitor.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-t border-white/10">
                          <span className="text-white/60">آخر دخول</span>
                          <span className="font-bold text-[10px]">
                            {currentVisitor.lastLoginAt
                              ? formatDateTime(currentVisitor.lastLoginAt)
                              : "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Email Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10">
                        <Mail className="w-4 h-4 text-blue-500" />
                      </div>
                      <CopyButton text={currentVisitor.email} />
                    </div>
                    <div className="text-xs text-slate-500 mb-1">
                      البريد الإلكتروني
                    </div>
                    <div
                      className="text-sm font-bold text-slate-900 dark:text-white truncate"
                      dir="ltr"
                    >
                      {currentVisitor.email}
                    </div>
                  </motion.div>

                  {/* Phone Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-lg bg-green-50 dark:bg-green-500/10">
                        <Phone className="w-4 h-4 text-green-500" />
                      </div>
                      <CopyButton text={currentVisitor.phone} />
                    </div>
                    <div className="text-xs text-slate-500 mb-1">
                      رقم الجوال
                    </div>
                    <div
                      className="text-sm font-bold text-slate-900 dark:text-white truncate"
                      dir="ltr"
                    >
                      {currentVisitor.phone}
                    </div>
                  </motion.div>

                  {/* Activity Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Activity className="w-4 h-4 text-orange-500" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        نشاطك
                      </span>
                    </div>

                    <div className="flex items-end gap-1 h-16">
                      {[40, 70, 45, 90, 60, 30, 80].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{
                            delay: 0.7 + i * 0.05,
                            duration: 0.5,
                          }}
                          className="flex-1 rounded-t-md bg-gradient-to-t from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition"
                        />
                      ))}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-2 text-center">
                      آخر 7 أيام
                    </div>
                  </motion.div>
                </div>

                {/* Danger Zone */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 }}
                  className="relative overflow-hidden bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-500/10 dark:to-orange-500/10 rounded-2xl p-5 border-2 border-red-200 dark:border-red-500/20"
                >
                  <div
                    className="absolute top-0 right-0 w-full h-full opacity-[0.03]"
                    style={{
                      backgroundImage: `repeating-linear-gradient(45deg, #ef4444, #ef4444 10px, transparent 10px, transparent 20px)`,
                    }}
                  />
                  <div className="relative flex flex-col md:flex-row items-start md:items-center gap-4">
                    <motion.div
                      animate={{ rotate: [0, -5, 5, -5, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                      className="p-3 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/30"
                    >
                      <AlertCircle className="w-5 h-5 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-black text-red-700 dark:text-red-400 mb-1">
                        منطقة الخطر
                      </h3>
                      <p className="text-xs text-red-600 dark:text-red-300">
                        حذف الحساب سيؤدي إلى إزالة جميع بياناتك نهائياً
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowDeleteAccount(true)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition shadow-lg shadow-red-500/30"
                    >
                      <Trash2 className="w-4 h-4" />
                      حذف الحساب
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === "inquiries" && (
              <motion.div
                key="inquiries"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-1">
                      الاستفسارات
                    </h1>
                    <p className="text-sm text-slate-500">
                      {currentVisitor.recentInquiries.length} استفسار
                    </p>
                  </div>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/30 hover:scale-105 transition"
                  >
                    <MessageSquare className="w-4 h-4" />
                    استفسار جديد
                  </Link>
                </div>

                {currentVisitor.recentInquiries.length === 0 ? (
                  <EmptyState
                    icon={Inbox}
                    title="لا توجد استفسارات بعد"
                    description="تواصل معنا وسنرد عليك قريباً"
                    actionLabel="أرسل استفساراً"
                    actionHref="/contact"
                    actionIcon={MessageSquare}
                  />
                ) : (
                  currentVisitor.recentInquiries.map((inq, i) => {
                    const badge = getStatusBadge(inq.status);
                    return (
                      <motion.div
                        key={inq.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ y: -2 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h3 className="font-black text-slate-900 dark:text-white">
                            {inq.subject || inq.serviceType || "استفسار"}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-bold border whitespace-nowrap ${badge.color}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}
                            />
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                          {inq.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDateTime(inq.createdAt)}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            )}

            {activeTab === "comments" && (
              <motion.div
                key="comments"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-1">
                    التعليقات
                  </h1>
                  <p className="text-sm text-slate-500">
                    {currentVisitor.recentComments.length} تعليق
                  </p>
                </div>

                {currentVisitor.recentComments.length === 0 ? (
                  <EmptyState
                    icon={FileText}
                    title="لا توجد تعليقات بعد"
                    description="شاركنا رأيك في مشاريعنا"
                    actionLabel="تصفح المشاريع"
                    actionHref="/portfolio"
                    actionIcon={Globe}
                  />
                ) : (
                  currentVisitor.recentComments.map((c, i) => {
                    const badge = getStatusBadge(c.status);
                    const target = c.project
                      ? `/portfolio/${c.project.category.toLowerCase()}/${c.project.slug}`
                      : c.blogPost
                      ? `/blog/${c.blogPost.slug}`
                      : "#";
                    const targetTitle =
                      c.project?.title || c.blogPost?.title || "—";
                    return (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ y: -2 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-500/50 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <Link
                            href={target}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline truncate"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            على: {targetTitle}
                          </Link>
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-bold border whitespace-nowrap ${badge.color}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}
                            />
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                          {c.content}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDateTime(c.createdAt)}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-1">
                    الإعدادات
                  </h1>
                  <p className="text-sm text-slate-500">إدارة إعدادات حسابك</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }}
                    onClick={() => setShowEditProfile(true)}
                    className="text-right bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg group-hover:scale-110 transition-transform">
                        <Edit className="w-6 h-6 text-white" />
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <h3 className="font-black text-slate-900 dark:text-white mb-1">
                      تعديل الملف الشخصي
                    </h3>
                    <p className="text-sm text-slate-500">
                      تحديث الاسم، الجوال، النبذة، والصورة
                    </p>
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ y: -4 }}
                    onClick={() => setShowChangePassword(true)}
                    className="text-right bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg group-hover:scale-110 transition-transform">
                        <Key className="w-6 h-6 text-white" />
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <h3 className="font-black text-slate-900 dark:text-white mb-1">
                      تغيير كلمة المرور
                    </h3>
                    <p className="text-sm text-slate-500">
                      تحديث كلمة المرور الخاصة بحسابك
                    </p>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ============================================ */}
      {/* Modals */}
      {/* ============================================ */}
      {showEditProfile && (
        <EditProfileModal
          visitor={currentVisitor}
          onClose={() => setShowEditProfile(false)}
          onSave={handleProfileUpdate}
        />
      )}

      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}

      {showDeleteAccount && (
        <DeleteAccountModal onClose={() => setShowDeleteAccount(false)} />
      )}
    </div>
  );
}

// ==========================================
// Empty State Component
// ==========================================
function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  actionIcon: ActionIcon,
}: {
  icon: any;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  actionIcon: any;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-500/5 dark:to-purple-500/5" />
      <div className="relative">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex p-5 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-500/20 dark:to-purple-500/20 mb-4"
        >
          <Icon className="w-12 h-12 text-indigo-500 dark:text-indigo-400" />
        </motion.div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          {description}
        </p>
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-indigo-500/30"
        >
          <ActionIcon className="w-4 h-4" />
          {actionLabel}
        </Link>
      </div>
    </motion.div>
  );
}