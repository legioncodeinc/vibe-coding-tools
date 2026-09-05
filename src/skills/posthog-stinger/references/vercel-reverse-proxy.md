# Vercel reverse proxy config (rewrites)

Grounded in [raw/posthog--reverse-proxy--vercel-and-managed.md]. Two options exist - pick one.

## Option A: managed reverse proxy (recommended default)

Free for PostHog Cloud users, PostHog-hosted (routes through Cloudflare), does not count against Vercel's own egress/Fast Data Transfer billing, SSL/DNS handled for you. Setup happens in the PostHog dashboard (Organization > Proxy settings), not in this repo - create a proxy with a neutral subdomain (never containing `analytics`, `tracking`, `telemetry`, `posthog`, or `ph` - ad blockers specifically target those terms), add the generated CNAME record at your DNS provider, disable any DNS-provider-side proxying (e.g. Cloudflare's orange cloud) on that record [raw/posthog--reverse-proxy--vercel-and-managed.md].

```javascript
// posthog.init once the managed proxy is live
posthog.init(token, {
  api_host: 'https://yoursubdomain.myapp.com', // US - your proxy subdomain
  ui_host: 'https://us.posthog.com', // always the real PostHog domain, for toolbar/links
})
```

Not HIPAA-compliant (Cloudflare is a subprocessor) - do not use for PHI [raw/posthog--reverse-proxy--vercel-and-managed.md].

## Option B: self-hosted via `vercel.json` rewrites

Use when the managed proxy's Cloudflare dependency is unacceptable, or self-hosting is otherwise required. Costs Vercel egress (Fast Data Transfer/Edge Requests) - session recordings are the dominant driver of that cost (often 1-5 MB/session) [raw/posthog--reverse-proxy--vercel-and-managed.md].

### `vercel.json` (project root, same level as `package.json`)

**US region:**

```json
{
  "rewrites": [
    { "source": "/ingest/static/:path(.*)", "destination": "https://us-assets.i.posthog.com/static/:path" },
    { "source": "/ingest/array/:path(.*)", "destination": "https://us-assets.i.posthog.com/array/:path" },
    { "source": "/ingest/:path(.*)", "destination": "https://us.i.posthog.com/:path" }
  ]
}
```

**EU region:**

```json
{
  "rewrites": [
    { "source": "/ingest/static/:path(.*)", "destination": "https://eu-assets.i.posthog.com/static/:path" },
    { "source": "/ingest/array/:path(.*)", "destination": "https://eu-assets.i.posthog.com/array/:path" },
    { "source": "/ingest/:path(.*)", "destination": "https://eu.i.posthog.com/:path" }
  ]
}
```

`/ingest` is a placeholder path - swap for anything unique to your app, never an obvious analytics-sounding name [raw/posthog--reverse-proxy--vercel-and-managed.md].

**Order is not cosmetic**: Vercel evaluates rewrites top-to-bottom. The `static` and `array` rules must precede the catch-all, or the catch-all intercepts those requests first. The `array` rule specifically exists because PostHog's asset server returns correct `cache-control` headers for remote config (`/array/{token}/config.js`) while the main API strips them - skipping this rule causes browsers to cache stale SDK config [raw/posthog--reverse-proxy--vercel-and-managed.md]. Always use the named-parameter syntax `:path(.*)` in both source and destination - a bare `(.*)` without the `:path` name does not work.

### SDK init to match the proxy

```javascript
posthog.init(token, {
  api_host: '/ingest', // relative path - routes through your own domain
  ui_host: 'https://us.posthog.com', // real PostHog domain - EU: https://eu.posthog.com
})
```

### Next.js-on-Vercel note (if this SvelteKit app sits behind other Next.js infra, or for reference)

Next.js apps can put the same rewrites in `next.config.js` instead - functionally identical on Vercel, but never configure both files at once, they can conflict. Not applicable to a pure SvelteKit app, included here because it's the only middleware-interaction case PostHog has documented; SvelteKit's own `hooks.server.ts` `handle` hook interaction with `vercel.json` rewrites specifically was not confirmed in research - treat as likely low-risk since SvelteKit hooks run after the Vercel rewrite layer, but verify empirically after deploying [raw/posthog--reverse-proxy--vercel-and-managed.md].

### Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| 404 on proxy path | `vercel.json` missing/misplaced, invalid JSON, wrong rule order | Verify project root, valid JSON, static -> array -> catch-all order |
| 401 after deploy (works locally) | Region mismatch between rewrite destinations and the PostHog project's actual region | Match `us`/`eu` consistently across `api_host`, `ui_host`, and rewrite destinations |
| Events stop mid-deploy | Conflicting `vercel.json` + `next.config.js` rewrites | Keep PostHog rewrites in exactly one file |

[raw/posthog--reverse-proxy--vercel-and-managed.md]
