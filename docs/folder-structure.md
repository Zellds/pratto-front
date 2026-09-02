# Estrutura de pastas do frontend

## Para que serve

Referência de onde cada arquivo mora dentro de `src/`.

`features/` é o nível principal de organização — por domínio de produto, não
por tipo de arquivo. Isso não muda. O que este documento fixa é a
organização **dentro** de cada domínio e o que vive fora de `features/`
(providers, layout, rotas, componentes genéricos, config).

## Árvore de referência

```
src/
├── api/
│   └── client.ts / .test.ts    → cliente HTTP base (fetch wrapper, tratamento de erro)
├── components/
│   ├── Button.tsx / .css
│   ├── Card.tsx / .css
│   ├── Modal.tsx / .css
│   ├── EmptyState.tsx / .css
│   ├── Skeleton.tsx / .css
│   ├── StubPage.tsx
│   └── icons.tsx
├── config/
│   └── i18n.ts                 → configuração do i18next
├── features/
│   ├── auth/
│   │   ├── api/index.ts
│   │   ├── components/
│   │   │   ├── AuthModal.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   └── types.ts
│   └── recipes/
│       ├── api/index.ts
│       ├── components/                    ← só o que é usado por MAIS de uma página
│       │   ├── RecipeCard.tsx / .css
│       │   └── RecipeCardSkeleton.tsx / .css
│       ├── pages/
│       │   ├── DashboardPage/
│       │   │   ├── DashboardPage.tsx / .css
│       │   │   └── components/            ← só o DashboardPage usa
│       │   │       ├── Hero.tsx / .css
│       │   │       ├── HeroSkeleton.tsx / .css
│       │   │       ├── ChefsSection.tsx / .css
│       │   │       ├── DiscoverSection.tsx / .css
│       │   │       └── FeedSection.tsx / .css
│       │   └── RecipeListPage/
│       │       ├── RecipeListPage.tsx
│       │       └── components/            ← só o RecipeListPage usa
│       │           └── RecipeList.tsx / .css
│       └── types.ts
├── layouts/
│   ├── Layout.tsx / .css
│   ├── Sidebar.tsx / .css
│   ├── BottomBar.tsx / .css
│   ├── MobileMenuSheet.tsx / .css
│   └── navItems.ts
├── providers/
│   ├── AuthProvider.tsx
│   ├── ThemeProvider.tsx
│   └── ToastProvider.tsx / Toast.css
├── routes/
│   └── routes.tsx
├── utils/
│   └── initials.ts
├── styles/
│   └── tokens.css
├── locales/
│   ├── pt-BR.json
│   └── en.json
├── test/
│   └── setup.ts
└── main.tsx
```

(Onde existe teste, ele fica em `.test.tsx`/`.test.ts` ao lado do arquivo, no
mesmo diretório — é a convenção de co-localização já em uso no projeto. Isso
não é garantia de cobertura: nem todo `.tsx` acima tem teste hoje, ex.
`components/Skeleton.tsx`, `components/StubPage.tsx`, `components/icons.tsx`
e `pages/RecipeListPage/RecipeListPage.tsx`.)

## O que vai em cada pasta

- **`api/client.ts`** — só o cliente HTTP genérico (`apiFetch`, `ApiError`).
  Chamadas específicas de domínio (buscar receitas, login) vivem dentro da
  própria feature, em `features/<dominio>/api/`.
- **`components/`** (topo) — componentes genéricos, sem nenhuma lógica de
  domínio: `Button`, `Card`, `Modal`, ícones. Se o componente não sabe o que
  é uma "receita" ou um "chef", ele mora aqui. Equivale ao que o `CLAUDE.md`
  já chamava de `shared/ui/` — só mudou o nome.
- **`config/`** — configuração de bibliotecas/infra que não é lógica de
  produto. Hoje só `i18n.ts`; candidato natural a crescer (ex: opções do
  `QueryClient` do React Query, hoje inline em `main.tsx`, podem migrar pra
  cá se um dia precisarem de configuração própria).
- **`features/<dominio>/`** — um domínio de produto por pasta (`recipes`,
  `auth`, e os que Plano 13+ trouxerem). Por dentro:
  - **`api/`** — chamadas HTTP daquele domínio. Fica como pasta (não um
    arquivo `api.ts` solto) porque um domínio tende a acumular mais de um
    arquivo aqui conforme cresce (ex: `recipes/api/` provavelmente ganha
    `rating.ts`/`comments.ts` separados quando o Plano 13 trouxer essas
    features).
  - **`components/`** — só os componentes **usados por mais de uma página**
    daquele domínio. Ver regra de promoção abaixo.
  - **`pages/`** — um componente de página por rota daquele domínio. Só
    existe se o domínio tiver de fato páginas roteadas (por isso `auth/` não
    tem `pages/` — login/registro acontece num modal, não numa rota
    própria).
  - **`types.ts`** — tipos daquele domínio, um arquivo só (não uma pasta
    `types/` com um `index.ts` dentro — pasta pra um arquivo só é estrutura
    sem ganho; se um domínio um dia precisar de vários arquivos de tipos,
    aí sim vira pasta).
- **`layouts/`** — a casca do app: barra lateral, barra superior, barra
  inferior mobile, o menu de tela cheia do mobile, e os dados de navegação
  (`navItems.ts`) que tanto a sidebar quanto o menu mobile consomem.
- **`providers/`** — os `Context.Provider` de estado global do app (sessão,
  tema, notificações toast). Nada aqui é específico de uma feature.
- **`routes/`** — a árvore de rotas (`createBrowserRouter`). Fica como pasta
  já pensando que pode ganhar mais de um arquivo (ex: um arquivo separado só
  de rotas protegidas) sem precisar mexer na convenção depois.
- **`utils/`** — funções puras reaproveitadas por mais de um lugar do app,
  sem estado e sem dependência de React. Hoje só `initials()`.

## Regra de promoção: página → feature

Um componente nasce dentro de `pages/<Pagina>/components/`. Ele só sobe pra
`features/<dominio>/components/` quando uma **segunda** página do mesmo
domínio passa a usá-lo de verdade — não antes, por especulação. Foi assim
que `RecipeCard` chegou em `features/recipes/components/`: é usado tanto
pelo `DashboardPage` (grades de Populares/Descubra) quanto pelo
`RecipeListPage`.

Essa é a mesma régua já usada neste projeto pra CSS (`.pill`/
`.discover-badge` ficaram deliberadamente duplicados até aparecer um
terceiro consumidor real, em vez de extrair cedo demais) — aplicada agora a
arquivos inteiros, não só a classes.

## Regra: página sem componente próprio fica sem pasta

Se uma página não tiver nenhum componente que seja só dela, ela não ganha
pasta+`components/` vazia — fica um arquivo solto direto em `pages/`, ex:
`pages/NewRecipePage.tsx`. Pasta só é criada quando `components/` dentro
dela vai ter algo de verdade. Mesmo princípio de `hooks/` (ver abaixo).

## O que foi deixado de fora, de propósito

- **Sem `index.ts` de fachada por feature.** Cada feature hoje tem exatamente
  um consumidor externo (`routes/routes.tsx`, que importa as páginas
  diretamente). Uma fachada só ganha valor real quando várias partes do app
  importariam de dentro da feature e você quer blindar isso de mudanças
  internas — com um consumidor só, é indireção sem proteção nenhuma. Cria
  quando um segundo consumidor externo aparecer de verdade.
- **Sem `hooks/` por feature.** Nenhum hook customizado existe ainda (tudo
  usa `useState`/`useQuery` direto nos componentes). Pasta vazia não serve
  pra nada — cria no dia em que o primeiro hook realmente existir.
- **Sem `assets/` nem `types/` no topo do `src/`.** Não há imagem/fonte
  fora de `public/` nem tipo genuinamente compartilhado entre features hoje
  (cada feature já tem seu próprio `types.ts`). Mesma lógica: criar quando
  tiver conteúdo real, não antes.
- **`shared/` e `app/` deixam de existir** como pastas. Tudo que tinha uso
  real dentro delas achou um lugar mais específico (`components/`,
  `providers/`, `layouts/`, `routes/`, `config/`, `utils/`, `api/`).

## Alias de import

`@/` aponta para `src/` (configurado em `vite.config.ts` e `tsconfig.json`).
Usa `@/` quando um arquivo dentro de `features/<dominio>/` importa de uma
pasta de infra do topo (`components/`, `providers/`, `api/`, `utils/`,
`config/`, `layouts/`, `routes/` — as que vivem direto em `src/`), como
`FeedSection.tsx` importando `@/providers/AuthProvider` ou
`@/components/EmptyState`.

Import dentro da mesma feature fica relativo, não importa a profundidade —
`FeedSection.tsx` importa `RecipeCard` e `getFeed` como
`../../../components/RecipeCard` e `../../../api`, porque são
`features/recipes/components/` e `features/recipes/api/`, não pastas do
topo. `@/` não existe pra evitar `../../../` em si; existe pra marcar a
fronteira entre a feature e a infra compartilhada.
