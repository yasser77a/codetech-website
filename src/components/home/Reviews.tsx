export default function Reviews() {
    const reviews = [
      {
        name: "أحمد الشامي",
        role: "صاحب متجر إلكتروني",
        rating: 5,
        comment: "تجربة رائعة! الفريق احترافي جداً والتسليم كان في الموعد. أنصح بهم بشدة.",
        initial: "أ",
        color: "bg-blue-500",
      },
      {
        name: "سارة العمراني",
        role: "مديرة شركة",
        rating: 5,
        comment: "أفضل شركة برمجية تعاملت معها في صنعاء. الجودة ممتازة والسعر مناسب.",
        initial: "س",
        color: "bg-purple-500",
      },
      {
        name: "محمد القباطي",
        role: "طالب جامعي",
        rating: 4,
        comment: "ساعدوني في مشروع تخرجي وكانوا متعاونين جداً. شكراً Code Tech.",
        initial: "م",
        color: "bg-green-500",
      },
    ];
  
    return (
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* العنوان */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold text-sm mb-4">
              ⭐ التقييمات
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              ماذا يقول <span className="text-brand-500">عملاؤنا</span>؟
            </h2>
            
            {/* التقييم الإجمالي */}
            <div className="inline-flex items-center gap-4 bg-white px-6 py-3 rounded-2xl shadow-lg mt-4">
              <span className="text-5xl font-black text-brand-500">4.5</span>
              <div className="text-right">
                <div className="text-yellow-500 text-2xl">⭐⭐⭐⭐⭐</div>
                <div className="text-sm text-gray-500">من 2,084 مراجعة</div>
              </div>
            </div>
          </div>
  
          {/* الشبكة */}
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                {/* التقييم */}
                <div className="text-yellow-500 text-xl mb-4">
                  {"⭐".repeat(review.rating)}
                </div>
  
                {/* النص */}
                <p className="text-gray-700 leading-relaxed mb-6 italic">
                  "{review.comment}"
                </p>
  
                {/* المقيّم */}
                <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
                  <div className={`w-12 h-12 ${review.color} rounded-full flex items-center justify-center text-white font-bold text-xl`}>
                    {review.initial}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{review.name}</div>
                    <div className="text-sm text-gray-500">{review.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }