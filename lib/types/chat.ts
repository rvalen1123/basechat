import { z } from "zod";

export interface ChatContext {
    userId: string;
    conversationId: string;
    tenant: {
        id: string;
        name: string;
    };
}

export interface ChatResponse {
    stream: Response;
    messageId: string;
}

export interface Source {
    text: string;
    metadata?: Record<string, unknown>;
}

export interface Message {
    id: string;
    conversationId: string;
    role: "system" | "user" | "assistant";
    content: string | null;
    sources: Source[];
    createdAt: string;
    updatedAt: string;
}

export interface UserTenant {
    id: string;
    userId: string;
    tenantId: string;
    role: string;
}

export const createMessageSchema = z.object({
    content: z.string().min(1),
});

export type CreateMessageRequest = z.infer<typeof createMessageSchema>;
