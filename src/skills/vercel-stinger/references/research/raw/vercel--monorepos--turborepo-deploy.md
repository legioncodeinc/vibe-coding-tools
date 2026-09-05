# Vercel monorepo + Turborepo deployment: root directory, build command, remote caching

- URL: https://vercel.com/docs/monorepos/turborepo ; https://vercel.com/docs/monorepos ; https://turborepo.dev/docs/guides/ci-vendors/vercel
- Fetched: 2026-08-14
- Source type: Official Vercel docs + official Turborepo docs
- Component: Monorepos / Turborepo

## Content

### Non-Turborepo monorepo support (baseline)

Vercel supports npm/yarn/pnpm/Bun workspace monorepos natively. Each deployable app gets its own Vercel Project, with **Root Directory** set to that app's path (e.g. `apps/web`) via dashboard or `vercel link --repo` (CLI ≥20.1.0, run from monorepo root, links multiple projects at once). Pushing a commit triggers a deployment for every connected project by default; Vercel can skip unaffected projects automatically if the repo follows standard workspace conventions (workspace root markers detected, lockfile uses a recognized package manager), or via the **Ignored Build Step** setting for repos that don't qualify for automatic skipping.

`VERCEL_RELATED_PROJECTS` env var + `@vercel/related-projects` npm package let one project in the monorepo reference another's deployed host (e.g. a frontend referencing an API project) without hardcoding URLs.

### Turborepo-specific zero-config integration

Vercel auto-detects Turborepo and pre-configures build settings:

| Field | Value Vercel sets |
|---|---|
| Framework Preset | one of 35+ presets, auto-detected |
| Build Command | `turbo run build` (Turborepo ≥1.8) or `cd ../.. && turbo run build --filter=web` |
| Output Directory | framework default |
| Install Command | auto-detected |
| Root Directory | app's path in repo |
| Ignored Build Step | `npx turbo-ignore --fallback=HEAD^1` |

Thanks to automatic workspace scoping and globally-installed `turbo` on Vercel's build image, the build command can be as simple as `turbo run build` even without a local `turbo` devDependency.

### Environment variables and cache correctness (the sharp edge)

Turborepo hashes build inputs to decide cache hits; if env vars that affect build output aren't declared, Turborepo may serve a **stale cache hit from the wrong environment** (e.g. accidentally shipping staging config to production). Required declaration in `turbo.json`:

```json
{
  "$schema": "https://turborepo.com/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "env": ["SOME_ENV_VAR"],
      "outputs": ["dist/**"]
    },
    "web#build": {
      "dependsOn": ["^build"],
      "env": ["SOME_OTHER_ENV_VAR"],
      "outputs": [".next/**", "!.next/cache/**"]
    }
  },
  "globalEnv": ["GITHUB_TOKEN"],
  "globalDependencies": ["tsconfig.json"]
}
```

Frameworks like Next.js get some env vars auto-inferred (e.g. `NEXT_PUBLIC_*`) but anything else that's inlined at build time must be declared explicitly. Best practice: scope env declarations to the specific app task (`web#build`) rather than the global `build` task, for better cache hit rates across a multi-app monorepo.

SvelteKit's expected `outputs` entry in `turbo.json` for cache-hit troubleshooting: `.svelte-kit/**`, `.vercel/**` (or `.vercel/output/**` if targeting the Build Output API directly).

### Remote Caching

Optional, connects local/CI Turborepo runs to Vercel's Remote Cache so build artifacts share across machines and CI. Not required to host on Vercel - works standalone too. Setup: `turbo login` / `turbo link` from monorepo root (or team-level dashboard toggle for org-wide enablement), then `vercel link` inside each sub-project directory.
