"use client";

import { useRouter } from "next/navigation";
import { z } from "zod";

import ChatInput from "@/components/chatbot/chat-input";
import * as schema from "@/lib/db/schema";

import { useGlobalState } from "./context";

const conversationResponseSchema = z.object({ id: z.string() });

interface Props {
  tenant: typeof schema.tenants.$inferSelect;
  questions: string[];
}

export default function WelcomeClient({ tenant, questions }: Props) {
  const router = useRouter();
  const { setInitialMessage } = useGlobalState();

  const handleSubmit = async (content: string) => {
    const res = await fetch("/api/conversations", { method: "POST", body: JSON.stringify({ title: content }) });
    if (!res.ok) throw new Error("Could not create conversation");

    const json = await res.json();
    const conversation = conversationResponseSchema.parse(json);
    setInitialMessage(content);
    router.push(`/conversations/${conversation.id}`);
  };

  return (
    <>
      <div className="flex items-start justify-evenly space-x-2">
        {questions.map((question, i) => (
          <div
            key={i}
            className="rounded-md border p-4 h-full w-1/3 cursor-pointer"
            onClick={() => handleSubmit(question)}
          >
            {question}
          </div>
        ))}
      </div>
      <div className="w-full flex flex-col items-center p-2 pl-4 rounded-[24px] border border-[#D7D7D7]">
        <ChatInput handleSubmit={handleSubmit} />
      </div>
    </>
  );
}
