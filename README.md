# Helena Art Store Monorepo

A Turbo-powered Nx workspace for Helena's immersive art store experience. The repository ships with a React frontend rendered with Three.js accents and a security-hardened NestJS backend that exposes a MongoDB-ready catalogue API.

## Tech stack

- [Nx](https://nx.dev) workspace orchestrated through [Turborepo](https://turbo.build/repo) (`turbo.json`) for task pipelines.
- **Frontend:** React 18 + Vite with @react-three/fiber/@react-three/drei for the neon art landing scene, React Router, and TanStack Query for typed API calls.
- **Backend:** NestJS 11 with MongoDB via Mongoose, global validation, Helmet hardening, rate limiting, and DTO/repository/service layering.
- **Shared libraries:**
  - `libs/api-types` – Zod schemas + shared DTO contracts.
  - `libs/config` – Environment validation and defaults.
  - `libs/core/utils` – Cross-app helpers (Mongo serializers, URL builders, etc.).
  - `libs/ui` – Glassmorphism UI primitives for the frontend.
  - `libs/shared/testing` – Testing fixtures/utilities.

## Getting started

```sh
npm install
```

Copy environment templates and customise as needed:

```sh
cp .env.example .env
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

### Development

Run both apps with hot reload:

```sh
npm run dev
```

- Frontend: http://localhost:4200 (Vite dev server)
- Backend: http://localhost:3333/api (NestJS with CORS + Helmet)

You can also start them individually:

```sh
npm run dev:frontend
npm run dev:backend
```

### Quality checks

```sh
npm run lint        # ESLint for frontend + backend
npm run typecheck   # TypeScript type-checking
npm run test        # Jest + Vitest suites (Nx orchestrated)
npm run build       # Production builds for every project
```

The Nx workspace is task-cached and can also be visualised with `npm run graph`. Turborepo caching can be configured via `turbo.json` if you opt into remote caching later.

## Backend API overview

- `GET /api/health` – Health probe with timestamp metadata.
- `GET /api/catalog/featured` – Returns featured artwork DTOs. The repository queries MongoDB (with lean reads) and falls back to secure stub data when the database is unavailable. Responses always expose `id` instead of `_id`.

Security defaults:

- Helmet with relaxed CSP for Three.js embeds.
- Global validation pipe (`whitelist`, `forbidNonWhitelisted`, `transform`).
- Rate limiting via `@nestjs/throttler` (120 req/min per client).
- CORS restricted to `FRONTEND_ORIGIN` from configuration.

## Frontend experience

The landing page renders a volumetric hero scene (Three.js orbs) with glass UI overlays, feature highlights, and a featured gallery fed by the backend API. React Query handles data fetching with shared types derived from the backend Zod schemas.

## Testing

- Backend and shared libs use Jest.
- Frontend uses Vitest + Testing Library with a ResizeObserver polyfill for the Three.js canvas.
- Shared testing utilities live in `libs/shared/testing`.

Run the full suite with `npm run test` (or `npx nx --output-style=stream test <project>` for individual targets).

## Project layout

```
apps/
  backend/    NestJS app (controllers/services/repositories/schema layering)
  frontend/   React app with feature-driven modules
libs/
  api-types/      Shared Zod contracts
  config/         Env schema + defaults
  core/utils/     Cross-cutting helpers
  shared/testing/ Jest/Vitest helpers
  ui/             Design system primitives
```

This structure keeps the domain logic modular while enabling both Nx and Turborepo task orchestration.
