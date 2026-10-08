"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle, Sparkles, ChevronDown } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/about", label: "من نحن" },
  { href: "/services", label: "الخدمات" },
  { href: "/portfolio", label: "أعمالنا" },
  { href: "/downloads", label: "مكتبة التحميلات" },
  { href: "/reviews", label: "التقييمات" },
  { href: "/contact", label: "اتصل بنا" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ✅ Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // ✅ Lock scroll when menu open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.nav
        suppressHydrationWarning
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-lg shadow-slate-900/5 border-b border-slate-200/50 dark:border-slate-800/50"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* ============================================ */}
            {/* Logo */}
            {/* ============================================ */}
            <Link href="/" className="flex items-center gap-3 group relative z-10">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="relative w-11 h-11 lg:w-12 lg:h-12"
              >
                <Image
                  src="/logo.png"
                  alt="Code Tech"
                  fill
                  className="object-contain"
                  priority
                />
                {/* Glow */}
                <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>

              <div className="hidden sm:block">
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white block leading-tight tracking-tight"
                >
                  Code Tech
                </motion.span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-widest uppercase">
                  Software Company
                </span>
              </div>
            </Link>

            {/* ============================================ */}
            {/* Desktop Navigation */}
            {/* ============================================ */}
            <div className="hidden lg:flex items-center gap-1 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl p-1.5 border border-slate-200/60 dark:border-slate-800/60">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                      active
                        ? "text-white"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg shadow-blue-500/30"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* ============================================ */}
            {/* Actions */}
            {/* ============================================ */}
            <div className="flex items-center gap-2 lg:gap-3">
              <ThemeToggle />

              {/* CTA Button */}
              <motion.a
                href="https://wa.me/967775566442"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-green-500/30 hover:shadow-green-500/50 relative overflow-hidden group"
              >
                {/* Shimmer */}
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                />
                <MessageCircle className="w-4 h-4 relative z-10" />
                <span className="relative z-10">اطلب خدمة</span>
              </motion.a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden relative w-11 h-11 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
                suppressHydrationWarning
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* Decorative bottom line when scrolled */}
        {/* ============================================ */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: scrolled ? 1 : 0 }}
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
        />
      </motion.nav>

      {/* ============================================ */}
      {/* Mobile Menu */}
      {/* ============================================ */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-slate-950 z-50 lg:hidden shadow-2xl"
              dir="rtl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10">
                    <Image src="/logo.png" alt="Code Tech" fill className="object-contain" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-slate-900 dark:text-white">
                      Code Tech
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Software Company
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                  aria-label="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Links */}
              <nav className="p-5 space-y-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 180px)" }}>
                {NAV_LINKS.map((link, i) => {
                  const active = isActive(link.href);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl font-bold transition-all ${
                          active
                            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span>{link.label}</span>
                        {active && <Sparkles className="w-4 h-4" />}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Footer CTA */}
              <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <a
                  href="https://wa.me/967775566442"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-3.5 rounded-xl font-bold w-full shadow-lg shadow-green-500/30"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>اطلب خدمة الآن</span>
                </a>
                <div className="text-center text-xs text-slate-400 dark:text-slate-500 mt-3">
                  © 2026 Code Tech
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}