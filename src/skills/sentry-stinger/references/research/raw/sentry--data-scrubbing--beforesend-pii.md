# Sentry PII scrubbing: beforeSend and related hooks, default denylist behavior, and where sensitive data hides

- URL: https://docs.sentry.io/platforms/javascript/data-management/sensitive-data/ ; https://develop.sentry.dev/sdk/foundations/data-scrubbing/ ; https://docs.sentry.io/security-legal-pii/scrubbing/ ; https://docs.sentry.io/platforms/python/data-management/sensitive-data/
- Fetched: 2026-08-14
- Source type: Official docs (docs.sentry.io, develop.sentry.dev)
- Component: PII scrubbing / data privacy

## Content

### Two layers of control

1. **SDK-side filtering/scrubbing** (`beforeSend*` hooks): data is never sent to Sentry in the first place. Different SDKs have different capabilities; changes require redeploying the application.
2. **Server-side scrubbing** (configured in the Sentry UI, `Settings`): Sentry receives the data but does not store it. Applies immediately to new events without a redeploy.
3. A third, less common option: **running a local Relay** between the SDK and Sentry, so data never leaves the operator's own infrastructure while still allowing config changes without redeploying the app.

Recommendation: determine a data policy early, communicate it to the team, and enforce it via code review - not just via SDK config.

### The `beforeSend*` hook family

| Hook | Applies to |
| --- | --- |
| `beforeSend` | error and message events |
| `beforeSendTransaction` | transactions (only in transaction mode; no effect if using span stream mode - use `beforeSendSpan` + `withStreamedSpan` instead in stream mode) |
| `beforeSendSpan` | spans |
| `beforeSendLog` | logs |
| `beforeSendMetric` | metrics |

### Canonical `beforeSend` example

```javascript
Sentry.init({
  dsn: "https://<key>@o<orgId>.ingest.sentry.io/<projectId>",
  beforeSend(event) {
    if (event.user) {
      delete event.user.email; // strip email before it ever leaves the browser/server
    }
    return event;
  },
});
```

Returning the (possibly mutated) `event` sends it; returning `null`/`undefined` drops the event entirely - this is the same hook used both for scrubbing fields and for dropping unwanted events outright.

### Where sensitive data tends to hide (the checklist worth auditing against)

- **Stack-locals**: Python, PHP, and Node SDKs can pick up local variable values within a stack trace. Scrub or disable this behavior entirely if variables may contain secrets.
- **Breadcrumbs**: JavaScript and Java logging integrations pick up previously-executed log statements as breadcrumbs - **do not log PII** if breadcrumb capture is on. Backend SDKs may also record DB queries as breadcrumbs, which can leak query parameter values. Query strings/fragments are often auto-attached to breadcrumbs too.
- **User context**: automatic behavior is controlled by the `dataCollection`/`sendDefaultPii`-family option (see the SvelteKit-specific `dataCollection.userInfo` flag noted in the SvelteKit raw file).
- **HTTP context**: query strings may be captured as part of request context depending on framework.
- **Transaction names**: e.g. `/users/1234/details` where `1234` is a user ID (PII). Sentry's SDKs generally parameterize routes automatically (`/users/:userid/details`), but framework/routing-config/race-condition edge cases can leave raw IDs in transaction names unparameterized.
- **HTTP spans**: query string and fragment are commonly attached as a span data attribute and may need scrubbing.
- **Attributes** (spans/logs/metrics): scrub via the respective `beforeSendSpan`/`beforeSendLog`/`beforeSendMetric` hooks.

### Server-side default denylist behavior (spec-level)

Per the SDK development spec: certain sensitive data must never be sent through automatic instrumentation at all - header/cookie/query values matching a **default denylist** are replaced with `"[Filtered]"` before leaving the SDK. This is distinct from *user-set* data (anything explicitly attached via `setUser`, `setTag`, `setContext`, etc.), which is **always sent as-is** - only automatically-gathered data is auto-scrubbed. `beforeSend`/event processors remain the tool for removing or redacting anything, including user-set data, that the default denylist doesn't cover.

The legacy `send_default_pii` boolean toggle is described (in this spec) as being superseded by a more structured `dataCollection` configuration object, where user-identity collection specifically is controlled by `dataCollection.userInfo` (default `true`), which can be set `false` to opt out - this matches the newer `dataCollection: { userInfo: false, httpBodies: [] }` shape seen directly in the current SvelteKit setup snippet (see the SvelteKit raw file), confirming that shape is current, not legacy.

### Recommended alternatives to sending raw PII

**Hash/checksum sensitive tags instead of sending them raw:**

```javascript
Sentry.setTag("birthday", checksumOrHash("08/12/1990"));
```

Preserves the ability to correlate events on that value internally, without Sentry ever seeing the plaintext.

**Prefer internal IDs over emails for user identification:**

```javascript
Sentry.setUser({ id: user.id });
// or
Sentry.setUser({ username: user.username });
```

Still gets user-impact-related product features (e.g., "N users affected") without sending an email address, if email is considered sensitive under the operator's own policy.

**Logging integrations**: avoid logging confidential information in the first place; for legacy code that already does, either anonymize before logging (swap emails for internal IDs), use `beforeBreadcrumb` to filter values out before they attach, or disable the breadcrumb-logging integration outright.

### Python SDK's `event_scrubber` (cross-platform pattern worth knowing, not JS-specific)

The Python SDK ships an `event_scrubber` config option with a built-in `denylist` (security-shaped values: passwords, auth headers, sessions, cookies, CSRF tokens) that runs automatically, plus a separate `pii_denylist` (PII-shaped values: IP addresses, etc.) that only applies when `send_default_pii` is `False`. Both lists are extensible with custom values, and the scrubber can optionally run `recursive=True` for deeper (but slower) traversal. This is Python-specific API surface, not confirmed to exist identically in the JavaScript/SvelteKit SDK - included here as the shape of a "denylist scrubber" concept that may inform how a custom `beforeSend` scrubbing function should be structured (recursive key/value pattern matching over the whole event) even though the JS SDK doesn't appear to expose a same-named built-in.

### GDPR/legal framing

Sentry's own docs explicitly frame this as a post-GDPR company responsibility: PII (name, email), authentication credentials (API keys, passwords), and confidential IP should all be treated as categories requiring an explicit scrubbing decision, not defaults to rely on blindly.
