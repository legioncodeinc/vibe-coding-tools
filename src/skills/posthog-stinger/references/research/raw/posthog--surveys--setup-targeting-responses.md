# PostHog surveys: setup, targeting, display conditions, and capturing responses

- URL: https://posthog.com/docs/surveys/start-here ; https://posthog.com/docs/surveys/creating-surveys ; https://posthog.com/docs/surveys/implementing-custom-surveys
- Fetched: 2026-08-14
- Source type: Official docs
- Component: Surveys

## Content

### Surveys are rendered by the SDK already installed

No separate survey package - surveys render through the same `posthog-js` install used for product analytics. Web has the most complete feature support; mobile platforms have limitations (check SDK feature-support matrix before planning a mobile-specific survey).

### Presentation types

1. **Popover** (default) - PostHog's prebuilt UI, shown as a bottom-corner popup.
2. **Widget** - always-available feedback button or custom selector-triggered.
3. **Hosted form** - shareable external URL (email/social/QR code), can be embedded in an iframe.
4. **API** - fully custom/headless UI, PostHog only handles display-condition logic and response capture.

Popover, widget/feedback-button, and API surveys are all "in-app" (rendered by the SDK inside the product). Hosted surveys are external URLs served by PostHog itself.

### Creating a survey

Built in the PostHog web app: start from a template (NPS, product-market fit, churn, open feedback) or PostHog AI natural-language generation, or the full editor. Question types (available for both popover and API modes): freeform text, link/notification, rating (emoji or numeric), single choice, multiple choice. Conditional/branching questions are supported (e.g. route detractors vs promoters down different paths).

### Display (targeting) conditions - ALL must match

- **Linked feature flag** - show only to users with a specific flag enabled (also a way to target non-behavioral cohorts).
- **URL targeting** - contains / exact match / regex against `window.location.href` (exact match strips trailing slashes before comparing).
- **Device type** - Desktop/Mobile/Tablet/Console/Wearable, parsed client-side from user agent (posthog-js >= 1.214.0), or via Person/group Device Type properties.
- **CSS selector match** - show only when a given element/class/ID is present on the page.
- **Wait period** - hide from anyone who saw ANY survey in the last N days; a user who completes a survey is never shown that exact survey again regardless of wait period (with documented exceptions for repeat schedules).
- **Person/group properties** - requires identified events; evaluated via internal feature flags, supports percentage rollout.
- **User sends a specific event** during the session.

Display conditions do NOT apply to hosted surveys - any visitor to the link sees it as long as it's launched.

### Wait for feature flags before checking survey eligibility (critical timing bug)

Display conditions that depend on a feature flag (targeting-by-cohort or linked-flag surveys) require flag values that are fetched asynchronously after page load. `getActiveMatchingSurveys()` evaluates against whatever the SDK knows **at the moment called**, and calls its callback exactly once - calling it before flags arrive can wrongly return an empty list for a user who does match, with no re-invocation once flags land. Fix: wrap in `posthog.onFeatureFlags()`, which fires as soon as flag values are available (immediately, if already available):

```javascript
posthog.onFeatureFlags(() => {
  posthog.getActiveMatchingSurveys((surveys) => {
    // flag values are now available, so display conditions evaluate correctly
  })
})
```

Same caveat applies to `displaySurvey(..., { ignoreConditions: false })`, which checks the same display conditions.

### Rendering surveys programmatically

`displaySurvey(surveyId, options)` (recommended, replaces deprecated `renderSurvey`) supports:
- Popover mode: `{ displayType: DisplaySurveyType.Popover, ignoreConditions, ignoreDelay }`.
- Inline mode: `{ displayType: DisplaySurveyType.Inline, selector: '#survey-container' }`.
- Pre-filled responses (popover only): `initialResponses: { 0: 2, 1: 9, 2: [0, 2] }` (0-based question index -> choice index / rating / array of choice indices for multiple choice).

Headless/fully custom UI: `getSurveys(callback, forceReload)` (all surveys, you handle display logic) or `getActiveMatchingSurveys(callback, forceReload)` (only surveys the current user is currently eligible for, respecting dismiss/response history).

### Capturing responses - `survey sent` event, ID-based (recommended) vs index-based

ID-based responses are explicitly recommended over index-based because they're resilient to a survey's questions being reordered later:

```javascript
posthog.capture('survey sent', {
  $survey_id: survey.id,
  [`$survey_response_${questionUuid}`]: feedback, // ID-based - each question has a UUID
})
```

Also capture the survey lifecycle events `survey shown` and `survey dismissed` for a complete implementation matching what popover surveys do automatically - needed for accurate funnel/abandonment analysis.

### Hosted survey identity linking

Hosted (externally-URL'd) surveys require **manual** linking since they're reached via an external link with no SDK session context:

```
https://us.posthog.com/external_surveys/your-survey-id?distinct_id=user123
```

Must be the **exact same** `distinct_id` value passed to `posthog.identify()` elsewhere in the app, or responses land as unlinked/anonymous. Additional URL params become event properties on the response automatically (types auto-inferred: numeric regex match -> number, exact `"true"`/`"false"` -> boolean, else string). In-app (popover/API/widget) surveys link responses automatically once the visitor is identified - no manual param needed.

### Repeating surveys

Default: shown once, never again after dismiss or completion. Two override mechanisms: (1) event-triggered surveys can be set to "every time the event is sent" instead of "just once"; (2) completion-conditions scheduling - "repeat on a schedule" (N repetitions, each M days apart, computed as fixed iteration windows from the launch date - every user becomes eligible again at the start of each new iteration, even if they already responded in a prior one) or "every time display conditions are met." Each response carries `$survey_iteration` and `$survey_iteration_start_date` properties for filtering by cycle.

### Notifications and AI-assisted reading

Survey responses can push to Slack/Discord/Microsoft Teams/a webhook per-response via the survey's Notifications tab. PostHog AI can generate a survey from a plain-language prompt and summarize open-text responses into themes/sentiment/segment comparisons inside the web app.
