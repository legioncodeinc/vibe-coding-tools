# 03. Performance tracing and sampling strategy

## Tracing is opt-in - verify it's actually on

Neither `tracesSampleRate` nor `tracesSampler` is set by default. If neither is configured, **zero transactions are ever sent, silently** - no error, no warning, just an empty Performance dashboard. Confirm one is set in both `hooks.client.ts` and `instrumentation.server.ts` before assuming tracing "should just be working" [raw/sentry--performance--tracing-sampling-strategy.md].

## Two levers, pick based on traffic shape

- **`tracesSampleRate`** (flat float `0`-`1`): every transaction gets that percentage chance, applied uniformly. Simple, but blunt at scale - a low flat rate can under-sample rare-but-important paths while still over-sampling high-frequency low-value ones (health checks, static asset requests).
- **`tracesSampler`** (function): receives `{ name, attributes, parentSampled, parentSampleRate, inheritOrSampleWith }` and returns a `0`-`1` rate per span/transaction, or filters some out entirely (`return 0`). Use once traffic is large enough that a single flat number stops making sense.

```typescript
tracesSampler: ({ name, inheritOrSampleWith }) => {
	if (name.includes('healthcheck')) return 0;      // never
	if (name.includes('/checkout')) return 1;         // always
	if (name.includes('/api/comments')) return 0.01;  // high-volume, low-value
	return inheritOrSampleWith(0.1);                  // otherwise: respect upstream, or 10%
};
```

`inheritOrSampleWith()` (SDK v9+) is the current-preferred way to respect an upstream trace's sampling decision - prefer it over the older `parentSampled`-only check for deterministic sampling and correct downstream metric extrapolation [raw/sentry--performance--tracing-sampling-strategy.md].

## Precedence, if it ever matters for debugging an unexpected rate

`tracesSampler` (if defined) wins over an inherited parent decision, which wins over `tracesSampleRate`. A flat `tracesSampleRate` always inherits the parent's decision when one exists - there's no way to override per-span with just a flat rate [raw/sentry--performance--tracing-sampling-strategy.md].

## What a rate actually means

`tracesSampleRate: 0.1` gives each transaction an independent 10% chance of being kept - probabilistic, not "1 out of every 10 in sequence." If observed accepted/dropped ratios don't match the configured rate, check (in likely order): overall volume assumptions, distributed-tracing precedence (an upstream service may have already decided for the whole trace), and stale client versions still running an old rate [raw/sentry--performance--tracing-sampling-strategy.md].

## Changing a rate requires a redeploy

Both `tracesSampleRate` and `tracesSampler` are static SDK config - there's no live dashboard toggle. For a temporary volume spike, a server-side rate limit or Spike Protection is the right tool instead of scrambling to change and redeploy the SDK rate - see `guides/06-cost-control-and-triage.md`.

## Starting point for this stack

Absent a specific traffic profile, use the sampling-rate decision table (`references/sampling-rate-decision-table.md`) rather than guessing a number. As a floor: `1.0` in development, `0.05`-`0.2` in production depending on traffic volume, with a `tracesSampler` graduation once a flat rate stops fitting reality.

## Keep client and server rates aligned

Mismatched rates between `hooks.client.ts` and `instrumentation.server.ts` risk broken or incomplete distributed traces where one side of a request gets sampled and the other doesn't. If deliberately sampling client and server differently, use `inheritOrSampleWith()` explicitly rather than letting the two sides independently roll dice [raw/sentry--sveltekit-sdk--client-server-hooks.md, raw/sentry--performance--tracing-sampling-strategy.md].

## Cost tension, stated plainly

Server-side Dynamic Sampling further prioritizes what's *retained* after ingestion (spans/transactions only, not errors), and Sentry's own preference is to set `tracesSampleRate` close to `1.0` and let that handle retention. But **billing meters events received, not retained** - a high `tracesSampleRate` still costs at send-time regardless of later server-side thinning. This is a real, unresolved tradeoff in the research, not a single "right" answer - state both sides when advising a specific number rather than picking one silently [raw/sentry--quotas--spike-protection-cost-control.md].

## Next

`04-session-replay-and-pii-scrubbing.md` covers the other major sampled surface - replay - plus the PII posture that needs deciding before either tracing or replay ships to production with any real user data flowing through it.
