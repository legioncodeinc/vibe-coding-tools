# Guide 6: Routing Middleware and Firewall (WAF, rate limiting)

Grounded in `references/research/distilled-vercel.md` §7-8, `references/research/raw/vercel--routing-middleware--edge-middleware.md`, `references/research/raw/vercel--firewall--waf-rate-limiting.md`.

## When to walk this guide

Personalizing statically-cached content before it hits cache, adding auth-gate redirects at the edge, or setting up rate limiting / bot-blocking.

## Routing Middleware - not the same thing as SvelteKit hooks

Current official name is **Routing Middleware** (older material calls it "Edge Middleware"). It runs before the request hits cache or a Vercel Function - this is what makes it useful for personalizing otherwise-static content. It is a **separate primitive from SvelteKit's own `hooks.server.ts` `handle` function**. Don't conflate them:

- `hooks.server.ts` - runs inside the SvelteKit server function itself, framework-level, always available, no separate Vercel feature to enable.
- `middleware.ts` (Vercel Routing Middleware) - runs earlier, before cache, requires the "Routing Middleware" permission on the account, and is a Vercel-specific opt-in.

```ts
// middleware.ts (project root)
export const config = {
  runtime: 'nodejs', // optional, defaults to 'edge' for this specific feature
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

export default function middleware(request: Request) {
  const url = new URL(request.url);
  if (url.pathname === '/old-blog') {
    return new Response(null, { status: 302, headers: { Location: '/blog' } });
  }
  return new Response('ok');
}
```

Note the runtime asymmetry: general Vercel Functions now steer toward Node.js (Guide 1), but Routing Middleware's **default remains Edge** - this is a real, current difference between the two features, not an inconsistency to "fix." Set `runtime: 'nodejs'` explicitly in the middleware config if Node-only APIs are needed inside middleware.

## Firewall: WAF custom rules

Dashboard-configured (natural language or step-by-step), take effect immediately on Publish, no redeploy. Useful default rules for this stack: block requests to `.env`/`.git`/`.bak` paths, rate-limit `/auth/login`, deny non-GET/HEAD on public read-only API routes.

## Rate limiting - dashboard path

Fixed Window (all plans) or Token Bucket (Enterprise only). Counters are **per-region** - a limit meant to be global needs the counting key and window sized with that in mind, since traffic split across regions can each independently reach the configured limit.

## Rate limiting - code path (`@vercel/firewall`)

```ts
import { checkRateLimit } from '@vercel/firewall';

export async function POST(request: Request) {
  const { rateLimited } = await checkRateLimit('update-object', { request });
  if (rateLimited) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  // continue
}
```

Requires a dashboard-created Rate Limit ID (`update-object` above) first. Default bucket key is client IP. Passing a custom `rateLimitKey` **replaces** IP bucketing - it does not add to it. If per-caller separation is still wanted, compose the IP into the custom key yourself. A constant `rateLimitKey` string turns the rule effectively global - this is called out explicitly in Vercel's own docs as a mistake to avoid.

## Common mistakes

- Assuming `hooks.server.ts` and Vercel Routing Middleware are the same layer.
- Setting up rate limiting via `@vercel/firewall` without first creating the dashboard Rate Limit ID it references.
- Passing a `rateLimitKey` that accidentally collapses all callers into one bucket.
