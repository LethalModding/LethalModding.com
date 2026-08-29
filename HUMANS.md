# HUMANS.md — Run and use

Install and run locally. Layout and agent conventions: [AGENTS.md](./AGENTS.md).

## Prerequisites

[Bun](https://bun.sh) (see `packageManager` in `package.json`).

## Install

```bash
git clone https://github.com/LethalModding/LethalModding.com.git LethalModding.com
cd LethalModding.com
bun install
```

## Environment

Create `.env.local` at the repo root:

```bash
NEXT_PUBLIC_BASE_URL=http://localhost:9000
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_KEY=<service-role-key>
NEXT_PUBLIC_BRANDING=lethalmodding
MAILGUN_SEND_KEY=<key>
MAILGUN_DOMAIN=<sending-domain>
GITHUB_TOKEN=<token-with-issue-create-scope>
```

`NODE_ENV` selects the email template directory; production uses `/app/src/server/<branding>/emails`.

## Usage

```bash
bun run dev      # http://localhost:9000
bun run build && bun run start
```

## Verify

```bash
bun run lint
bun run typecheck
```

Or `gate run build typecheck` (see `.gate.toml`).

## Uninstall

Delete the clone. Secrets live only in `.env.local` (gitignored).
