# Server Components and the Client Boundary

**Sources:**
- https://nextjs.org/docs/app/getting-started/server-and-client-components
- https://nextjs.org/docs/app/api-reference/directives/use-client
- https://www.builder.io/blog/nextjs-react-server-components

**Retrieved:** 2026-04-24

## Summary

`'use client'` marks a file as the *entry point* to the client bundle. Every file it imports also enters the client bundle. Place it as close to the leaves as possible.

## Key rules

1. **Server Components by default.** Every file is an RSC unless it uses a client feature or is imported from a client file.
2. **Push `'use client'` down the tree, not up.** A page can be an RSC even if it contains a client `<LikeButton />`.
3. **Props crossing the boundary must be serializable.** No functions (except Server Actions), no classes, no Date (gets serialized to string), no Maps.
4. **You can pass Server Components as children to a Client Component.** The SC renders on the server; the result slots in. This is the canonical pattern for wrapping server-rendered content in a client-side layout.
5. **Never import server-only code into a client file.** Use `import 'server-only'` to fail the build if a leak happens. Mirror: `import 'client-only'` for browser-only modules.

## Common failure modes

- **"use client" at the root**: forces the entire app into the client bundle.
- **Passing Date objects through the boundary**: serialized to string, loses type.
- **Secret leakage**: a util that reads `process.env.SECRET` imported into a client file ships the secret to the browser. `server-only` guards against this.

## Server Actions

- A `'use server'` function is a POST endpoint.
- Next.js adds CSRF / Origin-Referer checks automatically for form-action invocations.
- **But you still must implement authn + authz inside the action.** No automatic session check.
- **Always validate input with Zod**: Server Actions are public HTTP endpoints.

## Relevance to this stinger

Spine of `guides/11-server-components.md`. Security caveats are a pointer to `security-worker-bee`. ADR example in `examples/` uses this decision framework.
