# 03. Feature flags and experiments

## Remote vs local evaluation - pick based on where the check happens

| | Remote (default) | Local evaluation |
| --- | --- | --- |
| Where | Any SDK, any environment | Server SDKs only (Node/Ruby/Go/Python/C#/PHP/Java/Rust) - never frontend/mobile/CLI |
| Cost model | One billable request per check | 10 requests per definitions-poll (default every 30s), regardless of how many flags are checked in between |
| Requires | Public project API key | Secret "feature flags secure API key" - server-only, never client-side |
| Latency | Network round trip per check | No round trip once definitions are cached |

[raw/posthog--feature-flags--local-evaluation-bootstrapping.md]

Use local evaluation for any SvelteKit server-side flag check (load functions, server actions, `hooks.server.ts`) that runs on every request - the cost difference at scale is significant, and it removes a network hop from the request path. In edge/Lambda/stateless-PHP environments specifically, the default in-memory local-eval cache re-initializes per request and can inflate cost rather than reduce it - use a shared external cache, or fall back to remote evaluation there [raw/posthog--feature-flags--local-evaluation-bootstrapping.md].

```javascript
const client = new PostHog(token, { host, personalApiKey: secureKey, featureFlagsPollingInterval: 30000 })
const flags = await client.evaluateFlags(distinctId, { personProperties, groups, groupProperties })
flags.getFlag('flag-key')
```

Prefer `evaluateFlags()` over the deprecated `isFeatureEnabled()`/`getFeatureFlag()`/`getFeatureFlagPayload()` methods for new code [raw/posthog--feature-flags--local-evaluation-bootstrapping.md].

## Bootstrapping - solves flicker, not cost

Bootstrapping and local evaluation solve different problems and combine naturally. Bootstrapping seeds the **client** SDK with server-evaluated flag values at `init()` time so first paint is already correct, instead of flashing default content while the client's own `/flags` request is in flight. It exists in JS web, React Native, iOS, Android, Flutter - not `posthog-node`, since Node has no "first paint" to protect [raw/posthog--feature-flags--local-evaluation-bootstrapping.md]. Full server-evaluate-then-bootstrap pattern for SvelteKit: `references/feature-flag-bootstrap.md`.

Read bootstrapped/loaded flags with `?? 'control'`, not `|| false` - `undefined` (not yet loaded) and `false`/`'control'` (a real value) are both falsy, and `??` is the only operator that distinguishes them [raw/posthog--feature-flags--local-evaluation-bootstrapping.md].

## Experiments run on top of flags - no separate instrumentation

An experiment is a feature flag plus a metric (an event you likely already capture, or a data warehouse table). No new SDK, no new package [raw/posthog--experiments--setup-and-code.md].

## The one rule that silently breaks experiment results

Only `getFeatureFlag()`/`useFeatureFlagVariantKey()` (client) or `evaluateFlags().getFlag()` (server) record an exposure event (`$feature_flag_called`). `getAllFlags()`, `getFeatureFlags()`, and payload-only accessors do **not** count as exposure - a user evaluated only through one of those methods is silently excluded from experiment results with no error anywhere [raw/posthog--experiments--setup-and-code.md]. When wiring an experiment in SvelteKit, always reach for the single-flag accessor (`flags.getFlag('experiment-key')` server-side, `posthog.getFeatureFlag('experiment-key')` client-side), never a bulk accessor, at the point where the variant decision is actually made.

## Server-side experiment metrics need flag info on the conversion event

If a conversion event happens server-side (e.g. a checkout completion in a form action), attach the flag evaluation snapshot to that `capture()` call, or PostHog can't attribute the conversion to the flag/variant that produced it:

```javascript
const flags = await client.evaluateFlags(distinctId)
const variant = flags.getFlag('experiment-key')
client.capture({ distinctId, event: 'checkout completed', flags })
```

[raw/posthog--experiments--setup-and-code.md, raw/posthog--feature-flags--local-evaluation-bootstrapping.md]

## Test before opening an experiment to real traffic

Override the underlying flag's release conditions to force a variant for internal testers (match on team email, or a `utm_source` param for logged-out testers) before launch. A bug discovered after real traffic starts invalidates already-collected results - there's no way to retroactively fix already-tainted experiment data [raw/posthog--experiments--setup-and-code.md].

## Group-targeted experiments (B2B)

If the app has group types configured (see `guides/05-group-analytics-and-reverse-proxy.md`), an experiment can be run at the group level instead of the user level, giving every member of a group the same variant - relevant for B2B products where individual-user randomization would create an inconsistent experience within one company/team [raw/posthog--experiments--setup-and-code.md, raw/posthog--group-analytics--b2b-frontend-backend.md].
