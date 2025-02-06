import { NextResponse } from "next/server";

import { checkDatabaseConnection } from "@/lib/db";

export async function GET() {
  const status = await checkDatabaseConnection();

  return NextResponse.json(status, {
    status: status.status === "healthy" ? 200 : 503,
  });
}
