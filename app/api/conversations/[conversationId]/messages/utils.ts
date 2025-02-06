import { openai } from "@ai-sdk/openai";
import { CoreMessage, streamObject } from "ai";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import db from "@/lib/db";
import { schema } from "@/lib/db";
import { getRagieClient } from "@/lib/ragie";

type GenerateContext = {
  messages: CoreMessage[];
  sources: Array<{ text: string; metadata?: Record<string, unknown> }>;
};

const responseSchema = z.object({
  content: z.string(),
});

export const EXPAND_MESSAGE_CONTENT = "Tell me more about this";

export async function generate(userId: string, conversationId: string, context: GenerateContext) {
  // Create pending message
  const [message] = await db
    .insert(schema.messages)
    .values({
      conversationId,
      role: "assistant",
      content: "",
      sources: context.sources,
    })
    .returning();

  if (!message) {
    throw new Error("Failed to create message");
  }

  const result = streamObject({
    messages: context.messages,
    model: openai("gpt-4"),
    temperature: 0.3,
    schema: responseSchema,
    output: "object",
    onFinish: async (event) => {
      if (!event.object) {
        return;
      }

      const response = responseSchema.parse(event.object);
      await db
        .update(schema.messages)
        .set({ content: response.content })
        .where(
          and(
            eq(schema.messages.id, message.id),
            eq(schema.messages.conversationId, conversationId)
          )
        );
    },
  });

  return [result, message.id] as const;
}

export async function getRetrievalSystemPrompt(tenantId: string, name: string, query: string) {
  const response = await getRagieClient().retrievals.retrieve({
    partition: tenantId,
    query,
    topK: 6,
    rerank: true,
  });

  const sources = response.scoredChunks.map((chunk) => ({
    text: chunk.text,
    metadata: {
      documentId: chunk.documentId,
      documentName: chunk.documentName,
      ...chunk.documentMetadata,
    },
  }));

  return {
    content: getSystemPrompt(name, JSON.stringify(response)),
    sources,
  };
}

export function getGroundingSystemPrompt(company: string) {
  return `You are ${company}'s AI assistant. Your responses should be:
- Professional and succinct (3 sentences or less)
- Based on provided sources when available
- Focused on business context and knowledge base
- Free from personal opinions or speculation

DO NOT:
- Use humor or informal language
- Engage in personal conversations
- Make assumptions about unavailable information
- Generate creative content (songs, jokes, poetry)

If no relevant information is found, acknowledge this and suggest how to refine the query.`;
}

function getSystemPrompt(company: string, chunks: string) {
  return `Here are relevant sections from ${company}'s knowledge base:
${chunks}

Provide a concise, professional response that:
- Directly references this information
- Stays under 3 sentences
- Maintains formal business tone
- Focuses only on factual content

DO NOT:
- Include explicit citations
- Use lists or bullet points
- Engage in creative writing
- Respond to off-topic queries`;
}

export function getExpandSystemPrompt() {
  return `Provide additional detail on the previous topic using the same source information. 
You may give a longer response but maintain the same professional tone and factual focus.
Do not repeat citations or restate basic context.`;
}
