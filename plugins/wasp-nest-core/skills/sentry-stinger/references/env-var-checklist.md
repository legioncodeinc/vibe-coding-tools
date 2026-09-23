# Environment variable checklist

Grounded in [raw/sentry--sourcemaps--vercel-vite-plugin.md], [raw/sentry--integrations--vercel-marketplace.md], [raw/sentry--sveltekit-sdk--client-server-hooks.md].

## Core variables

| Variable | Scope | Required | Notes |
| --- | --- | --- | --- |
| DSN (public) | Client + server | Yes | Not secret, but still sourced from env, not hardcoded, so each environment (dev/preview/staging/production) points at the correct Sentry project. Use `$env/static/public` (or `$env/dynamic/public` for a single build artifact across multiple Vercel preview targets) [raw/sentry--sveltekit-sdk--client-server-hooks.md] |
| `SENTRY_ORG` | Build-time only | Yes, for source map upload | Org slug. Auto-injected by the Sentry Vercel integration once project-linking is complete; otherwise set manually as a Vercel project env var [raw/sentry--integrations--vercel-marketplace.md] |
| `SENTRY_PROJECT` | Build-time only | Yes, for source map upload | Project slug. Same sourcing as `SENTRY_ORG` [raw/sentry--integrations--vercel-marketplace.md] |
| `SENTRY_AUTH_TOKEN` | Build-time only, server-only secret | Yes, for source map upload and release creation | Organization Auth Token (preferred) or Personal Token with `Project: Read & Write` + `Release: Admin`. Never commit. Never expose to the client bundle [raw/sentry--sourcemaps--vercel-vite-plugin.md] |

## Vercel-integration-only variables (auto-injected, do not hand-set unless the integration is not in use)

| Variable | Present when |
| --- | --- |
| `SENTRY_VERCEL_LOG_DRAIN_URL` | Vercel Log Drains configured through the integration |
| `SENTRY_OTLP_TRACES_URL` | Vercel Trace Drains configured through the integration |
| `SENTRY_PUBLIC_KEY` | Used to authenticate log/trace drain payloads |

[raw/sentry--integrations--vercel-marketplace.md]

These three are specific to Sentry's Vercel Marketplace onboarding path and the drains feature of the legacy integration - they are not needed for basic error/performance/replay reporting and should not be manually fabricated if the Vercel integration isn't installed.

## Naming gap - flag, don't guess

Official Sentry docs show `NEXT_PUBLIC_SENTRY_DSN` as the Vercel-integration-injected public DSN variable name - this is Next.js-specific naming, and no SvelteKit-equivalent variable name was confirmed in the fetched research. When wiring this for a SvelteKit app, either rename the auto-injected variable explicitly in the Vercel project settings to match the SvelteKit convention (e.g. `PUBLIC_SENTRY_DSN`), or read whatever name the integration actually injects and confirm it directly against the live Vercel project rather than assuming it matches SvelteKit's `PUBLIC_` prefix convention automatically [raw/sentry--integrations--vercel-marketplace.md].

## Monorepo env-forwarding check

If this SvelteKit app builds inside a monorepo via Turborepo (or similar), confirm `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT` are explicitly declared in the task runner's environment-forwarding config, not just set in the Vercel project UI. Turborepo v2+ does not forward env vars to task hashes/build steps by default - this is a repeatedly-confirmed cause of "token is set in Vercel but the build still logs no auth token provided" [raw/sentry--sourcemaps--vercel-vite-plugin.md].

## Setup checklist

1. Create (or confirm) the Sentry project and copy its DSN into the app's public env var, per-environment (dev/preview/production each may point at the same or different Sentry projects depending on how noisy dev/preview traffic should be allowed to get).
2. Install Sentry's Vercel "Releases and Source Map Integration" (not the Marketplace flow, for an existing Sentry org - see `references/research/distilled-sentry.md` §8) and complete project linking to auto-inject `SENTRY_ORG`/`SENTRY_PROJECT`/`SENTRY_AUTH_TOKEN`.
3. If in a monorepo, add the forwarded env vars to the task runner's env-passthrough config.
4. Redeploy to trigger the first Sentry-tracked release and confirm source maps upload (check the build log for the Sentry Vite plugin's own upload confirmation, not just a successful build).
5. Confirm the public DSN variable name actually reaching the SvelteKit client bundle matches what `hooks.client.ts` reads - see the naming gap above.
