# Server-only modules / $env/static/private - SvelteKit Docs

- URL: https://svelte.dev/docs/kit/server-only-modules ; https://svelte.dev/docs/kit/$env-static-private
- Fetched: 2026-08-14
- Source type: official framework documentation
- Component: SvelteKit environment variable model

## Server-only modules

- SvelteKit prevents accidentally importing sensitive data (env vars containing API keys, etc.) into front-end code via "server-only modules."
- `$env/static/private` and `$env/dynamic/private` can only be imported into modules that themselves only run on the server, such as `hooks.server.js` or `+page.server.js`.
- `$app/server` (server-only filesystem/asset reads) is likewise server-only.
- Any module under `$lib/server/` (or any file/directory named `server`) is illegal to import into browser-reachable code. Example error: "Cannot import $lib/server/secrets.ts into code that runs in the browser, as this could leak sensitive information," shown with the full import chain even if the client code only used a non-secret export from that module - the whole chain is considered unsafe because the secret code could still end up in the shipped JS.
- This protection also covers dynamic imports, including interpolated ones like `await import(`./${foo}.js`)`.
- Illegal-import detection is DISABLED when running tests (`process.env.TEST === 'true'`), because unit test frameworks like Vitest do not distinguish server-only from public-facing code - meaning a test harness will not catch a leak that a real build would.

## $env/static/private, $env/dynamic/public, and the runtime/buildtime x public/private matrix

|  | Runtime | Build time |
|---|---|---|
| Private | `$env/dynamic/private` | `$env/static/private` |
| Public | `$env/dynamic/public` | `$env/static/public` |

- `$env/static/private`: variables injected statically into the bundle at build time, private access only. This module CANNOT be imported into client-side code, and only includes variables that do NOT start with the public prefix (default `PUBLIC_`) and DO start with the private prefix if configured. Importing a non-matching var (e.g. a `PUBLIC_`-prefixed name) throws a build-time error.
- `$env/dynamic/public`: variables defined by the deployment platform at runtime (equivalent to `process.env` filtered to the public prefix on adapter-node). CAN be imported into client-side code. Only variables beginning with the public prefix are included.
- `$env/dynamic/private`: runtime, private access, cannot be imported client-side, does not require the public prefix.
- Static env vars are loaded by Vite from `.env` files and `process.env` at build time and statically injected, enabling dead-code elimination - meaning the actual literal value gets baked into the emitted JS wherever referenced, even in code paths that only run on the server, if that code path is ever pulled into a client-reachable bundle.
- Practical implication for an auditor: a `PUBLIC_`-prefixed variable is a contract that its value WILL ship to every browser. Anything the app treats as secret must never carry that prefix, and must only be imported from a `+page.server.ts`/`+server.ts`/`hooks.server.ts`/`$lib/server/*` file.
