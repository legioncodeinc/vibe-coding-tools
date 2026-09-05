# Sentry handled vs. unhandled exceptions: the exception mechanism, capture semantics, and common confusions

- URL: https://develop.sentry.dev/sdk/telemetry/errors/ ; https://www.sentry.help/en/articles/13964197-how-to-determine-if-an-unhandled-error-in-sentry-actually-caused-a-crash ; https://www.sentry.help/en/articles/13965242-handled-exceptions-from-openai-are-still-being-captured-and-reported-in-sentry ; https://docs.sentry.io/product/errors/ ; https://docs.sentry.io/guides/issues-errors/ ; https://forum.sentry.io/t/what-does-handled-mean/7385
- Fetched: 2026-08-14
- Source type: Official SDK development spec (develop.sentry.dev) + official help center + official docs + community forum (Sentry-staff-answered, dated 2019, included only for the plain-language clarification it provides, not as a primary source of current behavior)
- Component: Error/exception semantics

## Content

### Core definitions (from the authoritative SDK spec, `develop.sentry.dev/sdk/telemetry/errors/`, version 1.8.1)

- **Error event**: an event containing one or more exceptions in an `exception` attribute.
- **Exception mechanism**: metadata on each exception describing *how* it was captured - by SDK instrumentation or by user code - and whether it was handled.
- **Handled**: the user caught the exception, e.g. via `try...catch`.
- **Unhandled**: exceptions caught by global error handlers or crash reporters instead of user code.
- **Chained exceptions**: multiple exceptions representing a cause chain, ordered oldest-to-newest.
- **Exception groups**: a tree of related exceptions (e.g. `AggregateException`, Python `ExceptionGroup`) flattened with `exception_id`/`parent_id` references.
- **In-app frames**: stack frames identified as belonging to the user's own application code, as opposed to library/framework code - SDKs must support identifying these, generally via a configurable package/module prefix.

### Mechanism attribute: `handled`

`handled` is an **optional boolean** on the exception mechanism object, indicating whether the user explicitly handled the exception (e.g. via `try...catch`). `type` (a string identifying the capturing mechanism) is the only **required** mechanism attribute.

### The rule that actually determines "handled" vs "unhandled" in practice (community/staff clarification, and confirmed by the help-center OpenAI-integration article)

An exception is marked **handled: true** only when it is explicitly captured by user code calling `captureException`/`captureMessage` directly, or via one of Sentry's own instrumentation integrations that specifically marks something as handled (e.g. XHR, History, EventEmitter API instrumentation in older SDK generations, per the 2019 forum answer). If an exception **bubbles up to a global/uncaught handler**, it is unhandled - full stop, regardless of whether some *later* code up the call stack would have caught and handled it if execution had continued normally.

### Important nuance: integration-captured exceptions are always reported as "unhandled," even if your own code later handles them

From the official OpenAI-integration help-center article: exceptions captured automatically by a Sentry *integration* (not by explicit user `captureException` calls) are **always** reported as unhandled - "because when the exception is captured in the integration, it is impossible to know whether any code up the call stack will handle it." Sentry's own explanation: there is no technical way for the SDK to know in advance whether a caught-later exception will actually get handled further up, so labeling every integration-captured exception "unhandled" is the only consistent policy, even though it can look surprising ("why is Sentry calling this unhandled when my code clearly wraps it in try/catch downstream?").

**Practical fix if this mislabeling matters for alerting/triage**: use a `before_send` (or `beforeSend` in JS) callback to detect these cases and either drop the event or explicitly rewrite `handled = True`/`true` on the mechanism before it's sent - this is stated as the only supported remediation; further SDK-level improvement is described as "not technically possible."

### Unhandled != crashed

From the help-center troubleshooting article: **an unhandled error does not always mean the application actually crashed.** "Unhandled" means the exception escaped a normal try/catch; "crashed" means the process/application actually terminated. Some runtimes/frameworks (Flutter, Unity, Xamarin, .NET MAUI are the named examples - none are directly relevant to this skill's SvelteKit/Node stack, but the general principle transfers) can surface an unhandled error while the process keeps running.

Diagnostic steps given: check `mechanism.handled` (if `false`, it's unhandled - that alone doesn't prove a crash); check event level and mechanism type (a `fatal` level or a native-crash-specific mechanism type is a stronger crash signal, but level behavior is SDK/platform-dependent); for SDKs that support it, `crashed` (hard crash, process ended) is tracked separately from `unhandled` (unhandled error where the runtime prevented process termination) under Release Health.

### Capturing handled exceptions explicitly (current JS-flavored guidance, `docs.sentry.io/guides/issues-errors/`)

Sentry auto-captures unhandled errors without any extra code. For errors your own code already catches and handles, call `captureException` explicitly and attach context at the same time:

```javascript
try {
  await processOrder(order);
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      order_id: order.id,
      payment_method: order.paymentMethod,
    },
    level: "error",
  });
  throw error; // re-throw if the caller still needs to know
}
```

- Levels: `fatal`, `error`, `warning`, `info`, `debug`.
- Tags are searchable - use them for high-cardinality identifiers (order IDs, regions, feature flags) rather than stuffing that data into the error message.
- Every error is automatically trace-connected; clicking the trace ID surfaces the full request trace, not just the isolated stack trace.

### Filtering out known-noise errors

- `ignoreErrors` SDK option: filter by error message/type pattern, applied before send.
- `beforeSend`: filter dynamically with arbitrary logic (see the dedicated PII-scrubbing raw file for the same hook used for scrubbing - it serves both purposes).

### Triage query patterns (from the same guide, useful operationally)

| View | Search query | Look for |
| --- | --- | --- |
| High-volume issues | `is:unresolved` (sort by Events) | high event counts, post-deploy spikes |
| New regressions | `is:unresolved` (sort by Age) | issues that first appeared recently |
| Environment issues | `environment:production` | prod-only config/data problems |
| High user impact | `is:unresolved` (sort by Users) | issues affecting many distinct users |

### Unhandled-fatal-crash search pattern (from `docs.sentry.io/product/errors/`)

To specifically find unhandled fatal errors that may be crashing the app: search `handled:no level:fatal`, with table columns `mechanism`, `platform.name`, `count()` - a documented, reusable saved-search shape rather than something to construct from scratch each time.
