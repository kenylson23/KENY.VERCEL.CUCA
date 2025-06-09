# Configuração do Banco Neon - Passos Finais

## 1. Configure a DATABASE_URL no Vercel

No dashboard do Vercel:
- Vá para **Settings > Environment Variables**
- Adicione nova variável:
  - **Name**: `DATABASE_URL`
  - **Value**: Sua connection string do Neon
  - **Environment**: Production, Preview, Development

## 2. Adicione outras variáveis obrigatórias

**SESSION_SECRET**
- **Name**: `SESSION_SECRET`
- **Value**: `your-super-secret-session-key-at-least-32-characters-long`

**NODE_ENV**
- **Name**: `NODE_ENV`
- **Value**: `production`

## 3. Execute a Migration (após deploy)

Depois do primeiro deploy no Vercel, execute localmente:

```bash
# Configure a DATABASE_URL do Neon localmente
export DATABASE_URL="sua_connection_string_aqui"

# Execute a migration
npm run db:push
```

## 4. Verificar se funcionou

Após a migration:
- Acesse seu app no Vercel
- O sistema criará automaticamente os dados iniciais
- Tabelas serão criadas: users, products, orders, etc.

## 5. Dados que serão criados automaticamente

- Produtos da cerveja CUCA
- Sistema de autenticação configurado
- Estrutura completa do banco

## Pronto para Deploy!

Sua aplicação estará totalmente funcional no Vercel com:
- Frontend React otimizado
- Backend Express como serverless function
- Banco PostgreSQL no Neon
- Sistema completo da marca CUCA