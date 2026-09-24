export default function ContactPage() {
    return (
      <div>
        {/* Header */}
        <section className="bg-gradient-to-br from-brand-600 to-brand-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl lg:text-6xl font-black mb-4">تواصل معنا</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              نحن هنا للإجابة على استفساراتك
            </p>
          </div>
        </section>
  
        {/* المحتوى */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            
            {/* معلومات التواصل */}
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-gray-900 mb-8">معلومات التواصل</h2>
  
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  💬
                </div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">واتساب</div>
                  <a href="https://wa.me/967775566442" target="_blank" className="text-brand-500 hover:underline" dir="ltr">
                    +967 775566442
                  </a>
                </div>
              </div>
  
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  📞
                </div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">الهاتف</div>
                  <a href="tel:+967775566442" className="text-brand-500 hover:underline" dir="ltr">
                    +967 775566442
                  </a>
                </div>
              </div>
  
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  📍
                </div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">العنوان</div>
                  <div className="text-gray-700">صنعاء – الدائري، حي جامعة صنعاء القديمة</div>
                </div>
              </div>
  
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  📘
                </div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">فيسبوك</div>
                  <a href="https://www.facebook.com/CodeTech.ye" target="_blank" className="text-brand-500 hover:underline">
                    CodeTech.ye
                  </a>
                </div>
              </div>
            </div>
  
            {/* نموذج التواصل */}
            <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-3xl p-8 text-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-6">أرسل لنا رسالة</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="الاسم الكامل"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-200 focus:outline-none focus:border-white/40"
                />
                <input
                  type="tel"
                  placeholder="رقم الهاتف"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-200 focus:outline-none focus:border-white/40"
                  dir="ltr"
                />
                <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40">
                  <option className="text-gray-900">اختر الخدمة</option>
                  <option className="text-gray-900">موقع ويب</option>
                  <option className="text-gray-900">تطبيق جوال</option>
                  <option className="text-gray-900">نظام برمجي</option>
                  <option className="text-gray-900">تصميم جرافيك</option>
                  <option className="text-gray-900">مشروع تخرج</option>
                </select>
                <textarea
                  rows={5}
                  placeholder="تفاصيل مشروعك..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-200 focus:outline-none focus:border-white/40 resize-none"
                />
                <button
                  type="submit"
                  className="w-full bg-white text-brand-600 hover:bg-blue-50 py-4 rounded-xl font-bold text-lg transition-all hover:scale-[1.02]"
                >
                  📤 إرسال الرسالة
                </button>
              </form>
  
              <div className="mt-6 pt-6 border-t border-white/20 text-center text-blue-200 text-sm">
                أو تواصل معنا مباشرة عبر{" "}
                <a href="https://wa.me/967775566442" target="_blank" className="text-green-400 font-bold hover:underline">
                  واتساب
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }