import { NextRequest } from "next/server";

import { getRagieClient } from "@/lib/ragie";
import { requireAuthContext } from "@/lib/server-utils";

export const dynamic = "force-dynamic"; // no caching

type Props = {
  params: {
    connectionId: string;
  };
};

export async function GET(request: NextRequest, props: Props) {
  await requireAuthContext();

  const client = getRagieClient();
  const connection = await client.connections.get({ connectionId: props.params.connectionId });

  return Response.json(connection);
}
