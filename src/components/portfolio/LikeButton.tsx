"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  targetType: "PROJECT" | "BLOG_POST";
  targetId: string;
  initialCount?: number;
  size?: "sm" | "md" | "lg";
}

export default function LikeButton({
  targetType,
  targetId,
  initialCount = 0,
  size = "md",
}: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);

  // جلب الحالة الأولية
  useEffect(() => {
    fetch(`/api/likes?targetType=${targetType}&targetId=${targetId}`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.likesCount === "number") setCount(data.likesCount);
        if (typeof data.userLiked === "boolean") setLiked(data.userLiked);
      })
      .catch(() => {});
  }, [targetType, targetId]);

  const handleToggle = async () => {
    if (loading) return;
    setLoading(true);

    // Optimistic update
    const previousLiked = liked;
    const previousCount = count;
    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);
    setAnimating(true);

    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId }),
      });

      const data = await res.json();

      if (res.ok) {
        setLiked(data.liked);
        setCount(data.likesCount);
      } else {
        // Rollback
        setLiked(previousLiked);
        setCount(previousCount);
      }
    } catch {
      // Rollback
      setLiked(previousLiked);
      setCount(previousCount);
    }

    setLoading(false);
    setTimeout(() => setAnimating(false), 600);
  };

  const sizes = {
    sm: { button: "px-3 py-1.5 text-xs", icon: "w-3.5 h-3.5" },
    md: { button: "px-4 py-2 text-sm", icon: "w-4 h-4" },
    lg: { button: "px-6 py-3 text-base", icon: "w-5 h-5" },
  };

  const s = sizes[size];

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`relative flex items-center gap-2 rounded-xl font-bold transition-all ${s.button} ${
        liked
          ? "bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-500/30"
          : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-2 border-slate-200 dark:border-slate-700 hover:border-red-200 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
      } ${loading ? "opacity-70 cursor-wait" : "hover:scale-105"}`}
    >
      <motion.div
        animate={
          animating
            ? { scale: [1, 1.4, 1], rotate: [0, 15, -15, 0] }
            : { scale: 1, rotate: 0 }
        }
        transition={{ duration: 0.5 }}
      >
        <Heart
          className={`${s.icon} transition-all ${
            liked ? "fill-red-500 text-red-500" : ""
          }`}
        />
      </motion.div>
      <span className="tabular-nums">{count}</span>

      {/* Burst effect */}
      <AnimatePresence>
        {animating && liked && (
          <>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.span
                key={i}
                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: [0, 1.5, 0],
                  x: Math.cos((i * Math.PI * 2) / 6) * 30,
                  y: Math.sin((i * Math.PI * 2) / 6) * 30,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute left-1/2 top-1/2 text-red-500 text-xl pointer-events-none"
              >
                ❤️
              </motion.span>
            ))}
          </>
        )}
      </AnimatePresence>
    </button>
  );
}