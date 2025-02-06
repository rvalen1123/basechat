import { NextRequest } from "next/server";
import { ConnectorSource } from "ragie/models/components";

import { getRagieClient } from "@/lib/ragie";
import { requireAuthContext } from "@/lib/server-utils";
import * as settings from "@/lib/settings";

export const dynamic = "force-dynamic"; // no caching

interface Params {
  type: string;
}

export async function GET(_request: NextRequest, { params }: { params: Params }) {
  const { tenant } = await requireAuthContext();

  if (!tenant?.id) {
    throw new Error("Missing required tenant data");
  }

  const client = getRagieClient();

  const payload = await client.connections.createOAuthRedirectUrl({
    redirectUri: [settings.BASE_URL, "api/ragie/callback"].join("/"),
    sourceType: "google_drive",
    partition: tenant.id,
    theme: "light",
  });

  return Response.json(payload);
}
