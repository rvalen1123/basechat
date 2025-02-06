import { and, desc, eq } from "drizzle-orm";

import { APIError } from "@/lib/api-error";
import db from "@/lib/db";
import { schema } from "@/lib/db";
import type { Message, Source, UserTenant } from "@/lib/types/chat";

export async function getUserTenant(userId: string): Promise<UserTenant> {
    const [userTenant] = await db
        .select()
        .from(schema.userTenants)
        .where(eq(schema.userTenants.userId, userId))
        .limit(1);

    if (!userTenant) {
        throw APIError.forbidden("No tenant access");
    }

    return userTenant;
}

export async function getTenant(tenantId: string) {
    const [tenant] = await db
        .select()
        .from(schema.tenants)
        .where(eq(schema.tenants.id, tenantId))
        .limit(1);

    if (!tenant) {
        throw APIError.internal("Tenant not found");
    }

    return tenant;
}

export async function verifyConversationAccess(userId: string, conversationId: string, tenantId: string) {
    const [conversation] = await db
        .select()
        .from(schema.conversations)
        .where(
            and(
                eq(schema.conversations.id, conversationId),
                eq(schema.conversations.userId, userId),
                eq(schema.conversations.tenantId, tenantId)
            )
        )
        .limit(1);

    if (!conversation) {
        throw APIError.notFound("Conversation not found");
    }

    return conversation;
}

export async function getConversationMessages(conversationId: string): Promise<Message[]> {
    const messages = await db
        .select()
        .from(schema.messages)
        .where(eq(schema.messages.conversationId, conversationId))
        .orderBy(desc(schema.messages.createdAt));

    return messages.map((msg): Message => ({
        ...msg,
        role: msg.role as "system" | "user" | "assistant",
        sources: msg.sources as Source[],
    }));
}

export async function addMessage(
    conversationId: string,
    role: "system" | "user" | "assistant",
    content: string,
    sources: Source[] = []
) {
    const [message] = await db
        .insert(schema.messages)
        .values({
            conversationId,
            role,
            content,
            sources,
        })
        .returning();

    if (!message) {
        throw APIError.internal("Failed to create message");
    }

    return {
        ...message,
        role: message.role as "system" | "user" | "assistant",
        sources: message.sources as Source[],
    } as Message;
}

export async function updateMessageContent(messageId: string, content: string) {
    const [message] = await db
        .update(schema.messages)
        .set({ content })
        .where(eq(schema.messages.id, messageId))
        .returning();

    if (!message) {
        throw APIError.internal("Failed to update message");
    }

    return {
        ...message,
        role: message.role as "system" | "user" | "assistant",
        sources: message.sources as Source[],
    } as Message;
}
