# Server-side capture pattern (posthog-node in SvelteKit)

Grounded in [raw/posthog--sveltekit--install-client-server-pageviews.md], [raw/posthog--identify--alias-identity-resolution.md]. Package: `posthog-node`.

## `src/lib/server/posthog.ts` - one shared client instance

Create a single module-scoped client instead of instantiating one per request (avoids re-init overhead and keeps the internal event queue/batching intact across requests):

```typescript
import { PostHog } from 'posthog-node'
import { env } from '$env/dynamic/private'

export const posthogServer = new PostHog(env.POSTHOG_PROJECT_KEY, {
  host: env.POSTHOG_HOST ?? 'https://us.i.posthog.com',
  // Vercel Functions are short-lived - flush aggressively rather than batching
  flushAt: 1,
  flushInterval: 0,
})
```

`flushAt: 1, flushInterval: 0` is required in serverless/edge environments (Vercel Functions) - the default batching (`flushAt: 20`, `flushInterval: 10000`) assumes a long-lived process, and a serverless function can exit before a batch fills or the interval elapses, silently dropping queued events [raw/posthog--sveltekit--install-client-server-pageviews.md].

## Capturing from a server action or `+page.server.ts` load function

```typescript
// src/routes/checkout/+page.server.ts
import type { Actions } from './$types'
import { posthogServer } from '$lib/server/posthog'

export const actions: Actions = {
  default: async ({ locals, request }) => {
    const formData = await request.formData()
    // ... process checkout ...

    posthogServer.capture({
      distinctId: locals.user.id, // must match the frontend's identify() distinct_id
      event: 'checkout completed',
      properties: {
        order_id: '#0054',
        subtotal: 3599,
      },
    })

    return { success: true }
  },
}
```

The `distinctId` here must be the same stable ID passed to `posthog.identify()` on the client, or backend and frontend events for the same user split into two unlinked person profiles [raw/posthog--identify--alias-identity-resolution.md].

## Flushing at the end of the request

Because `hooks.server.ts` middleware runs for the lifetime of a request but the underlying serverless function can terminate immediately after the response is sent, explicitly flush (or shut down) queued events before returning, rather than relying on a background flush interval that may never fire:

```typescript
// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit'
import { posthogServer } from '$lib/server/posthog'

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event)
  // With flushAt: 1 this is largely redundant per-capture, but flush() is
  // cheap insurance against any buffered event at the moment the function exits.
  await posthogServer.flush()
  return response
}
```

For a long-running server (not Vercel serverless - e.g. a persistent Node process), call `await posthogServer.shutdown()` once at process termination instead of flushing per-request.

## Linking frontend session/distinct ID to backend events (tracing headers pattern)

Client-side, opt specific backend hostnames into tracing headers:

```javascript
posthog.init(token, {
  api_host,
  tracing_headers: ['api.example.com'], // hostname only, no protocol/port
})
```

This adds `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` to matching `fetch`/`XMLHttpRequest` calls made to that host [raw/posthog--sveltekit--install-client-server-pageviews.md]. `posthog-node`'s Express middleware (`setupExpressRequestContext`) reads these headers automatically, but no dedicated SvelteKit equivalent was found in research - the pattern below reads the headers manually in `hooks.server.ts` and is an inferred adaptation, not a directly-documented SvelteKit snippet [raw/posthog--sveltekit--install-client-server-pageviews.md]:

```typescript
// src/hooks.server.ts
export const handle: Handle = async ({ event, resolve }) => {
  event.locals.posthogDistinctId = event.request.headers.get('x-posthog-distinct-id') ?? undefined
  event.locals.posthogSessionId = event.request.headers.get('x-posthog-session-id') ?? undefined
  return resolve(event)
}
```

Then pass `event.locals.posthogDistinctId` explicitly into any `posthogServer.capture()` call made downstream in that request, falling back to an authenticated user ID when available - never trust the header alone for security-sensitive branching, since it's client-controlled analytics context, not authentication [raw/posthog--sveltekit--install-client-server-pageviews.md].

## Group analytics from the server (no session, explicit on every call)

Backend SDKs have no session concept - group association must be passed on every relevant `capture()` call, not set once like the frontend `posthog.group()` [raw/posthog--group-analytics--b2b-frontend-backend.md]:

```typescript
posthogServer.groupIdentify({
  distinctId: locals.user.id,
  groupType: 'company',
  groupKey: locals.organization.id,
})

posthogServer.capture({
  distinctId: locals.user.id,
  event: 'invoice_paid',
  groups: { company: locals.organization.id },
})
```
