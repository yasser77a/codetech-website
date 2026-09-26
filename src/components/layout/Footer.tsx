import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-800 text-white pt-16 pb-8 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* عن الشركة */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Code Tech" className="h-16 w-16 object-contain" />
              <div>
                <div className="text-2xl font-bold">Code Tech</div>
              </div>
            </div>
            <p className="text-blue-200 leading-relaxed">
              نبني أنظمة برمجية بحماية فائقة ودقة عالية. شريكك التقني الموثوق في صنعاء.
            </p>
            <div className="flex items-center gap-2 mt-4 text-yellow-400">
              <span>⭐ 4.5/5</span>
              <span className="text-blue-200 text-sm">(2,084 مراجعة)</span>
            </div>
          </div>

          {/* روابط سريعة */}
          <div>
            <h3 className="font-bold text-xl mb-4 text-white">روابط سريعة</h3>
            <ul className="space-y-3 text-blue-200">
              <li><Link href="/" className="hover:text-white transition">الرئيسية</Link></li>
              <li><Link href="/about" className="hover:text-white transition">من نحن</Link></li>
              <li><Link href="/services" className="hover:text-white transition">الخدمات</Link></li>
              <li><Link href="/portfolio" className="hover:text-white transition">أعمالنا</Link></li>
              <li><Link href="/reviews" className="hover:text-white transition">التقييمات</Link></li>
            </ul>
          </div>

          {/* خدماتنا */}
          <div>
            <h3 className="font-bold text-xl mb-4 text-white">خدماتنا</h3>
            <ul className="space-y-3 text-blue-200">
              <li>🖥️ أنظمة سطح المكتب</li>
              <li>🌐 مواقع الويب</li>
              <li>📱 تطبيقات أندرويد وآيفون</li>
              <li>🎨 تصاميم جرافيكس</li>
              <li>🎓 مشاريع تخرج وبحوثات</li>
              <li>📊 دراسة مشاريع</li>
            </ul>
          </div>

          {/* تواصل معنا */}
          <div>
            <h3 className="font-bold text-xl mb-4 text-white">تواصل معنا</h3>
            <ul className="space-y-3 text-blue-200">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>اليمن - صنعاء</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:+967775566442" className="hover:text-white transition" dir="ltr">
                  +967 775566442   -   +967 733111389
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>💬</span>
                <a href="https://wa.me/967775566442" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition">
                  واتساب
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>📘</span>
                <a href="https://www.facebook.com/CodeTech.ye" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">
                  فيسبوك
                </a>
              </li>
            </ul>

            {/* أيام العمل */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-sm text-blue-200">
                🕐 السبت – الخميس
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 text-center text-blue-300 text-sm">
          © 2026 Code Tech – جميع الحقوق محفوظة | صُنع بـ ❤️ في اليمن
        </div>
      </div>
    </footer>
  );
}