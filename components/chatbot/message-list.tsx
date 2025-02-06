import { Fragment } from "react";

import AssistantMessage from "./assistant-message";
import { SourceMetadata } from "./types";

interface Message {
  content: string;
  role: "assistant" | "user" | "system";
  id?: string;
  expanded?: boolean;
  sources?: SourceMetadata[];
}

interface Props {
  messages: Message[];
  name: string;
  isLoading: boolean;
  onSelectedDocumentId: (id: string) => void;
  onTellMeMore: () => void;
  pendingMessage?: { id: string; expanded: boolean };
  sourceCache: Record<string, SourceMetadata[]>;
}

function UserMessage({ content }: { content: string }) {
  return <div className="mb-6 rounded-md px-4 py-2 self-end bg-[#F5F5F7]">{content}</div>;
}

function isExpandable(messages: Message[], i: number) {
  return (
    i === messages.length - 1 &&
    (messages.length <= 2 ||
      (messages.length - 2 > 0 && messages[messages.length - 2].content != "Tell me more about this"))
  );
}

export default function MessageList({
  messages,
  name,
  isLoading,
  onSelectedDocumentId,
  onTellMeMore,
  pendingMessage,
  sourceCache,
}: Props) {
  const messagesWithSources = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => (m.role === "assistant" && m.id && sourceCache[m.id] ? { ...m, sources: sourceCache[m.id] } : m));

  return (
    <div className="flex flex-col h-full w-full p-4 max-w-[717px]">
      {messagesWithSources.map((message, i) =>
        message.role === "user" ? (
          <UserMessage key={i} content={message.content} />
        ) : (
          <Fragment key={i}>
            <AssistantMessage
              name={name}
              content={message.content}
              id={message.id}
              sources={message.sources || []}
              onSelectedDocumentId={onSelectedDocumentId}
            />
            {isExpandable(messagesWithSources, i) && (
              <div className="flex justify-center">
                <button className="flex justify-center rounded-[20px] border px-4 py-2.5 mt-8" onClick={onTellMeMore}>
                  Tell me more about this
                </button>
              </div>
            )}
          </Fragment>
        ),
      )}
      {isLoading && (
        <AssistantMessage
          name={name}
          content={""}
          id={pendingMessage?.id}
          sources={[]}
          onSelectedDocumentId={onSelectedDocumentId}
        />
      )}
    </div>
  );
}
