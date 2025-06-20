import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "../shared/schema.js";

// Use only local PostgreSQL environment variables
console.log('Using local PostgreSQL environment variables...');

const client = postgres({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432'),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '',
  database: process.env.PGDATABASE || 'postgres',
  ssl: false,
  prepare: false,
});

export const db = drizzle(client, { schema });