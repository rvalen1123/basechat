"use client";

import { ReactNode } from "react";

import { ThemeProvider } from "./(auth)/theme-context";

export function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
