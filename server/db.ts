import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "../shared/schema.js";

// Check for Supabase URL first, then fallback to DATABASE_URL
const databaseUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "SUPABASE_DATABASE_URL or DATABASE_URL must be set. Please configure your Supabase database connection.",
  );
}

// Create postgres connection for Supabase
const client = postgres(databaseUrl, {
  prepare: false,
  ssl: 'require'
});

export const db = drizzle(client, { schema });