import PortfolioTabs from "@/components/home/PortfolioTabs";
import CTA from "@/components/home/CTA";

export default function PortfolioPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-brand-600 to-brand-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl lg:text-6xl font-black mb-4">معرض أعمالنا</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            اكتشف مشاريعنا المتنوعة في مختلف المجالات
          </p>
        </div>
      </section>

      <PortfolioTabs />
      <CTA />
    </div>
  );
}