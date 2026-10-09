# AGENTS.md — Developer guide

Agent conventions. Setup: [HUMANS.md](./HUMANS.md).

## Guardrails

- No secrets, `.env`, or build artifacts (`.next`, `node_modules`, `tsconfig.tsbuildinfo`).
- Marketing copy stays implementation-free; routes and env catalogs belong here or HUMANS.
- Stage only files for the current change.
- Kept on purpose, not deadwood: `components/mods/ModListItem` and `ProfileListItem`, the `picsum.photos` image remote, and the `slugs ?? …` fallback in `useTeamSlugs` (`src/components/team/Profile.tsx`).

## Verification

| Change | Command |
| ------ | ------- |
| Source | `bun run lint`, `bun run typecheck` |
| Build | `bun run build` or `gate run build typecheck` |
| Full gate (CI) | `bun run lint`, `bun run typecheck`, `bun run build`, then `bun run test:e2e` against `next start` and `next dev --webpack` (`PW_WEB_COMMAND`; Turbopack dev fails on next 16.4.0) |

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
- **Auth:** `@supabase/ssr` browser client from `SupabaseProvider`; hooks in `src/utility/supabase.ts`. Tokens may arrive in URL hash on home.
- **HTTP:** `ofetch` for client API calls.
- **Package manager:** Bun — `bun run <script>`.
