import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "../shared/schema.js";

// Use Supabase PostgreSQL database
const databaseUrl = process.env.DATABASE_URL;

let client;

if (databaseUrl) {
  console.log('Connecting to Supabase database with DATABASE_URL...');
  
  client = postgres(databaseUrl, {
    prepare: false,
    ssl: 'require'
  });
} else {
  console.log('Using local PostgreSQL environment variables...');
  
  // Fallback to local PostgreSQL with SSL
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