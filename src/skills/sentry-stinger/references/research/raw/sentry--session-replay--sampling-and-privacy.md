# Sentry Session Replay: sample rates, session vs buffer mode, and privacy/masking configuration

- URL: https://docs.sentry.io/platforms/javascript/session-replay/ ; https://docs.sentry.io/platforms/javascript/session-replay/configuration/ ; https://docs.sentry.io/platforms/javascript/session-replay/privacy/ ; https://docs.sentry.io/platforms/javascript/session-replay/understanding-sessions/ ; https://sentry.io/quickstart/session-replay/
- Fetched: 2026-08-14
- Source type: Official docs (docs.sentry.io) + official quickstart page (sentry.io)
- Component: Session replay

## Content

### Basic setup

```javascript
Sentry.init({
  dsn: "https://<key>@o<orgId>.ingest.sentry.io/<projectId>",
  replaysSessionSampleRate: 0.1,   // 10% of sessions recorded fully, from the start
  replaysOnErrorSampleRate: 1.0,   // 100% of sessions get a replay if an error occurs
  integrations: [Sentry.replayIntegration()],
});
```

**Testing tip from official docs**: set `replaysSessionSampleRate: 1.0` during development so every session is captured; lower it before production.

### Two sample rate options and what triggers each

| Option | Default | Meaning |
| --- | --- | --- |
| `replaysSessionSampleRate` | `0` | Sample rate for replays that begin recording immediately and last the entire session. `1.0` = all sessions, `0` = none. |
| `replaysOnErrorSampleRate` | `0` | Sample rate for replays recorded when an error happens. Records up to a minute of events *before* the error plus everything after, until session end. `1.0` = every error-containing session gets a replay. |

### Session mode vs. buffer mode

| Configuration | What happens |
| --- | --- |
| `replaysSessionSampleRate > 0` | Starts in **session mode**: continuously records and streams to Sentry in real time. |
| Only `replaysOnErrorSampleRate > 0` | Starts in **buffer mode**: nothing is sent by default; a rolling ~60-second, ~2-5MB in-memory ring buffer is kept. |
| Both rates `0` | Replay is installed but inactive until manually started via `replay.start()` / `replay.startBuffering()`. |

In buffer mode, when an error occurs, `replaysOnErrorSampleRate` is checked; if sampled, the buffered 60 seconds *before* the error plus everything *after* uploads and recording continues normally for the rest of the session. If not sampled, the buffer is discarded and nothing is sent.

Session duration limits: a session ends after **15 minutes of inactivity** or a **maximum duration of 60 minutes**, whichever comes first; a new session then initializes per the same sampling rules.

### Recommended production sample rates by traffic volume (official docs table)

| Traffic volume | Session rate | Error rate |
| --- | --- | --- |
| High (100k+/day) | `0.01` (1%) | `1.0` |
| Medium (10k-100k/day) | `0.1` (10%) | `1.0` |
| Low (under 10k/day) | `0.25` (25%) | `1.0` |

Consistent guidance across the docs: **keep `replaysOnErrorSampleRate` at (or near) `1.0`** regardless of traffic volume - error-triggered replays are described as the highest-debugging-value data and are comparatively cheap because they only fire on an actual error, not on every session.

### Manual control / conditional replay

```javascript
// Init with both sample rates at 0 for full manual control
Sentry.init({
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
  integrations: [Sentry.replayIntegration()],
});

// Later, in code:
replay.start();          // start in session mode regardless of sample rates
replay.startBuffering();  // start in buffer mode regardless of sample rates
```

`start()`/`startBuffering()` are no-ops (with a debug log) if a session is already running. Useful for targeting replay at high-value flows (e.g. checkout) rather than a blanket percentage.

Sample rates can also be adjusted at runtime before adding the integration:

```javascript
async function init(sessionSampleRate, errorSampleRate) {
  const client = Sentry.getClient();
  const options = client.getOptions();
  options.replaysSessionSampleRate = sessionSampleRate;
  options.replaysOnErrorSampleRate = errorSampleRate;
  const replay = Sentry.replayIntegration({ maskAllText: true });
  client.addIntegration(replay);
}
```

### `beforeErrorSampling` - skip replay for specific errors

```javascript
replayIntegration({
  beforeErrorSampling: (event) => {
    // Return false to skip capturing a replay for this error
    return !event.exception?.values?.[0]?.value?.includes("drop me");
  },
});
```

Returning `false` skips the error-sample-rate check entirely for that error (no replay attempt). Returning `true` proceeds to check `replaysOnErrorSampleRate` as normal. This hook **only runs in buffer mode** - session mode records continuously regardless of individual errors.

### Privacy defaults - aggressive by default

By default, the SDK **masks all text content** (each character replaced with `*`) and **blocks all media elements** (`img`, `svg`, `video`, `object`, `picture`, `embed`, `map`, `audio`) client-side, before anything is sent to Sentry's servers.

Official guidance: **before enabling Session Replay in production, verify masking configuration to ensure no sensitive data is captured.** If UI frameworks or system SDKs get updated, re-test - masking issues found should be reported as a GitHub issue, and production deployment should be avoided until resolved.

### Three privacy mechanisms and their CSS-class triggers

| Mechanism | Effect | Default class / attribute |
| --- | --- | --- |
| Masking | Replaces text content, default behavior swaps each character for `*` | `.sentry-mask`, `[data-sentry-mask]` |
| Blocking | Replaces the element with a placeholder of the same dimensions (empty space) | `.sentry-block`, `[data-sentry-block]` |
| Ignoring | Applies only to form inputs; input change events are ignored so replay doesn't show what was typed | `.sentry-ignore`, `[data-sentry-ignore]` |

### `replayIntegration({})` full option table

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `mask` | `string[]` | `['.sentry-mask', '[data-sentry-mask]']` | Additional selectors to mask (in addition to defaults) |
| `maskAllText` | `boolean` | `true` | Mask all text content |
| `maskAllInputs` | `boolean` | `true` | Mask all input values |
| `block` | `string[]` | `['.sentry-block', '[data-sentry-block]']` | Additional selectors to block |
| `blockAllMedia` | `boolean` | `true` | Block all media elements |
| `ignore` | `string[]` | `['.sentry-ignore', '[data-sentry-ignore]']` | Ignore events on matching input fields |
| `maskFn` | `(text: string) => string` | replaces each char with `*` | Custom masking function |
| `unblock` | `string[]` | `[]` | Selectors to exempt from blocking (takes precedence over `blockAllMedia`; does not affect password fields) |
| `unmask` | `string[]` | `[]` | Selectors to exempt from `maskAllText` |

Internal default block list additionally includes `base` elements and same-origin `srcdoc` iframes (`iframe[srcdoc]:not([src])`), because masking cannot run inside `srcdoc` iframe content - they'd otherwise record unmasked. Can be re-enabled with `unblock: ['iframe[srcdoc]']` if the operator understands the tradeoff.

**v8+ behavior change**: `unblock` and `unmask` no longer auto-include default selectors; if upgrading from pre-v8 and depending on the old defaults, explicitly set:

```javascript
Sentry.replayIntegration({
  unblock: [".sentry-unblock", "[data-sentry-unblock]"],
  unmask: [".sentry-unmask", "[data-sentry-unmask]"],
});
```

### Opting out of default masking entirely (static/no-PII sites only)

```javascript
Sentry.replayIntegration({
  // Only safe if the site truly has no sensitive data, or other masking/blocking is already configured
  maskAllText: false,
  blockAllMedia: false,
});
```

### Network request/response body and header capture - opt-in only

By default Replay captures only basic metadata about outgoing fetch/XHR requests (URL, request/response body size, method, status code) - explicitly to limit the chance of collecting PII. Capturing actual headers or bodies requires opting in per-URL via `networkDetailAllowUrls` (SDK >= 7.50.0), so operators can allow only endpoints known to be PII-free. Bodies that do get captured are additionally PII-sanitized server-side (pattern-matching for things like credit card numbers, SSNs, passwords) as a best-effort backstop, not a guarantee.

### Custom scrubbing hook for recording events

`beforeAddRecordingEvent` (SDK >= 7.53.0) lets code modify, scrub, or drop individual recording events (console logs, network requests, response data) before they leave the browser - a lower-level hook than the declarative mask/block/ignore config, for cases those don't cover.

### Relationship to error-context vs product-analytics replay (cross-tool boundary, not from Sentry docs directly - editorial note)

Everything above is Sentry's own session replay, scoped to error/debugging context (masked-by-default, sampled toward error-adjacent sessions). This is a distinct product surface from product-analytics session replay tools (e.g. PostHog Session Recording), which are typically scoped toward product-behavior analysis rather than crash forensics. This skill does not have research on PostHog's replay feature; see `posthog-stinger` if/when it exists for that side of the boundary.
