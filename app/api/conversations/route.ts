import { and, desc, eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { z } from "zod";

import { APIError } from "@/lib/api-error";
import db from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { ApiContext, withMiddleware } from "@/lib/middleware";
import { requireAuthContext } from "@/lib/server-utils";

const createConversationRequest = z.object({ title: z.string() });

async function handlePost(req: NextRequest, context: ApiContext<z.infer<typeof createConversationRequest>>) {
  const { profile, tenant } = await requireAuthContext();
  if (!context.data) {
    throw APIError.badRequest("Missing request data");
  }
  const { title } = context.data;

  const rs = await db
    .insert(schema.conversations)
    .values({
      tenantId: tenant.id,
      profileId: profile.id,
      title,
    })
    .returning();

  if (!rs.length) {
    throw APIError.internal("Failed to create conversation");
  }

  return Response.json({
    status: "success",
    data: { id: rs[0].id },
  });
}

async function handleGet(req: NextRequest, context: ApiContext) {
  const { profile, tenant } = await requireAuthContext();

  const rs = await db
    .select({
      id: schema.conversations.id,
      title: schema.conversations.title,
      createdAt: schema.conversations.createdAt,
      updatedAt: schema.conversations.updatedAt,
    })
    .from(schema.conversations)
    .where(and(eq(schema.conversations.tenantId, tenant.id), eq(schema.conversations.profileId, profile.id)))
    .orderBy(desc(schema.conversations.createdAt));

  return Response.json({
    status: "success",
    data: rs,
  });
}

export const POST = withMiddleware(handlePost, {
  rateLimit: true,
  validation: createConversationRequest,
});

export const GET = withMiddleware(handleGet, {
  rateLimit: true,
});
