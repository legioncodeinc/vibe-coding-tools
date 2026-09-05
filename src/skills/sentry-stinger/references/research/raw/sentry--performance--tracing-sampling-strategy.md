# Sentry performance tracing: tracesSampleRate, tracesSampler, precedence, and a practical sampling strategy

- URL: https://docs.sentry.io/platforms/javascript/sampling/ ; https://docs.sentry.io/concepts/key-terms/sample-rates/ ; https://develop.sentry.dev/sdk/telemetry/spans/sampling/ ; https://blog.sentry.io/sampling-strategy-sentry/ ; https://www.sentry.help/en/articles/13965104-how-does-transaction-sampling-work ; https://develop.sentry.dev/sdk/performance
- Fetched: 2026-08-14
- Source type: Official docs (docs.sentry.io, develop.sentry.dev) + official blog (blog.sentry.io, dated 2026-02-02) + official help center
- Component: Performance tracing / sampling

## Content

### Two ways to control transaction/trace volume

1. **`tracesSampleRate`** (uniform static rate): a float `0`-`1`. Every transaction has that flat percentage chance of being sent. Simple, applies equally everywhere.
2. **`tracesSampler`** (function): receives a `samplingContext` object per span/transaction and returns a `0`-`1` rate (or a boolean, `true`==`1`, `false`==`0`). Lets different transactions sample at different rates, or be filtered out entirely (return `0`).

By default, **neither is set** and no transactions are sent - tracing is opt-in, not on-by-default. At least one of the two must be set to enable tracing at all [raw/sentry--sveltekit-sdk--client-server-hooks.md shows `tracesSampleRate: 1.0` as the SvelteKit wizard's own scaffolded default for dev].

### `tracesSampler` signature and example

```typescript
interface SamplingContext {
  name: string;                          // span name
  attributes: SpanAttributes | undefined; // initial span attributes
  parentSampled: boolean | undefined;     // upstream sampling decision, if any
  parentSampleRate: number | undefined;   // upstream sample rate, if any
}

Sentry.init({
  tracesSampler: ({ name, attributes, inheritOrSampleWith }) => {
    if (name.includes("healthcheck")) return 0;       // never sample health checks
    if (name.includes("auth")) return 1;               // always sample auth flows
    if (name.includes("comment")) return 0.01;          // high-volume, low-value: 1%
    return inheritOrSampleWith(0.5);                    // otherwise inherit or fall back to 50%
  },
});
```

`inheritOrSampleWith(fallbackRate)` was introduced in SDK v9; it either inherits the upstream trace's sampling decision (if this span has a parent trace) or falls back to the given rate if there's no parent decision. It is **strongly preferred over the older `parentSampled` pattern** for deterministic sampling and correct metric extrapolation on downstream traces. Historically `tracesSampler` could return only a boolean; that pattern is deprecated in favor of returning a float.

### Precedence rules (when multiple sampling inputs could apply)

1. If `tracesSampler` is defined, its decision wins - it can inherit or override the parent's decision, or compute its own rate. Overriding a parent's decision is discouraged because it breaks distributed traces (a broken trace won't include every service that touched the request).
2. If `tracesSampler` is not defined but a parent sampling decision exists, the parent's decision is used.
3. If neither `tracesSampler` nor a parent decision exists, `tracesSampleRate` is used.
4. An absolute decision passed directly to `startTransaction` (legacy API) overrides everything else, regardless.

If using `tracesSampleRate` (not `tracesSampler`), the sampling decision is **always inherited** by child spans/downstream transactions - there is no per-span override path with a flat rate.

### What "10% sample rate" actually means

`tracesSampleRate: 0.1` does **not** mean "1 out of every 10 transactions, evenly spaced." Each transaction independently gets a 10% chance of being kept - a random/probabilistic process, not a round-robin one. If observed accepted-vs-dropped ratios don't match the configured rate, check (in order of likelihood): overall volume vs. expectations, distributed-tracing decision precedence (an upstream service may have already decided for the whole trace), and stale app versions still running an old `tracesSampleRate` value.

### Sample rate change requires redeploy

Changing `sampleRate` (errors) or `tracesSampleRate`/`tracesSampler` (transactions) requires a full redeploy - these are SDK-level static config, not a dynamic dashboard toggle. For a temporary volume problem, a project-level Sentry rate limit (drops events only above a threshold, doesn't need redeploy) may fit better than changing the SDK sample rate.

### Recommended practical strategy (Sentry's own 2026-02-02 blog post)

```javascript
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  sampleRate: 1.0,                                              // errors: keep all, this is the default
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.05, // traces: 5% in prod
  replaysSessionSampleRate: 0.01,                                // full-session replay: 1%
  replaysOnErrorSampleRate: 1.0,                                 // error-triggered replay: 100%
});
```

Sentry's own framing of the four levers:
- `sampleRate` (errors): almost always left at `1.0` - "if something breaks, we want to know every single time."
- `tracesSampleRate`: primary lever for managing performance-data volume; a uniform cross-section of traffic.
- `replaysSessionSampleRate`: records full sessions from the start; high-fidelity, so a small percentage is usually enough to characterize "the average user."
- `replaysOnErrorSampleRate`: a buffer that only ships data if an error actually occurs, so it's cheap to keep near `1.0`.

For high-traffic production apps, Sentry's own guidance is generally to sample 100% of traces where feasible for full trace completeness, but for very-high-traffic apps to trace strategically instead of blanket-percentage - i.e., prefer `tracesSampler` logic over a single flat `tracesSampleRate` once traffic is large enough that a flat rate either misses rare-but-critical paths or floods common ones.

### `inheritOrSampleWith` for keeping frontend/backend in sync

If the backend already decided to sample a trace, the frontend generally should follow suit to avoid "orphaned spans" (a trace where part is sampled and part isn't). The blog explicitly recommends destructuring `inheritOrSampleWith` in the frontend's `tracesSampler` and calling it to respect the backend's choice, falling back only when there is no upstream decision.

### Sampling and Session Replay - no `replaysSampler` (yet)

Session Replay sampling is controlled only by two static rates (`replaysSessionSampleRate`, `replaysOnErrorSampleRate`) - there is no function-based `replaysSampler` equivalent to `tracesSampler` as of this research. For finer control than static rates allow, the documented workaround is manually starting/stopping replay recording in code via `replay.start()` / `replay.startBuffering()` (see the dedicated session replay raw file), for example only during a checkout flow or a newly-flagged feature.

### Backpressure (advanced, spec-level)

Per the SDK development spec (`develop.sentry.dev/sdk/telemetry/spans/sampling/`): if an SDK supports backpressure handling, the overall configured sampling rate is divided by a `downsamplingFactor` returned by a backpressure monitor - i.e., under sustained system load the SDK can automatically shrink its own effective sample rate further than what's configured. Not confirmed whether the JavaScript/SvelteKit SDK specifically implements backpressure-based downsampling; flagged as a spec-level capability, not verified as shipped in `@sentry/sveltekit`.

### Server-side "dynamic sampling priorities" (org/project-level, not SDK config)

Separately from SDK-level sampling, Sentry's backend applies its own **Dynamic Sampling Priorities** once data volume is high enough - these are toggled per-project in Project Settings > Performance and prioritize retaining spans from low-volume projects and low-volume transaction names so they aren't drowned out by high-volume ones. Sentry's own recommendation: set `tracesSampleRate` as close to `1.0` as feasible and let server-side dynamic sampling handle further prioritization, rather than aggressively hand-tuning the SDK rate down - though this must be balanced against the cost/quota guidance in the dedicated cost-control raw file, which is largely about the SDK-side rate specifically because dynamic sampling still meters based on *received*, not stored, events.
