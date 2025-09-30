# Helena Art Store Monorepo

This Nx workspace hosts the immersive Helena Art Store experience:

- **frontend** — a Vite-powered React application that renders a Three.js powered digital gallery landing page.
- **backend** — a NestJS API prepared to connect to MongoDB with layered architecture, DTO validation, and security hardening.
- **shared libraries** — cross-cutting utilities, environment configuration, UI primitives, and shared API contracts.

## Getting Started

Install dependencies once:

```bash
npm install
```

Copy the sample environment file and adjust values when needed:

```bash
cp .env.example .env
```

The backend `ConfigModule` and the Vite dev server both consume the same root `.env`. Server-only settings (e.g. MongoDB credentials) stay unprefixed, while frontend-facing values must be prefixed with `VITE_` so they are exposed to the browser build.

## Running the apps

### With Docker (Recommended)

The easiest way to run the complete stack with MongoDB:

```bash
# Copy the environment file and adjust as needed
cp .env.example .env

# Start all services (MongoDB, backend, frontend) in detached mode
docker-compose up -d --build

# View logs from all services
docker-compose logs -f

# View logs from a specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Check the status of all services
docker-compose ps

# Stop all services (containers remain for quick restart)
docker-compose stop

# Start stopped services
docker-compose start

# Stop and remove all containers
docker-compose down

# Stop and remove all containers and volumes (⚠️ data will be lost)
docker-compose down -v

# Rebuild a specific service
docker-compose up -d --build backend

# Execute commands inside a running container
docker-compose exec backend sh
docker-compose exec mongodb mongosh
```

The services will be available at:
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000/api
- **MongoDB**: mongodb://localhost:27017

### Local Development

```bash
# Start the NestJS API on http://localhost:3000
npm run start

# In another terminal start the React frontend on http://localhost:4200
npm run start:frontend
```

The backend exposes versioned routes under `/api/v1` and falls back to curated sample data when MongoDB is unavailable so the experience remains functional during development.

## Useful Nx Targets

```bash
# Type-check all projects
npm run typecheck

# Lint every affected project
npm run lint

# Run unit tests
npm run test

# Build all buildable targets
npm run build
```

You can scope commands to an individual project, for example:

```bash
npx nx test frontend
npx nx lint backend
```

## Project Structure Highlights

- `libs/api-types` — Zod-powered contracts shared between backend and frontend.
- `libs/config` — Typed environment validation and ConfigModule options for NestJS.
- `libs/core/utils` — Domain error helpers and Mongo document serialization utilities.
- `libs/ui` — Reusable React UI primitives used across the frontend.
- `libs/shared/testing` — Helpers for unit testing in both backend and frontend contexts.

## Security & Resilience

- Global validation pipes, security headers (Helmet), and correlation IDs are enabled in the API.
- MongoDB repository calls use lean queries and surface DomainErrors that are mapped to HTTP responses.
- When MongoDB is offline, curated sample artwork is returned so the gallery remains interactive.

## Three.js Gallery Experience

The landing page renders a floating gallery scene via `@react-three/fiber` and overlays interactive content composed with shared UI primitives. Featured artwork data loads through React Query from the Nest API (or the shared fallback dataset).

Happy building!
