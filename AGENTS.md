# AGENTS.md — Developer guide

Agent conventions. Setup: [HUMANS.md](./HUMANS.md).

## Guardrails

- No secrets, `.env`, or build artifacts (`.next`, `node_modules`, `tsconfig.tsbuildinfo`).
- Marketing copy stays implementation-free; routes and env catalogs belong here or HUMANS.
- Stage only files for the current change.

## Verification

| Change | Command |
| ------ | ------- |
| Source | `bun run lint`, `bun run typecheck` |
| Build | `bun run build` or `gate run build typecheck` |

## Layout

| Path | Role |
| ---- | ---- |
| `src/pages/` | Pages Router routes; API under `pages/api/` |
| `src/components/` | React UI — `_shared`, `branding`, `mods`, `project`, `team`, `tools` |
| `src/server/` | Supabase, email (Mailgun + Handlebars), rate limiting |
| `src/types/` | Shared TypeScript models |
| `src/styles/` | MUI theme, global CSS |
| `src/utility/` | Emotion cache, slugify |
| `src/store.ts` | Zustand state |
| `next.config.mjs` | Image remotes, API CORS |

## Stack invariants

- **Router:** Pages Router (`src/pages`), not App Router.
- **UI:** MUI v9 + Emotion.
- **Auth:** `@supabase/auth-helpers-nextjs` / `react`; tokens may arrive in URL hash on home.
- **HTTP:** `ofetch` for client API calls.
- **Package manager:** Bun — `bun run <script>`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
