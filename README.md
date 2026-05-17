# Blog Mind Group - Frontend

Frontend React do desafio de blog. Consome a API Express/MySQL do repo backend.

## Requisitos

- Node.js 20+
- npm
- Backend rodando em `http://localhost:3333`

## Setup

```powershell
cd "D:\Dev\Projects\Mind Group\blog-frontend"
npm install
Copy-Item .env.example .env
npm run dev
```

Aplicacao local:

```text
http://localhost:5173
```

## Variaveis

```env
VITE_API_URL=http://localhost:3333/api
```

## Fluxo Para Avaliacao

1. Importe o dump do backend.
2. Rode o backend.
3. Rode o frontend.
4. Crie uma conta pela tela de cadastro.
5. Teste:

- listar artigos
- abrir artigo
- criar artigo
- editar artigo
- excluir artigo

## Scripts

```powershell
npm run dev
npm run build
npm run preview
```
