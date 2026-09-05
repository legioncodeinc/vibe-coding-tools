# PostHog experiments / A-B tests: setup, feature-flag backing, and exposure mechanics

- URL: https://posthog.com/docs/experiments ; https://posthog.com/docs/experiments/creating-an-experiment ; https://posthog.com/docs/experiments/adding-experiment-code.md ; https://posthog.com/docs/experiments/installation ; https://posthog.com/docs/experiments/testing-and-launching
- Fetched: 2026-08-14
- Source type: Official docs
- Component: Experiments

## Content

### What experiments are, structurally

Experiments run entirely on top of feature flags and existing events - no new instrumentation required to measure a result. "Experiments don't collect anything new. They read the feature flag that assigns each user to a variant, the events those users go on to send, and - if you want - tables you've already loaded into the data warehouse." Every experiment is backed by a flag that randomizes users into variants and records exposure; any already-captured event can become a funnel/mean/ratio metric; data warehouse tables (revenue, subscriptions) can also be metrics. Statistics are Bayesian or frequentist, computed by PostHog. Every variant is linked to the session replays of users who saw it.

### Install (wizard)

`npx @posthog/wizard` (works in-terminal or with LLM coding agents like Cursor/Bolt) installs the SDK for experiments. Otherwise, standard `posthog-js`/`posthog-node` install applies (see SvelteKit raw file) - Experiments has no separate SDK package.

### Creating an experiment (PostHog web app wizard, 3 steps)

1. **Description** - name, hypothesis, feature flag key. Reuse an existing flag if it already has >= 2 variants with `'control'` first, otherwise a new flag auto-generates from the experiment name (customizable key).
2. **Variant rollout** - variants (default `control` + `test`, up to 9 test variants total), traffic split (equal by default), rollout percentage (default 100%, lower to limit exposure). Participant type defaults to user-level; if group types exist, experiments can run group-targeted (same variant to every group member). Changing split/variants after launch can produce inconsistent user experience; increasing rollout % alone does not reassign already-bucketed users.
3. **Analytics** - inclusion criteria (default: exposure = a `$feature_flag_called` event; can switch to a custom event to narrow exposure to users who reached the relevant product surface), multiple-variant handling (default: exclude users exposed to >1 variant from analysis), optional test-account filtering, primary/secondary metrics (reusable project-level shared metrics or ad hoc).

Save as draft, then launch from the experiment's detail page. Metrics can be added after saving/launching since they only affect analysis, not what users see or what data is collected - but defining metrics upfront is recommended to avoid biasing analysis.

### Adding experiment code - CRITICAL: only flag-value access counts as exposure

"You must use `getFeatureFlag()` (or its framework equivalent like `useFeatureFlagVariantKey()`) to check variants. In server-side SDKs, use the `evaluateFlags` API to access flag values via `getFlag()`/`get_flag()`. Other methods like `getAllFlags()`, `getFeatureFlags()`, or payload-only accessors do NOT record an exposure event. Users evaluated with those methods won't be included in your experiment results." This is the single most important implementation-correctness rule for experiments.

```javascript
// Web (JS)
posthog.onFeatureFlags(function() {
  if (posthog.getFeatureFlag('experiment-feature-flag-key') == 'variant-name') {
    // do something
  }
})
// or, once flags are known to be loaded:
if (posthog.getFeatureFlag('experiment-feature-flag-key') == 'variant-name') { /* ... */ }
// test override:
posthog.featureFlags.overrideFeatureFlags({ flags: { 'experiment-feature-flag-key': 'test' } })
```

```javascript
// React
import { useFeatureFlagVariantKey } from '@posthog/react'
function App() {
  const variant = useFeatureFlagVariantKey('experiment-feature-flag-key')
  if (variant == 'variant-name') { /* ... */ }
}
// or the component form:
import { PostHogFeature } from '@posthog/react'
<PostHogFeature flag='experiment-feature-flag-key' match={'variant-name'}>
  <div>...</div>
</PostHogFeature>
```

```javascript
// Node.js (server-side experiments - evaluateFlags snapshot, NOT getAllFlags)
const flags = await client.evaluateFlags('user_distinct_id')
const variant = flags.getFlag('experiment-feature-flag-key')
if (variant === 'variant-name') {
  // Do something
}
```

Server-side experiment metrics require manually sending feature flag information on captured events (see feature-flags raw file's `flags` option on `capture()`), since PostHog can't otherwise attribute server-captured conversion events to the flag evaluation that assigned the variant.

### Testing before launch

Use a release-condition override on the underlying feature flag to force a specific variant for internal testers before opening the experiment to real traffic: enable the flag, add a condition set matching a test signal (e.g. `email = your_email@domain.com`, or a `utm_source` query param for logged-out users), set that condition set's rollout to 100% with an explicit variant override, save. Bugs discovered after launch invalidate already-collected results (lost days of experiment runtime), so this pre-launch test pass matters.

### Self-driving validity monitoring (context, not core to implementation)

A background "Self-driving" scout audits running experiments' exposure streams against configured split/status/flag-state and files validity-threat reports (skewed splits, contamination, stalls, mid-run flag edits) to a human inbox for review - it never comments on which variant is winning, and never auto-drafts a fix PR for a validity threat (unlike some other Self-driving signal sources). This is supplementary QA tooling, not required for basic experiment implementation.

### Where experiments can be managed

PostHog Web (design/launch/analyze), PostHog MCP (create/check-results/manage lifecycle from an MCP client or AI editor), REST API (programmatic management of experiments/holdouts/shared metrics), PostHog Desktop (review Self-driving validity reports).
