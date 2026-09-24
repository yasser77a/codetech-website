"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // ✅ تحميل الثيم المحفوظ عند البدء
  useEffect(() => {
    try {
      const saved = localStorage.getItem("codetech-theme") as Theme | null;
      const initial: Theme = saved === "dark" ? "dark" : "light";
      setTheme(initial);
      document.documentElement.classList.toggle("dark", initial === "dark");
      document.documentElement.style.colorScheme = initial;
    } catch (e) {
      console.error("Theme loading error:", e);
    }
    setMounted(true);
  }, []);

  // ✅ تبديل الثيم
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "light" ? "dark" : "light";
      document.documentElement.classList.toggle("dark", next === "dark");
      document.documentElement.style.colorScheme = next;
      try {
        localStorage.setItem("codetech-theme", next);
      } catch (e) {
        console.error("Failed to save theme:", e);
      }
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};