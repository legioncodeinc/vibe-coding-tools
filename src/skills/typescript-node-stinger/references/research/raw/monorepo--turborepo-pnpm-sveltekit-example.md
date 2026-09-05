# Turborepo + pnpm workspaces for a SvelteKit (+ Payload-shaped) monorepo: practical patterns

- URL: https://vigerust.dev/articles/monorepo-architecture ; https://github.com/mattddean/payloadcms-nextjs-pnpm-monorepo ; https://github.com/HanielU/sk-trpc-payload
- Fetched: 2026-08-14
- Source type: Blog (practitioner write-up, 2025-11-29) + two public example repos (Payload CMS + pnpm/Turborepo monorepo patterns; one is Next.js-based, one is SvelteKit + Payload CMS + tRPC directly)
- Component: Monorepo tooling choice and layout for this stack shape

## Content

### Turborepo + pnpm workspaces is the common pairing for this shape of app

A production write-up building a Turborepo monorepo with multiple SvelteKit apps and shared component libraries uses pnpm workspaces for package management and Turborepo purely for task orchestration/caching - explicitly two separate concerns handled by two separate, purpose-built tools rather than one tool trying to do both.

### Why Turborepo over Nx or Rush (this source's stated reasoning, contrasts with Nx's own framing in the Nx-vs-Turborepo raw source)

"Turborepo prioritizes simplicity and speed. Unlike Nx's opinionated generators or Rush's strict publishing workflows, Turborepo focuses solely on task orchestration and caching. The entire configuration fits in 20 lines of JSON." This is a smaller, simpler monorepo's-eye view than the Nx comparison page - reinforces that the "right" choice is scale-dependent (see the framing note at the end of the Nx-vs-Turborepo raw source).

### Why pnpm over npm or Yarn (this source's stated reasoning)

"pnpm's symlink-based approach saves gigabytes of disk space and enables instant cross-package changes. The `workspace:*` protocol provides better local development ergonomics than npm workspaces or Yarn's `portal:` protocol."

### Turborepo pipeline shape

Tasks are declared with a `^build` dependency notation creating a dependency graph - running `pnpm build` from the root builds packages in dependency order, and Turborepo caches each package's output based on a fingerprint of its inputs; if a shared package (e.g. `@org/utils`) hasn't changed, its build step is skipped entirely and the cached artifact is restored instead.

### The `workspace:*` protocol in practice

```json
// apps/web/package.json
{
  "dependencies": {
    "@org/ui": "workspace:*"
  }
}
```

During local development, pnpm symlinks the local package for instant updates with no reinstall step needed. During publishing, pnpm rewrites `workspace:*` to the actual resolved version number - this is the same behavior documented in the general pnpm-vs-alternatives raw source, confirmed here in an applied monorepo context.

### Config-package pattern: separate runtime packages from tooling-config packages

The source's monorepo splits internal packages into two categories: **runtime packages** (actual code consumed by apps at runtime - shared components, utilities) and **dev-only config packages** (centralized ESLint/TypeScript/build config, consumed only as devDependencies). Centralizing config packages is presented as the mechanism that "prevents drift and ensures all workspace members follow identical patterns" across a multi-app monorepo - each app's own config becomes a thin extension of the shared config package rather than a hand-maintained duplicate.

### Deployment: Vercel's native Turborepo support

Vercel auto-detects a Turborepo monorepo and sets Build Command to `turbo run build` (or a `--filter`-scoped variant) and Root Directory to the specific app's path automatically - documented independently in the Vercel-specific research already archived for this repo's `vercel-stinger` (`[raw/vercel--monorepos--turborepo-deploy.md]` in that skill's archive). The two public example repos both confirm the same deployment shape in practice: one uses Payload Cloud + Turborepo for the CMS half and Vercel + Turborepo for the Next.js half of a monorepo; the other (`sk-trpc-payload`) pairs a SvelteKit app with an Express+Payload CMS server directly inside one Turborepo/pnpm workspace, run together locally via `pnpm dev` at the root.

### SvelteKit + Payload CMS monorepo shape (from the `sk-trpc-payload` example repo)

A real (if community, non-official) example repo structures a Turborepo workspace as:
- `web` - the SvelteKit app (styling via a utility CSS framework)
- `server` - an Express app hosting Payload CMS plus a tRPC layer for typed client-server communication

Installed and run via `pnpm install` then `pnpm dev` at the workspace root, which runs both the SvelteKit app and the Payload server in parallel. This is presented as a template/starter rather than an official Payload or SvelteKit reference architecture - useful as a concrete existence proof that the SvelteKit+Payload combination is a known, workable monorepo shape, not as an endorsed canonical layout. Note this repo pairs Payload with tRPC + Express rather than Payload's own native Next.js-adjacent app-router integration, since Payload's first-party integration story is Next.js-centric; a SvelteKit+Payload monorepo today most commonly runs Payload as its own standalone server (Express or Payload's own Node adapter) alongside, not inside, the SvelteKit app.
