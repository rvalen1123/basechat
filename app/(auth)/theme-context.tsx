"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

import { theme } from "./theme";

const STORAGE_KEY = "theme-preference";

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
  currentTheme: typeof theme.light;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY) === "dark";
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);
  const currentTheme = isDark ? theme.dark : theme.light;

  return <ThemeContext.Provider value={{ isDark, toggleTheme, currentTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
