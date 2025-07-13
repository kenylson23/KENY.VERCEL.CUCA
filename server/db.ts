import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "../shared/schema.js";

console.log('Configurando conexão com Supabase...');

if (!process.env.SUPABASE_URL) {
  throw new Error('SUPABASE_URL não configurada');
}

// Extrair project reference da URL do Supabase  
const supabaseUrl = process.env.SUPABASE_URL;
const projectRef = supabaseUrl.split('//')[1].split('.')[0];

// Construir connection string para Supabase usando service role key
const supabaseConnectionString = `postgresql://postgres.${projectRef}:${process.env.SUPABASE_SERVICE_ROLE_KEY}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;

console.log('Conectando com projeto Supabase:', projectRef);

// Configurar variável DATABASE_URL para que drizzle.config.ts funcione
process.env.DATABASE_URL = supabaseConnectionString;

const client = postgres(supabaseConnectionString, {
  prepare: false,
  ssl: 'require',
  max: 3,
  idle_timeout: 20,
  connect_timeout: 30
});

export const db = drizzle(client, { schema });