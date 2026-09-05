# Distilled Sentry research

Dense, cited reference distilled from `raw/`. Every claim ends with `[raw/<file>]`. Research window: sources fetched 2026-08-14; official docs pages are undated/evergreen live pages, blog posts dated where shown (two alert-tuning posts are older than the 6-12 month preferred window - flagged inline). Stack context: SvelteKit (Svelte 5) on Vercel, Neon Postgres.

## 1. SvelteKit SDK setup

| Layer | File | Key call |
| --- | --- | --- |
| Client | `src/hooks.client.(js\|ts)` | `Sentry.init({...})` + `export const handleError = Sentry.handleErrorWithSentry(myErrorHandler)` [raw/sentry--sveltekit-sdk--client-server-hooks.md] |
| Server config | `svelte.config.js` (SvelteKit 2) or the `sveltekit()` Vite plugin call (SvelteKit 3) | `experimental: { instrumentation: { server: true }, tracing: { server: true } }` [raw/sentry--sveltekit-sdk--client-server-hooks.md] |
| Server init | `src/instrumentation.server.(js\|ts)` | `Sentry.init({...})` [raw/sentry--sveltekit-sdk--client-server-hooks.md] |
| Server hooks | `src/hooks.server.(js\|ts)` | `export const handleError = Sentry.handleErrorWithSentry(...)`; `export const handle = Sentry.sentryHandle()` [raw/sentry--sveltekit-sdk--client-server-hooks.md] |
| Build | `vite.config.ts` | `sentrySvelteKit()` plugin, ordered before `sveltekit()` [raw/sentry--sveltekit-sdk--client-server-hooks.md] |

- Package: `@sentry/sveltekit`. Requires SvelteKit `2.0.0+` (`2.31.0+` recommended), Vite `4.2+` [raw/sentry--sveltekit-sdk--client-server-hooks.md].
- The `2.31.0+` server path enables SvelteKit's own (experimental) observability/tracing support, giving auto-instrumented DB-query spans and accurate `load`/action/remote-function timing that the older pre-`2.31.0` setup path does not provide [raw/sentry--sveltekit-sdk--client-server-hooks.md].
- **Runtime compatibility for Vercel**: fully supported on `adapter-vercel`'s Node.js Lambda runtime and `adapter-auto`. **Vercel's Edge runtime is explicitly NOT supported** as of this research [raw/sentry--sveltekit-sdk--client-server-hooks.md]. This directly constrains deployment target choice for any SvelteKit app on this stack that wants full Sentry coverage.
- `handleError`'s return value becomes `page.error` (the safe-to-show-user shape); `error.message` may still carry sensitive detail and should not be assumed safe to render directly [raw/sentry--sveltekit-sdk--client-server-hooks.md].
- `sentryHandle()` creates root spans for every incoming request and is what stitches server-side and client-side spans into one connected trace via injected `<meta>` tags read by `browserTracingIntegration()` [raw/sentry--sveltekit-sdk--client-server-hooks.md].
- **Newer `dataCollection` config shape** (`dataCollection: { userInfo: false, httpBodies: [] }`) is the current mechanism for opting out of default PII collection, superseding the older flat `sendDefaultPii` boolean referenced in general (non-SvelteKit-specific) JS docs [raw/sentry--sveltekit-sdk--client-server-hooks.md, raw/sentry--data-scrubbing--beforesend-pii.md].
- Gap: the exact full Vite-plugin snippet combining `sentrySvelteKit()` + `sveltekit()` was truncated mid-fetch; the ordering rule (`sentrySvelteKit` before `sveltekit()`) is stated but the complete option surface for that specific wrapper wasn't captured verbatim - use `@sentry/vite-plugin`'s standalone options (§2) as the grounded fallback [raw/sentry--sveltekit-sdk--client-server-hooks.md].

## 2. Source maps and releases on Vercel

- Package: `@sentry/vite-plugin`, installed as a devDependency, placed **after all other plugins** in the `plugins` array [raw/sentry--sourcemaps--vercel-vite-plugin.md].
- `build.sourcemap` must be enabled (`"hidden"` or `true`) or the plugin has nothing to upload [raw/sentry--sourcemaps--vercel-vite-plugin.md].
- Auth token: an **Organization Auth Token** (preferred) or a Personal Token with `Project: Read & Write` + `Release: Admin` scopes, supplied via `authToken` option, `SENTRY_AUTH_TOKEN` env var, or a gitignored `.env.sentry-build-plugin` file [raw/sentry--sourcemaps--vercel-vite-plugin.md].
- Vite does **not** auto-load `.env` into `process.env` when evaluating `vite.config.ts` - use `loadEnv()` or the `.env.sentry-build-plugin` file [raw/sentry--sourcemaps--vercel-vite-plugin.md].
- `sourcemaps.filesToDeleteAfterUpload` deletes generated `.map` files post-upload to avoid publicly exposing source [raw/sentry--sourcemaps--vercel-vite-plugin.md].
- The plugin does **not** run in dev/watch mode - test source-map upload against a production build [raw/sentry--sourcemaps--vercel-vite-plugin.md].
- **Known Vercel/monorepo failure**: `SENTRY_AUTH_TOKEN` set in Vercel's UI can still be invisible to the actual build process if a monorepo task runner (Turborepo confirmed, v2+) doesn't forward env vars to task hashes by default - confirmed root cause by a Sentry engineer on a GitHub issue thread, not a Sentry/Vercel bug [raw/sentry--sourcemaps--vercel-vite-plugin.md]. Not applicable to a non-monorepo SvelteKit project, but the general lesson (verify the var is visible **inside** the build step, not just in the platform UI) transfers.
- Sentry's own Vercel "Releases and Source Map Integration" (§8) can auto-generate and inject `SENTRY_AUTH_TOKEN`/`SENTRY_ORG`/`SENTRY_PROJECT` as Vercel project env vars, removing the need to hand-create an org auth token [raw/sentry--integrations--vercel-marketplace.md, raw/sentry--sourcemaps--vercel-vite-plugin.md].
- **Commit association is a separate step from source-map upload.** No first-party Sentry CI-automation guide specifically covers "Vercel + `sentry-cli releases set-commits`"; the documented Vercel-native path instead relies on Vercel's own `VERCEL_GITHUB_COMMIT_SHA` (or GitLab/Bitbucket equivalents) exposed at build time, consumed through the Vercel integration rather than a discrete `sentry-cli releases` CI stage [raw/sentry--releases--commit-association.md]. Treat hand-rolled `sentry-cli releases set-commits --auto` inside a Vercel build as unconfirmed/untested by this research; default to the Vercel-integration-driven path.

## 3. Performance tracing and sampling strategy

| Option | Type | Purpose |
| --- | --- | --- |
| `tracesSampleRate` | float `0`-`1` | Uniform flat-rate sampling of all transactions [raw/sentry--performance--tracing-sampling-strategy.md] |
| `tracesSampler` | function | Per-span/context-aware sampling; can also filter transactions to zero entirely [raw/sentry--performance--tracing-sampling-strategy.md] |

- Neither is set by default - **tracing is fully opt-in**; at least one must be configured or zero transactions are ever sent [raw/sentry--performance--tracing-sampling-strategy.md].
- Precedence when both a parent decision and local config exist: `tracesSampler` (if defined) > inherited parent decision (if no `tracesSampler`) > `tracesSampleRate` (if neither of the above). An absolute decision passed directly to a legacy `startTransaction` call overrides everything [raw/sentry--performance--tracing-sampling-strategy.md].
- `inheritOrSampleWith(fallbackRate)` (SDK v9+) is the current-preferred way to respect an upstream trace's sampling decision inside a custom `tracesSampler`, superseding the older `parentSampled`-only pattern, for deterministic sampling and correct downstream metric extrapolation [raw/sentry--performance--tracing-sampling-strategy.md].
- **A flat sample rate is probabilistic per-transaction, not round-robin** - `0.1` means each transaction independently has a 10% chance of being kept, not "1 in 10 evenly spaced" [raw/sentry--performance--tracing-sampling-strategy.md].
- **Changing `tracesSampleRate`/`tracesSampler` requires a redeploy** - it is static SDK config, not a live dashboard toggle. A server-side rate limit is the tool for a temporary volume problem instead [raw/sentry--performance--tracing-sampling-strategy.md, raw/sentry--quotas--spike-protection-cost-control.md].
- **Recommended starter config** (Sentry's own 2026-02-02 blog post): `sampleRate: 1.0` (errors, keep the default), `tracesSampleRate: 0.05` in production / `1.0` in dev, `replaysSessionSampleRate: 0.01`, `replaysOnErrorSampleRate: 1.0` [raw/sentry--performance--tracing-sampling-strategy.md].
- No `replaysSampler` function exists (as of this research) - Session Replay sampling is limited to the two static rates plus manual `replay.start()`/`replay.startBuffering()` control [raw/sentry--performance--tracing-sampling-strategy.md, raw/sentry--session-replay--sampling-and-privacy.md].
- Server-side **Dynamic Sampling Priorities** (distinct from SDK config, applies only to spans/transactions not errors) further prioritize low-volume projects and low-volume transaction names automatically after ingestion; Sentry's stated preference is to set `tracesSampleRate` close to `1.0` where feasible and let Dynamic Sampling handle retention prioritization - but this does not reduce **billing** exposure, since metering is based on events **received**, not events **retained** [raw/sentry--quotas--spike-protection-cost-control.md]. This tension (send-high vs. cost-control) is a real tradeoff, not a resolved recommendation - state both sides when advising a specific rate.

## 4. Session replay and PII scrubbing

| Rate | Default | Behavior |
| --- | --- | --- |
| `replaysSessionSampleRate` | `0` | Starts session-mode recording immediately for a % of all sessions [raw/sentry--session-replay--sampling-and-privacy.md] |
| `replaysOnErrorSampleRate` | `0` | Buffers ~60s in a ring buffer; ships only if an error occurs during that session [raw/sentry--session-replay--sampling-and-privacy.md] |

- **Recommended production rates by traffic** (official docs): High (100k+/day) -> session `0.01`, error `1.0`; Medium (10k-100k/day) -> session `0.1`, error `1.0`; Low (<10k/day) -> session `0.25`, error `1.0`. Keep the error-rate near `1.0` regardless of tier - it's the highest-value, comparatively cheap data [raw/sentry--session-replay--sampling-and-privacy.md].
- Session ends after 15 min inactivity or 60 min max duration, whichever first [raw/sentry--session-replay--sampling-and-privacy.md].
- **Privacy defaults are aggressive by design**: `maskAllText: true` (all text -> `*`) and `blockAllMedia: true` (img/svg/video/etc. redacted) are both on by default, client-side, before anything leaves the browser [raw/sentry--session-replay--sampling-and-privacy.md]. Official docs explicitly instruct verifying masking before any production enablement and re-testing after UI framework/system SDK upgrades.
- Three CSS-class-driven mechanisms: **masking** (`.sentry-mask`), **blocking** (`.sentry-block`, renders empty space), **ignoring** (`.sentry-ignore`, form-input-only, suppresses input-change events) [raw/sentry--session-replay--sampling-and-privacy.md].
- Network request/response body and header capture is **opt-in only**, gated by `networkDetailAllowUrls` (SDK >= 7.50.0) - avoiding PII-bearing endpoints is the primary defense; server-side pattern-match scrubbing (credit cards, SSNs, passwords) is a best-effort backstop, not a guarantee [raw/sentry--session-replay--sampling-and-privacy.md].
- **PII scrubbing generally** (errors/transactions/spans/logs/metrics, not just replay) runs through the `beforeSend*` hook family: `beforeSend` (errors/messages), `beforeSendTransaction`, `beforeSendSpan`, `beforeSendLog`, `beforeSendMetric` [raw/sentry--data-scrubbing--beforesend-pii.md]. Canonical pattern: mutate and return the event, or return `null`/`undefined` to drop it entirely.
- Known PII hiding spots to audit: stack-local variable values (Node/Python/PHP), breadcrumbs (logged statements, DB queries, query strings), user context (`dataCollection.userInfo`/`sendDefaultPii`-gated), unparameterized transaction names (e.g. raw `/users/1234/details`), HTTP span query strings [raw/sentry--data-scrubbing--beforesend-pii.md].
- Recommended alternatives to raw PII: hash/checksum sensitive tag values (`Sentry.setTag('birthday', hash(...))`); identify users by internal ID rather than email (`Sentry.setUser({ id: user.id })`) [raw/sentry--data-scrubbing--beforesend-pii.md].
- **Boundary note (not from Sentry docs, editorial)**: Sentry's session replay is scoped to error/debugging context - masked-by-default, weighted toward error-adjacent sessions. This is a distinct product surface from product-analytics session replay (e.g. PostHog). No research exists in this archive on PostHog's replay feature; consult `posthog-stinger` for that side if/when it exists [raw/sentry--session-replay--sampling-and-privacy.md].

## 5. Release tracking and commit association

- Commit association **only applies to error issues** - not performance or replay issues [raw/sentry--releases--commit-association.md].
- Three paths: (1) a repository integration (GitHub/GitLab/Bitbucket) auto-forwards commit metadata on every push, no manual step per release; (2) `sentry-cli releases set-commits --auto $VERSION` (or `--local`, or an explicit `--commit "repo@from..to"` range) when no repo integration exists; (3) raw API `POST` with a `commits[]` array including `patch_set` for suspect-commit/suggested-assignee features [raw/sentry--releases--commit-association.md].
- Commit messages referencing `Fixes SENTRY-317` (or PR titles with `fixes <ID>`) mark the issue resolved **only once a release containing that commit is created in Sentry** - not immediately on commit [raw/sentry--releases--commit-association.md].
- **Vercel is not in Sentry's first-party CI-automation guide list** (which covers Bitbucket Pipelines, CircleCI, GitHub Actions, Jenkins, Netlify, Travis CI) - Vercel-specific release/commit wiring instead flows through the Vercel integration's `VERCEL_*_COMMIT_SHA` env vars, not a discrete `sentry-cli` CI step [raw/sentry--releases--commit-association.md]. This is a real gap: no Sentry-authored end-to-end "Vercel + sentry-cli releases" walkthrough was found.

## 6. Alerting without noise

- Model: **trigger** (WHEN, issue-state event, multiple run under `ANY`) + **filter** (IF, `ANY`/`ALL` grouping) + **action** (THEN: Slack/Teams/Discord, email, PagerDuty/Opsgenie, Jira/Linear/Azure DevOps, webhook) [raw/sentry--alerts--issue-alert-rules-noise.md].
- Newer terminology: a **Monitor** defines what to track and when to create an issue; an **Alert** defines who gets notified - one Alert can serve many Monitors [raw/sentry--alerts--issue-alert-rules-noise.md].
- Three concrete noise-reduction levers (dated 2022 blog, but structurally confirmed by current evergreen docs): (1) define "new" by event-count/user-count thresholds, not raw issue creation; (2) route unassigned-issue notifications to a triage channel instead of all project members (or disable that default under Project Settings > Issue Owners); (3) filter by event level (`level:fatal`) or specific exception type rather than notifying on everything [raw/sentry--alerts--issue-alert-rules-noise.md].
- **Throttling** sets a minimum re-trigger interval **per issue** - prevents one bursting issue from spamming, but does not suppress simultaneous alerts from different issues matching the same rule [raw/sentry--alerts--issue-alert-rules-noise.md].
- ML Priority Alerts (2024 blog, plan-gated to Business tier at time of writing, flagged as a point-in-time claim) - an ML classifier layered on Sentry's AI Grouping that filters non-actionable issues from the default alert rule, claimed ~35% average alert-volume reduction; paired with Escalating Issues detection so filtered-low-priority issues still surface if they later spike [raw/sentry--alerts--issue-alert-rules-noise.md]. Not verified as still-current/GA - treat as directional, not a guaranteed available feature.
- **Recommended default** (synthesis): start with two narrow rules - `level:fatal` new issues -> paging channel, `is:unassigned` -> triage channel - both throttled to a minute-scale window, rather than the out-of-the-box "notify everyone on every new issue" default [raw/sentry--alerts--issue-alert-rules-noise.md].

## 7. Distinguishing handled vs. unhandled errors

- `handled` is an optional boolean on the exception mechanism: `true` only when user code explicitly caught the exception (`try...catch` + `captureException`, or specific Sentry instrumentation that marks itself handled) [raw/sentry--errors--handled-vs-unhandled.md].
- **Any exception captured automatically by a Sentry integration (not by explicit `captureException`) is always reported `handled: false`**, even if code further up the call stack would have caught it - because the SDK cannot know in advance whether that will happen. Fix, if this mislabels something for alerting purposes: use `beforeSend` to detect and either drop the event or rewrite `handled` on the mechanism [raw/sentry--errors--handled-vs-unhandled.md].
- **Unhandled does not mean crashed.** Some runtimes can surface an unhandled error without the process terminating. Diagnostic order: check `mechanism.handled`; check event level/mechanism type for stronger crash signal; where supported, `crashed` is tracked separately from `unhandled` under Release Health [raw/sentry--errors--handled-vs-unhandled.md].
- Explicit capture pattern for already-handled application errors, with searchable tags:

```javascript
try {
  await processOrder(order);
} catch (error) {
  Sentry.captureException(error, { tags: { order_id: order.id }, level: "error" });
  throw error;
}
```
[raw/sentry--errors--handled-vs-unhandled.md]

- Saved-search pattern to find crash-risk issues: `handled:no level:fatal`, columns `mechanism`, `platform.name`, `count()` [raw/sentry--errors--handled-vs-unhandled.md].

## 8. Sentry's official Vercel integration

Two distinct, non-simultaneous integrations - only one active at a time:

| | Releases and Source Map Integration (legacy, still supported) | Vercel Marketplace integration |
| --- | --- | --- |
| Who it's for | Existing Sentry orgs | New Sentry signups only - no upgrade path from an existing org [raw/sentry--integrations--vercel-marketplace.md] |
| Install | Sentry-side install, creates an internal integration for the auth token | One-click via Vercel marketplace UI |
| Auto env vars | `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`, `NEXT_PUBLIC_SENTRY_DSN` | Same four, plus `SENTRY_VERCEL_LOG_DRAIN_URL`, `SENTRY_OTLP_TRACES_URL`, `SENTRY_PUBLIC_KEY` |
| Billing | Sentry-side | Vercel-side card, Sentry-side plan/PAYG budget |
| Deletion | Delete both the Sentry-side config and the internal integration separately | Deleting in Vercel does NOT delete the Sentry org (irreversible disconnect only) |

[raw/sentry--integrations--vercel-marketplace.md]

- **If the "Vercel Internal Integration" (auth-token source) is deleted, the whole Vercel integration stops working** - it's load-bearing, not incidental [raw/sentry--integrations--vercel-marketplace.md].
- "Failed to fetch" during setup is typically an ad blocker interfering with the Vercel<->Sentry handshake [raw/sentry--integrations--vercel-marketplace.md].
- For an existing Hive project (this stack context), the legacy Releases and Source Map Integration is the relevant path, not the Marketplace flow [raw/sentry--integrations--vercel-marketplace.md].
- The env var name `NEXT_PUBLIC_SENTRY_DSN` shown in official docs is Next.js-flavored; for a SvelteKit app, the equivalent public DSN should be wired through SvelteKit's own env-var convention rather than assuming that exact variable name applies unchanged - flagged as a naming gap, not directly resolved in the fetched source.

## 9. Cost control: quotas, sampling, spike protection

| Lever | Errors | Spans | Replays | Attachments | Logs | App metrics |
| --- | --- | --- | --- | --- | --- | --- |
| Spike Protection | v | v | | v | | |
| Quota adjustment (reserved/PAYG) | v | v | v | v | v | v |
| SDK sample rate | v | v | | | | |

[raw/sentry--quotas--spike-protection-cost-control.md]

- **Spike Protection does not cover Replays**, and the generic "SDK sample rate" lever does not apply to Replays/Attachments/Logs/App metrics at all - replay volume is controlled only by its own two sample rates plus quota adjustment [raw/sentry--quotas--spike-protection-cost-control.md, raw/sentry--session-replay--sampling-and-privacy.md].
- Spike Protection threshold = max(minimum-event floor, 7-day seasonality-weighted usage projection); recalculates hourly during a spike; dropped events decay out of the threshold calculation over ~2 days so one-off spikes don't permanently distort future baselines [raw/sentry--quotas--spike-protection-cost-control.md]. Does not apply during trials. Off by default for notifications (must opt in per project).
- **SDK sample rate vs. server-side rate limit are different tools**: SDK sample rate is evaluated client-side, static, requires redeploy to change, and reduces visibility into true occurrence frequency even under normal load. A server-side per-DSN rate limit only drops events once volume is already abnormally high, preserving full visibility in normal operation - Sentry's own guidance favors the rate limit for a "protect against surges" need and reserves SDK sample rate for deliberate baseline volume management [raw/sentry--quotas--spike-protection-cost-control.md].
- Recommended rate-limit cadence: derive a daily max from expected volume, then prefer a **minute-based** limit over daily/hourly so one spike doesn't exhaust a whole day's/hour's budget and leave the project blind for the remainder of that window [raw/sentry--quotas--spike-protection-cost-control.md].
- Dynamic Sampling (server-side, spans/transactions only, not errors) retains data selectively post-ingestion but does **not** reduce billed volume, since billing meters received events, not retained ones - so a high `tracesSampleRate` still costs at send-time regardless of later server-side thinning [raw/sentry--quotas--spike-protection-cost-control.md].
- Events that never count toward quota: dropped by active Spike Protection, blocked by inbound data filters, excluded by SDK sample rate (never sent), or rejected after quota exhaustion [raw/sentry--quotas--spike-protection-cost-control.md].

## Gaps and open questions (state plainly, do not guess)

1. **Vite plugin's full combined config with `sentrySvelteKit()`** was not captured in complete verbatim form (fetch truncated mid-snippet) - the ordering rule is confirmed but the full option surface for the SvelteKit-specific wrapper (as opposed to the standalone `@sentry/vite-plugin`) should be verified against the live npm package/docs before treating any exhaustive option list as complete [raw/sentry--sveltekit-sdk--client-server-hooks.md].
2. **No first-party "Vercel + sentry-cli releases set-commits" walkthrough exists** in the fetched official sources - the Vercel-native commit-SHA env var path is the only confirmed-documented route for that specific platform combination; a manually-scripted `sentry-cli` release step in a Vercel build is unverified by this research, not necessarily broken [raw/sentry--releases--commit-association.md].
3. **The exact public-DSN env var naming convention for a SvelteKit app under the Sentry Vercel integration** is not confirmed - official docs show `NEXT_PUBLIC_SENTRY_DSN` (Next.js-specific); no SvelteKit-equivalent variable name was found in the fetched Vercel-integration source [raw/sentry--integrations--vercel-marketplace.md].
4. **ML Priority Alerts' current availability/plan tier** is sourced from an August 2024 blog post and was not re-confirmed against a current pricing/feature page - treat the specific "Business plan, 35% reduction" claim as dated, not necessarily still accurate [raw/sentry--alerts--issue-alert-rules-noise.md].
5. **Backpressure-based automatic downsampling** is documented at the SDK-spec level (`develop.sentry.dev`) but this research did not confirm whether `@sentry/sveltekit` specifically implements it - flag as spec-level capability, not a confirmed-shipped SvelteKit SDK feature [raw/sentry--performance--tracing-sampling-strategy.md].
6. **No research was done on PostHog's own session replay, analytics, or feature-flag surfaces.** Any claim about the Sentry/PostHog replay boundary in this skill's guides is an inference about Sentry's own documented scope (error/debugging-context replay), not a comparative claim grounded in PostHog research [raw/sentry--session-replay--sampling-and-privacy.md].
