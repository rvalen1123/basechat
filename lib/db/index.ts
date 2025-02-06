import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import * as schema from "./schema.new";

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL environment variable is required");
}

const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
const db = drizzle(pool, { schema });

export default db;
export { schema };
