import { sql } from "drizzle-orm";

import db from "@/lib/db";

export async function GET() {
  try {
    // Simple query to check if database is accessible
    await db.execute(sql`SELECT 1`);
    return Response.json({ status: "ok" });
  } catch (err) {
    const error = err as Error;
    return Response.json({ status: "error", message: error.message }, { status: 500 });
  }
}
