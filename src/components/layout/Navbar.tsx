"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "الرئيسية" },
    { href: "/about", label: "من نحن" },
    { href: "/services", label: "الخدمات" },
    { href: "/portfolio", label: "أعمالنا" },
    { href: "/downloads", label: "مكتبة التحميلات" },
    { href: "/reviews", label: "التقييمات" },
    { href: "/contact", label: "اتصل بنا" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-gray-200 dark:border-slate-800 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* الشعار */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-14 h-14">
            <Image
              src="/logo.png"
              alt="Code Tech"
              fill
              sizes="56px"
              priority
              className="object-contain group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="hidden sm:block">
            <span className="text-2xl font-bold text-brand-500 dark:text-brand-400 block leading-tight">
              Code Tech
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">كود تك</span>
          </div>
        </Link>

        {/* الروابط - شاشات كبيرة */}
        <ul className="hidden lg:flex items-center gap-7 font-semibold text-gray-700 dark:text-gray-300">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors relative py-2 group"
              >
                {link.label}
                <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-brand-500 group-hover:w-full transition-all duration-300" />
              </Link>
            </li>
          ))}
        </ul>

        {/* زر CTA */}
        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/967775566442"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold transition shadow-lg shadow-green-500/20 hover:shadow-green-500/40"
          >
            💬 اطلب خدمة
          </a>

          {/* زر القائمة للجوال */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-brand-500 dark:text-brand-400 p-2"
            aria-label="القائمة"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* قائمة الجوال */}
      {isOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
          <ul className="container mx-auto px-4 py-4 space-y-3 font-semibold text-gray-700 dark:text-gray-300">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 hover:text-brand-500 dark:hover:text-brand-400 transition"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-3 border-t border-gray-200 dark:border-slate-800">
              <a
                href="https://wa.me/967775566442"
                target="_blank"
                className="block text-center bg-green-500 text-white px-5 py-3 rounded-xl font-bold"
              >
                💬 اطلب خدمة
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}