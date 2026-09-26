export default function CTA() {
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="relative bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 rounded-[2.5rem] overflow-hidden p-12 lg:p-20 text-center text-white shadow-2xl">
            
            {/* خلفية */}
            <div className="absolute inset-0 opacity-10"
                 style={{
                   backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                   backgroundSize: '30px 30px'
                 }}
            />
            
            {/* دوائر */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-accent-500 rounded-full blur-[120px] opacity-30" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-400 rounded-full blur-[120px] opacity-30" />
  
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl lg:text-6xl font-black mb-6 leading-tight">
                جاهز لبدء مشروعك؟
              </h2>
              <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                تواصل معنا الآن للحصول على استشارة مجانية وعرض سعر مخصص لمشروعك.
                سارعوا بالحجز قبل فوات الفرصة! 🏃
              </p>
  
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://wa.me/967775566442"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-2xl flex items-center gap-3"
                >
                  💬 احصل على عرض سعر
                </a>
                <a
                  href="tel:+967775566442"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur border-2 border-white/20 px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:scale-105 flex items-center gap-3"
                >
                  📞 اتصل بنا
                </a>
              </div>
  
              <div className="mt-10 pt-8 border-t border-white/10 text-blue-200">
                📍  اليمن - صنعاء | 📞 967775566442+     -     967733111389+            </div>
            </div>
          </div>
        </div>
      </section>
    );
  }