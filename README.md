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

### Tecnologias utilizadas

- React 18
- TypeScript
- Tailwind CSS
- Framer Motion (animações)
- Vite (build tool)
- Wouter (roteamento)

### Desenvolvimento local

```bash
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:5000`