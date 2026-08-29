# HUMANS.md — Run and use

Operator guide for installing, configuring, and running LethalModding.com locally. For repository layout and agent conventions, see [AGENTS.md](./AGENTS.md).

## Prerequisites

- [Bun](https://bun.sh) (matches `packageManager` in `package.json`)

## Installation

### Clone

```bash
git clone https://github.com/LethalModding/LethalModding.com.git LethalModding.com
cd LethalModding.com
```

### Dependencies

```bash
bun install
```

## Environment

Create `.env.local` in the repository root. Minimum variables for local development:

```bash
# Public site URL (auth redirects)
NEXT_PUBLIC_BASE_URL=http://localhost:9000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_KEY=<service-role-key>

# Branding key for email template paths (e.g. lethalmodding)
NEXT_PUBLIC_BRANDING=lethalmodding

# Mailgun (email login and notifications)
MAILGUN_SEND_KEY=<key>
MAILGUN_DOMAIN=<sending-domain>

# GitHub API (bug-report endpoint)
GITHUB_TOKEN=<token-with-issue-create-scope>
```

`NODE_ENV` selects the email template directory at runtime; production expects templates under `/app/src/server/<branding>/emails`.

## Usage

### Development server

```bash
bun run dev
```

The dev server listens on port **9000** (`http://localhost:9000`).

### Production build

```bash
bun run build
bun run start
```

### Quality checks

```bash
bun run lint
bun run typecheck
```

`gate run build typecheck` runs the serial gates declared in `.gate.toml`.

## Further reading

### TypeScript

- [TypeScript documentation](https://www.typescriptlang.org/docs/)
- [TypeScript tutorial](https://www.typescripttutorial.net/) — assumes JavaScript familiarity

### Next.js

- [Next.js documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub repository](https://github.com/vercel/next.js/)

### Material UI

- [Material UI components](https://mui.com/material-ui/)
- [Getting started with Material UI](https://mui.com/material-ui/getting-started/learn/)
- [Material UI GitHub repository](https://github.com/mui/material-ui)
