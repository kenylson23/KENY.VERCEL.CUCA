import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "../shared/schema.js";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create postgres connection for Supabase
const client = postgres(process.env.DATABASE_URL, {
  prepare: false,
  ssl: 'require'
});

export const db = drizzle(client, { schema });