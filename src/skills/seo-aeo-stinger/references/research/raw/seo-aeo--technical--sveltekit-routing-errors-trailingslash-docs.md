# SvelteKit Docs: Advanced routing, Routing (+error.svelte), trailingSlash tutorial, Errors, redirects

- URL: https://svelte.dev/docs/kit/advanced-routing ; https://svelte.dev/docs/kit/routing ; https://svelte.dev/tutorial/kit/trailingslash ; https://svelte.dev/docs/kit/errors ; https://svelte.dev/tutorial/kit/redirects ; https://svelte.dev/docs/kit/@sveltejs-kit
- Fetched: 2026-08-14
- Source type: official-docs
- Component: technical

## Notes

### 404 handling

Rest parameters (`[...path]`) allow rendering a custom 404 for an entire subtree. Given routes without a catch-all, a nested `+error.svelte` under an unmatched path segment will NOT render, because no route matched at all -- only the root `+error.svelte` renders in that case. To get a scoped 404, add a `[...path]` catch-all route under the subtree and explicitly `error(404, ...)` from its load function/handler:

```
src/routes/
├ marx-brothers/
| ├ [...path]/     <- catch-all so a scoped +error.svelte can render
│ ├ chico/
│ ├ harpo/
│ ├ groucho/
│ └ +error.svelte
└ +error.svelte
```

```ts
import { error } from '@sveltejs/kit';
// inside a load function under the catch-all route:
error(404, 'Not Found');
```

`error()` throws an exception SvelteKit catches, setting the response status and rendering the nearest `+error.svelte`. Do not catch this thrown error yourself, or SvelteKit cannot handle it.

Route matching priority: more specific routes rank above less specific; matcher-typed params (`[name=type]`) outrank untyped params; `[[optional]]` and `[...rest]` are treated as lowest priority unless they are the final path segment.

### +error.svelte resolution

SvelteKit walks up the route tree looking for the closest `+error.svelte` boundary. If an error occurs inside a `load` function in `+layout(.server).js`, the closest boundary is an `+error.svelte` file ABOVE that layout, not beside it. If no boundary is found anywhere (including if the error originates in the root `+layout`'s load), SvelteKit falls back to a static `src/error.html` file. `+error.svelte` is not used for errors inside `handle` or a `+server.js` request handler -- those get a JSON or fallback-HTML response depending on the `Accept` header.

An experimental `handleRenderingErrors` config flag (SvelteKit 2.54+ / Svelte 5.53+) extends error-boundary coverage to rendering-time errors (not just load-function errors), wrapping route components in a boundary at each level with an `+error.svelte`, including on the server.

### trailingSlash

By default SvelteKit strips trailing slashes -- a request for `/foo/` redirects to `/foo`. Search engines and browsers treat `/foo` and `/foo/` (and relative links like `./bar` under each) as different URLs, so being inconsistent creates duplicate-URL problems. Default value: `'never'`. To force trailing slashes: `export const trailingSlash = 'always';`. `'ignore'` (both accepted, not recommended) is also available. This is set per-route or per-`+layout`, and it affects prerendered output paths: `'always'` writes `/always/index.html`; `'never'` writes `/never.html`.

Known edge-case bug (GitHub issue #13516, fixed by later PRs #15265/#15358): if `trailingSlash = 'always'` is configured at a layer BELOW where the nearest `+error.svelte` boundary sits, an HTTP error thrown during client-side load/hydration can cause the client to strip the trailing slash incorrectly, in some setups causing an infinite redirect loop. Mitigation confirmed in the thread: define `trailingSlash` at or above the layer containing the `+error.svelte`, or set it in the root layout if no `+error.svelte` exists in the app.

### Redirects

```ts
import { redirect } from '@sveltejs/kit';
export function load() {
	redirect(307, '/b');
}
```

`redirect()` can be called inside `load` functions, form actions, API routes, and the `handle` hook; like `error()`, it throws, so code after it never runs.

Status codes (from `@sveltejs/kit` type signature, valid range 300-308): `303 See Other` for redirecting after a successful form POST (redirect as GET); `307 Temporary Redirect` keeps the request method; `308 Permanent Redirect` keeps the request method AND transfers SEO value to the new page -- this is the correct status for canonical URL migrations (equivalent to a classic 301 for SEO purposes, since 301 historically allowed method-changing on redirect while 308 does not).

Client-side nuance (GitHub issue #15227): when `redirect()` is called inside a universal `load` function that runs in the browser (e.g. on client-side navigation, not the initial server-rendered request), the status code is not sent as a real HTTP response status -- the client performs an internal navigation equivalent to `goto('...', { replaceState: true })`, and the numeric status argument is largely irrelevant to the browser at that point. This distinction matters for SEO auditing: verify redirect status codes against server-rendered/first-load responses (e.g. via `curl`), not just client-side behavior, since the same `redirect(308, ...)` call can be a true HTTP 308 on first load and an invisible client-side navigation later.
