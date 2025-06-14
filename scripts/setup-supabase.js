#!/usr/bin/env node

/**
 * Script para configurar as variáveis de ambiente do Supabase
 * Este script ajuda na migração do Neon para o Supabase
 */

console.log('🔧 Configurando migração para Supabase...\n');

// Verificar se as variáveis de ambiente necessárias estão definidas
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY', 
  'SUPABASE_SERVICE_ROLE_KEY'
];

console.log('📋 Verificando variáveis de ambiente necessárias:');

const missingVars = requiredEnvVars.filter(varName => {
  const exists = !!process.env[varName];
  console.log(`  ${exists ? '✅' : '❌'} ${varName}`);
  return !exists;
});

if (missingVars.length > 0) {
  console.log('\n❌ Faltam as seguintes variáveis de ambiente:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  
  console.log('\n📝 Para configurar o Supabase:');
  console.log('1. Acesse https://supabase.com/dashboard');
  console.log('2. Selecione seu projeto');
  console.log('3. Vá em Settings > API');
  console.log('4. Configure as variáveis de ambiente no Replit');
  
  process.exit(1);
}

console.log('\n✅ Todas as variáveis de ambiente estão configuradas!');

// Criar URL de conexão do banco de dados Supabase
if (process.env.SUPABASE_URL) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const projectRef = supabaseUrl.split('//')[1].split('.')[0];
  
  console.log('\n🔗 Configuração da DATABASE_URL:');
  console.log(`   Projeto: ${projectRef}`);
  console.log('   Formato esperado: postgresql://[user]:[password]@db.[project-ref].supabase.co:5432/postgres');
  console.log('\n💡 A DATABASE_URL deve ser configurada com suas credenciais do banco Supabase');
}

console.log('\n🚀 Pronto para usar o Supabase!');