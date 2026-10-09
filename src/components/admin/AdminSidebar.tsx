"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  LayoutDashboard,
  FolderKanban,
  Globe,
  Smartphone,
  Monitor,
  GraduationCap,
  MessageSquare,
  Star,
  FileText,
  Users,
  Settings,
  ChevronDown,
  ChevronLeft,
  LogOut,
  Bell,
  Wrench,
} from "lucide-react";

interface BadgeCounts {
  inquiriesNew: number;
  notificationsUnread: number;
  reviewsPending: number;
  inquiriesTotal: number;
}

const menuItems = [
  { icon: LayoutDashboard, label: "لوحة المعلومات", href: "/admin/dashboard" },
  {
    icon: FolderKanban,
    label: "المشاريع",
    href: "/admin/projects",
    submenu: [
      { icon: Globe, label: "المواقع", href: "/admin/projects/websites" },
      { icon: Smartphone, label: "التطبيقات", href: "/admin/projects/apps" },
      { icon: Monitor, label: "الأنظمة", href: "/admin/projects/systems" },
      {
        icon: GraduationCap,
        label: "مشاريع التخرج",
        href: "/admin/projects/graduation",
      },
    ],
  },
  { icon: Wrench, label: "الخدمات", href: "/admin/services" },
  {
    icon: MessageSquare,
    label: "الاستفسارات",
    href: "/admin/inquiries",
    badgeKey: "inquiriesNew" as const,
  },
  {
    icon: Star,
    label: "التقييمات",
    href: "/admin/reviews",
    badgeKey: "reviewsPending" as const,
  },
  { icon: FileText, label: "المدونة", href: "/admin/blog" },
  {
    icon: Bell,
    label: "الإشعارات",
    href: "/admin/notifications",
    badgeKey: "notificationsUnread" as const,
  },
  { icon: Users, label: "المستخدمين", href: "/admin/users" },
  { icon: Settings, label: "الإعدادات", href: "/admin/settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  const [openMenus, setOpenMenus] = useState<string[]>(["المشاريع"]);
  const [counts, setCounts] = useState<BadgeCounts>({
    inquiriesNew: 0,
    notificationsUnread: 0,
    reviewsPending: 0,
    inquiriesTotal: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch("/api/admin/counts");
        if (res.ok) {
          const data = await res.json();
          setCounts(data);
        }
      } catch (error) {
        console.error("Failed to fetch counts:", error);
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, [pathname]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((m) => m !== label) : [...prev, label]
    );
  };

  const toggleCollapsed = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", String(newState));
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <aside
      suppressHydrationWarning
      className={`${
        collapsed ? "w-20" : "w-72"
      } bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white transition-all duration-300 flex flex-col sticky top-0 h-screen flex-shrink-0 shadow-sm`}
    >
      {/* ============================================ */}
      {/* الشعار */}
      {/* ============================================ */}
      <div className="p-5 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 flex-1"
            >
              <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/5 flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="Code Tech"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="text-lg font-black text-slate-900 dark:text-white">
                  Code Tech
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  لوحة التحكم
                </div>
              </div>
            </Link>
          )}
          {collapsed && (
            <img
              src="/logo.png"
              alt="Code Tech"
              className="w-10 h-10 object-contain mx-auto"
            />
          )}
          <button
            onClick={toggleCollapsed}
            className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition flex-shrink-0"
            aria-label="طي/توسيع القائمة"
            suppressHydrationWarning
          >
            <ChevronLeft
              className={`w-5 h-5 transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* ============================================ */}
      {/* القائمة */}
      {/* ============================================ */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          const isOpen = openMenus.includes(item.label);
          const badgeCount = item.badgeKey ? counts[item.badgeKey] : 0;

          return (
            <div key={item.label}>
              {hasSubmenu ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && (
                        <span className="font-semibold">{item.label}</span>
                      )}
                    </div>
                    {!collapsed && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                  <AnimatePresence>
                    {!collapsed && isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mr-4 mt-1 space-y-1 border-r-2 border-slate-200 dark:border-white/10 pr-3 overflow-hidden"
                      >
                        {item.submenu!.map((sub) => {
                          const SubIcon = sub.icon;
                          const subActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition ${
                                subActive
                                  ? "bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold"
                                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                              }`}
                            >
                              <SubIcon className="w-4 h-4" />
                              <span>{sub.label}</span>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`relative flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && (
                      <span className="font-semibold">{item.label}</span>
                    )}
                  </div>
                  {!collapsed && badgeCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[24px] text-center"
                    >
                      {badgeCount > 99 ? "99+" : badgeCount}
                    </motion.span>
                  )}
                  {collapsed && badgeCount > 0 && (
                    <span className="absolute left-2 top-2 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* ============================================ */}
      {/* Footer */}
      {/* ============================================ */}
      <div className="p-3 border-t border-slate-200 dark:border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 transition"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-semibold">تسجيل الخروج</span>}
        </button>
      </div>
    </aside>
  );
}