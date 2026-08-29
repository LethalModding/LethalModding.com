# AGENTS.md — Developer guide

Conventions for coding agents working in this repository. Setup and environment variables belong in [HUMANS.md](./HUMANS.md).

## Guardrails

- Do not commit secrets, `.env` files, or generated build output (`.next`, `node_modules`, `tsconfig.tsbuildinfo`).
- Keep marketing copy in README free of implementation detail — route names, env var catalogs, and internal identifiers belong here or in HUMANS.
- Stage only files related to the current change; avoid mixing unrelated refactors.

## Verification

| Change type | Command |
| ----------- | ------- |
| General source edits | `bun run lint`, `bun run typecheck` |
| Build confidence | `bun run build` or `gate run build typecheck` |

## Repository layout

| Path | Role |
| ------ | ------ |
| `src/pages/` | Next.js Pages Router routes and API handlers under `pages/api/` |
| `src/components/` | React UI — `_shared` (auth, chrome), `branding`, `mods`, `project`, `team`, `tools` |
| `src/server/` | Server-only helpers — Supabase client, email (Mailgun + Handlebars), rate limiting |
| `src/types/` | Shared TypeScript models for mods, teams, projects, and profiles |
| `src/styles/` | MUI theme options and global CSS |
| `src/utility/` | Client utilities (Emotion cache, slugify) |
| `src/store.ts` | Zustand global state |
| `next.config.mjs` | Next.js config — image remote patterns, API CORS headers |

## Stack invariants

- **Router:** Next.js Pages Router (`src/pages`), not App Router.
- **UI:** Material UI v5 with Emotion styling.
- **Auth:** `@supabase/auth-helpers-nextjs` / `@supabase/auth-helpers-react`; session tokens may arrive in the URL hash on the home page.
- **HTTP client:** `ofetch` for client-side API calls.
- **Package manager:** Bun (`bun.lock`); run scripts with `bun run <script>`.

## API surface

Concrete API routes live under `src/pages/api/concrete/`. Auth login is at `api/concrete/v2/auth/login`; mod recommendations at `api/concrete/mods/recommended`; bug reports at `api/concrete/bug-report`. TypeScript package proxy at `api/ts/package/[...id]`.
