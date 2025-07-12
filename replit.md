# CUCA Cerveja - Site Profissional de Vendas

## Visão Geral

Este é um site profissional de vendas para a cerveja CUCA, apresentando a rica herança da marca através de uma interface React interativa e dinamicamente animada. A aplicação possui uma stack tecnológica moderna com React, Express.js, PostgreSQL, e está otimizada para deployment no Vercel com funções serverless.

## Arquitetura do Sistema

### Arquitetura Frontend
- **Framework**: React com TypeScript
- **Estilização**: Tailwind CSS com componentes shadcn/ui
- **Animações**: Framer Motion para transições e interações suaves
- **Ferramenta de Build**: Vite para desenvolvimento rápido e builds otimizados
- **Gerenciamento de Estado**: TanStack Query para gerenciamento de estado do servidor
- **Roteamento**: Wouter para roteamento leve do lado do cliente

### Arquitetura Backend
- **Runtime**: Node.js com Express.js
- **Linguagem**: TypeScript com módulos ES
- **Gerenciamento de Sessão**: Sistema de autenticação duplo (sessões para deployment tradicional, JWT para Vercel)
- **Design de API**: Endpoints RESTful com tratamento adequado de erros
- **Middleware**: Logging customizado, CORS e middleware de autenticação

### Arquitetura de Banco de Dados
- **Banco de Dados**: PostgreSQL (hospedagem Supabase)
- **ORM**: Drizzle ORM com definições de schema type-safe
- **Migrações**: Drizzle Kit para gerenciamento de schema
- **Conexão**: Driver postgres-js com SSL para Supabase

## Componentes Principais

### Sistema de Autenticação
- **Principal**: Autenticação Supabase com tokens JWT
- **Painel Admin**: Controle de acesso baseado em roles usando metadados do usuário Supabase
- **Frontend**: React hooks com gerenciamento automático de tokens
- **Backend**: Middleware de verificação JWT Supabase
- **Segurança**: Supabase gerencia hash de senhas, sessões seguras e renovação de tokens

### Gerenciamento de Conteúdo
- **Catálogo de Produtos**: Showcase dinâmico de produtos com otimização de imagens
- **Sistema de Contato**: Tratamento de mensagens com moderação admin
- **Galeria de Fãs**: Conteúdo gerado por usuários com fluxo de aprovação
- **Analytics**: Rastreamento de eventos e estatísticas de uso

### Otimização de Performance
- **Lazy Loading**: Code splitting e lazy loading a nível de componente
- **Otimização de Imagens**: Suporte a formato WebP com fallbacks
- **Cache**: Cache de queries com TanStack Query
- **Otimização de Bundle**: Builds separados para cliente e servidor

## Fluxo de Dados

1. **Requisições do Cliente**: Frontend React faz chamadas de API através do TanStack Query
2. **Autenticação**: Middleware valida sessões/tokens JWT
3. **Operações de Banco de Dados**: Drizzle ORM manipula interações type-safe com o banco
4. **Processamento de Resposta**: Middleware Express formata e registra respostas
5. **Tratamento de Erros**: Tratamento centralizado de erros com códigos HTTP adequados

## Dependências Externas

### Dependências Principais
- **@radix-ui/react-***: Componentes UI acessíveis
- **framer-motion**: Biblioteca de animação
- **drizzle-orm**: ORM type-safe
- **express**: Framework web
- **bcrypt**: Hash de senhas
- **jsonwebtoken**: Autenticação JWT

### Dependências de Desenvolvimento
- **vite**: Ferramenta de build e servidor de desenvolvimento
- **typescript**: Verificação de tipos
- **tailwindcss**: Framework CSS utility-first
- **esbuild**: Bundler JavaScript rápido

### Serviços em Nuvem
- **Supabase**: Hospedagem de banco PostgreSQL com auth integrado e recursos real-time
- **Vercel**: Plataforma de deployment serverless

## Estratégia de Deployment

### Deployment Vercel
- **Funções**: Funções serverless para rotas de API
- **Assets Estáticos**: Servimento otimizado de arquivos estáticos
- **Variáveis de Ambiente**: Gerenciamento seguro de configuração
- **Processo de Build**: Sistema de build duplo (Vite para frontend, esbuild para backend)

### Arquivos de Configuração
- `vercel.json`: Configuração de deployment com rewrites e funções
- `build-vercel.js`: Script de build customizado para compatibilidade Vercel
- `tsconfig.vercel.json`: Configuração TypeScript para ambiente serverless

### Resolução de Erros
- **Resolução de Módulos**: Imports de módulos ES corrigidos para compatibilidade Vercel
- **Tratamento de Sessão**: Estratégias de fallback implementadas para ambientes serverless
- **Otimização de Build**: Dependências externas configuradas adequadamente para serverless

## Funcionalidades Implementadas

### Hero Section com Vídeo
- **Vídeo de Fundo**: Implementado com vídeo enviado pelo usuário (.mov convertido para MP4)
- **Loop Infinito**: Sistema robusto de reprodução automática em loop
- **Otimização**: Múltiplos formatos para compatibilidade máxima (MP4 H.264 baseline, MP4 padrão, MOV original)
- **Controles JavaScript**: Controles customizados para garantir reprodução contínua

### Sistema de Contato
- **Formulário Completo**: Nome, email, telefone e mensagem
- **Validação em Tempo Real**: Mensagens de erro específicas em português
- **Armazenamento**: Mensagens salvas no banco PostgreSQL
- **Status de Mensagens**: Sistema de status para organização administrativa

### Banco de Dados
- **PostgreSQL Configurado**: Todas as tabelas criadas com sucesso
- **Schema Completo**: Tabelas para usuários, produtos, pedidos, mensagens de contato, analytics e fotos de fãs
- **Relações Definidas**: Relacionamentos adequados entre tabelas usando Drizzle ORM

## Registro de Mudanças

- 15 de Junho, 2025: Migração bem-sucedida para banco Supabase
- 15 de Junho, 2025: Schema do banco atualizado para estrutura Supabase
- 15 de Junho, 2025: Sistema de autenticação Supabase configurado
- 15 de Junho, 2025: Removidas todas as dependências Neon e migrado para configuração DATABASE_URL
- 15 de Junho, 2025: Seeding da aplicação funcionando corretamente com Supabase
- 15 de Junho, 2025: **Sistema de autenticação Supabase totalmente operacional** - Frontend e backend configurados adequadamente com chaves API
- 15 de Junho, 2025: **Sistema de redirecionamento de login corrigido** - Implementados redirecionamentos baseados em roles (usuários regulares → dashboard, usuários admin → painel admin)
- 15 de Junho, 2025: **Conexão com banco Supabase estabelecida** - Seeding do banco bem-sucedido com integração completa
- 20 de Junho, 2025: **Sistema Fan Gallery totalmente funcional com Supabase** - Todas as operações CRUD funcionando corretamente com autenticação adequada e integração com banco
- 20 de Junho, 2025: **Sistema de formulário de contato totalmente operacional** - Validação frontend corrigida, removido requisito de autenticação para acesso público, corrigidas chamadas API e mapeamento de campos
- 20 de Junho, 2025: **Hero Section com vídeo implementado** - Substituída animação 3D por vídeo de fundo em loop infinito, otimizado para múltiplos formatos

## Preferências do Usuário

- **Estilo de Comunicação**: Linguagem simples e cotidiana em português
- **Documentação**: Toda documentação deve estar em português
- **Design**: Preferência por vídeo de fundo no hero ao invés de animações 3D
- **Validação**: Validação em tempo real com mensagens específicas em português