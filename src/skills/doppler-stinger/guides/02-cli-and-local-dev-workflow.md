# CLI and local dev workflow (replacing `.env`)

Grounded in `references/research/distilled-doppler.md` §2-4, citing [raw/doppler--cli--cli-guide-reference.md] and [raw/doppler--cli--install-and-local-dev-workflow.md].

## Install and authenticate

Local development uses `doppler login` (one-time browser auth per workplace). Live/production environments must NEVER use a CLI or Personal Token - both carry the same write access as the authenticating account. Use a Service Token there instead (`guides/04-service-tokens-scoping-access-control.md`) [raw/doppler--tokens--service-tokens-and-token-formats.md].

## Scope the repo to a project/config

```shell
cd ./my-sveltekit-app
doppler setup
```

Commit a `doppler.yaml` so every teammate gets the same project/config with zero prompts. Full worked example, including the monorepo case: `references/sveltekit-local-dev-workflow.md`.

## Replace `npm run dev` / `vite-node` with `doppler run --`

This is the core local-dev change for a SvelteKit app: wrap the existing dev/build/seed commands instead of relying on Vite's own `.env` loading.

```shell
doppler run -- npm run dev
doppler run -- vite-node src/scripts/seed.ts
doppler run --watch -- npm run dev   # Team plan: auto-restart on secret change
```

Full copy-paste `package.json` before/after and the SvelteKit public/private `$env` module boundary: `references/sveltekit-local-dev-workflow.md`.

## Injection mechanism: runtime env vars, not a build-time bake

`doppler run` injects the latest secrets as real process environment variables at the moment the wrapped command starts - this is a runtime injection model, not a build-time substitution into a bundled artifact. No source in this research surfaced a first-party "bake secrets into the build output" workflow, and doing so would be actively wrong for anything server-only (it would ship the value into whatever artifact gets built). Only variables intentionally meant for the browser (SvelteKit's `PUBLIC_`-prefixed convention) should ever cross that boundary [raw/doppler--cli--install-and-local-dev-workflow.md].

## Setting and fetching secrets from the CLI

```shell
doppler secrets set DATABASE_URL              # interactive prompt, or:
doppler secrets set DATABASE_URL=postgres://...
doppler secrets upload existing.env           # bulk import
doppler secrets get DATABASE_URL --plain      # single value to stdout
doppler secrets download --no-file --format=json
```

Doppler explicitly recommends against writing secrets to plaintext files on disk. Prefer `doppler run --` injection or the mount feature over `doppler secrets download` to a real file [raw/doppler--cli--cli-guide-reference.md].

## Secret references - avoid duplicating a value across configs

`${SECRET_NAME}` (same config), `${config.SECRET_NAME}` (same project, different config), `${project.config.SECRET_NAME}` (cross-project, paid plans). Watch for dangling references: a deleted/renamed target leaves the literal `${...}` string as the value until the path resolves again, at which point it silently starts injecting - track and clean these up rather than assuming a reference is permanently safe once working [raw/doppler--cli--cli-guide-reference.md].

## Removing `.env` files - do this, don't leave both systems running

Once `doppler run --` is wired into every script that needs secrets, delete the `.env` file(s) and any application code still reading from them. Running both systems side by side reintroduces exactly the "which one is the source of truth" ambiguity Doppler exists to remove [raw/doppler--cli--install-and-local-dev-workflow.md].

## Offline development

The CLI auto-creates an encrypted local fallback file, so `doppler run --` keeps working without connectivity and refreshes silently once back online - no manual "keep a backup .env just in case" workaround needed [raw/doppler--cli--install-and-local-dev-workflow.md].

## Where to go next

- Vercel sync for staging/production: `guides/03-vercel-integration-and-sync.md`
- Scoping a Service Token for CI or production: `guides/04-service-tokens-scoping-access-control.md`
