import { NextRequest } from "next/server";

import { getRagieClient } from "@/lib/ragie";
import { requireAuthContext } from "@/lib/server-utils";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { tenant } = await requireAuthContext();

  if (!tenant?.id) {
    throw new Error("Missing required tenant data");
  }

  const client = await getRagieClient();
  const document = await client.documents.get({ partition: tenant.id, documentId: params.id });
  const summary = await client.documents.getSummary({ partition: tenant.id, documentId: params.id });

  return Response.json({ ...document, summary: summary.summary });
}
