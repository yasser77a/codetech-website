import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 relative overflow-hidden" dir="rtl">
      
      {/* خلفية شبكية */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* دوائر ضوئية */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />

      {/* النموذج */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          
          {/* الشعار */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <img
                src="/logo.png"
                alt="Code Tech"
                className="w-full h-full object-contain drop-shadow-[0_0_40px_rgba(59,130,246,0.6)]"
              />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Code Tech</h1>
            <p className="text-blue-200 text-sm">لوحة التحكم الإدارية</p>
          </div>

          {/* نموذج تسجيل الدخول */}
          <LoginForm />

          {/* رابط العودة */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <a
              href="/"
              className="text-blue-300 hover:text-white text-sm transition"
            >
              ← العودة إلى الموقع الرئيسي
            </a>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="mt-6 text-center text-blue-300/60 text-xs">
          © 2026 Code Tech - جميع الحقوق محفوظة
        </div>
      </div>
    </div>
  );
}