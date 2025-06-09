# Guia de Deploy no Vercel - Projeto CUCA Beer

## 📋 Pré-requisitos

1. Conta no Vercel (vercel.com)
2. Repositório Git (GitHub, GitLab, ou Bitbucket)
3. Banco de dados PostgreSQL (recomendado: Vercel Postgres)

## 🚀 Passos para Deploy

### 1. Preparar o Banco de Dados

**Opção A: Vercel Postgres (Recomendado)**
- No dashboard do Vercel, vá em "Storage" > "Create Database"
- Selecione "Postgres"
- Após criar, copie a `DATABASE_URL` das configurações

**Opção B: Banco Externo**
- Use qualquer provedor PostgreSQL (Neon, Supabase, Railway, etc.)
- Certifique-se de ter a `DATABASE_URL` de conexão

### 2. Configurar Variáveis de Ambiente

No Vercel, configure estas variáveis de ambiente:

```
DATABASE_URL=postgresql://seu_usuario:senha@host:5432/database
NODE_ENV=production
SESSION_SECRET=sua_chave_secreta_aqui
```

### 3. Deploy do Projeto

1. **Conectar Repositório**
   - No Vercel, clique em "New Project"
   - Conecte seu repositório Git
   - Selecione este projeto

2. **Configurações Automáticas**
   - O Vercel detectará automaticamente o `vercel.json`
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

3. **Deploy**
   - Clique em "Deploy"
   - O processo levará alguns minutos

### 4. Configurar Database Schema

Após o primeiro deploy:

1. No terminal local, configure a `DATABASE_URL` do Vercel:
   ```bash
   export DATABASE_URL="sua_database_url_do_vercel"
   ```

2. Execute a migração:
   ```bash
   npm run db:push
   ```

## 📁 Arquivos de Configuração Criados

- `vercel.json` - Configuração principal do Vercel
- `api/index.ts` - Entrada do backend para Vercel Functions
- Este guia de deploy

## 🔧 Funcionalidades Incluídas

✅ Frontend React otimizado
✅ Backend Express como Vercel Function
✅ Autenticação de usuários
✅ Sistema de admin
✅ Galeria de fotos dos fãs
✅ Formulário de contato
✅ Database PostgreSQL
✅ Roteamento SPA configurado

## 🌐 URLs do Projeto

Após o deploy:
- **Site Principal**: `https://seu-projeto.vercel.app`
- **API**: `https://seu-projeto.vercel.app/api/*`
- **Admin**: `https://seu-projeto.vercel.app/admin`

## 🔐 Configuração de Domínio (Opcional)

1. No dashboard do Vercel, vá para "Domains"
2. Adicione seu domínio personalizado
3. Configure os DNS conforme instruído

## 📊 Monitoramento

- Logs disponíveis no dashboard do Vercel
- Métricas de performance automáticas
- Alerts de erro opcionais

## ⚠️ Notas Importantes

1. **Banco de Dados**: Certifique-se de que a `DATABASE_URL` está configurada antes do deploy
2. **Session Secret**: Use uma chave forte para `SESSION_SECRET`
3. **Domínio**: O Vercel fornece um domínio gratuito `.vercel.app`
4. **Limites**: Funciona dentro dos limites do plano gratuito do Vercel

## 🆘 Resolução de Problemas

**Erro de Conexão com Database:**
- Verifique a `DATABASE_URL` nas variáveis de ambiente
- Certifique-se de que o banco permite conexões externas

**Erro 404 em Rotas:**
- O `vercel.json` já está configurado para SPA routing
- Verifique se o arquivo está no root do projeto

**Build Falhou:**
- Verifique se todas as dependências estão listadas
- Logs detalhados disponíveis no dashboard do Vercel