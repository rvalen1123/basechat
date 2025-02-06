import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  driver: "d1-http",
  dialect: "sqlite",
  dbCredentials: {
    accountId: process.env.CF_ACCOUNT_ID || "",
    databaseId: process.env.DATABASE_ID || "",
    token: process.env.CF_API_TOKEN || "",
  },
  strict: true,
} satisfies Config;
