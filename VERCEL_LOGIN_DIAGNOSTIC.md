# Diagnóstico do Problema de Login no Vercel

## Problema Identificado
O erro "Unexpected token 'A'; 'A server e'... is not valid JSON" indica que o servidor está retornando HTML em vez de JSON quando deployado no Vercel.

## Causas Raiz

### 1. Configuração de Sessão Incompatível com Produção
- **Problema**: A configuração de sessão está definida com `secure: false`, mas o Vercel usa HTTPS
- **Solução**: Detectar automaticamente o ambiente de produção e configurar `secure: true`

### 2. Falha na Conexão com PostgreSQL Session Store
- **Problema**: O session store PostgreSQL pode falhar no Vercel se não configurado corretamente
- **Solução**: Implementar fallback para memory store quando PostgreSQL falha

### 3. Variáveis de Ambiente Ausentes
- **Problema**: `SESSION_SECRET` e `DATABASE_URL` podem não estar configuradas no Vercel
- **Solução**: Verificar e configurar todas as variáveis necessárias

## Correções Implementadas

### ✅ 1. Configuração de Sessão Melhorada
```typescript
export function getSimpleSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000;
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Fallback para memory store se PostgreSQL falhar
  let sessionStore;
  if (process.env.DATABASE_URL) {
    try {
      const pgStore = connectPg(session);
      sessionStore = new pgStore({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: false,
        ttl: sessionTtl,
        tableName: "sessions",
      });
    } catch (error) {
      console.warn('PostgreSQL session store failed, using memory store');
      sessionStore = undefined;
    }
  }

  return session({
    secret: process.env.SESSION_SECRET || "cuca-admin-secret-key-2024",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction, // Automaticamente true em produção
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: sessionTtl,
    },
  });
}
```

### ✅ 2. Tratamento de Erros Melhorado
```typescript
export const loginHandler: RequestHandler = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validação de entrada
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Usuário e senha são obrigatórios" 
      });
    }

    // Resto da lógica de login...
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Erro interno do servidor" 
    });
  }
};
```

### ✅ 3. Headers CORS e Content-Type Corrigidos
```typescript
app.use((req, res, next) => {
  // Apenas definir JSON content-type para rotas da API
  if (req.path.startsWith('/api')) {
    res.header('Content-Type', 'application/json; charset=utf-8');
  }
  
  // Configuração CORS para produção
  const allowedOrigins = [
    'http://localhost:5000',
    'https://localhost:5000',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ].filter(Boolean);

  const origin = req.headers.origin;
  if ((origin && allowedOrigins.includes(origin)) || !origin) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
```

## Próximos Passos para Vercel

### 1. Configurar Variáveis de Ambiente no Vercel
No painel do Vercel, adicione:
```
SESSION_SECRET=cuca-admin-secret-key-2024-production
DATABASE_URL=sua_url_postgresql_completa
NODE_ENV=production
```

### 2. Verificar Configuração do PostgreSQL
- Certifique-se de que a tabela `sessions` existe no banco
- Verifique se as credenciais de conexão estão corretas
- Confirme que o banco aceita conexões externas

### 3. Testar Login após Deploy
```bash
curl -X POST https://seu-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"cuca2024"}' \
  -v
```

## Credenciais de Teste
- **Usuário**: admin
- **Senha**: cuca2024

## Logs para Monitoramento
As melhorias incluem logs detalhados para facilitar o diagnóstico:
- Logs de falha na conexão PostgreSQL
- Logs de erro durante login
- Logs de configuração de ambiente

## Status das Correções
- ✅ Configuração de sessão para produção
- ✅ Fallback para memory store
- ✅ Tratamento de erros melhorado
- ✅ Headers CORS corretos
- ✅ Content-Type apenas para APIs
- 🔄 Aguardando deploy no Vercel para teste

O sistema local está funcionando corretamente. As modificações foram feitas para resolver especificamente os problemas de deployment em produção.