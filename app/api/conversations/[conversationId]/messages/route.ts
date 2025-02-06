import { NextRequest } from "next/server";

import { handleMessage } from "@/lib/services/chat";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const stream = await handleMessage(body.message);
  return new Response(stream);
}
