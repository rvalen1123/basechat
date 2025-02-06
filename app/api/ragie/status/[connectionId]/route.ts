import { NextRequest } from "next/server";
import { z } from "zod";

import { getRagieClient } from "@/lib/ragie";
import { requireAuthContext } from "@/lib/server-utils";

export const dynamic = "force-dynamic"; // no caching

interface Params {
  connectionId: string;
}

export async function GET(_request: NextRequest, { params }: { params: Promise<Params> }) {
  try {
    await requireAuthContext();

    const { connectionId } = await params;
    const validatedParams = z
      .object({
        connectionId: z.string(),
      })
      .parse({ connectionId });

    const client = getRagieClient();
    const connection = await client.connections.get({
      connectionId: validatedParams.connectionId,
    });

    return Response.json(connection);
  } catch (error) {
    console.error("Error in status endpoint:", error);
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid parameters" }, { status: 400 });
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
