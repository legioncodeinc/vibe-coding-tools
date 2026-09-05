# Scrubbing Sensitive Data - Sentry for JavaScript

- URL: https://docs.sentry.io/platforms/javascript/data-management/sensitive-data/
- Fetched: 2026-08-14
- Source type: official vendor documentation (Sentry)
- Component: error/log monitoring PII hygiene

## Content

- Three layers of control are offered: (1) filtering/scrubbing sensitive data WITHIN the SDK before it is ever sent to Sentry (requires a redeploy to change), (2) server-side scrubbing configured in the Sentry UI so Sentry does not STORE data even if received (applies immediately, no redeploy), (3) running a local Relay between the SDK and Sentry so data never leaves the local environment at all.
- SDK-level `beforeSend*` hooks are the primary in-app control, invoked before an event is transmitted: `beforeSend` (errors/messages), `beforeSendSpan` (spans), `beforeSendLog` (logs), `beforeSendMetric` (metrics), `beforeSendTransaction` (transactions, no effect if using streamed-span mode - use `beforeSendSpan` with `withStreamedSpan` instead in that mode).
```javascript
Sentry.init({
  dsn: "...",
  beforeSend(event) {
    if (event.user) delete event.user.email; // don't send user's email address
    return event;
  },
});
```
- Enumerated leak surfaces to check when auditing a Sentry integration: stack-local variable values (some SDKs capture local variables at the point of the exception - can leak arguments/tokens present in scope); breadcrumbs (previously-executed log statements AND, for backend SDKs, recorded database queries - explicit guidance: "Do NOT log PII if using this feature and including log statements as breadcrumbs"); user context (governed by the `sendDefaultPii` option); HTTP context/query strings; transaction names (a raw URL like `/users/1234/details` may not get parameterized to `/users/:userid/details` depending on framework/routing/race conditions, leaking a user ID as if it were a route name); HTTP span attributes (also carry the raw query string/fragment by default).
- Recommended pattern for correlating without exposing: hash sensitive context values (`Sentry.setTag("birthday", checksumOrHash(...))`) or use an internal identifier instead of PII (`Sentry.setUser({ id: user.id })` instead of email/username) when the org's policy treats those fields as confidential.
- Server-side scrubbing (Sentry's ingestion-time PII filter) pattern-matches for known sensitive formats (credit card numbers, social security numbers, passwords) as a best-effort backstop, but this is explicitly a backstop, not the primary control - the documentation frames SDK-level scrubbing as the thing to configure first, since server-side scrubbing only catches data that already matches a known pattern.
