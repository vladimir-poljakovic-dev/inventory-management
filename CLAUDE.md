# Inventory Management

A production-quality inventory management application built as a pnpm + Turborepo
monorepo: a **NestJS** REST API and a **Next.js** (App Router) web client that share
types through internal workspace packages.

This file is the contract for how the codebase is structured and extended. The patterns
here are copied across every feature — follow them exactly.

---

## Monorepo structure

```
inventory-management/
├── apps/
│   ├── api/          NestJS REST API (TypeORM + PostgreSQL, JWT auth)
│   └── web/          Next.js App Router frontend (Tailwind, axios)
├── packages/
│   ├── types/        @repo/types  — shared enums, DTOs, interfaces (the API/web contract)
│   └── tsconfig/     @repo/tsconfig — shared TypeScript base configs
├── pnpm-workspace.yaml
├── turbo.json        task graph (build / dev / lint)
└── .env.example      copy into apps/api/.env
```

### `apps/api` (NestJS)
```
src/
├── common/           cross-cutting concerns applied globally
│   ├── decorators/   @Public(), @Roles(...)
│   ├── filters/      GlobalExceptionFilter (consistent error shape)
│   ├── guards/       JwtAuthGuard (authn), RolesGuard (authz)
│   └── interceptors/ ResponseInterceptor (consistent success shape)
├── config/           typeorm.config.ts, jwt.config.ts
├── auth/             register/login, JWT strategy
├── users/            User entity + service (no controller — managed via auth)
├── database/         BaseEntity, data-source.ts (CLI), migrations/
├── app.module.ts
└── main.ts           global pipe/guards/interceptor/filter + CORS are wired here
```

### `apps/web` (Next.js)
```
src/
├── app/
│   ├── (auth)/login, (auth)/register   public auth pages
│   ├── (protected)/dashboard           authenticated pages
│   ├── layout.tsx, page.tsx (→ /dashboard)
├── lib/
│   ├── api.ts        axios instance + typed helpers that unwrap the response envelope
│   └── auth.ts       token helpers (localStorage + cookie)
└── middleware.ts     route protection based on the token cookie
```

### `packages/types` (`@repo/types`)
The single source of truth for data shared between the API and the web app: the `Role`
enum, `RegisterDto` / `LoginDto` (class-validator classes), `AuthResponseDto`, and
`JwtPayload`. It **compiles to `dist/`** and is built before the apps (Turbo `^build`).

### `packages/tsconfig` (`@repo/tsconfig`)
- `base.json` — shared base (CommonJS, ES2021, strict, decorators enabled).
- `nextjs.json` — extends base with Next.js specifics (`jsx: preserve`, ESNext, bundler resolution).

---

## How to add a new feature

Example: adding a `Product` resource.

1. **Entity** — create `apps/api/src/products/product.entity.ts` extending `BaseEntity`:
   ```ts
   @Entity('products')
   export class Product extends BaseEntity {
     @Column() name: string;
     @Column('int') quantity: number;
   }
   ```
2. **Migration** — generate and review it (never hand-write schema SQL):
   ```bash
   cd apps/api
   pnpm migration:generate src/database/migrations/AddProduct
   pnpm migration:run
   ```
3. **Shared DTOs** — add request/response DTOs to `packages/types` (e.g.
   `CreateProductDto` with class-validator decorators) and export them from `src/index.ts`.
   Run `pnpm build` once so consumers pick up the new types.
4. **Module / service / controller** — create `products.module.ts`, `products.service.ts`,
   `products.controller.ts`. Inject the repository with `@InjectRepository(Product)`.
   Routes are protected by default; add `@Roles(Role.WarehouseManager)` to restrict, or
   `@Public()` to open.
5. **Wire it up** — import `ProductsModule` into `AppModule`.
6. **Frontend** — add pages under `apps/web/src/app/(protected)/...` and call the API with
   the typed `api` helper, e.g. `await api.get<Product[]>('/products')`.

---

## Critical conventions — never break these

- **`synchronize: false` is permanent.** It is hardcoded in `config/typeorm.config.ts` and
  must never be set from an env var or flipped to `true`. Schema drift is not allowed.
- **All schema changes go through migrations.** Never run manual SQL or rely on auto-sync.
- **Every entity extends `BaseEntity`** (UUID `id` + `createdAt` / `updatedAt`).
- **All routes are protected by default.** The global `JwtAuthGuard` requires a valid JWT
  unless a handler is explicitly marked `@Public()`. Authorization is added with `@Roles(...)`.
- **Shared DTOs/types live in `packages/types`.** Never duplicate a request/response shape
  in an app — define it once in `@repo/types` so the API and web stay in lockstep.
- **Never return password fields** (or other secrets) from any endpoint. Build explicit
  response objects (see `AuthService.buildAuthResponse`); never return a raw entity that
  contains `password`.

---

## Response shape (the envelope)

Every **successful** response is wrapped by `ResponseInterceptor`:
```jsonc
{ "data": <payload>, "statusCode": 200, "timestamp": "2026-06-24T12:00:00.000Z" }
```
Every **error** response is normalized by `GlobalExceptionFilter` (stack traces are logged
server-side only, never sent to the client):
```jsonc
{ "error": "Invalid credentials", "statusCode": 401, "timestamp": "..." }
```
Because of the envelope, the web client's typed helpers in `lib/api.ts` unwrap
`response.data.data` for you — so `await api.get<Product[]>('/products')` resolves to the
`Product[]` payload directly, not the envelope.

---

## Environment setup

1. Use the pinned Node version: `nvm use` (reads `.nvmrc` → Node 24.18.0).
2. Copy the env template into the API and fill in your PostgreSQL credentials and a JWT secret:
   ```bash
   cp .env.example apps/api/.env
   ```
   | Var | Purpose |
   | --- | --- |
   | `DATABASE_HOST/PORT/USER/PASSWORD/NAME` | PostgreSQL connection |
   | `JWT_SECRET` | secret used to sign JWTs |
   | `JWT_EXPIRES_IN` | token lifetime, e.g. `7d` |
   | `FRONTEND_URL` | allowed CORS origin (web app, `http://localhost:3001`) |
   | `NEXT_PUBLIC_API_URL` | API base URL the web app calls (`http://localhost:3000`) |

   > `NEXT_PUBLIC_API_URL` must also be visible to the web app. For local dev you can keep a
   > single root `apps/api/.env` for the API and create `apps/web/.env.local` with
   > `NEXT_PUBLIC_API_URL=http://localhost:3000`.
3. Create the database, then run migrations from the API:
   ```bash
   cd apps/api
   pnpm migration:run
   ```

---

## Running the project

```bash
nvm use            # Node 24.18.0
pnpm install       # from the repo root
pnpm dev           # runs api (:3000) and web (:3001) together via Turbo
```

Useful targeted commands:
- `pnpm dev:api` / `pnpm dev:web` — run a single app.
- `pnpm build` — build everything (`@repo/types` first, then the apps).
- `pnpm lint` — type-check all packages.
- From `apps/api`: `pnpm migration:generate <path>`, `pnpm migration:run`, `pnpm migration:revert`.

The API serves on **http://localhost:3000**, the web app on **http://localhost:3001**.
