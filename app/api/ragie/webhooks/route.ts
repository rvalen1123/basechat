import { createHmac } from "crypto";

import { getRagieClient } from "@/lib/ragie";
import { saveConnection } from "@/lib/service";
import * as settings from "@/lib/settings";

export async function POST(request: Request) {
  const signature = request.headers.get("x-ragie-signature");
  if (!signature) {
    return new Response("Missing signature", { status: 401 });
  }

  const rawBody = await request.text();
  const hmac = createHmac("sha256", settings.RAGIE_WEBHOOK_SECRET);
  const digest = hmac.update(rawBody).digest("base64");

  if (digest !== signature) {
    return new Response("Invalid signature", { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  if (payload.type === "connection.updated") {
    const connection = await getRagieClient().connections.get({
      connectionId: payload.data.connection_id,
    });

    if (connection) {
      await saveConnection(payload.data.partition, payload.data.connection_id, payload.data.status);
    }
  }

  return new Response("OK", { status: 200 });
}
