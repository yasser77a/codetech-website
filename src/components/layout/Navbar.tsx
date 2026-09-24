"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "الرئيسية" },
    { href: "/about", label: "من نحن" },
    { href: "/services", label: "الخدمات" },
    { href: "/portfolio", label: "أعمالنا" },
    { href: "/reviews", label: "التقييمات" },
    { href: "/contact", label: "اتصل بنا" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* الشعار */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Code Tech"
            className="h-14 w-14 object-contain"
          />
          <div className="hidden sm:block">
            <span className="text-2xl font-bold text-brand-500 block leading-tight">
              Code Tech
            </span>
            <span className="text-xs text-gray-500">كود تك</span>
          </div>
        </Link>

        {/* الروابط - شاشات كبيرة */}
        <ul className="hidden lg:flex items-center gap-8 font-semibold text-gray-700">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="hover:text-brand-500 transition-colors"
              >
                {link.label}
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
            className="hidden md:inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold transition"
          >
            💬 اطلب خدمة
          </a>

          {/* زر القائمة للجوال */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-brand-500 p-2"
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
        <div className="lg:hidden bg-white border-t border-gray-200">
          <ul className="container mx-auto px-4 py-4 space-y-3 font-semibold text-gray-700">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 hover:text-brand-500 transition"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-3 border-t">
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