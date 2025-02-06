import { Pool } from "@neondatabase/serverless";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import * as settings from "@/lib/settings";

// Use pooled connection for better performance
const pool = new Pool({
  connectionString: settings.POSTGRES_URL,
  ssl: true,
});

// Use Vercel Postgres client with drizzle
const db = drizzle(sql);

export default db;
