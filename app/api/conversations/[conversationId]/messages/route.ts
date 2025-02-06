import { NextRequest } from "next/server";

import { auth } from "@/auth";
import { APIError } from "@/lib/api-error";
import { withMiddleware } from "@/lib/middleware";
import { getMessages, getUserAccess, handleMessage } from "@/lib/services/chat";
import { createMessageSchema } from "@/lib/types/chat";

async function handleGet(request: NextRequest, context: { params: Record<string, string | string[]> }) {
  const session = await auth();
  if (!session?.user?.id) {
    throw APIError.unauthorized("Not authenticated");
  }

  const conversationId = context.params.conversationId as string;
  if (!conversationId) {
    throw APIError.badRequest("Missing conversation ID");
  }

  const messages = await getMessages(session.user.id, conversationId);

  return Response.json({
    status: "success",
    data: messages,
  });
}

async function handlePost(request: NextRequest, context: { params: Record<string, string | string[]>; data?: unknown }) {
  const session = await auth();
  if (!session?.user?.id) {
    throw APIError.unauthorized("Not authenticated");
  }

  const conversationId = context.params.conversationId as string;
  if (!conversationId) {
    throw APIError.badRequest("Missing conversation ID");
  }

  if (!context.data) {
    throw APIError.badRequest("Missing request data");
  }

  const { content } = createMessageSchema.parse(context.data);

  // Get user's tenant access
  const { tenant } = await getUserAccess(session.user.id, conversationId);

  // Handle the message and get the response
  const { stream, messageId } = await handleMessage(
    session.user.id,
    conversationId,
    content,
    tenant
  );

  return stream;
}

export const GET = withMiddleware(handleGet, {
  rateLimit: true,
});

export const POST = withMiddleware(handlePost, {
  rateLimit: true,
  validation: createMessageSchema,
});
