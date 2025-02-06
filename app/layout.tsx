import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

import { cn } from "@/lib/utils";

import { GlobalStateProvider } from "./(main)/context";
import { Providers } from "./providers";

import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Grey Matter Group AI",
  description: "Grey Matter Group's AI-powered knowledge base",
  icons: {
    icon: "/logos/PNG-01.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <Providers>
        <GlobalStateProvider>
          <html lang="en" suppressHydrationWarning className="h-full w-full">
            <head>
              <link rel="icon" href="/logos/PNG-01.png" />
            </head>
            <body
              suppressHydrationWarning
              className={cn("min-h-screen bg-background font-sans antialiased h-full w-full", fontSans.variable)}
            >
              {children}
              <Toaster
                position="bottom-center"
                toastOptions={{
                  classNames: {
                    toast: "bg-background text-foreground border border-border shadow-lg",
                    title: "text-sm font-medium",
                    description: "text-sm text-muted-foreground",
                    actionButton: "bg-primary text-primary-foreground",
                    cancelButton: "bg-muted text-muted-foreground",
                  },
                }}
              />
            </body>
          </html>
        </GlobalStateProvider>
      </Providers>
    </SessionProvider>
  );
}
