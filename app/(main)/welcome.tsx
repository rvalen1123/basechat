import { Inter } from "next/font/google";

import * as schema from "@/lib/db/schema";
import { getInitials } from "@/lib/utils";

import WelcomeClient from "./welcome-client";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  tenant: typeof schema.tenants.$inferSelect;
  className?: string;
}

export default function Welcome({ tenant, className }: Props) {
  const initials = getInitials(tenant.name);
  const questions = [
    tenant.question1 || "What are our current active deals and their status?",
    tenant.question2 || "Can you summarize our company's investment strategy?",
    tenant.question3 || "What are the key points from our latest executive meeting?",
  ];

  return (
    <div className={className} suppressHydrationWarning>
      <div className={`h-full flex flex-col justify-center ${inter.className}`} suppressHydrationWarning>
        <div className="h-[100px] mb-8">
          <img src="/logos/PNG-01.png" alt="Grey Matter Group" className="h-full w-auto" />
        </div>
        <h1 className="mb-12 text-[40px] font-bold leading-[50px]">
          Welcome to Grey Matter Group AI
          <br />
          How can I assist you today?
        </h1>
        <WelcomeClient tenant={tenant} questions={questions} />
      </div>
    </div>
  );
}
