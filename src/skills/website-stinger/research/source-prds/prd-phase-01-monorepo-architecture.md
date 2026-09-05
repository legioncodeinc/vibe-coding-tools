# Phase 1: Monorepo & Deployment Architecture

> **Site Template Guide**: PRD Phase 1 of 12

---

## Phase Overview

### Goals

Establish the pnpm workspace monorepo housing `apps/web` (SvelteKit public site) and, in Payload CMS mode, `apps/cms` (Next.js + Payload admin). Both apps deploy to separate Vercel projects from the same Git repository via independent `vercel.json` configurations.

### Scope

**In scope:**
- `pnpm-workspace.yaml` at monorepo root
- `apps/web/`: SvelteKit 5 skeleton with adapter-vercel
- `apps/cms/`: Next.js + Payload 3.x skeleton (Payload mode only)
- `supabase/` directory initialized at root
- Vercel project linking for both apps
- `packages/payload-types/` shared types package (optional, Payload mode)

**Out of scope:**
- Any application-level code beyond scaffolding
- Supabase schema or migrations (Phase 5)
- CI/CD pipeline configuration beyond `vercel.json`
- Domain name purchase or DNS configuration

### Dependencies

- None (this is Phase 1; all other phases depend on it)

---

## User Stories

### Story 1: Developer: Scaffold Both Apps

> As a **Developer**, I want to run a single command from the monorepo root to start both apps in development mode so that I can work on the SvelteKit frontend and the Payload admin simultaneously.

**Acceptance criteria:**
- `pnpm dev:web` starts SvelteKit at `http://localhost:5173`
- `pnpm dev:cms` starts Payload admin at `http://localhost:3000/admin` (Payload mode only)
- Both are resolvable concurrently without port conflicts

### Story 2: Developer: Build Both Apps for Deployment

> As a **Developer**, I want separate `vercel.json` files per app so that Vercel treats `apps/web` and `apps/cms` as independent projects.

**Acceptance criteria:**
- `apps/web/vercel.json` has `"framework": "sveltekit"`
- `apps/cms/vercel.json` has `"framework": "nextjs"`
- `pnpm build:web` produces a SvelteKit `.svelte-kit/` output
- `pnpm build:cms` produces a Next.js `.next/` output (Payload mode)

---

## Technical Specification

### pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### Root package.json

```json
{
  "name": "<project-monorepo>",
  "private": true,
  "scripts": {
    "dev:web": "pnpm --filter web dev",
    "dev:cms": "pnpm --filter cms dev",
    "build:web": "pnpm --filter web build",
    "build:cms": "pnpm --filter cms build"
  },
  "engines": { "node": ">=22", "pnpm": ">=9" }
}
```

### apps/web: SvelteKit scaffold

```bash
pnpm create svelte@latest apps/web
# Options: skeleton, TypeScript, ESLint, Prettier, Vitest
```

Key dependencies to add:
```bash
pnpm add @sveltejs/adapter-vercel @sveltejs/enhanced-img
pnpm add -D tailwindcss @tailwindcss/vite
```

`apps/web/vercel.json`:
```json
{
  "framework": "sveltekit",
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install"
}
```

### apps/cms: Payload scaffold (Payload mode only)

```bash
pnpm create payload-app@latest apps/cms
# Options: blank template, PostgreSQL, TypeScript
```

`apps/cms/vercel.json`:
```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install"
}
```

### supabase/ directory

```bash
npx supabase init
```

Produces: `supabase/config.toml` and `supabase/migrations/` (empty).

### packages/payload-types (optional, Payload mode)

After running `payload generate:types` in `apps/cms`, the output `payload-types.ts` is copied to `packages/payload-types/index.ts`. Both apps reference it via tsconfig path alias:

```json
{
  "compilerOptions": {
    "paths": {
      "@payload-types": ["../../packages/payload-types/index.ts"]
    }
  }
}
```

---

## Deployment Architecture

```
GitHub repo
├── apps/web/     → Vercel project A (SvelteKit)
└── apps/cms/     → Vercel project B (Next.js + Payload)
         ↓                    ↓
    Public URL          cms.domain.com
    (domain.com)      (Payload admin + REST)
```

Both projects share a single Supabase project. Environment variables for each Vercel project are configured in the Vercel dashboard.

---

## Environment Variables

| Variable | Where set | Purpose |
|---|---|---|
| `PUBLIC_SITE_URL` | `apps/web` Vercel | Canonical site URL (e.g. https://domain.com) |
| `PUBLIC_SUPABASE_URL` | `apps/web` Vercel | Supabase project URL |
| `PUBLIC_SUPABASE_ANON_KEY` | `apps/web` Vercel | Supabase anon (publishable) key |
| `SUPABASE_SERVICE_ROLE_KEY` | `apps/web` Vercel (private) | For Edge Function calls |
| `PAYLOAD_DATABASE_URI` | `apps/cms` Vercel | Full Postgres connection string |
| `PAYLOAD_SECRET` | `apps/cms` Vercel | JWT signing secret |
| `PAYLOAD_PUBLIC_SERVER_URL` | `apps/cms` Vercel | cms.domain.com |
| `PUBLIC_SITE_URL` | `apps/cms` Vercel | Added to CORS allowlist |

---

## Risks and Open Questions

- **R-1:** pnpm workspace filter syntax may differ from npm workspaces. Ensure `pnpm --filter web dev` resolves to `apps/web` and not a package named `web` in `packages/`.
- **R-2:** Vercel multi-project monorepo billing: each Vercel project counts separately. Confirm the account has the appropriate plan for two projects.
- **Q-1:** Should `packages/payload-types/` be a proper npm workspace package with its own `package.json` and `name: "@project/payload-types"`, or is a tsconfig path alias sufficient? The workspace package approach is more robust for monorepo tooling.
