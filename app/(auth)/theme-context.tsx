"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

import { theme } from "./theme";

const STORAGE_KEY = "theme-mode";
const DARK_CLASS = "dark";

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
  currentTheme: typeof theme.light;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check system preference and localStorage on mount
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const storedTheme = localStorage.getItem(STORAGE_KEY);
    setIsDark(storedTheme === DARK_CLASS || (!storedTheme && prefersDark));
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add(DARK_CLASS);
      localStorage.setItem(STORAGE_KEY, DARK_CLASS);
    } else {
      root.classList.remove(DARK_CLASS);
      localStorage.setItem(STORAGE_KEY, "light");
    }
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
