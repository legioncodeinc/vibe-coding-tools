# Configuration - SvelteKit Docs (CSRF and CSP)

- URL: https://svelte.dev/docs/kit/configuration
- Fetched: 2026-08-14
- Source type: official framework documentation
- Component: SvelteKit application (svelte.config.js, `kit.csrf`, `kit.csp`)

## CSRF configuration

```
csrf?: {
  checkOrigin?: boolean;   // default true, deprecated in favor of trustedOrigins
  trustedOrigins?: string[]; // default []
}
```

- `checkOrigin` (deprecated as of SvelteKit 2.61 in favor of `trustedOrigins: ['*']`): whether to check the incoming `origin` header for `POST`, `PUT`, `PATCH`, or `DELETE` form submissions and verify it matches the server's origin.
- To allow cross-origin `POST`/`PUT`/`PATCH`/`DELETE` requests with `Content-Type` of `application/x-www-form-urlencoded`, `multipart/form-data`, or `text/plain`, you must disable this check - "Be careful!"
- `trustedOrigins`: an array of complete origins (protocol + host) allowed to make cross-origin form submissions, e.g. `['https://payment-gateway.com']`. Only add origins you completely trust; if the array contains `'*'`, ALL origins are trusted (generally not recommended).
- CSRF checks only apply in production, not in local development.
- Known limitation (tracked in sveltejs/kit#15992, opened 2026-06-09): SvelteKit's origin check forbids a request when `request_origin !== url.origin && (!request_origin || !options.csrf_trusted_origins.includes(request_origin))`. The `!request_origin` clause forbids a missing-`Origin` POST regardless of `trustedOrigins` - some privacy-hardened browsers (Tor, Firefox extra-paranoid mode) send no `Origin` header on a top-level form POST, and there is currently no supported way to fully disable this check other than the deprecated `checkOrigin: false`. A maintainer response floated switching the check to `sec-fetch-site: same-origin` instead of comparing `origin` to `url.origin`, as best practice may have moved on since the original design.

## Content Security Policy configuration

```
csp?: {
  mode?: 'hash' | 'nonce' | 'auto';
  directives?: CspDirectives;
  reportOnly?: CspDirectives;
}
```

- CSP protects users against XSS by limiting the places resources can be loaded from, e.g. `directives: { 'script-src': ['self'] }` prevents scripts loading from external sites.
- SvelteKit augments the specified directives with nonces or hashes (depending on `mode`) for any inline styles/scripts it generates itself.
- To add a nonce to scripts/links manually included in `src/app.html`, use the placeholder `%sveltekit.nonce%`.
- When pages are prerendered, the CSP header is added via a `<meta>` tag; in that case `frame-ancestors`, `report-uri`, and `sandbox` directives are ignored (meta-tag CSP cannot carry these).
- `mode: 'auto'` uses nonces for dynamically rendered (SSR) pages and hashes for prerendered pages. Using nonces with prerendered pages is insecure and therefore forbidden by SvelteKit.
- Svelte transitions create inline `<style>` elements - if used, either leave `style-src` unspecified or add `unsafe-inline`.
- For more dynamic CSP requirements, roll your own CSP via the `handle` hook instead of the static config.
- `reportOnly` must be specified together with either `report-uri` or `report-to` (or both) - it emits `Content-Security-Policy-Report-Only` instead of enforcing.
