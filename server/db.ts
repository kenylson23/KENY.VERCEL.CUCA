import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "../shared/schema.js";

console.log('Conectando ao banco PostgreSQL do Replit...');

// Usar banco PostgreSQL do Replit
const client = postgres({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432'),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '',
  database: process.env.PGDATABASE || 'postgres',
  ssl: false, // Replit não precisa SSL
  prepare: false,
});

export const db = drizzle(client, { schema });