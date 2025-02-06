"use client";

import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { ThemeToggle } from "../components/theme-toggle";

const inter = Inter({ subsets: ["latin"] });

export default function SignInForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ThemeToggle />
      </div>
      <Link
        href="/api/auth/signin/google"
        className="flex w-full items-center justify-center gap-3 rounded-lg border bg-background px-4 py-3 text-foreground shadow-sm hover:bg-accent focus:outline-offset-0"
      >
        <div className="w-5 h-5">
          <Image src="/google-mark.svg" alt="Google" width={20} height={20} className="w-full h-full" />
        </div>
        <span className={inter.className}>Continue with Google</span>
      </Link>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-[#f8f9fa] px-2 text-gray-500">or</span>
        </div>
      </div>

      <form className="space-y-2" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Email"
          className="w-full rounded-lg border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none"
        />
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Password"
          className="w-full rounded-lg border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-primary px-4 py-3 text-primary-foreground hover:bg-primary/90 focus:outline-none"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
