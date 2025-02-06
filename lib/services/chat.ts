import { CoreMessage } from "ai";

import {
    addMessage,
    getConversationMessages,
    getTenant,
    getUserTenant,
    verifyConversationAccess,
} from "@/lib/data-access/messages";
import type { ChatResponse, Message, Source } from "@/lib/types/chat";

import {
    EXPAND_MESSAGE_CONTENT,
    generate,
    getExpandSystemPrompt,
    getGroundingSystemPrompt,
    getRetrievalSystemPrompt,
} from "./chat-utils";

export async function getUserAccess(userId: string, conversationId: string) {
    const userTenant = await getUserTenant(userId);
    const tenant = await getTenant(userTenant.tenantId);
    await verifyConversationAccess(userId, conversationId, userTenant.tenantId);

    return { userTenant, tenant };
}

export async function handleInitialMessage(conversationId: string, tenantName: string) {
    await addMessage(
        conversationId,
        "system",
        getGroundingSystemPrompt(tenantName),
        []
    );
}

export async function handleExpandMessage(conversationId: string) {
    await addMessage(
        conversationId,
        "system",
        getExpandSystemPrompt(),
        []
    );
}

export async function handleRegularMessage(
    conversationId: string,
    tenantId: string,
    tenantName: string,
    content: string
) {
    const { content: systemContent, sources } = await getRetrievalSystemPrompt(
        tenantId,
        tenantName,
        content
    );

    await addMessage(
        conversationId,
        "system",
        systemContent,
        []
    );

    return sources;
}

export async function handleMessage(
    userId: string,
    conversationId: string,
    content: string,
    tenant: { id: string; name: string }
): Promise<ChatResponse> {
    // Add user message
    await addMessage(conversationId, "user", content, []);

    // Get existing messages
    const existingMessages = await getConversationMessages(conversationId);

    // Handle system message based on content type
    let sources: Source[] = [];
    if (!existingMessages.length) {
        await handleInitialMessage(conversationId, tenant.name);
    } else if (content === EXPAND_MESSAGE_CONTENT) {
        await handleExpandMessage(conversationId);
    } else {
        sources = await handleRegularMessage(conversationId, tenant.id, tenant.name, content);
    }

    // Get all messages for context
    const messages = await getConversationMessages(conversationId);
    const coreMessages: CoreMessage[] = messages.map(({ role, content }) => ({
        role,
        content: content ?? "",
    }));

    // Generate response
    const [result, messageId] = await generate(userId, conversationId, {
        messages: coreMessages,
        sources,
    });

    return {
        stream: result.toTextStreamResponse(),
        messageId,
    };
}

export async function getMessages(userId: string, conversationId: string): Promise<Message[]> {
    const userTenant = await getUserTenant(userId);
    await verifyConversationAccess(userId, conversationId, userTenant.tenantId);
    return getConversationMessages(conversationId);
}
