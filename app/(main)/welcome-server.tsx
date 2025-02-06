import { eq } from "drizzle-orm";

import db from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { authOrRedirect } from "@/lib/server-utils";

import Welcome from "./welcome";

export default async function WelcomeServer() {
  const { tenant, session } = await authOrRedirect();
  const tenantData = await db
    .select()
    .from(schema.tenants)
    .where(eq(schema.tenants.id, tenant.id))
    .then((rows) => rows[0]);

  return <Welcome tenant={tenantData} className="flex-1 flex flex-col w-full bg-white p-4 max-w-[717px]" />;
}
