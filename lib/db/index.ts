import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import type { NeonDatabase } from "drizzle-orm/neon-serverless";

import * as settings from "@/lib/settings";

// Configure connection pool with optimal settings
const pool = new Pool({
  connectionString: settings.POSTGRES_URL,
  ssl: true,
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 3000, // Return an error after 3 seconds if connection not established
  maxUses: 7500, // Close connection after this many queries (recommended for serverless)
});

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_BACKOFF = 1000; // 1 second

const withRetry = async <T>(operation: () => Promise<T>): Promise<T> => {
  let lastError;
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (i < MAX_RETRIES - 1) {
        // Exponential backoff with jitter
        const backoff = INITIAL_BACKOFF * Math.pow(2, i) * (0.5 + Math.random() * 0.5);
        await new Promise((resolve) => setTimeout(resolve, backoff));
      }
    }
  }
  throw lastError;
};

// Create drizzle database instance with connection pool
const db = drizzle(pool);

// Wrap db operations with retry logic
const dbWithRetry = new Proxy(db, {
  get(target: NeonDatabase<Record<string, never>>, prop: string | symbol) {
    const value = Reflect.get(target, prop);
    if (typeof value === "function") {
      return (...args: unknown[]) => {
        const result = Reflect.apply(value, target, args);
        if (result instanceof Promise) {
          return withRetry(() => result);
        }
        return result;
      };
    }
    return value;
  },
});

// Health check function
export const checkDatabaseConnection = async () => {
  try {
    await withRetry(async () => {
      const client = await pool.connect();
      try {
        await client.query("SELECT 1");
        return true;
      } finally {
        client.release();
      }
    });
    return { status: "healthy", message: "Database connection successful" };
  } catch (error) {
    return {
      status: "unhealthy",
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export default dbWithRetry;
