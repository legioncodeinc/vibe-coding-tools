# 04. Session replay and PII scrubbing

## Enable replay

```typescript
integrations: [Sentry.replayIntegration()],
replaysSessionSampleRate: 0.1,  // full-session recording, see the decision table for tiering
replaysOnErrorSampleRate: 1.0,  // error-triggered, keep near 1.0 regardless of traffic
```

`replaysSessionSampleRate` starts continuous session-mode recording for a percentage of all sessions. `replaysOnErrorSampleRate` buffers ~60 seconds in memory and only ships that buffer plus the rest of the session if an error actually occurs - cheap, high-value, keep it near `1.0` at any traffic tier [raw/sentry--session-replay--sampling-and-privacy.md]. Full tiering table: `references/sampling-rate-decision-table.md`.

There is no `replaysSampler` function - finer control than the two static rates requires manually calling `replay.start()` / `replay.startBuffering()` around specific flows (e.g. checkout) instead of a blanket percentage [raw/sentry--performance--tracing-sampling-strategy.md].

## Privacy defaults are aggressive - verify, don't assume

Replay masks **all text content** (`maskAllText: true`) and blocks **all media** (`blockAllMedia: true`) by default, client-side, before anything is sent. This is safe-by-default, but official guidance is explicit: **verify masking configuration before any production enablement, and re-test after UI framework or system SDK upgrades** - default masking can miss content after a framework update changes how content renders to the DOM [raw/sentry--session-replay--sampling-and-privacy.md].

Three CSS-driven mechanisms, in addition to the blanket defaults:

| Mechanism | Effect | Default trigger |
| --- | --- | --- |
| Masking | Text -> `*` | `.sentry-mask`, `[data-sentry-mask]` |
| Blocking | Element -> empty placeholder, same dimensions | `.sentry-block`, `[data-sentry-block]` |
| Ignoring | Form input change events suppressed | `.sentry-ignore`, `[data-sentry-ignore]` |

Never disable `maskAllText`/`blockAllMedia` unless the app genuinely has no sensitive UI content, or other masking/blocking is already fully configured to cover what those defaults would have caught [raw/sentry--session-replay--sampling-and-privacy.md].

## Network body/header capture is opt-in for a reason

Replay captures only URL/method/status/size by default for fetch/XHR - not headers or bodies. Capturing those requires explicit opt-in via `networkDetailAllowUrls`, scoped to endpoints known to be PII-free. Don't opt in broadly "to see more debugging detail" without auditing what those specific endpoints return [raw/sentry--session-replay--sampling-and-privacy.md].

## `beforeSend` scrubbing - applies beyond replay too

The same `beforeSend`/`beforeSendTransaction`/`beforeSendSpan`/`beforeSendLog`/`beforeSendMetric` hook family covers errors, transactions, spans, logs, and metrics - not just replay. Full pattern with the audit checklist (stack-locals, breadcrumbs, user context, unparameterized transaction names, HTTP span query strings): `references/before-send-pii-scrubbing.md`.

Key principle: **prefer not sending PII over scrubbing it after the fact.** Hash sensitive tag values before calling `setTag`; identify users by internal ID (`Sentry.setUser({ id: user.id })`) rather than email. `beforeSend` is a backstop for what automatic instrumentation picks up, not the primary control for data explicitly attached in application code [raw/sentry--data-scrubbing--beforesend-pii.md].

## Server-side scrubbing as a second, faster-to-change layer

SDK-side scrubbing (`beforeSend`, replay masking config) requires a redeploy to change. Sentry's UI also supports server-side data scrubbing (`Settings > Security & Privacy > Data Scrubber`), which prevents storage of matched patterns immediately, without a redeploy - useful as a fast-response tool if a leak is discovered in production before a code fix can ship, not a replacement for getting the SDK-side config right up front [raw/sentry--data-scrubbing--beforesend-pii.md].

## Boundary with product-analytics replay tools

Sentry's session replay is scoped to error/debugging context - masked by default, weighted toward error-adjacent sessions, meant for root-causing a specific bug. This is a distinct product surface from product-analytics session replay (e.g. PostHog Session Recording), which is typically scoped toward broader product-behavior analysis. If this repo has (or gains) a `posthog-stinger`, that skill is authoritative for product-behavior replay; this skill is authoritative for error-context replay. No research on PostHog's replay feature exists in this skill's archive - do not claim comparative specifics about it here.

## Escalate, don't decide unilaterally

Any policy question about what counts as sensitive for this specific app, beyond the generic PII categories covered here, belongs to `security-worker-bee` - see `guides/05-alerting-without-noise.md`'s escalation note and the skill's Critical Directive sibling links.

## Next

`05-alerting-without-noise.md` - once errors and replays are flowing cleanly, the next failure mode is alert fatigue drowning out the signal.
