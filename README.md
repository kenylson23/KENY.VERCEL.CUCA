# CUCA Beer - Landing Page

Landing page profissional para a marca de cerveja angolana CUCA.

## Características

- Design responsivo com cores da marca CUCA (amarelo, vermelho, preto, branco)
- Logotipo oficial da CUCA
- Imagem de hero com latas douradas da CUCA
- Slogan "Em Angola, cerveja é CUCA"
- Seções: Hero, Produtos, História, Depoimentos, Contato
- Formulário de contato integrado
- Sistema de admin para gestão de conteúdo
- Galeria de fotos dos fãs

## Estrutura do projeto

```
├── client/
│   ├── public/
│   │   └── images/
│   │       ├── cuca-hero.jpg   # Imagem de fundo do hero
│   │       └── cuca-logo.png   # Logotipo oficial
│   └── src/
│       ├── components/         # Componentes React
│       └── pages/             # Páginas da aplicação
├── server/                    # Backend Express
├── shared/                    # Schemas e tipos compartilhados
└── README.md                 # Este arquivo
```

## Tecnologias utilizadas

- React 18 + TypeScript
- Express.js + PostgreSQL
- Tailwind CSS + Framer Motion
- Vite (build tool)
- Wouter (roteamento)
- Drizzle ORM

## Desenvolvimento local

```bash
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:5000`

## Deploy no Vercel

O projeto está configurado para deploy automático no Vercel:

1. **Conecte seu repositório** ao Vercel
2. **Configure as variáveis de ambiente**:
   - `DATABASE_URL` - URL do PostgreSQL
   - `SESSION_SECRET` - Chave secreta para sessões
   - `NODE_ENV=production`
3. **Deploy automático** - O Vercel usará as configurações do `vercel.json`

Consulte `VERCEL_DEPLOY_GUIDE.md` para instruções detalhadas.

## Funcionalidades

- Landing page responsiva da marca CUCA
- Sistema de autenticação
- Painel administrativo
- Galeria de fotos dos fãs
- Formulário de contato
- Gestão de produtos e pedidos