import type { Config } from "drizzle-kit";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export default {
  // @ts-ignore - drizzle-kit doesn't export proper pg types
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  driver: "d1-http",
  dbCredentials: {
    accountId: process.env.ACCOUNT_ID ?? "defaultAccountId",
    databaseId: process.env.DATABASE_ID ?? "defaultDatabaseId",
    token: process.env.TOKEN ?? "defaultToken",
  },
  strict: true,
} satisfies Config;
