import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "../shared/schema.js";

console.log('Configurando conexão com Supabase...');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Credenciais Supabase não configuradas. Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.');
}

// Extrair project reference da URL do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const projectRef = supabaseUrl.split('//')[1].split('.')[0];

console.log('✓ Conectando ao projeto Supabase:', projectRef);

// Usar conexão direta com Supabase
const connectionString = `postgresql://postgres.${projectRef}:${process.env.SUPABASE_SERVICE_ROLE_KEY}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;

// Sobrescrever DATABASE_URL para que drizzle.config.ts funcione
process.env.DATABASE_URL = connectionString;

const client = postgres(connectionString, {
  prepare: false,
  ssl: 'require',
  max: 1,
  idle_timeout: 30,
  connect_timeout: 30
});

export const db = drizzle(client, { schema });