# PostHog env var checklist (SvelteKit on Vercel)

Grounded in [raw/posthog--sveltekit--install-client-server-pageviews.md], [raw/posthog--feature-flags--local-evaluation-bootstrapping.md], [raw/posthog--data-residency--eu-us-gdpr.md], [raw/posthog--reverse-proxy--vercel-and-managed.md].

## Required

| Var | Used by | Public/secret | Notes |
| --- | --- | --- | --- |
| `PUBLIC_POSTHOG_KEY` (or `VITE_PUBLIC_POSTHOG_KEY`) | Client (`posthog-js`) init | Public - safe to expose, this is the project API token, not a secret | One value per PostHog project |
| `PUBLIC_POSTHOG_HOST` | Client init `api_host` | Public | `https://us.i.posthog.com` (US) or `https://eu.i.posthog.com` (EU) - or the reverse-proxy path (`/ingest`) if a proxy is configured |
| `POSTHOG_PROJECT_KEY` | Server (`posthog-node`) init | Same value as `PUBLIC_POSTHOG_KEY` in practice, but read server-side via `$env/dynamic/private` for consistency with other secrets | |
| `POSTHOG_HOST` | Server init `host` | Must match the client region exactly - mismatched US/EU endpoints cause 401s | |

## Required only if using local feature-flag evaluation server-side

| Var | Used by | Public/secret | Notes |
| --- | --- | --- | --- |
| `POSTHOG_FEATURE_FLAGS_SECURE_KEY` | Server `posthog-node` `personalApiKey` option | **Secret, server-only, never client-side** | From Project Settings > Feature Flags tab > "Feature Flags Secure API Key". Personal API keys still work but are being deprecated for this specific purpose |

## Required only if self-hosting the Vercel reverse proxy

No additional env vars - the proxy path is hardcoded into `vercel.json` and the client's `api_host` (see `references/vercel-reverse-proxy.md`), not env-driven, since Vercel rewrites are static config evaluated at deploy time.

## Region consistency checklist

Every one of these must point at the SAME region (US or EU) or the integration breaks with 401s [raw/posthog--reverse-proxy--vercel-and-managed.md, raw/posthog--data-residency--eu-us-gdpr.md]:

- [ ] `PUBLIC_POSTHOG_HOST` (client `api_host`, or the proxy path if proxied)
- [ ] `POSTHOG_HOST` (server `host`)
- [ ] `ui_host` in both client and server init (`https://us.posthog.com` or `https://eu.posthog.com`)
- [ ] Reverse-proxy rewrite destinations in `vercel.json`, if self-hosting the proxy (`us.i.posthog.com`/`us-assets.i.posthog.com` vs `eu.i.posthog.com`/`eu-assets.i.posthog.com`)

## GDPR / region decision (synthesized guidance, flagged as inference - see distilled-posthog.md §13)

If the app has a meaningful EU user base and GDPR compliance is a live requirement, default all of the above to EU endpoints - PostHog's own docs describe EU Cloud as the path requiring the fewest additional compliance steps (IP capture is off by default on EU Cloud, unlike US) [raw/posthog--data-residency--eu-us-gdpr.md]. Otherwise, US Cloud (PostHog's own default) is fine.

## Vercel-specific setup notes

- Set all four required vars in Vercel Project Settings > Environment Variables, scoped to Production/Preview/Development as appropriate - a Preview deployment pointed at a PostHog staging/dev project (if one exists) avoids polluting production analytics with QA traffic, though PostHog itself does not document a dedicated "staging environment" concept the way some other Hive-stack tools (e.g. WorkOS) do; project-level separation is the closest equivalent.
- Never commit these to the repo - use `.env.local` for local dev (gitignored by SvelteKit's default template) and Vercel's environment variable UI for deployed environments.
- `PUBLIC_POSTHOG_KEY` is safe to be visible in client-side bundle output by design (it is the intended public project token), but `POSTHOG_FEATURE_FLAGS_SECURE_KEY` must never appear in any client bundle - verify it is only read via `$env/dynamic/private` (server-only) and never `$env/dynamic/public` or `$env/static/public`.
