# Parallelia

Parallelia is a 2D metaverse platform inspired by Gather Town that simulates real-life social interactions inside interactive virtual spaces. The project combines a real-time frontend client, a WebSocket-based real-time backend, and a PostgreSQL database managed with Prisma.

This README gives a concise overview, quick-start instructions, project layout, and notes for contributors and maintainers.

## Table of contents

- About
- Quick Start
- Development
- Project structure
- Database & Migrations
- Tests
- Contributing
- Troubleshooting
- License


## About

Key capabilities:

- Real-time multiplayer movement and interaction (WebSockets)
- Map-based spaces with placeable elements and collision handling
- Avatar management and customizable assets
- Admin APIs for maps, avatars, and elements
- JWT-based authentication for protected endpoints


## Quick Start (local)

These instructions assume Node.js (>=18), pnpm (project uses pnpm v8+), and PostgreSQL are available locally.

1. Install dependencies

	```cmd
	pnpm install
	```

2. Configure the database

The Prisma datasource reads the connection string from the `DATABASE_URL` environment variable. The Prisma schema is at `metaverse/packages/db/prisma/schema.prisma`.

There are currently no `.env.example` files in the repo. Create a `.env` file at the repo root or in `metaverse/packages/db` containing at least:

	```text
	DATABASE_URL=postgresql://user:password@localhost:5432/parallelia_dev
	```

3. Run Prisma migrations

	```cmd
	pnpm --filter @repo/db prisma migrate deploy
	```

	For local development (create DB + apply migrations):

	```cmd
	pnpm --filter @repo/db prisma migrate dev
	```

4. Start services

The monorepo uses `turbo` from `metaverse` for orchestration, but individual packages expose dev scripts.

From the repo root you can run the metaverse dev command (uses turbo):

	```cmd
	pnpm --filter metaverse dev
	```

Or run packages individually:

	```cmd
	pnpm --filter metaverse/apps/frontend dev
	pnpm --filter metaverse/apps/http dev
	pnpm --filter metaverse/apps/ws dev
	```

Notes about ports and startup:

- Frontend (Vite) uses default Vite dev server (the code references `http://localhost:5173` in CORS settings).
- HTTP API server listens on port 3000 (see `metaverse/apps/http/src/index.ts`).
- WebSocket server listens on port 3001 (see `metaverse/apps/ws/src/index.ts`).

Security note: the project currently defines a hard-coded JWT secret in both `metaverse/apps/http/src/config.ts` and `metaverse/apps/ws/src/config.ts` as `JWT_PASSWORD = "123kasdk123"`. For production use, replace this with a secure secret taken from environment variables.


## Development

- Lint / Typecheck: `metaverse/package.json` provides workspace scripts (`pnpm --filter metaverse lint`, `pnpm --filter metaverse build`). Use `turbo` commands from the `metaverse` package for workspace-level tasks (see `metaverse/package.json`).
- Testing: run unit tests in the `tests` package and any package-local tests:

	```cmd
	pnpm --filter tests test
	```

- Formatting: `prettier` is defined at the `metaverse` level. Run:

	```cmd
	pnpm --filter metaverse format
	```


## Project structure (high level)

Top-level folders (inside `metaverse/`):

- `apps/frontend` - React + Vite client (TypeScript). Key files: `src/main.tsx`, `src/pages`, `src/components`.
- `apps/http` - HTTP API (TypeScript, Express). Key files: `src/index.ts`, `src/routes`, `src/middleware`. The service exposes endpoints under `/api/v1` and uses `/signup` and `/signin` routes as entry points.
- `apps/ws` - WebSocket real-time server. Key files: `src/index.ts`, `src/RoomManager.ts`, `src/User.ts`.
- `packages/db` (`@repo/db`) - Prisma schema and database access code. The Prisma client is exported from `packages/db/src/index.ts` and imported by other apps as `@repo/db`.
- `packages/ui`, `packages/typescript-config`, `packages/eslint-config` - shared tooling, ESLint/TS config and UI helper components.


## Database & Migrations

- Prisma schema is in `metaverse/packages/db/prisma/schema.prisma`.
- Migration files are in `metaverse/packages/db/prisma/migrations`.
- For development you can use `pnpm --filter @parallelia/db prisma migrate dev` to create a local dev database and run migrations.


## Tests

- Unit tests live in `tests/` and package-local test folders. Run all tests with:

	pnpm test


## Contributing

Contributions are welcome. When opening a PR:

- Add tests for new functionality when practical.
- Follow the repository's linting and formatting rules.
- Keep changes scoped and add clear commit messages.

If you'd like to contribute bigger features (voice chat, AI NPCs), open an issue first to discuss design.


## Troubleshooting

- If you see Prisma or DB connection errors, ensure `DATABASE_URL` points to a reachable Postgres instance. For local development use a .env file in `metaverse/packages/db` or the repo root depending on the setup.
- If ports collide when starting services, change the dev ports in the package's config (Vite / server configs).


## Assumptions and notes

- Commands above assume `pnpm` workspace scripts are available. If you use `npm` or `yarn`, adapt commands accordingly.
- The repository contains TypeScript projects; Node >=18 and modern TypeScript tooling are recommended.
- JWTs are used for authentication; check the `apps/http` package for auth middleware and required env vars.


## License

This project is licensed under the MIT License.


