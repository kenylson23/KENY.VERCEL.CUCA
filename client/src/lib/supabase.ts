import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase usando as credenciais fornecidas
const supabaseUrl = 'https://qaskgmrxnxykmougppzk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhc2tnbXJ4bnh5a21vdWdwcHprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NTE0NjYsImV4cCI6MjA2NTEyNzQ2Nn0.JwCuZvDs93V413oj4DvMq2OTqicyxLzHmX3ZfgjsKlI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export type User = {
  id: string;
  email: string;
  role: string;
};

export type AuthSession = {
  user: User;
  accessToken: string;
};