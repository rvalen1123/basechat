import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

import { GlobalStateProvider } from "./(main)/context";

const inter = Inter({ subsets: ["latin"] });

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
      <GlobalStateProvider>
        <html lang="en" className="h-full w-full">
          <head>
            <link rel="icon" href="/logos/PNG-01.png" />
          </head>
          <body className={`${inter.className} antialiased h-full w-full bg-[#f8f9fa]`}>
            {children}
            <Toaster position="bottom-center" />
          </body>
        </html>
      </GlobalStateProvider>
    </SessionProvider>
  );
}
