import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

let databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/placementiq";

// Sanitize legacy postgres sslmode parameter to suppress pg-connection-string deprecation warning
if (databaseUrl.includes("sslmode=require") || databaseUrl.includes("sslmode=prefer") || databaseUrl.includes("sslmode=verify-ca")) {
  databaseUrl = databaseUrl.replace(/sslmode=(require|prefer|verify-ca)/g, "sslmode=verify-full");
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

const isLocal = databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1");

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    ssl: isLocal ? false : { rejectUnauthorized: false },
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
