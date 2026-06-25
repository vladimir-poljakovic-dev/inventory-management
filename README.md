# Inventory Management

A full-stack inventory management system built with NestJS, Next.js, and PostgreSQL in a Turborepo monorepo.

The API and web client share types through internal workspace packages, so request/response shapes stay in lockstep across the stack.

## Tech stack

| Tool | Version |
| --- | --- |
| Node.js | 24.18.0 LTS (pinned via `.nvmrc`) |
| pnpm | 11.9 |
| TypeScript | 5 |
| Turborepo | 2.9 |
| NestJS | 11 |
| TypeORM | 0.3 |
| PostgreSQL | 14 or newer |
| Next.js | 16 (App Router) |
| React | 19 |
| Tailwind CSS | 3.4 |

## Monorepo structure

```
inventory-management/
├── apps/
│   ├── api/        NestJS REST API — TypeORM, PostgreSQL, JWT auth
│   └── web/        Next.js App Router client — Tailwind, axios
├── packages/
│   ├── types/      @repo/types — shared enums, DTOs, interfaces (the API/web contract)
│   └── tsconfig/   @repo/tsconfig — shared TypeScript base configs
├── turbo.json          task graph (build / dev / lint)
├── pnpm-workspace.yaml  workspace definition
└── .env.example         copy into apps/api/.env
```

- **`apps/api`** — REST API. Global JWT auth, role-based guards, a consistent response envelope, and TypeORM migrations.
- **`apps/web`** — Web client. Auth pages, a typed API helper that unwraps the response envelope, and cookie-based route protection.
- **`packages/types`** — Single source of truth for shared data: the `Role` enum, `RegisterDto`/`LoginDto`, `AuthResponseDto`, and `JwtPayload`. Compiles to `dist/` and builds before the apps.
- **`packages/tsconfig`** — Shared TypeScript base configs (`base.json`, `nextjs.json`) extended by every package.

## Prerequisites

- **Node.js 24 LTS** — managed via [`.nvmrc`](.nvmrc). Install [Node.js](https://nodejs.org/) directly, or use a version manager: [nvm-windows](https://github.com/coreybutler/nvm-windows) / [nvm](https://github.com/nvm-sh/nvm).
- **pnpm** — [installation guide](https://pnpm.io/installation).
- **PostgreSQL** — installed and running locally. [Download](https://www.postgresql.org/download/).

## Getting started

```bash
# 1. Clone the repo
git clone <repo-url>
cd inventory-management

# 2. Switch to Node 24 (reads .nvmrc; or manually switch to Node 24)
nvm use            # nvm-windows: nvm use 24.18.0

# 3. Install all workspace dependencies (from the root)
pnpm install

# 4. Copy the env template into the API and fill in your credentials
cp .env.example apps/api/.env          # PowerShell: Copy-Item .env.example apps/api/.env

# 5. Create your database, then run migrations from the API
cd apps/api
pnpm migration:run
cd ../..

# 6. Start the API (:3000) and web (:3001) together
pnpm dev
```

The API serves on **http://localhost:3000** and the web app on **http://localhost:3001**.

> `NEXT_PUBLIC_API_URL` must also be visible to the web app. For local dev, create `apps/web/.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:3000`.

## Environment variables

All variables live in [`.env.example`](.env.example). Copy it to `apps/api/.env` and fill in the blanks.

| Variable | Description | Example |
| --- | --- | --- |
| `DATABASE_HOST` | PostgreSQL host | `localhost` |
| `DATABASE_PORT` | PostgreSQL port | `5432` |
| `DATABASE_USER` | PostgreSQL user | `postgres` |
| `DATABASE_PASSWORD` | PostgreSQL password | `postgres` |
| `DATABASE_NAME` | Database name | `inventory` |
| `JWT_SECRET` | Secret used to sign JWTs | `a-long-random-string` |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |
| `FRONTEND_URL` | Allowed CORS origin (the web app) | `http://localhost:3001` |
| `NEXT_PUBLIC_API_URL` | API base URL the web app calls | `http://localhost:3000` |

## Available scripts

Run from the repo root:

| Script | Description |
| --- | --- |
| `pnpm dev` | Run the API (:3000) and web (:3001) together via Turbo |
| `pnpm build` | Build all packages and apps (`@repo/types` first, then the apps) |
| `pnpm lint` | Type-check every package |
| `pnpm dev:api` | Run only the API |
| `pnpm dev:web` | Run only the web app |

The API also exposes `pnpm migration:generate <path>`, `pnpm migration:run`, and `pnpm migration:revert` (run from `apps/api`).

## API overview

**Base URL:** `http://localhost:3000`

Every successful response is wrapped in a consistent envelope:

```json
{ "data": "<payload>", "statusCode": 200, "timestamp": "2026-06-25T12:00:00.000Z" }
```

Errors are normalized to the same shape (stack traces are logged server-side only, never returned):

```json
{ "error": "Invalid credentials", "statusCode": 401, "timestamp": "2026-06-25T12:00:00.000Z" }
```

### Authentication

Two public endpoints issue a JWT:

| Method | Endpoint | Body | Returns |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | `{ email, password }` | `{ accessToken, user }` |
| `POST` | `/auth/login` | `{ email, password }` | `{ accessToken, user }` |

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "user@example.com", "password": "password123" }'
```

Every other endpoint is protected and requires the token:

```
Authorization: Bearer <accessToken>
```

## Architecture notes

- **All routes are protected by default.** A global guard requires a valid JWT; open a route explicitly with the `@Public()` decorator and restrict one with `@Roles(...)`.
- **`synchronize: false` is permanent.** All schema changes go through TypeORM migrations — never manual SQL or auto-sync.
- **Shared DTOs and types live in `packages/types`** and are imported by both apps, so the API and web never drift out of sync.
- **Password fields are never returned** from any endpoint. Responses are built from explicit objects, not raw entities.

See [`CLAUDE.md`](CLAUDE.md) for the full set of conventions and a step-by-step guide to adding a new feature.
