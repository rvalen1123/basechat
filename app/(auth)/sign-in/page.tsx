import { Inter } from "next/font/google";
import Image from "next/image";

import SignInForm from "./sign-in-form";

const inter = Inter({ subsets: ["latin"] });

export default function SignIn() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#f8f9fa]">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="flex flex-col items-center">
          <div className="w-[300px] h-[150px] mb-8 relative">
            <Image
              src="/logos/grey-matter-logo.png"
              alt="Grey Matter Group"
              fill
              sizes="(max-width: 300px) 100vw, 300px"
              priority
              className="object-contain"
            />
          </div>
          <h2 className={`${inter.className} text-2xl font-semibold`}>Welcome back</h2>
          <p className={`${inter.className} text-gray-600`}>Log in to your account below</p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
