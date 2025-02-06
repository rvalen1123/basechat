"use client";

import assert from "assert";

import { experimental_useObject as useObject } from "ai/react";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef, useState } from "react";

import {
  conversationMessagesResponseSchema,
  CreateConversationMessageRequest,
  createConversationMessageResponseSchema,
} from "@/lib/schema";

import ChatbotLoading from "./loading";
import { SourceMetadata } from "./types";

const MessageList = dynamic(() => import("./message-list"), {
  loading: () => <ChatbotLoading />,
  ssr: false,
});

const ChatInput = dynamic(() => import("./chat-input"), {
  ssr: false,
});

type AiMessage = { content: string; role: "assistant"; id?: string; expanded: boolean; sources: SourceMetadata[] };
type UserMessage = { content: string; role: "user" };
type SystemMessage = { content: string; role: "system" };
type Message = AiMessage | UserMessage | SystemMessage;

interface Props {
  conversationId: string;
  name: string;
  initMessage?: string;
  onSelectedDocumentId: (id: string) => void;
}

export default function Chatbot({ name, conversationId, initMessage, onSelectedDocumentId }: Props) {
  const [localInitMessage, setLocalInitMessage] = useState(initMessage);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sourceCache, setSourceCache] = useState<Record<string, SourceMetadata[]>>({});
  const [pendingMessage, setPendingMessage] = useState<null | { id: string; expanded: boolean }>(null);

  const { isLoading, object, submit } = useObject({
    api: `/api/conversations/${conversationId}/messages`,
    schema: createConversationMessageResponseSchema,
    fetch: async function middleware(input: RequestInfo | URL, init?: RequestInit) {
      const res = await fetch(input, init);
      const id = res.headers.get("x-message-id");
      const expanded = res.headers.get("x-expanded") ? true : false;

      assert(id);

      setPendingMessage({ id, expanded });
      return res;
    },
    onError: console.error,
    onFinish: (event) => {
      if (!event.object) return;

      const content = event.object.message;
      setMessages((prev) => [...prev, { content: content, role: "assistant", sources: [], expanded: false }]);
    },
  });

  const handleSubmit = (content: string) => {
    const payload: CreateConversationMessageRequest = { conversationId, content };
    setMessages([...messages, { content, role: "user" }]);
    submit(payload);
  };

  useEffect(() => {
    if (!pendingMessage || isLoading) return;

    const copy = [...messages];
    const last = copy.pop();
    if (last?.role === "assistant") {
      setMessages([...copy, { ...last, id: pendingMessage.id, expanded: pendingMessage.expanded }]);
      setPendingMessage(null);
    }
  }, [pendingMessage, isLoading, messages]);

  useEffect(() => {
    if (!pendingMessage) return;

    (async () => {
      const res = await fetch(`/api/conversations/${conversationId}/messages/${pendingMessage.id}`);
      if (!res.ok) return;

      const json = (await res.json()) as { id: string; sources: SourceMetadata[] };
      setSourceCache((prev) => ({ ...prev, [json.id]: json.sources }));
    })();
  }, [conversationId, pendingMessage]);

  useEffect(() => {
    if (localInitMessage) {
      handleSubmit(localInitMessage);
      setLocalInitMessage(undefined);
    } else {
      (async () => {
        const res = await fetch(`/api/conversations/${conversationId}/messages`);
        if (!res.ok) throw new Error("Could not load conversation");
        const json = await res.json();
        const messages = conversationMessagesResponseSchema.parse(json);
        setMessages(messages);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally run once
  }, []);

  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    container.current?.scrollTo({
      top: container.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex h-full w-full items-center flex-col">
      <div ref={container} className="flex flex-col h-full w-full items-center overflow-y-auto">
        <Suspense fallback={<ChatbotLoading />}>
          <MessageList
            messages={messages}
            name={name}
            isLoading={isLoading}
            onSelectedDocumentId={onSelectedDocumentId}
            onTellMeMore={() => handleSubmit("Tell me more about this")}
            pendingMessage={pendingMessage ?? undefined}
            sourceCache={sourceCache}
          />
        </Suspense>
      </div>
      <div className="p-4 w-full flex justify-center max-w-[717px]">
        <div className="flex flex-col w-full p-2 pl-4 rounded-[24px] border border-[#D7D7D7]">
          <Suspense fallback={<div>Loading input...</div>}>
            <ChatInput handleSubmit={handleSubmit} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
