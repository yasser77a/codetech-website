export default function CTA() {
  return (
    <section className="cta-section py-24 bg-slate-50 dark:bg-[#0a0a0f] transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="cta-card relative bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-brand-600 dark:via-brand-700 dark:to-brand-900 rounded-[2.5rem] overflow-hidden p-12 lg:p-20 text-center shadow-xl dark:shadow-2xl border border-slate-200 dark:border-transparent transition-all duration-300">
          
          {/* خلفية (تظهر في الوضع الليلي فقط) */}
          <div className="absolute inset-0 opacity-0 dark:opacity-10 transition-opacity duration-300"
               style={{
                 backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                 backgroundSize: '30px 30px'
               }}
          />
          
          {/* دوائر (ألوان فاتحة في النهاري، داكنة في الليلي) */}
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-300 dark:bg-accent-500 rounded-full blur-[120px] opacity-20 dark:opacity-30" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-300 dark:bg-blue-400 rounded-full blur-[120px] opacity-20 dark:opacity-30" />

          <div className="relative z-10 max-w-3xl mx-auto">
            {/* العنوان: أسود في النهاري، أبيض في الليلي */}
            <h2 className="text-4xl lg:text-6xl font-black mb-6 leading-tight text-slate-900 dark:text-white transition-colors">
              جاهز لبدء مشروعك؟
            </h2>
            
            {/* الوصف: رمادي داكن في النهاري، أزرق فاتح في الليلي */}
            <p className="text-xl text-slate-600 dark:text-blue-100 mb-10 leading-relaxed transition-colors">
              تواصل معنا الآن للحصول على استشارة مجانية وعرض سعر مخصص لمشروعك.
              سارعوا بالحجز قبل فوات الفرصة! 🏃
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {/* زر واتساب (يبقى أخضر في الوضعين) */}
              <a
                href="https://wa.me/967775566442"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-lg dark:shadow-2xl flex items-center gap-3"
              >
                💬 احصل على عرض سعر
              </a>
              
              {/* زر الاتصال: خلفية فاتحة في النهاري، شفافة في الليلي */}
              <a
                href="tel:+967775566442"
                className="bg-white hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur border-2 border-slate-200 dark:border-white/20 text-slate-800 dark:text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:scale-105 flex items-center gap-3"
              >
                📞 اتصل بنا
              </a>
            </div>

            {/* معلومات الاتصال السفلية */}
            <div className="mt-10 pt-8 border-t border-slate-200 dark:border-white/10 text-slate-500 dark:text-blue-200 transition-colors">
              📍 اليمن - صنعاء | 📞 967775566442+ - 967733111389+
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}