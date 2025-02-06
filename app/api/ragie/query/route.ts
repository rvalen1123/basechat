import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

import db from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { getRagieClient } from "@/lib/ragie";
import { requireAuthContext } from "@/lib/server-utils";

export async function POST(request: NextRequest) {
  const { tenant } = await requireAuthContext();
  const { question } = await request.json();

  // Look up Ragie connection ID for the tenant
  const rs = await db
    .select({ ragieConnectionId: schema.connections.ragieConnectionId })
    .from(schema.connections)
    .where(eq(schema.connections.tenantId, tenant.id));

  if (rs.length === 0) {
    return Response.json({ error: "No Ragie connection found for tenant" }, { status: 400 });
  }

  const { ragieConnectionId } = rs[0];

  const client = getRagieClient();

  // Retrieve relevant chunks using RAG
  const result = await client.retrievals.retrieve({
    query: question,
    topK: 5,
    filter: {
      partition: ragieConnectionId,
    },
    rerank: true,
    recencyBias: true,
  });

  // Extract and combine the relevant chunks into a response
  const chunks = result.scoredChunks || [];
  const response = chunks.length > 0 ? chunks.map((chunk) => chunk.text).join("\n\n") : "No relevant information found";

  return Response.json({ response });
}
