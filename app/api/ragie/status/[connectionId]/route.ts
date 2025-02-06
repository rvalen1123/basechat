import { NextRequest } from "next/server";

import { getRagieClient } from "@/lib/ragie";
import { requireAuthContext } from "@/lib/server-utils";

export const dynamic = "force-dynamic"; // no caching

interface Params {
  connectionId: string;
}

export async function GET(_request: NextRequest, { params }: { params: Params }) {
  await requireAuthContext();

  const client = getRagieClient();
  const connection = await client.connections.get({ connectionId: params.connectionId });

  return Response.json(connection);
}
