// This file handles API routes for individual messages within a conversation
// GET /api/conversations/[conversationId]/messages/[messageId] - Fetch a single message by ID
import { NextRequest } from "next/server";

import { getConversationMessage } from "@/lib/data-access/conversation";
import { requireAuthContext } from "@/lib/server-utils";

type Params = { conversationId: string; messageId: string };

export async function GET(_request: NextRequest, { params }: { params: Promise<Params> }) {
  const { profile, tenant } = await requireAuthContext();
  const { conversationId, messageId } = await params;
  const message = await getConversationMessage(tenant.id, profile.id, conversationId, messageId);

  return Response.json(message);
}
