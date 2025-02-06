import { defineConfig } from "drizzle-kit";

import * as settings from "./lib/settings";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  driver: "postgres",
  dbCredentials: {
    connectionString: settings.POSTGRES_URL_NON_POOLING,
    ssl: true,
  },
  verbose: true,
  strict: true,
});
