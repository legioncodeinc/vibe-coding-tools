# PostHog reverse proxy on Vercel: rewrites pattern, ad-blocker rationale, managed alternative

- URL: https://posthog.com/docs/advanced/proxy/vercel ; https://posthog.com/docs/advanced/proxy ; https://posthog.com/docs/privacy/ad-blockers
- Fetched: 2026-08-14
- Source type: Official docs
- Component: Reverse proxy / Vercel deployment

## Content

### Why a reverse proxy (mechanism, not just "trust us")

Ad blockers maintain static blocklists of known analytics domains (`posthog.com` subdomains are cataloged). A reverse proxy routes PostHog traffic through the app's own domain instead, which blockers haven't cataloged - "This typically increases event capture by 10-30% depending on your user base." Browser extension blockers (uBlock Origin, etc.) only see HTTP requests post-DNS-resolution and rely on domain/URL blocklists; only DNS-level "uncloaking" resolvers (NextDNS, Pi-hole, some custom resolvers) can follow a CNAME chain back to a known analytics target and block anyway - this is a real but narrow gap, not a proxy defeat.

Do NOT use obvious path/subdomain names like `/analytics`, `/tracking`, `/telemetry`, `/posthog`, or `/ph` - blockers specifically target these terms; pick something unique to your app.

### Two proxy options for Vercel: managed vs self-hosted (vercel.json rewrites)

**Managed reverse proxy** (recommended default): free for all PostHog Cloud users, routes through PostHog's own infrastructure (Cloudflare), PostHog handles SSL/routing/maintenance. Setup: create a proxy at Organization > Proxy settings with a neutral subdomain you control (e.g. `yoursubdomain.myapp.com` - avoid `analytics`/`tracking`/`telemetry`/`posthog`/`ph` in the name), add a CNAME record pointing that subdomain at the generated proxy target, disable any DNS-provider-side proxying (e.g. Cloudflare's orange cloud) on that record, wait for status to go waiting -> issuing -> live (2-5 min typically, up to 30 min), then point the SDK at it:

```javascript
posthog.init('<ph_project_token>', {
  api_host: 'https://yoursubdomain.myapp.com', // US
  ui_host: 'https://us.posthog.com',
})
```

Not HIPAA-compliant (routes through Cloudflare as a subprocessor) - do not use for PHI. Traffic through the managed proxy does NOT bill against your own Vercel egress/bandwidth quota since it never touches your Vercel deployment.

**Self-hosted proxy via `vercel.json` rewrites** (this stinger's primary pattern - avoids the managed proxy's Cloudflare dependency, but costs Vercel egress):

```json
{
  "rewrites": [
    { "source": "/yourpath/static/:path(.*)", "destination": "https://us-assets.i.posthog.com/static/:path" },
    { "source": "/yourpath/array/:path(.*)", "destination": "https://us-assets.i.posthog.com/array/:path" },
    { "source": "/yourpath/:path(.*)", "destination": "https://us.i.posthog.com/:path" }
  ]
}
```

(EU: swap `us.i.posthog.com`/`us-assets.i.posthog.com` for `eu.i.posthog.com`/`eu-assets.i.posthog.com`.)

Rule-by-rule purpose: the `static/*` rule proxies the JS SDK bundle and lazy-loaded feature bundles; the `array/*` rule proxies remote config (`/array/{token}/config.js`) specifically because the asset server returns correct `cache-control` headers for it while the main API server strips them (falling through to the catch-all here causes browsers to cache stale SDK config); the catch-all rule handles event capture, feature flags, and session recordings. **Order matters**: Vercel evaluates rewrites top-to-bottom, so the specific `static`/`array` rules MUST precede the catch-all, or the catch-all would intercept them first. The `:path(.*)` named-parameter syntax is required - a bare `(.*)` without the `:path` name does not work as a destination reference.

SDK init after the rewrite is deployed:

```javascript
posthog.init('<ph_project_token>', {
  api_host: '/yourpath', // relative path -> requests go to your own domain
  ui_host: 'https://us.posthog.com', // must stay the real PostHog domain for toolbar/links to work
})
```

### Next.js-on-Vercel alternative and interaction warning

Next.js apps can alternatively configure the same rewrites in `next.config.js` instead of `vercel.json` - functionally identical on Vercel, but **do not configure both simultaneously**, they can conflict; pick one file as the source of truth. If the app has an existing `middleware.ts`/`proxy.ts` (common with `next-intl`, NextAuth, or custom logic) with a catch-all `matcher`, that matcher can intercept and rewrite/redirect the proxy path BEFORE PostHog's rewrite runs, silently breaking event/flag/replay ingestion while static JS assets (which have a file extension and are typically excluded by matchers like `next-intl`'s default) keep loading - making the integration look connected while nothing is actually sending. Fix: add the proxy path to the middleware matcher's negative lookahead, e.g. `matcher: ['/((?!api|yourpath|_next|_vercel|.*\\..*).*)']`.

### Data transfer cost warning (Vercel specifically)

"Proxying routes all PostHog traffic - events, session recordings, feature flag polls, and SDK assets - through Vercel, which bills it as Fast Data Transfer and Edge Requests. Session recordings are the biggest driver (often 1-5 MB per session) and can consume a plan quickly on high-traffic sites." To avoid this cost: use the managed reverse proxy (free, doesn't touch Vercel egress) or a provider without egress fees such as Cloudflare Workers instead of a self-hosted Vercel-rewrite proxy.

### Troubleshooting patterns specific to Vercel

- 404 on the proxy path: verify `vercel.json` is at the project root (same level as `package.json`), is valid JSON, rule order is static -> array -> catch-all, and the config actually deployed (check Vercel dashboard).
- 401 after deploy but working locally: almost always a **region mismatch** - rewrite destinations must match the PostHog project's actual region (`us.i.posthog.com`/`us-assets.i.posthog.com` vs `eu.i.posthog.com`/`eu-assets.i.posthog.com`).
- Conflicting `vercel.json` + `next.config.js` rewrites: remove the PostHog rules from whichever file isn't the chosen source of truth.

### Endpoints that should never be blocked (informational, for anyone building their own blocking logic - also useful negative-space knowledge for debugging "why didn't my proxy work")

Analytics/event endpoints that ad blockers legitimately target: `https://us.i.posthog.com/i/v0/e` / `https://eu.i.posthog.com/i/v0/e`. Endpoints PostHog explicitly says should NOT be blocked because they're required for site functionality beyond pure analytics: `https://us.i.posthog.com/flags` / `https://eu.i.posthog.com/flags` (feature flags) and `https://us-assets.i.posthog.com/static/` / `https://eu-assets.i.posthog.com/static/` (SDK assets).

### No static IPs

PostHog's domains sit behind AWS load balancing with rotating IPs - there is no fixed IP to allowlist directly. For strict firewall/allowlist requirements, either allow outbound HTTPS to `*.posthog.com` (or the specific `us.i.posthog.com`/`us-assets.i.posthog.com` pair, `eu.*` for EU), or deploy a reverse proxy under your own control and allowlist only that proxy's static IP - the recommended approach for strict enterprise firewall policies.
