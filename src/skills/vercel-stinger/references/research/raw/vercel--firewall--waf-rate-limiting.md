# Vercel Firewall: WAF custom rules, rate limiting (dashboard + @vercel/firewall SDK)

- URL: https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting ; https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting-sdk ; https://vercel.com/docs/vercel-firewall/vercel-waf/custom-rules
- Fetched: 2026-08-14
- Source type: Official Vercel docs
- Component: Vercel Firewall / WAF

## Content

### Custom rules basics

Configured per-project in the dashboard Firewall tab (or natural-language prompt, e.g. "Rate limit /api to 100 requests per minute per IP"). Rule actions: Log, Deny, Challenge, Bypass, or Rate Limit. Changes take effect immediately on Publish - **no redeploy required**. Rate limit counters are tracked **per-region**, so traffic matching the same key across multiple regions can collectively exceed a single-region limit.

### Rate limiting via dashboard

1. Firewall → Configure → + New Rule.
2. Add If conditions (all must be true).
3. Then action → Rate Limit.
4. Choose algorithm: **Fixed Window** (all plans) or **Token Bucket** (Enterprise only).
5. Set Time Window (default 60s) and Request Limit (default 100).
6. Choose the counting key(s): IP, JA4 Digest, and on Pro+ also User Agent / arbitrary headers.
7. Then action on breach: default 429, or Log / Deny / Challenge.
8. Review Changes → Publish.

| Resource | Hobby | Pro | Enterprise |
|---|---|---|---|
| Included counting keys | IP, JA4 Digest | IP, JA4 Digest | IP, JA4 Digest, User Agent, arbitrary headers |
| Counting algorithm | Fixed window | Fixed window | Fixed window, Token bucket |
| Counting window | 10s-10min | 10s-10min | 10s-1hr |
| Rules per project | 1 (of 3 total custom firewall rules) | 40 | 1000 |
| Included requests | 1,000,000 allowed | Usage-based | Custom |

### `@vercel/firewall` SDK - code-level rate limiting

For conditions the dashboard UI can't express, or backend-triggered limits:

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

Setup requires first creating a dashboard rule whose If condition is `@vercel/firewall` with a chosen **Rate limit ID** (e.g. `update-object`) that the SDK call references by name.

By default the bucket key is client IP. Pass `rateLimitKey` to bucket on something else (authenticated user ID, org ID) - **this replaces IP bucketing entirely**, not adds to it. To keep IP as part of the bucket, compose it into the custom key yourself. Explicit warning in the docs: combining a dashboard condition with a constant `rateLimitKey` string makes the rule "effectively global" - always include a per-caller value (IP, user ID) in the key when per-caller separation is the goal.

### Custom rules beyond rate limiting

Natural-language rule authoring examples from the docs: block requests where path ends in `.env`/`.git`/`.bak`; challenge requests with `curl`/`wget` user agents; deny all but GET/HEAD on a public API path; log POST requests from outside a continent; combine rate-limit + persistent deny (e.g. 10/min on `/auth/login`, then deny for 15 minutes - brute-force protection pattern).
