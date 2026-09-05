# Vercel Routing Middleware (formerly "Edge Middleware"): runtimes, matcher, geo headers

- URL: https://vercel.com/docs/routing-middleware ; https://vercel.com/docs/routing-middleware/getting-started
- Fetched: 2026-08-14
- Source type: Official Vercel docs
- Component: Routing Middleware

## Content

### Naming shift

Vercel's current docs call this feature **"Routing Middleware,"** built on top of Fluid compute - the older "Edge Middleware" name reflects that Edge was originally the only runtime option. It executes **before a request is processed**, globally, before the cache - making it the mechanism for personalizing otherwise-static/cached content.

### Runtime options

Available on **Node.js, Bun, and Edge** runtimes. **Edge remains the default.** To use Node.js, export a `config` object with `runtime: 'nodejs'`. To use Bun, set `bunVersion` in `vercel.json` (Bun requires `runtime: 'nodejs'` too). Pricing follows the Fluid compute model - billed by compute resources actually used, same pricing document as regular Functions.

### File and export shape

```ts
// middleware.ts (project root, same level as package.json)
export const config = {
  runtime: 'nodejs', // optional; omit for edge (default)
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)', // exclude static assets
    // or: '/blog/:path*', '/api/:path*'
  ],
};

export default function middleware(request: Request) {
  const url = new URL(request.url);
  if (url.pathname === '/old-blog') {
    return new Response(null, { status: 302, headers: { Location: '/blog' } });
  }
  return new Response('Middleware processed this request');
}
```

Next.js 16+ renames the export to `proxy.ts` / `export function proxy`; this is Next.js-specific, not a SvelteKit concern - SvelteKit's own `hooks.server.ts` `handle` function is the equivalent request-interception point and is a distinct mechanism from Vercel Routing Middleware (SvelteKit hooks run inside the SvelteKit server function, not as a separate pre-cache Vercel primitive). Do not conflate the two: a SvelteKit app on Vercel gets `hooks.server.ts` for free from the framework, and can additionally opt into `middleware.ts` for the pre-cache/pre-function personalization use case.

### Reference table

| Detail | Value |
|---|---|
| File location | `middleware.ts` in project root |
| Export | `export default function middleware(request: Request)` |
| Config export | `export const config = { matcher: [...] }` |
| Default runtime | `edge` |
| Bun runtime | set `bunVersion` in `vercel.json` + `runtime: 'nodejs'` in config |
| Request object | standard Web `Request` |
| Geo headers | `x-vercel-ip-country`, `x-vercel-ip-country-region`, `x-vercel-ip-city` |
| Path matching | regex, named params, wildcards via `matcher` |

### Permissions

Routing Middleware requires the "Routing Middleware" permission on the account/project - flagged explicitly in the docs as a permissions-gated feature, not universally available to every role.
