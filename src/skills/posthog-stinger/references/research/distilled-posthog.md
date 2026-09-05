# Distilled PostHog research

Dense, cited reference distilled from `raw/`. Every claim ends with `[raw/<file>]`. Research window: sources fetched/searched 2026-08-14, official docs undated (live pages, evergreen). Stack context: SvelteKit (Svelte 5) on Vercel, Neon Postgres (Postgres facts not relevant to PostHog itself, noted only where PostHog writes to app-owned tables via webhooks/CDP - out of scope for this pass).

## 1. SvelteKit installation

| Layer | Package | Init location | Notes |
| --- | --- | --- | --- |
| Client | `posthog-js` | `src/routes/+layout.js`, guarded by `browser` from `$app/environment` | `posthog.init(token, { api_host, defaults: '2026-05-30' })` [raw/posthog--sveltekit--install-client-server-pageviews.md] |
| Server | `posthog-node` | Anywhere server-side: `load` functions, `+page.server.ts`, `hooks.server.ts`, form actions | `new PostHog(token, { host })`, always `await posthog.shutdown()` after capturing [raw/posthog--sveltekit--install-client-server-pageviews.md] |

CSP requirement: `script-src`, `connect-src` (or `default-src` fallback), and `worker-src` must allow `https://*.posthog.com`, or `capture`/`identify` silently no-op with zero visible error [raw/posthog--sveltekit--install-client-server-pageviews.md].

## 2. Pageview tracking with SvelteKit's router (SPA navigation)

SvelteKit uses client-side routing after first load; a page-load-only pageview capture misses in-app navigations. Fix: set `defaults` to a recent date string (any value `>= '2025-05-24'`, current recommended `'2026-05-30'`) at `posthog.init()` time, which makes `capture_pageview` default to `'history_change'` - listens to the browser History API and fires `$pageview` on every path change. No extra code beyond the `defaults` config is needed; this is the same mechanism used across every SPA framework PostHog documents (React, Vue, Next.js, Svelte) [raw/posthog--sveltekit--install-client-server-pageviews.md, raw/posthog--autocapture--config-vs-manual-events.md].

To disable pageview/pageleave autocapture and capture manually instead (cost-control lever): `capture_pageview: false, capture_pageleave: false` at init, then `posthog.capture('$pageview')`/`posthog.capture('$pageleave')` on demand. Explicit warning: disabling breaks features that depend on these events, e.g. bounce rate [raw/posthog--autocapture--config-vs-manual-events.md, raw/posthog--cost-control--billing-sampling-estimation.md].

SSR-specific gotcha: Svelte's default relative asset paths during SSR break session replay - set `kit.paths.relative = false` in `svelte.config.js` [raw/posthog--sveltekit--install-client-server-pageviews.md].

## 3. Server-side capture (posthog-node in SvelteKit)

```javascript
import { PostHog } from 'posthog-node';
export async function load() {
  const posthog = new PostHog('<token>', { host: 'https://us.i.posthog.com' });
  posthog.capture({ distinctId: '...', event: 'event_name' });
  await posthog.shutdown();
}
```
[raw/posthog--sveltekit--install-client-server-pageviews.md]

Serverless/edge (Vercel Functions) requirement: set `flushAt: 1, flushInterval: 0` so events send immediately instead of waiting for a batch that may never fill before the function exits; always `await posthog.shutdown()` before the function returns [raw/posthog--sveltekit--install-client-server-pageviews.md].

Frontend-to-backend linking: set `tracing_headers: ['api.example.com']` (hostnames only, no port/protocol) on the client SDK to auto-attach `X-POSTHOG-DISTINCT-ID`/`X-POSTHOG-SESSION-ID` to `fetch`/`XHR` calls to that host; on an Express backend, `setupExpressRequestContext()` (posthog-node >= 5.31.0) reads those headers automatically. No SvelteKit-native equivalent to the Express middleware was found in research - treat SvelteKit `hooks.server.ts` request-context wiring as a manual pattern (read the incoming headers yourself and pass `distinctId`/`sessionId` into `capture()` calls) [raw/posthog--sveltekit--install-client-server-pageviews.md]. **Gap, stated plainly**: no dedicated SvelteKit request-context helper was found; this is inferred from the Express pattern, not a direct SvelteKit-specific source.

## 4. Autocapture vs manual events

| | Autocapture | Manual (custom) events |
| --- | --- | --- |
| Setup cost | Zero - on by default | Requires code at each call site |
| Covers | Clicks/forms/inputs on `a,button,form,input,select,textarea,label`, pageviews/pageleaves, clipboard, heatmaps, dead clicks, rage clicks | Anything you explicitly instrument |
| Reliability for growth metrics | Explicitly NOT reliable for signup-style events [raw/posthog--autocapture--config-vs-manual-events.md] | Reliable, versioned, typed |
| Backend coverage | None (frontend only) | Full |
| Official guidance | Start with it for quick full coverage | Always instrument signups/purchases/feature-usage explicitly regardless of autocapture |

Official synthesis: "We recommend using a combination of autocapture and custom events, and tuning autocapture to your needs if you find you're sending too many events" [raw/posthog--autocapture--config-vs-manual-events.md]. Turn autocapture off (fully or via allow/ignore lists) when: cost matters at scale, the UI's DOM/text churns often (autocapture names embed clicked element text, so `Clicked button with text 'Add to cart'` silently becomes a different event name the moment the button copy changes), or the product is backend/API-heavy where UI clicks aren't the meaningful signal [raw/posthog--autocapture--config-vs-manual-events.md].

Config surface: `autocapture: { url_allowlist, url_ignorelist, dom_event_allowlist, element_allowlist, css_selector_allowlist, css_selector_ignorelist, element_attribute_ignorelist, capture_copied_text }`, or `autocapture: false` to disable entirely (does not affect pageview/pageleave capture, which is controlled separately) [raw/posthog--autocapture--config-vs-manual-events.md].

## 5. Event naming taxonomy and property design

Two overlapping official conventions exist - **flagged conflict, both cite official PostHog docs**:

1. **`category:object_action` snake_case framework** (from the dedicated best-practices guide): lowercase, present-tense verbs, snake_case, e.g. `account_settings:forgot_password_button_click`. Properties: `object_adjective` pattern (`user_id`), `is_`/`has_` booleans, `_date`/`_timestamp` suffixes [raw/posthog--event-taxonomy--naming-properties-best-practices.md].
2. **`[object] [verb]` plain English** (used pervasively in every SDK doc's own code samples): `project created`, `user signed up`, `invite sent` [raw/posthog--event-taxonomy--naming-properties-best-practices.md, raw/posthog--sveltekit--install-client-server-pageviews.md].

**Preferred reading**: use the `category:object_action` snake_case framework for a from-scratch taxonomy design (it's the dedicated best-practices source), but recognize PostHog's own SDK examples default to the simpler `[object] [verb]` form everywhere else - what matters most, per the same best-practices guide, is picking ONE scheme and enforcing it project-wide, not which one [raw/posthog--event-taxonomy--naming-properties-best-practices.md].

Hard rules regardless of scheme:
- Never interpolate values into event or property names (`page_viewed_${pageName}` -> unbounded event definitions, potential rate limiting on new property definitions). Use a static name + a property value instead [raw/posthog--event-taxonomy--naming-properties-best-practices.md].
- Version events when their meaning changes materially (`registration_v2:...`) rather than silently redefining [raw/posthog--event-taxonomy--naming-properties-best-practices.md].
- Prefer backend tracking for anything requiring precise counts; track the same business action from both frontend and backend under **different event names** (e.g. `user created` backend / `user signed up` frontend) to avoid double-counting, optionally disambiguated with a `source` property [raw/posthog--event-taxonomy--naming-properties-best-practices.md].
- Always explicitly instrument growth events (signup, purchase, activation) - do not rely on autocapture for these [raw/posthog--autocapture--config-vs-manual-events.md, raw/posthog--event-taxonomy--naming-properties-best-practices.md].
- Filter out internal/team traffic via email domain, an `is_employee` property, IP exclusion, or host filtering [raw/posthog--event-taxonomy--naming-properties-best-practices.md].

Optional typed layer: Data Management > Events/Property Groups lets you pre-define event schemas with typed properties and generate type-safe code; commit generated types to version control; event names cannot be renamed after creation [raw/posthog--event-taxonomy--naming-properties-best-practices.md].

## 6. identify/alias and anonymous-to-identified stitching

Layered model: anonymous (auto-assigned local ID) -> `identify(distinct_id, properties)` on the frontend at login (merges anonymous person into identified person) -> the SAME `distinct_id` passed to every backend `capture()` call for that user [raw/posthog--identify--alias-identity-resolution.md].

```javascript
posthog.identify('distinct_id', { email, name }) // frontend
posthog.reset() // on logout - required even if users don't share machines
```

Backend has no session concept - no merge happens server-side; pass the same `distinct_id` explicitly on every `capture()`, or use `$set`/`$set_once` in properties for person-property updates (these are NOT stored on the event itself, only used at ingestion) [raw/posthog--identify--alias-identity-resolution.md].

`alias(alias_id, distinct_id)` links a second ID to the same user when the primary ID isn't available in a given context (e.g. frontend ID unavailable in a backend job) - constraints: an alias ID can't already map to >1 distinct_id, and can't have been previously used as a prior `identify()`/`alias()` distinct_id argument [raw/posthog--identify--alias-identity-resolution.md].

**Blocked/illegal distinct IDs** (merges silently fail, no error): `null, undefined, None, 0, anonymous, guest, distinct_id, id, email, true, false, [object Object], NaN`, empty strings, and quoted variants [raw/posthog--identify--alias-identity-resolution.md]. Use UUIDs or validate against this list.

Symptom -> root cause table (identity bugs across flags/experiments/replay/funnels/errors) is in raw/posthog--identify--alias-identity-resolution.md - every fix is upstream: link IDs before the events that need connecting.

Anonymous vs identified event tradeoff:

| | Anonymous | Identified |
| --- | --- | --- |
| Cost | Up to 4x cheaper [raw/posthog--identify--alias-identity-resolution.md, raw/posthog--cost-control--billing-sampling-estimation.md] | Baseline |
| Capabilities | Event properties, filter/aggregate by event property | + person properties, cohorts, Lifecycle insights, person-property targeting for flags/experiments/surveys, persons-table SQL, group analytics |

Default config `person_profiles: 'identified_only'` (recommended): anonymous by default, identified only once a profile exists (`identify()`, `alias()`, `group()`, `setPersonProperties()`; `setPersonPropertiesForFlags()` is the one exception that does NOT create a profile, letting flag targeting use person properties pre-login). Backend SDKs are identified-by-default; force anonymous per-event with `$process_person_profile: false` [raw/posthog--identify--alias-identity-resolution.md].

Catch-all server-side distinct IDs (`"system"`, `"cron"`) are a correctness AND cost antipattern - they funnel unrelated events into one profile, risk a ~5,000 events/min per-distinct-ID rate limit, and cost up to 4x as identified events; fix with `$process_person_profile: false` on those events [raw/posthog--identify--alias-identity-resolution.md, raw/posthog--event-taxonomy--naming-properties-best-practices.md].

## 7. Feature flags: client/server evaluation, local evaluation, bootstrapping

| Mode | Where | Round trip per check? | Requires |
| --- | --- | --- | --- |
| Remote (default) | Any SDK | Yes, every check | Public project API key |
| Local evaluation | Server SDKs only (Node, Ruby, Go, Python, C#, PHP, Java, Rust) - NOT frontend/mobile/CLI | No (after initial poll) | Secret "feature flags secure API key," never client-side [raw/posthog--feature-flags--local-evaluation-bootstrapping.md] |

Local evaluation mechanics: SDK polls `/flags/definitions` in the background (default 30s Node, 5min Go), evaluates locally using properties YOU supply - if a required property is missing, falls back to remote (unless `onlyEvaluateLocally: true`, which returns `undefined` instead). Billed as 10 flag requests per poll (not per check), far cheaper than remote at scale [raw/posthog--feature-flags--local-evaluation-bootstrapping.md, raw/posthog--cost-control--billing-sampling-estimation.md]. Edge/Lambda/stateless-PHP caveat: in-memory local-eval cache re-initializes per request, inflating cost - use a shared external cache or fall back to remote evaluation in these environments [raw/posthog--feature-flags--local-evaluation-bootstrapping.md].

```javascript
// Node.js server-side, current API
const client = new PostHog(token, { host, personalApiKey: secureKey, featureFlagsPollingInterval: 30000 });
const flags = await client.evaluateFlags(distinctId, { personProperties, groups, groupProperties, onlyEvaluateLocally: false });
flags.getFlag('flag-key'); flags.isEnabled('flag-key'); flags.getFlagPayload('flag-key');
```
Deprecated but still working: `isFeatureEnabled()`, `getFeatureFlag()`, `getFeatureFlagPayload()`, `capture({ sendFeatureFlags: true })` - prefer `evaluateFlags()` for new code [raw/posthog--feature-flags--local-evaluation-bootstrapping.md].

**Bootstrapping (avoid flicker)**: seeds the SDK with server-known state (distinct ID, identified status, session ID [JS web only], flag values/payloads) at client `init()` time, so first paint already has correct state instead of flashing default content while the client's own `/flags` request is in flight. Available in JS web, React Native, iOS, Android, Flutter - NOT posthog-node (no client "first paint" concept) [raw/posthog--feature-flags--local-evaluation-bootstrapping.md].

```javascript
posthog.init(token, {
  defaults: '2026-05-30',
  bootstrap: { distinctID, isIdentifiedID: true, sessionID, featureFlags: { 'flag-key': 'variant' }, featureFlagPayloads: {...} },
})
```

Practical SvelteKit anti-flicker pattern (synthesized, not a direct quote - flagged as inference): evaluate flags server-side in a `load` function using `posthog-node` + the session's distinct ID, pass the results into the client SDK's `bootstrap.featureFlags` on init, so the very first client render is already correct [raw/posthog--feature-flags--local-evaluation-bootstrapping.md]. Bootstrapped flags are fully replaced by the SDK's first real `/flags` response; only enabled flags (`true` or non-empty variant) are seeded, falsy/empty values are dropped [raw/posthog--feature-flags--local-evaluation-bootstrapping.md].

Cold start default handling: use `?? 'control'` not `|| false` for flag reads during the first poll interval, to avoid `undefined` silently reading as a falsy default [raw/posthog--feature-flags--local-evaluation-bootstrapping.md].

## 8. Experiments / A-B tests

Experiments are backed entirely by a feature flag + existing events/warehouse tables - no separate instrumentation needed beyond correct flag-value access [raw/posthog--experiments--setup-and-code.md]. Created via a 3-step web-app wizard: description + flag key -> variant rollout (2-10 variants, `control` first) -> analytics (inclusion criteria, primary/secondary metrics).

**Critical implementation rule**: only `getFeatureFlag()`/`useFeatureFlagVariantKey()` (client) or `evaluateFlags().getFlag()` (server) record an exposure (`$feature_flag_called`). `getAllFlags()`, `getFeatureFlags()`, and payload-only accessors do NOT count as exposure and silently exclude those users from experiment results [raw/posthog--experiments--setup-and-code.md].

```javascript
// Server-side (Node)
const flags = await client.evaluateFlags(distinctId)
const variant = flags.getFlag('experiment-feature-flag-key')
if (variant === 'variant-name') { /* ... */ }
```

Server-side experiments require manually attaching flag info to captured conversion events (via the `flags` option on `capture()`, see §7) since PostHog can't otherwise link a server-captured conversion to the flag evaluation that assigned the variant [raw/posthog--experiments--setup-and-code.md].

Pre-launch testing: override the underlying flag's release conditions (e.g. match on internal-team email or a `utm_source` param) to force a variant for testers before opening to real traffic - bugs found post-launch invalidate already-collected data [raw/posthog--experiments--setup-and-code.md].

## 9. Session replay: privacy masking and cost

Masking runs client-side; masked data is never transmitted [raw/posthog--session-replay--privacy-masking-pricing.md].

| Surface | Default | Config |
| --- | --- | --- |
| Inputs | Masked | `maskAllInputs`, `maskInputOptions`, `maskInputFn` |
| Non-input text | NOT masked | `maskTextSelector`, `maskTextFn` |
| Whole elements | Not excluded | `.ph-no-capture` class (also disables autocapture on that element) |
| Replayed URL query strings | Not redacted | `maskCapturedNetworkRequestFn` (shared with network-request redaction) |

Common presets (maximum / limited / selective privacy) are in raw/posthog--session-replay--privacy-masking-pricing.md. For sensitive apps, PostHog's own "private by default" recommendation is mask-everything-then-selectively-unmask, not the reverse [raw/posthog--session-replay--privacy-masking-pricing.md].

Cost: web replay free tier 5,000 recordings/mo, then $0.0050/recording down to $0.0015/recording at 500k+/mo; mobile replay billed separately, free tier 2,500/mo, $0.0100 down to $0.0030/recording [raw/posthog--session-replay--privacy-masking-pricing.md]. Session recordings are separately flagged as the single biggest driver of reverse-proxy bandwidth cost on Vercel (1-5 MB/session) [raw/posthog--reverse-proxy--vercel-and-managed.md, raw/posthog--session-replay--privacy-masking-pricing.md] - replay is a double cost surface (per-recording billing AND proxy egress if self-hosting the proxy). PostHog's own comparison page concedes competitors may be preferable when "strict data residency" or "more robust PII redaction" are hard requirements [raw/posthog--session-replay--privacy-masking-pricing.md].

## 10. Surveys

Rendered by the already-installed `posthog-js` SDK, no separate package [raw/posthog--surveys--setup-targeting-responses.md]. Four presentation types: popover (default), widget/feedback button, hosted (external URL/iframe), API (fully custom UI). Display conditions (ALL must match): linked feature flag, URL match, device type, CSS selector presence, wait period, person/group properties, event trigger.

**Timing bug to avoid**: flag-dependent display conditions require flags loaded asynchronously; wrap `getActiveMatchingSurveys()` in `posthog.onFeatureFlags()` or risk a false-empty result for eligible users with no re-invocation [raw/posthog--surveys--setup-targeting-responses.md].

Response capture uses the `survey sent` event; **ID-based** responses (`$survey_response_<questionUuid>`) are recommended over index-based since they survive question reordering [raw/posthog--surveys--setup-targeting-responses.md]. Also capture `survey shown`/`survey dismissed` for accurate funnel analysis. Hosted surveys require manual `?distinct_id=` linking (must exactly match the app's `identify()` value) since they have no SDK session context; in-app surveys link automatically [raw/posthog--surveys--setup-targeting-responses.md].

## 11. Group analytics for B2B products

Paid add-on, up to 5 group types/project, unlimited groups per type [raw/posthog--group-analytics--b2b-frontend-backend.md]. **Billing gotcha**: once enabled, billing applies to ALL identified events project-wide, not just group-tagged ones, starting the moment it's enabled on the billing page (not when code ships) [raw/posthog--group-analytics--b2b-frontend-backend.md].

| | Frontend (JS web) | Backend (Node) |
| --- | --- | --- |
| Association model | `posthog.group(type, key)` once; stateful session auto-associates all subsequent events | Stateless; every `capture()` call needs explicit `groups: { type: key }` |
| Property updates | Side effect of `group()` call | Separate `groupIdentify()` call only |
| Cleanup | `posthog.reset()` (or `resetGroup()`) on logout | None needed (no session) |

Events must be identified (`$process_person_profile` not `false`) to link to a group at all [raw/posthog--group-analytics--b2b-frontend-backend.md]. One event can carry only one group per group **type**, but multiple group types simultaneously (e.g. `company` + `channel`) [raw/posthog--group-analytics--b2b-frontend-backend.md].

## 12. Reverse proxy on Vercel

Rationale: bypasses ad-blocker domain blocklists by routing through the app's own domain, "typically increases event capture by 10-30%" [raw/posthog--reverse-proxy--vercel-and-managed.md]. Never use obvious path names (`/analytics`, `/tracking`, `/posthog`).

Two options:
1. **Managed reverse proxy** (recommended default) - free, PostHog-hosted via Cloudflare, CNAME + SSL auto-provisioned, does NOT count against Vercel egress. NOT HIPAA-compliant [raw/posthog--reverse-proxy--vercel-and-managed.md].
2. **Self-hosted via `vercel.json` rewrites** - three ordered rules (static -> array -> catch-all; order matters, Vercel evaluates top-to-bottom), counts against Vercel Fast Data Transfer/Edge Requests billing, session recordings are the dominant cost driver [raw/posthog--reverse-proxy--vercel-and-managed.md].

```json
{
  "rewrites": [
    { "source": "/yourpath/static/:path(.*)", "destination": "https://us-assets.i.posthog.com/static/:path" },
    { "source": "/yourpath/array/:path(.*)", "destination": "https://us-assets.i.posthog.com/array/:path" },
    { "source": "/yourpath/:path(.*)", "destination": "https://us.i.posthog.com/:path" }
  ]
}
```
```javascript
posthog.init(token, { api_host: '/yourpath', ui_host: 'https://us.posthog.com' })
```
(swap `us` -> `eu` domains for EU projects) [raw/posthog--reverse-proxy--vercel-and-managed.md]

Region-mismatch (US rewrite destinations with an EU project or vice versa) is the top cause of 401s post-deploy [raw/posthog--reverse-proxy--vercel-and-managed.md]. Existing Next.js `middleware.ts`/`proxy.ts` catch-all matchers can silently intercept and break the proxy path before the rewrite runs - add the proxy path to the matcher's negative lookahead [raw/posthog--reverse-proxy--vercel-and-managed.md]. **Gap**: research covered Next.js-on-Vercel middleware interaction explicitly; no dedicated source confirms whether SvelteKit's `hooks.server.ts` `handle` hook has an equivalent interception risk with `vercel.json` rewrites - treat as likely-low-risk since SvelteKit hooks run after Vercel's rewrite layer, but this specific interaction was not directly confirmed in research.

## 13. EU vs US cloud and data residency

| | US Cloud (default) | EU Cloud |
| --- | --- | --- |
| Hosting | USA (AWS) | Frankfurt, Germany (AWS) |
| IP capture default | Enabled (must manually disable) | **Automatically disabled by default for all new projects** [raw/posthog--data-residency--eu-us-gdpr.md] |
| GDPR posture | Requires manual anonymization of EU user data via realtime transformations | PostHog's own recommended path for "robust GDPR compliance," no extra anonymization step needed |

Official recommendation: "If you require robust GDPR compliance, we recommend using PostHog Cloud EU" [raw/posthog--data-residency--eu-us-gdpr.md]. Endpoint pairs must stay consistent across SDK `api_host`, reverse-proxy rewrite destinations, and `ui_host` - mixing regions causes 401s [raw/posthog--data-residency--eu-us-gdpr.md, raw/posthog--reverse-proxy--vercel-and-managed.md].

Deletion/right-to-be-forgotten: person/group/project/org deletion available; event deletion specifically is asynchronous (non-peak-hours ClickHouse processing) - avoid reusing a `distinct_id` immediately after deleting it [raw/posthog--data-residency--eu-us-gdpr.md]. Managed reverse proxy is explicitly NOT HIPAA-compliant and not covered by any BAA even if one exists at the org level [raw/posthog--data-residency--eu-us-gdpr.md, raw/posthog--reverse-proxy--vercel-and-managed.md].

**Practical rule for this skill (synthesized, flagged as inference, not a direct PostHog recommendation)**: default new SvelteKit/Vercel apps with meaningful EU user bases to EU Cloud; default everything else to US Cloud (PostHog's own default) [raw/posthog--data-residency--eu-us-gdpr.md].

## 14. Cost control: event volume and estimation

Pricing is tiered per-event, first 1M events/mo free, down to $0.0000090/event at 250M+/mo [raw/posthog--cost-control--billing-sampling-estimation.md]. Official cost levers, in the order PostHog's own docs present them: (1) prefer anonymous over identified events where analytically sufficient (up to 4x cheaper) [raw/posthog--cost-control--billing-sampling-estimation.md, raw/posthog--identify--alias-identity-resolution.md]; (2) configure/disable autocapture; (3) call `identify()` once per session (idempotent, but redundant calls still worth avoiding); (4) call `group()` once per session client-side; (5) disable pageview/pageleave autocapture where unneeded; (6) be aware group analytics bills ALL identified events once enabled.

Event ingestion filtering (server-side, pre-transformation, most efficient exclusion method) is a separate lever from client-side autocapture allow/ignorelists - drops events by metadata before they're processed at all [raw/posthog--cost-control--billing-sampling-estimation.md].

**Sampling - explicit research gap**: no dedicated PostHog sampling feature (e.g. a `sample_rate` config or statistical-sampling API) was found in any fetched source. Do not claim PostHog has a native sampling mechanism; the volume-reduction levers found are all allow/ignorelist- or filter-based, not probabilistic sampling [raw/posthog--cost-control--billing-sampling-estimation.md].

Billing limits are a hard stop with permanent data loss once hit (not a soft throttle) - "your additional data is lost forever" past the set dollar limit; alerts fire at 80%/100% [raw/posthog--cost-control--billing-sampling-estimation.md]. Feature-flag request cost has its own separate estimation math (local evaluation polling counts as 10 requests per poll cycle, not per flag) [raw/posthog--cost-control--billing-sampling-estimation.md, raw/posthog--feature-flags--local-evaluation-bootstrapping.md].

## Gaps and open questions (state plainly, do not guess)

1. **No dedicated SvelteKit request-context/tracing helper** confirmed (unlike the Express middleware for posthog-node) - the tracing_headers -> server linkage pattern for SvelteKit is inferred, not a direct quoted source [raw/posthog--sveltekit--install-client-server-pageviews.md].
2. **Event-name taxonomy conflict** between the `category:object_action` best-practices guide and the `[object] [verb]` pattern used throughout every other SDK doc - both are official, not reconciled by PostHog itself; this skill picks the best-practices framework as primary but flags the discrepancy (see §5).
3. **No PostHog-native sampling feature found** - cost-control research surfaced only allow/ignorelist and post-ingestion filtering mechanisms, not statistical sampling; do not assert a sampling API exists (see §14).
4. **Vercel + SvelteKit `hooks.server.ts` interaction with `vercel.json` rewrites** was not directly confirmed (only the Next.js `middleware.ts` interaction case was documented) - treat as likely-fine but unconfirmed (see §12).
5. **Whether the EU Cloud managed-proxy edge-termination guarantee is contractually enforced** - PostHog's own FAQ states EU-only termination is *not* strictly guaranteed for the managed reverse proxy (anycast routing to nearest Cloudflare edge, usually but not always EU for EU-based users) [raw/posthog--reverse-proxy--vercel-and-managed.md] - relevant caveat for any strict-EU-only compliance requirement.
