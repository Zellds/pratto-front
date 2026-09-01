# Pratto — Frontend

App de receitas com IA, preço regional de ingredientes, lista de compras/despensa e perfil social de chef.

## Rodando localmente

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre em `http://localhost:5173`. Requer o backend (`projects/backend`) rodando via `docker compose` — ajustar `VITE_API_URL` em `.env.local` conforme a porta real.

Pra desenvolvimento local com dado real, rode `docker compose exec app php artisan migrate:fresh --seed` no backend — cria um usuário de teste (`usuario_teste`/`senha123`) já seguindo outros dois usuários seedados, útil pra ver o feed populado.

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção
- `npm run test` — Vitest (modo watch); `npm run test -- --run` roda uma vez só
- `npm run lint` — ESLint
- `npm run format` / `npm run format:check` — Prettier
