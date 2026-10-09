"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Star,
  Quote,
  Sparkles,
  MessageCircle,
  Award,
  Users,
  TrendingUp,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

// ==========================================
// Types
// ==========================================
interface Review {
  id: string;
  name: string;
  company: string | null;
  position: string | null;
  content: string;
  rating: number;
  avatar: string | null;
  isFeatured: boolean;
  isVerified: boolean;
  createdAt: Date;
}

interface ReviewsContentProps {
  reviews: Review[];
}

// ==========================================
// 🏠 الصفحة
// ==========================================
export default function ReviewsContent({ reviews }: ReviewsContentProps) {
  // حساب الإحصائيات
  const totalReviews = reviews.length;
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;
  const fiveStarsCount = reviews.filter((r) => r.rating === 5).length;

  return (
    <div className="bg-slate-50 dark:bg-[#0a0a0f] transition-colors duration-300">
      {/* ============================================ */}
      {/* Hero */}
      {/* ============================================ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-slate-900 dark:via-amber-950 dark:to-slate-900">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-yellow-400/30 dark:bg-yellow-500/20 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-orange-400/30 dark:bg-orange-500/20 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 py-24 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-yellow-200/50 dark:border-white/10 px-5 py-2.5 rounded-full mb-6 shadow-lg">
            <Sparkles className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
            <span className="text-sm font-bold text-amber-700 dark:text-amber-100">
              آراء عملائنا
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="text-slate-900 dark:text-white">ماذا يقول </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 dark:from-yellow-400 dark:via-orange-400 dark:to-red-400">
              عملاؤنا؟
            </span>
          </h1>

          <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-12">
            تقييمات حقيقية من عملاء استفادوا من خدماتنا
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-yellow-100 dark:border-white/10 rounded-2xl p-6 shadow-lg">
              <Award className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {averageRating.toFixed(1)}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                متوسط التقييم
              </div>
            </div>
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-yellow-100 dark:border-white/10 rounded-2xl p-6 shadow-lg">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {totalReviews}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                إجمالي المراجعات
              </div>
            </div>
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-yellow-100 dark:border-white/10 rounded-2xl p-6 shadow-lg">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {fiveStarsCount}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                تقييم 5 نجوم
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* المراجعات */}
      {/* ============================================ */}
      <section className="py-24 bg-white dark:bg-[#0a0a0f] transition-colors duration-300">
        <div className="container mx-auto px-4">
          {reviews.length === 0 ? (
            <div className="text-center py-20 max-w-2xl mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-yellow-100 dark:bg-yellow-500/20 flex items-center justify-center">
                <Star className="w-12 h-12 text-yellow-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                لا توجد مراجعات بعد
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                كن أول من يشارك تجربته مع Code Tech!
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-2xl transition-all hover:scale-105"
              >
                <MessageCircle className="w-5 h-5" />
                أضف مراجعتك
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {reviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`relative bg-white dark:bg-[#12121a] rounded-3xl p-6 border-2 transition-all hover:shadow-2xl hover:-translate-y-2 ${
                    review.isFeatured
                      ? "border-yellow-300 dark:border-yellow-500/30 shadow-lg shadow-yellow-500/10"
                      : "border-slate-100 dark:border-white/10"
                  }`}
                >
                  {/* Featured Badge */}
                  {review.isFeatured && (
                    <div className="absolute -top-3 right-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <Sparkles className="w-3 h-3" />
                      مميز
                    </div>
                  )}

                  {/* Quote Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg">
                    <Quote className="w-6 h-6 text-white" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-4 h-4 ${
                          idx < review.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-slate-300 dark:text-slate-600"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 min-h-[100px]">
                    {review.content}
                  </p>

                  {/* Author */}
                  <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                      {review.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-black text-slate-900 dark:text-white truncate">
                          {review.name}
                        </div>
                        {review.isVerified && (
                          <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      {(review.company || review.position) && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {review.position && `${review.position} — `}
                          {review.company}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================ */}
      {/* CTA */}
      {/* ============================================ */}
      <section className="py-24 bg-slate-50 dark:bg-[#0d0d14] transition-colors duration-300">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl">
              <Star className="w-10 h-10 text-white fill-white" />
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
              شارك تجربتك معنا
            </h2>

            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              رأيك يهمنا ويساعدنا على التحسين المستمر
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-xl"
            >
              <MessageCircle className="w-5 h-5" />
              أضف مراجعتك الآن
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}