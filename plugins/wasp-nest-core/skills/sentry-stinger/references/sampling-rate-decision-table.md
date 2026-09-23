# Sampling rate decision table: traces, replay, profiles

Grounded in [raw/sentry--performance--tracing-sampling-strategy.md], [raw/sentry--session-replay--sampling-and-privacy.md], [raw/sentry--quotas--spike-protection-cost-control.md]. Profiles sampling was not directly researched for this skill (see gap note at the bottom) - do not present the profiles row below as equally well-grounded as traces/replay.

## Errors

| Setting | Recommended default | Why |
| --- | --- | --- |
| `sampleRate` | `1.0` (the SDK default - usually left unset) | Errors are comparatively low-volume and high-value; Sentry's own guidance is to keep 100% unless a specific project is generating pathological error volume [raw/sentry--performance--tracing-sampling-strategy.md] |

## Traces (`tracesSampleRate` / `tracesSampler`)

| Environment | Starting point | Notes |
| --- | --- | --- |
| Development | `1.0` | Full visibility while building; not billed against production quota if pointed at a separate dev/staging Sentry project |
| Production, low-medium traffic | `0.1`-`0.2` | A reasonable starting cross-section; adjust after observing actual event volume against quota |
| Production, high traffic | `0.05` or lower, or switch to `tracesSampler` | A flat rate at high volume either floods common paths or under-samples rare ones - a sampler function that keeps 100% of auth/checkout-critical spans and 1% of high-frequency low-value spans (e.g. health checks, static asset requests) is the documented pattern [raw/sentry--performance--tracing-sampling-strategy.md] |

Tracing is **opt-in** - if neither `tracesSampleRate` nor `tracesSampler` is set, zero transactions are ever sent, silently. Verify one is actually configured rather than assuming a default applies [raw/sentry--performance--tracing-sampling-strategy.md].

**Keep client and server rates in sync** unless there's a specific reason not to - mismatched rates between `hooks.client.ts` and `instrumentation.server.ts` risk broken/incomplete distributed traces where one side samples a request and the other doesn't [raw/sentry--sveltekit-sdk--client-server-hooks.md]. Use `inheritOrSampleWith()` inside a `tracesSampler` to explicitly respect an upstream decision rather than let the two sides independently roll dice.

Changing either value **requires a redeploy** - it is static SDK config, not a live toggle [raw/sentry--performance--tracing-sampling-strategy.md].

## Session Replay (`replaysSessionSampleRate` / `replaysOnErrorSampleRate`)

| Traffic volume | `replaysSessionSampleRate` | `replaysOnErrorSampleRate` |
| --- | --- | --- |
| High (100k+ sessions/day) | `0.01` (1%) | `1.0` |
| Medium (10k-100k/day) | `0.1` (10%) | `1.0` |
| Low (under 10k/day) | `0.25` (25%) | `1.0` |

Keep `replaysOnErrorSampleRate` at or near `1.0` regardless of tier - it's buffered (near-zero cost unless an error actually fires) and the highest-debugging-value data type in the product [raw/sentry--session-replay--sampling-and-privacy.md]. There is no `replaysSampler` function equivalent to `tracesSampler`; finer control than the two static rates requires manually calling `replay.start()`/`replay.startBuffering()` around specific high-value flows (e.g. checkout) instead of a blanket percentage [raw/sentry--performance--tracing-sampling-strategy.md, raw/sentry--session-replay--sampling-and-privacy.md].

**Spike Protection does not cover Replay events** - a replay-volume spike (e.g. from a traffic surge) is not automatically capped the way error/span/attachment spikes are. Replay volume is controlled only by these sample rates plus reserved/pay-as-you-go quota adjustment [raw/sentry--quotas--spike-protection-cost-control.md].

## Profiles

No dedicated research was archived on Sentry's profiling product's sample-rate configuration for this skill (`profilesSampleRate` and related options were not among the researched topics). **Do not invent a specific recommended number here.** If profiling is needed, treat it as a research gap: confirm current official docs directly before configuring, rather than extrapolating from the traces/replay guidance above - profiling's cost and sampling model may differ meaningfully from both.

## Cost-control cross-check before finalizing any rate

Before locking in production values, cross-reference `references/research/distilled-sentry.md` §9 (cost control) and the raw quotas file: SDK sample rate changes require a redeploy and reduce visibility into true event frequency, while a server-side per-DSN rate limit only kicks in during an actual surge and preserves full visibility under normal load. If the goal is "protect against an unexpected spike" rather than "manage steady-state baseline volume," a rate limit or Spike Protection (errors/spans/attachments only, not replay) may be the more precise tool than lowering a sample rate further [raw/sentry--quotas--spike-protection-cost-control.md].
