import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "../shared/schema.js";

// Check for DATABASE_URL first (Supabase or other PostgreSQL)
const databaseUrl = process.env.DATABASE_URL;

let client;

if (databaseUrl) {
  console.log('Connecting to database with DATABASE_URL...');
  
  client = postgres(databaseUrl, {
    prepare: false,
    ssl: 'require'
  });
} else {
  console.log('Using local PostgreSQL environment variables...');
  
  // Fallback to local/Replit PostgreSQL
  client = postgres({
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432'),
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || '',
    database: process.env.PGDATABASE || 'postgres',
    ssl: process.env.PGHOST ? 'require' : false,
    prepare: false,
  });
}

export const db = drizzle(client, { schema });