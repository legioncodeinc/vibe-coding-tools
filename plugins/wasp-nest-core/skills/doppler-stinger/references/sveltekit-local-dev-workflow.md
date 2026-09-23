# SvelteKit local dev workflow: `doppler setup` + `doppler run --`

Grounded in [raw/doppler--cli--install-and-local-dev-workflow.md], [raw/doppler--cli--cli-guide-reference.md], [raw/doppler--project-config--root-configs-and-branch-configs.md].

## One-time setup (per developer, per repo)

```shell
# 1. Install the CLI (macOS shown; see raw/doppler--cli--cli-guide-reference.md for other OS)
brew install gnupg
brew install dopplerhq/cli/doppler

# 2. Authenticate once per workplace - opens a browser
doppler login

# 3. From the SvelteKit app's repo root, scope this directory to a project/config
cd ./my-sveltekit-app
doppler setup
# Prompts for Project (e.g. myapp) and Config - choose dev_personal if
# Personal Configs are enabled, otherwise dev.
```

## Commit a `doppler.yaml` so teammates skip the prompts

Drop this at the repo root (safe to commit - it names a project/config, not secrets):

```yaml
# doppler.yaml
setup:
  - project: myapp
    config: dev_personal
```

For a monorepo with a separate worker or admin app, scope each subdirectory independently:

```yaml
setup:
  - project: myapp-web
    config: dev_personal
    path: apps/web/
  - project: myapp-worker
    config: dev_personal
    path: apps/worker/
```

New teammates then just run `doppler setup --no-interactive` after `doppler login`.

## Importing an existing `.env` (one-time migration)

```shell
doppler import .env
```

## Replacing `npm run dev` / `vite-node` with `doppler run --`

Before (reading from a local `.env` via `vite`'s built-in dotenv loading or a `vite-node` script):

```json
{
  "scripts": {
    "dev": "vite dev",
    "start": "node build"
  }
}
```

After (Doppler injects secrets as real process env vars, no `.env` file involved):

```json
{
  "scripts": {
    "dev": "doppler run -- vite dev",
    "start": "doppler run -- node build"
  }
}
```

Or invoke directly without touching `package.json`:

```shell
doppler run -- npm run dev
doppler run -- pnpm dev
doppler run -- vite-node src/scripts/seed.ts
```

Team-plan bonus: auto-restart the dev server when a secret changes (no manual Ctrl-C/re-run needed) [raw/doppler--cli--install-and-local-dev-workflow.md]:

```shell
doppler run --watch -- vite dev
```

## SvelteKit public vs. private env boundary - still applies

Doppler only handles *where the value lives and how it gets into the process*; SvelteKit's own client/server boundary still governs what's safe to expose to the browser. Only variables intended for the client should ever be read through `$env/dynamic/public` / `$env/static/public` (SvelteKit's `PUBLIC_`-prefixed convention). A Neon connection string, a WorkOS API key, or any Doppler-managed secret belongs behind `$env/dynamic/private` / `$env/static/private` and is only ever read in `+page.server.ts`, `+server.ts`, or `hooks.server.ts` - never in a `+page.svelte` or any code that ships to the client bundle. This SvelteKit-module mapping is this skill's application of the general Vite client-exposure convention documented in the source, not a Doppler-authored SvelteKit statement [raw/doppler--cli--install-and-local-dev-workflow.md].

```ts
// src/hooks.server.ts - safe: server-only module
import { DATABASE_URL } from '$env/dynamic/private';
```

```ts
// src/routes/+page.svelte - NEVER import $env/dynamic/private here
```

## Removing `.env` files once Doppler is wired up

Per Doppler's own guidance: delete both the `.env` file(s) AND any application code that still reads from them once `doppler run` is the process's env source. Add `.env*` (except `.env.example`, if kept as a documentation-only template with placeholder values) to `.gitignore` if not already present [raw/doppler--cli--install-and-local-dev-workflow.md].

## Offline development

The CLI writes an encrypted local fallback file automatically, so `doppler run -- vite dev` keeps working without network access; it refreshes silently the next time the CLI can reach Doppler [raw/doppler--cli--install-and-local-dev-workflow.md]. This is safer than manually downloading secrets to a plaintext `.env` "just in case" - don't do that instead.
