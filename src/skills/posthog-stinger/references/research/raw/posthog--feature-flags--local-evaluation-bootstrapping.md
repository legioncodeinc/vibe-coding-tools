# PostHog feature flags: client/server evaluation, local evaluation, bootstrapping to avoid flicker

- URL: https://posthog.com/docs/feature-flags/local-evaluation ; https://posthog.com/docs/libraries/bootstrapping ; https://posthog.com/docs/libraries/node
- Fetched: 2026-08-14
- Source type: Official docs
- Component: Feature flags / posthog-node / SDK bootstrapping

## Content

### Remote (default) vs local evaluation

Remote evaluation: every flag check sends a request to PostHog's `/flags` endpoint; PostHog resolves flag definitions, person/group properties, and cohort membership server-side and returns the result. Simple, always up to date, but every check is a network round trip and a billable request.

Local evaluation (Node, Ruby, Go, Python, C#/.NET, PHP, Java, Rust SDKs only - NOT for frontend/mobile/CLI apps): the SDK periodically fetches flag *definitions* from `/flags/definitions` in the background (default every 30s in Node, 5 min in Go), and evaluates flags locally using properties **you provide**. No round trip at evaluation time, but you are responsible for supplying every property the flag's release conditions depend on - if a property is missing, the SDK can't evaluate locally and either falls back to a remote request or returns `undefined` (depending on `onlyEvaluateLocally`).

Local evaluation requires the **feature flags secure API key** (a secret, project-specific token from Feature Flags tab of project settings - "Feature Flags Secure API Key" section) - must never be used client-side. Personal API keys still work but are being deprecated for this purpose in favor of the secure key.

Cost note: local evaluation is billed as 10 flag requests per definitions-fetch (not per individual flag check), making it far cheaper than remote evaluation at scale for high-traffic services. Each flag definition carries a `version` the SDK uses to detect changes (bumped on direct flag edits AND on changes to any cohort the flag references, even nested).

Edge/Lambda/stateless-PHP caveat: the default in-memory local-evaluation cache causes performance issues and inflated cost from per-request re-initialization in these environments - use an external shared cache provider, or fall back to remote evaluation.

### Node.js setup for local evaluation

```javascript
const client = new PostHog('<ph_project_token>', {
  host: 'https://us.i.posthog.com',
  personalApiKey: 'your feature flags secure API key',
  featureFlagsPollingInterval: 30000, // ms, default 30000
})
```

### Evaluating flags (current API: evaluateFlags, snapshot pattern)

```javascript
const flags = await client.evaluateFlags('distinct_id_of_the_user', {
  personProperties: { property_name: 'value' },
  groups: { your_group_type: 'your_group_id' },
  groupProperties: { your_group_type: { group_property_name: 'value' } },
  onlyEvaluateLocally: false, // true = never fall back to a remote request, returns undefined instead
})
const flagValue = flags.getFlag('flag-key')       // variant string, true, false, or undefined
const isOn = flags.isEnabled('flag-key')          // boolean convenience
const payload = flags.getFlagPayload('flag-key')  // does NOT send $feature_flag_called, doesn't count as an access
```

Note: `client.isFeatureEnabled()`, `client.getFeatureFlag()`, `client.getFeatureFlagPayload()`, and `capture({ sendFeatureFlags: true })` still work but are deprecated in favor of `evaluateFlags()`.

Trimming requests/payload: pass `flagKeys: [...]` to `evaluateFlags` to scope the underlying `/flags` request to specific flags; use `flags.only([...])` or `flags.onlyAccessed()` (order-dependent - must be called after the `isEnabled()`/`getFlag()` accesses) to control which flags get attached to a subsequent `capture()` call.

### Attaching flag info to captured events (for insight breakdowns)

```javascript
const flags = await client.evaluateFlags('distinct_id_of_your_user')
if (flags.isEnabled('flag-key')) { /* ... */ }
client.capture({
  distinctId: 'distinct_id_of_your_user',
  event: 'event_name',
  flags, // attaches $feature/<key> properties + $active_feature_flags from this exact evaluation
})
```

Sending `$feature_flag_called` (needed for flag-level analytics) happens automatically on `flags.isEnabled()`/`flags.getFlag()` calls, deduplicated per `(distinct_id, flag, value)` in a local cache.

### Overriding evaluation context (GeoIP, person/group properties)

`personProperties`/`groupProperties` passed to `evaluateFlags` override stored values for that evaluation only - useful when evaluating server-side without frontend GeoIP data, or with fresher property values than what's been ingested. Overridable GeoIP keys: `$geoip_country_code`, `$geoip_country_name`, `$geoip_city_name`, `$geoip_city_confidence`, `$geoip_continent_code`, `$geoip_continent_name`, `$geoip_latitude`, `$geoip_longitude`, `$geoip_postal_code`, `$geoip_subdivision_1/2/3_code/name`, `$geoip_time_zone`.

### Cold start problem and fallback defaults

On SDK startup, local evaluation needs up to one polling interval (30s default) to fetch definitions; during that window it returns `undefined`. Use a per-flag default rather than relying on truthiness:

```javascript
// Without a default, undefined is falsy - users silently see nothing
const variant = posthog.getFeatureFlag('checkout-redesign') || false
// With an explicit default, you control the experience during cold start
const variant = posthog.getFeatureFlag('checkout-redesign') ?? 'control'
```

For frequent deploys / many short-lived workers, a shared flag-definition cache eliminates the cold-start window entirely across restarts.

### Bootstrapping (client-side, avoids flicker on first paint)

Bootstrapping seeds the SDK with data the app already knows (server-rendered) at init time, so identity/session/flag state is available on the very first render instead of waiting for the client's first `/flags` round trip. Available in JS web, React Native, iOS, Android, Flutter SDKs (NOT posthog-node - Node has no client-side "first paint" concept; bootstrapping is specifically a client-init-flicker fix).

```javascript
posthog.init('<ph_project_token>', {
  api_host: 'https://us.i.posthog.com',
  defaults: '2026-05-30',
  bootstrap: {
    distinctID: 'distinct_id_of_your_user',
    isIdentifiedID: true,
    sessionID: 'session_id_of_user_session', // JS web SDK only
    featureFlags: { 'flag-key': 'variant-name', 'other-flag': true },
    featureFlagPayloads: { 'flag-key': { some: 'payload' } },
  },
})
```

Lifecycle: bootstrapped flags are served until the SDK's first complete `/flags` response arrives, which then fully replaces them (bootstrapped-only keys do not persist past that first real response). Only *enabled* flags are seeded - a `false` boolean or empty variant string is dropped (matches posthog-js semantics). Values/payloads must be JSON-serializable or they're dropped. Bootstrapped flags are cleared on `reset()`.

**The practical pattern to avoid flicker**: evaluate flags server-side (SvelteKit `load` function, using `posthog-node` and the user's session-derived distinct ID) and pass the resulting flag values into `bootstrap.featureFlags` when the client SDK initializes - this way the very first client render already has the correct flag state instead of a flash of default/control content while the client's own `/flags` request is in flight.

### Identity bootstrap reconciliation rules (JS web, iOS, Android, Flutter)

When `isIdentifiedID: true` is bootstrapped: no persisted identity -> SDK adopts the bootstrapped ID as identified, no `$identify` emitted; a matching persisted anonymous identity -> marked identified silently; a different persisted anonymous identity -> SDK calls `identify()` to link them (emits `$identify`); same persisted identified identity -> no-op; a *different* already-identified persisted identity -> SDK keeps the existing one and warns - call `reset()` before init when intentionally switching users. This follows the app's person-profile settings (`never` mode preserves anonymity instead of merging).

### Use bootstrap vs identify() decision rule

Use `bootstrap` when the signed-in identity is already known before SDK init (e.g. from a server-rendered session). Call `identify()` instead when the identity loads asynchronously after the SDK has already initialized.
