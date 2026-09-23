# 04. Session replay and surveys

## Session replay privacy - masking runs client-side, before anything is sent

"Masked data is never sent over the network to PostHog" - this is a genuine client-side redaction, not a promise about server-side handling [raw/posthog--session-replay--privacy-masking-pricing.md]. Defaults:

| Surface | Default | Escape hatch |
| --- | --- | --- |
| `<input>` elements | Masked | `maskAllInputs: false` + `maskInputOptions` to selectively unmask |
| Non-input text | **NOT masked** | `maskTextSelector` (CSS selector, or `"*"` for everything) |
| Arbitrary elements | Not excluded | `.ph-no-capture` class (also disables autocapture on that element) |
| Replay-player URL bar / query strings | Not redacted | `maskCapturedNetworkRequestFn` |

Because non-input text is unmasked by default, any app displaying sensitive data outside form fields (account numbers, PII in a table, chat messages) needs to explicitly opt into masking - do not assume replay is safe out of the box for anything beyond passwords/inputs. For a genuinely sensitive app, PostHog's own "private by default" recommendation is mask-everything (`maskAllInputs: true, maskTextSelector: "*"`) then selectively unmask specific known-safe elements, not the reverse [raw/posthog--session-replay--privacy-masking-pricing.md]. Full config presets: `references/research/raw/posthog--session-replay--privacy-masking-pricing.md`.

Third-party embeds that can't be masked directly (payment forms, hosted auth screens) - manually stop/start the recording around that UI rather than relying on selector-based masking, which can't reach into a cross-origin iframe [raw/posthog--session-replay--privacy-masking-pricing.md].

## Session replay cost - a double cost surface

Web replay: 5,000 recordings/mo free, then $0.0050/recording down to $0.0015/recording at 500k+/mo. Mobile replay is billed separately with its own free tier (2,500/mo) and higher per-recording rates ($0.0100 down to $0.0030) [raw/posthog--session-replay--privacy-masking-pricing.md]. If self-hosting the Vercel reverse proxy (see `guides/05-group-analytics-and-reverse-proxy.md`), session recordings are also separately called out as the dominant driver of Vercel's own egress cost (1-5 MB/session) - replay traffic is billed once by PostHog per recording, and again by Vercel per byte proxied if the app runs its own proxy rather than the managed one [raw/posthog--session-replay--privacy-masking-pricing.md, raw/posthog--reverse-proxy--vercel-and-managed.md].

## When PostHog explicitly says a competitor might be the better call

PostHog's own comparison messaging concedes two legitimate reasons to choose a different session-replay tool: needing self-hosting or stricter data residency, or needing more robust PII redaction than selector-based masking provides. Worth raising explicitly with a user who has a hard compliance requirement rather than defaulting to PostHog's replay without flagging this [raw/posthog--session-replay--privacy-masking-pricing.md].

## Surveys - no separate SDK, same posthog-js install

Four presentation modes: popover (default, PostHog-rendered UI), widget/feedback button, hosted (external URL/iframe), API (fully custom UI, PostHog only handles targeting logic and response capture). Display conditions (URL match, device type, CSS selector, wait period, person/group properties, event trigger, linked feature flag) must ALL match for a survey to show [raw/posthog--surveys--setup-targeting-responses.md].

## The survey-plus-flag timing bug

Any survey whose display conditions depend on a feature flag (targeting by cohort, or a linked flag) needs flag values that load asynchronously after page load. Calling `getActiveMatchingSurveys()` before those flag values arrive can wrongly return an empty list for a user who actually matches, and the callback fires exactly once - there's no automatic re-check once flags land. Always wrap the call in `posthog.onFeatureFlags()`:

```javascript
posthog.onFeatureFlags(() => {
  posthog.getActiveMatchingSurveys((surveys) => {
    // flag values are guaranteed available here
  })
})
```

[raw/posthog--surveys--setup-targeting-responses.md]. The same caveat applies to `displaySurvey(id, { ignoreConditions: false })`.

## Response capture - use ID-based properties

```javascript
posthog.capture('survey sent', {
  $survey_id: survey.id,
  [`$survey_response_${questionUuid}`]: feedback,
})
```

ID-based responses (keyed by each question's UUID) are explicitly recommended over legacy index-based responses, since index-based responses break if questions are ever reordered [raw/posthog--surveys--setup-targeting-responses.md]. Also capture `survey shown` and `survey dismissed` alongside `survey sent` for accurate abandonment/funnel analysis - popover surveys do this automatically, but a custom/API survey implementation has to fire all three explicitly.

## Hosted surveys need manual identity linking

Unlike in-app surveys (which link responses automatically to whatever the SDK's current identity is), a hosted (externally-URL'd) survey has no SDK session context and requires the exact same `distinct_id` used elsewhere in `identify()` passed as a `?distinct_id=` query parameter, or responses land unlinked/anonymous [raw/posthog--surveys--setup-targeting-responses.md].
