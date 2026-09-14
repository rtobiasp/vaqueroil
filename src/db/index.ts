import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

type Db = ReturnType<typeof drizzle>;

let cached: Db | undefined;

function getDb(): Db {
  if (cached) {
    return cached;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured");
  }

  const client = postgres(connectionString, { prepare: false });
  cached = drizzle(client);
  return cached;
}

// Lazily create the client on first query so importing this module during
// `next build` (prerender / config collection) never crashes when the DB
// is unreachable or DATABASE_URL is invalid in the build environment.
// Pages that need the DB should also export `dynamic = "force-dynamic"`.
export const db: Db = new Proxy({} as Db, {
  get(_target, prop) {
    const current = getDb() as unknown as Record<PropertyKey, unknown>;
    const value = current[prop];
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(current)
      : value;
  },
});
