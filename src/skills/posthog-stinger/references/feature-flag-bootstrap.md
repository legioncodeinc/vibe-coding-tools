# Feature-flag bootstrap example (avoid flicker)

Grounded in [raw/posthog--feature-flags--local-evaluation-bootstrapping.md]. Without bootstrapping, the client SDK's first `/flags` request is in flight during initial render, so a gated feature can flash its default/control state before flipping to the correct variant. Bootstrapping seeds the client with server-evaluated flag values at `init()` time, so first paint is already correct.

## Pattern: evaluate flags server-side, pass into client `bootstrap`

### `src/routes/+layout.server.ts` - evaluate on the server

```typescript
import type { LayoutServerLoad } from './$types'
import { PostHog } from 'posthog-node'
import { env } from '$env/dynamic/private'

export const load: LayoutServerLoad = async ({ locals }) => {
  const distinctId = locals.user?.id ?? locals.anonymousId
  if (!distinctId) return { posthogBootstrap: null }

  const posthog = new PostHog(env.POSTHOG_PROJECT_KEY, {
    host: env.POSTHOG_HOST ?? 'https://us.i.posthog.com',
  })

  const flags = await posthog.evaluateFlags(distinctId, {
    personProperties: locals.user ? { email: locals.user.email } : undefined,
  })
  await posthog.shutdown()

  return {
    posthogBootstrap: {
      distinctID: distinctId,
      isIdentifiedID: Boolean(locals.user),
      featureFlags: flags.all ?? {}, // shape depends on SDK version - see note below
    },
  }
}
```

Note on `flags.all`: the `evaluateFlags()` snapshot object exposes `getFlag()`/`isEnabled()`/`getFlagPayload()` accessors per research; a bulk "all flags as a plain object" accessor was not directly confirmed in the fetched local-evaluation source for the current SDK version - verify the exact snapshot-to-object shape against the installed `posthog-node` version's type definitions before relying on it, and fall back to explicitly listing the specific flag keys the layout needs via `flagKeys` on `evaluateFlags()` if a bulk accessor isn't available [raw/posthog--feature-flags--local-evaluation-bootstrapping.md].

### `src/routes/+layout.js` - pass into client init

```javascript
import posthog from 'posthog-js'
import { browser } from '$app/environment'

export const load = async ({ data }) => {
  if (browser) {
    posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
      api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
      defaults: '2026-05-30',
      bootstrap: data.posthogBootstrap ?? undefined,
    })
  }
  return data
}
```

Bootstrapped flag values are served until the SDK's own first complete `/flags` response arrives, which then fully replaces them - so bootstrap only needs to cover the flags relevant to first paint, not every flag in the project. Only truthy/non-empty flag values are honored as bootstrap seeds; a `false` or empty variant is dropped [raw/posthog--feature-flags--local-evaluation-bootstrapping.md].

## Reading a bootstrapped flag without flicker in a component

```javascript
// Safe default during the brief window before the SDK's first /flags response,
// distinguishing "not yet loaded" (undefined) from "explicitly off" (false)
const variant = posthog.getFeatureFlag('checkout-redesign') ?? 'control'
```

Use `??`, not `||` - `undefined` is falsy but so is a legitimate `false`/`'control'` value; `??` only falls through on `null`/`undefined` [raw/posthog--feature-flags--local-evaluation-bootstrapping.md].

## Local evaluation as a complementary (not alternative) pattern

Bootstrapping solves first-paint flicker; local evaluation (server-side, using the feature flags secure API key) solves per-request latency/cost for flags evaluated repeatedly on the server. The two combine naturally: the same server-side `evaluateFlags()` call used to build the bootstrap payload above can run against local evaluation if `POSTHOG_FEATURE_FLAGS_SECURE_KEY` is configured, avoiding a network round trip on every SSR request [raw/posthog--feature-flags--local-evaluation-bootstrapping.md]:

```typescript
const posthog = new PostHog(env.POSTHOG_PROJECT_KEY, {
  host: env.POSTHOG_HOST,
  personalApiKey: env.POSTHOG_FEATURE_FLAGS_SECURE_KEY, // enables local evaluation
  featureFlagsPollingInterval: 30000,
})
```

Do not use the feature flags secure API key client-side, ever - it is a secret, server-only credential [raw/posthog--feature-flags--local-evaluation-bootstrapping.md].
