# 02. Source maps and releases on Vercel

## The plugin

`@sentry/sveltekit` bundles `sentrySvelteKit()`, a wrapper around `@sentry/vite-plugin`, wired into `vite.config.ts` before `sveltekit()` in the `plugins` array. Full config: `references/vite-config-sourcemaps.md`.

Requirements to actually get maps uploaded:
- `build.sourcemap` set to `"hidden"` (or `true`) in `vite.config.ts` - without this the plugin has nothing to upload.
- A production build (`vite build`) - **the plugin does not run in dev/watch mode**. If source maps aren't showing up in Sentry, check that the verification was done against a real build, not the dev server [raw/sentry--sourcemaps--vercel-vite-plugin.md].
- `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` all resolvable in the build environment.

## Auth token: two ways to get one, prefer the integration

**Preferred**: install Sentry's Vercel "Releases and Source Map Integration" (see `references/research/distilled-sentry.md` §8 and `references/env-var-checklist.md`) and complete project linking - this auto-generates and injects `SENTRY_ORG`/`SENTRY_PROJECT`/`SENTRY_AUTH_TOKEN` as Vercel project env vars, skipping manual token management entirely. Do not confuse this with the newer Vercel Marketplace integration, which is a new-Sentry-org-only onboarding path with no upgrade route from an existing org - see the same distillation section for the full comparison.

**Manual fallback**: create an Organization Auth Token in Sentry (`Settings > Auth Tokens`) and set it as a Vercel project environment variable by hand. Never commit it, never expose it to the client bundle - it's build-time-only.

## The failure mode that wastes the most time: token invisible in the build despite being set in Vercel

If the build log says "No auth token provided" even though `SENTRY_AUTH_TOKEN` is visibly set in the Vercel project's environment variables UI, this is almost always a **monorepo env-forwarding problem**, not a Sentry or Vercel bug. Turborepo v2+ specifically does not forward environment variables to task hashes/build steps by default - the variable exists in the Vercel project but never reaches the actual build process Turborepo invokes. Fix: explicitly declare the variable in the task runner's env-passthrough config (`turbo.json`'s `globalEnv` or the relevant task's `env` array), not just in Vercel's UI [raw/sentry--sourcemaps--vercel-vite-plugin.md]. If this project is not a monorepo, this specific failure mode doesn't apply, but the underlying lesson - **verify the var is visible inside the actual build step, not just set in the platform dashboard** - still applies to any build-time env var.

## Delete maps after upload

Set `sourceMapsUploadOptions.filesToDeleteAfterUpload` (via `sentrySvelteKit`) or `sourcemaps.filesToDeleteAfterUpload` (via the standalone plugin) to a glob matching the build output, so generated `.map` files don't ship publicly after Sentry has ingested them - publicly-served source maps can leak original source code [raw/sentry--sourcemaps--vercel-vite-plugin.md].

## Release and commit association

Source map upload and release/commit association are related but separate concerns - uploading a map doesn't automatically associate commits, and vice versa.

**Default for this stack**: let the Vercel integration handle it via Vercel's own `VERCEL_GITHUB_COMMIT_SHA` (or GitLab/Bitbucket equivalent) build-time env var, consumed by the Sentry Vercel integration once a repository integration is also installed in Sentry. No manual CLI step needed [raw/sentry--releases--commit-association.md].

**If not using the Vercel integration**: a manual `sentry-cli releases set-commits --auto` sequence is documented for CI generally, but **no first-party Sentry guide specifically confirms this combination working inside a Vercel build** - treat it as untested by this skill's research and verify against a real deployment before relying on it. Full sequence and caveats: `references/release-commit-association-vercel.md`.

**Resolving issues via commit message** (`Fixes SENTRY-482` in a commit message, or `fixes <ID>` in a PR title) only marks the issue resolved once a release *containing* that commit is created in Sentry - not on commit itself. This only applies to error issues, not performance/replay issues [raw/sentry--releases--commit-association.md].

## Next

`03-performance-tracing-and-sampling.md` covers what to do once traces are actually flowing - the sampling levers and how to pick numbers instead of guessing.
