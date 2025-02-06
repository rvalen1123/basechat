import type { Config } from "drizzle-kit";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export default {
  // @ts-ignore - drizzle-kit doesn't export proper pg types
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL,
  },
  strict: true,
} satisfies Config;
