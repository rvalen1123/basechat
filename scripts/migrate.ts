import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";

const MAX_RETRIES = 3;
const INITIAL_BACKOFF = 1000;

async function runMigrations() {
  // Use the same connection string as the main app
  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error("POSTGRES_URL environment variable is required");
  }

  console.log("Starting database migrations...");

  const pool = new Pool({ connectionString });
  const db = drizzle(pool);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await migrate(db, { migrationsFolder: "drizzle" });
      console.log("Migrations completed successfully!");
      await pool.end();
      return;
    } catch (error) {
      console.error(`Migration attempt ${attempt} failed:`, error);

      if (attempt === MAX_RETRIES) {
        console.error("Max retry attempts reached. Migration failed.");
        await pool.end();
        process.exit(1);
      }

      // Exponential backoff with jitter
      const backoff = INITIAL_BACKOFF * Math.pow(2, attempt - 1) * (0.5 + Math.random() * 0.5);
      console.log(`Retrying in ${Math.round(backoff / 1000)} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, backoff));
    }
  }
}

runMigrations().catch((error) => {
  console.error("Migration script failed:", error);
  process.exit(1);
});
