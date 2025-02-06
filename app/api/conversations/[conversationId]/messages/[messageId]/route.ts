// This file handles API routes for individual messages within a conversation
// GET /api/conversations/[conversationId]/messages/[messageId] - Fetch a single message by ID
import { NextRequest } from "next/server";

import { getConversationMessage } from "@/lib/data-access/conversation";
import { requireAuthContext } from "@/lib/server-utils";

type Params = { conversationId: string; messageId: string };

export async function GET(_request: NextRequest, { params }: { params: Params }) {
  const { profile, tenant } = await requireAuthContext();

  if (!tenant?.id || !profile?.id) {
    throw new Error("Missing required auth data");
  }

  const message = await getConversationMessage(tenant.id, profile.id, params.conversationId, params.messageId);

  if (!message) {
    return new Response(null, { status: 404 });
  }

  return Response.json(message);
}
