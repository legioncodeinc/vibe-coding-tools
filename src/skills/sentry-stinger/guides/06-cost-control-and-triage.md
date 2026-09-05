# 06. Cost control and handled-vs-unhandled triage

## What counts toward quota, and what doesn't

Sentry bills on data volume per category: errors, spans/transactions, replays, attachments, logs, application metrics - each with its own separate quota. Events dropped by Spike Protection, blocked by inbound data filters, excluded by SDK sample rate (never sent), or rejected after quota exhaustion do **not** count toward billed volume [raw/sentry--quotas--spike-protection-cost-control.md].

## Three cost-control levers, and which categories each one actually covers

| Lever | Errors | Spans | Replays | Attachments | Logs | App metrics |
| --- | --- | --- | --- | --- | --- | --- |
| Spike Protection | yes | yes | **no** | yes | no | no |
| Quota adjustment (reserved/PAYG) | yes | yes | yes | yes | yes | yes |
| SDK sample rate | yes | yes | **no** | no | no | no |

**Replay volume is not covered by Spike Protection or the generic SDK-sample-rate lever at all** - it's controlled only by `replaysSessionSampleRate`/`replaysOnErrorSampleRate` plus quota adjustment. A traffic surge that spikes replay volume will not be automatically capped the way an error/span/attachment spike would be [raw/sentry--quotas--spike-protection-cost-control.md].

## Spike Protection - what it is, and its real limits

Establishes a per-project dynamic threshold from baseline usage; once volume crosses it, events get **dropped, not billed**, protecting the rest of the billing period. Recalculates hourly during an active spike; dropped-event contribution decays out of the threshold over ~2 days so a one-off spike doesn't permanently distort future baselines. **Does not apply during trials.** Notifications are off by default - turn them on per key project (email/Slack/PagerDuty) if the team wants to know when it fires, not just silently survive it [raw/sentry--quotas--spike-protection-cost-control.md]. Bursty-by-design projects (cron/task-runner orchestration) may want it disabled for that specific project, since the algorithm can't distinguish "malfunction" from "intentional burst pattern."

## SDK sample rate vs. server-side rate limit - different tools, don't conflate

- **SDK sample rate** (`sampleRate`, `tracesSampleRate`/`tracesSampler`): client/server-side, static, **requires a redeploy to change**, and reduces visibility into true event frequency even under normal load.
- **Server-side rate limit** (per-DSN, configured in Sentry): only drops events once volume is already abnormally high - a ceiling, not a constant filter. Preserves full visibility under normal operation.

Sentry's own framing: for "protect against a surge" needs, a rate limit fits better than lowering the SDK sample rate; use minute-based rate limits over daily/hourly ones, since a minute-based ceiling avoids one random spike exhausting a whole day's or hour's budget and leaving the project blind for the rest of that window [raw/sentry--quotas--spike-protection-cost-control.md].

## Handled vs. unhandled - correct triage keeps alerts meaningful

`handled: true` only when user code explicitly caught the exception (`try...catch` + `captureException`, or SDK instrumentation that specifically marks itself handled). **Anything captured automatically by a Sentry integration is always reported `handled: false`**, even if code further up the stack would have caught it - the SDK has no way to know that in advance [raw/sentry--errors--handled-vs-unhandled.md].

For deliberately-handled application errors that still need visibility, capture explicitly with context rather than relying on auto-capture:

```typescript
try {
	await processOrder(order);
} catch (error) {
	Sentry.captureException(error, {
		tags: { order_id: order.id, payment_method: order.paymentMethod },
		level: 'error'
	});
	throw error;
}
```

[raw/sentry--errors--handled-vs-unhandled.md]

## Unhandled does not mean crashed

An unhandled error escaping try/catch does not necessarily mean the process terminated - some runtimes surface unhandled errors while continuing to run. Check `mechanism.handled` first, then event level/mechanism type for a stronger crash signal, rather than treating "unhandled" alone as "the app went down" [raw/sentry--errors--handled-vs-unhandled.md]. This distinction matters directly for alert severity: a `level:fatal` + `handled:no` combination is meaningfully more urgent than `handled:no` alone.

Saved-search pattern for crash-risk triage: `handled:no level:fatal`, columns `mechanism`, `platform.name`, `count()` [raw/sentry--errors--handled-vs-unhandled.md].

## Filtering out known noise before it costs anything

`ignoreErrors` (message/type pattern match, applied before send) and `beforeSend` (arbitrary drop logic, same hook used for PII scrubbing - see `references/before-send-pii-scrubbing.md`) both prevent an event from ever counting toward quota, not just from displaying. Use these for confirmed non-actionable noise (e.g. browser-extension errors, known benign `ResizeObserver` warnings) rather than filtering them out only at the alert-rule layer, which still costs quota even if it doesn't page anyone [raw/sentry--errors--handled-vs-unhandled.md, raw/sentry--data-scrubbing--beforesend-pii.md].

## This is the last guide in the sequence

At this point: SDK is wired (guide 01), source maps and releases upload on deploy (guide 02), sampling rates are deliberate rather than default (guide 03), replay and PII posture are set (guide 04), alerts are tuned to avoid fatigue (guide 05), and cost/triage levers are understood (this guide). Run the Ship Gate before calling any of this shippable - see `SKILL.md`.
