# Privacy controls - PostHog Docs (Session Replay)

- URL: https://posthog.com/docs/session-replay/privacy
- Fetched: 2026-08-14
- Source type: official vendor documentation (PostHog)
- Component: product analytics / session replay PII hygiene

## Content

- Masking runs IN THE BROWSER (or mobile app) before data is transmitted: "masked data is never sent over the network to PostHog" - this is a client-side redaction control, not a server-side filter, meaning misconfiguration ships the raw data over the wire regardless of any later server-side policy.
- Input elements are masked BY DEFAULT (`maskAllInputs: true` is the default), because any input is highly likely to carry sensitive text (email, password). Disabling this globally (`maskAllInputs: false`) requires explicitly re-enabling masking per input TYPE via `maskInputOptions` (e.g. keep `password: true` at minimum) - the docs explicitly flag `password: true` as "Highly recommended as a minimum!!" if global masking is turned off.
- `maskInputFn(text, element)` allows granular custom masking logic (e.g. don't mask search-box input, mask everything else) - useful when full input masking would break legitimate product-analytics use cases like capturing non-sensitive search queries.
- General TEXT content (not inputs) is NOT masked by default - must be explicitly enabled via `maskTextSelector: "*"` (mask everything) or a scoped CSS selector (e.g. `.email, #sensitive`) if any user-visible text on the page could contain PII (names, emails rendered in a profile view, etc.). This is an important asymmetry to flag in an audit: an app that only relies on PostHog's INPUT masking defaults, but renders PII as plain text elsewhere on the page (e.g. an account settings page showing the user's email as static text), will still leak that text into session replay by default.
- `ph-no-capture` CSS class fully excludes an element from capture (including autocapture events, not just replay); `ph-no-mask` is the corresponding explicit opt-out for something that should NEVER be masked even under global masking settings.
- URL/query-string redaction is a distinct concern from input/text masking: session replay captures the page URL shown in the browser bar. A `maskCapturedNetworkRequestFn` callback (the same one used for network-request capture) also runs against the captured page URL, so auth tokens or user identifiers embedded in query strings can be redacted with one shared configuration.
- Password inputs are masked unconditionally regardless of other configuration ("Password inputs are always masked no matter your config"), but this protection relies on platform semantics detecting the field as a real password input (e.g. `type="password"`, or `secureTextEntry` on React Native) - a CUSTOM input component that does not use the platform's native password-field primitive under the hood will NOT be auto-detected and must be masked manually.
- Recommended default posture for a new integration ("maximum privacy" preset): `{ maskAllInputs: true, maskTextSelector: "*" }` - mask everything, then selectively unmask only fields explicitly reviewed as safe, rather than starting from "capture everything" and trying to enumerate every sensitive field to exclude.
