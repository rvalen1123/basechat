import assert from "assert";

import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

import db from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { getRagieClient } from "@/lib/ragie";
import { requireSession } from "@/lib/server-utils";
import { saveConnection } from "@/lib/service";
import * as settings from "@/lib/settings";

export async function GET(request: NextRequest) {
  const session = await requireSession();

  const connectionId = request.nextUrl.searchParams.get("connection_id");
  assert(connectionId, "expected connection_id");

  const rs = await db.select().from(schema.tenants).where(eq(schema.tenants.ownerId, session.user.id));
  assert(rs.length === 1, "failed tenant lookup");

  // Set initial connection status to syncing
  await saveConnection(rs[0].id, connectionId, "syncing");

  return Response.redirect(new URL("data", settings.BASE_URL));
}
