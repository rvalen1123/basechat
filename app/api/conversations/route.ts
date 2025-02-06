import { and, desc, eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { APIError } from "@/lib/api-error";
import db from "@/lib/db";
import { schema } from "@/lib/db";
import { withMiddleware } from "@/lib/middleware";

const createConversationRequest = z.object({
  title: z.string().min(1).max(255),
});

type ApiContext<T = unknown> = {
  data?: T;
};

async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    throw APIError.unauthorized("Not authenticated");
  }
  return session;
}

async function handlePost(req: NextRequest, context: ApiContext<z.infer<typeof createConversationRequest>>) {
  const session = await requireAuth();
  if (!context.data) {
    throw APIError.badRequest("Missing request data");
  }

  const { title } = context.data;

  // Get user's current tenant
  const [userTenant] = await db
    .select()
    .from(schema.userTenants)
    .where(eq(schema.userTenants.userId, session.user.id))
    .limit(1);

  if (!userTenant) {
    throw APIError.forbidden("No tenant access");
  }

  const [conversation] = await db
    .insert(schema.conversations)
    .values({
      tenantId: userTenant.tenantId,
      userId: session.user.id,
      title,
    })
    .returning();

  if (!conversation) {
    throw APIError.internal("Failed to create conversation");
  }

  return Response.json({
    status: "success",
    data: {
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt,
    },
  });
}

async function handleGet(req: NextRequest) {
  const session = await requireAuth();

  // Get user's current tenant
  const [userTenant] = await db
    .select()
    .from(schema.userTenants)
    .where(eq(schema.userTenants.userId, session.user.id))
    .limit(1);

  if (!userTenant) {
    throw APIError.forbidden("No tenant access");
  }

  const conversations = await db
    .select({
      id: schema.conversations.id,
      title: schema.conversations.title,
      createdAt: schema.conversations.createdAt,
      updatedAt: schema.conversations.updatedAt,
    })
    .from(schema.conversations)
    .where(
      and(
        eq(schema.conversations.tenantId, userTenant.tenantId),
        eq(schema.conversations.userId, session.user.id)
      )
    )
    .orderBy(desc(schema.conversations.createdAt));

  return Response.json({
    status: "success",
    data: conversations,
  });
}

export const POST = withMiddleware(handlePost, {
  rateLimit: true,
  validation: createConversationRequest,
});

export const GET = withMiddleware(handleGet, {
  rateLimit: true,
});
