"use client";

import HeroNew from "@/components/home/HeroNew";
import Services from "@/components/home/Services";
import WhyUs from "@/components/home/WhyUs";
import ServicesShowcase from "@/components/home/ServicesShowcase";
import PortfolioTabs from "@/components/home/PortfolioTabs";
import Reviews from "@/components/home/Reviews";
import CTA from "@/components/home/CTA";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500">
      {/* ==================== HERO الجديد ==================== */}
      <HeroNew />

      {/* ==================== بقية الأقسام ==================== */}
      <Services />
      <WhyUs />
      <ServicesShowcase />
      <PortfolioTabs />
      <Reviews />
      <CTA />
    </div>
  );
}