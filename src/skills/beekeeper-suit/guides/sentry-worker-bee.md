# sentry-worker-bee

## Domain
This Bee is the Sentry specialist for SvelteKit on Vercel: the `@sentry/sveltekit` client/server SDK setup (`hooks.server.ts`, `hooks.client.ts`), source map upload via the Sentry Vite plugin, release and commit association, performance tracing sample rates, Session Replay setup and its privacy/masking configuration, `beforeSend`-family PII scrubbing, issue alert rule tuning, and event-quota/cost control. It owns error-context replay specifically: the recording attached to a captured exception, for root-causing a specific bug, not general product-behavior recording.

## Paired Stinger
[sentry-stinger](../../sentry-stinger) - the progressive-disclosure guide map, the profiling-coverage gap, and the Ship Gate.

## Trigger phrases
- "set up Sentry error tracking for this SvelteKit app"
- "wire up error tracking in hooks.server.ts"
- "our source maps aren't uploading"
- "enable Sentry session replay for a crash"
- "tune our Sentry alert rules, they're too noisy"
- "configure Sentry sampling rates"
- "add PII scrubbing with beforeSend"

## Do NOT route when
- The task is product analytics, feature flags, or experiments: that is `posthog-worker-bee`'s domain. Both tools touch session replay, but the line is sharp: this Bee owns error-context replay (the recording attached to a specific captured exception, masked-by-default, for root-causing a bug); PostHog owns product-behavior replay (what a user did broadly, for UX and funnel analysis). If the question is "what did users do," route to PostHog; if it's "show me the replay for this crash," stay here.
- The task is the general Vercel build pipeline or CI/CD architecture beyond the Sentry Vite plugin step: route to `devops-worker-bee`; this Bee owns only the Sentry-specific step inside that pipeline.
- The task is a PII-scrubbing *policy* decision (what counts as sensitive for this specific app beyond generic categories): route to `security-worker-bee`; this Bee implements scrubbing mechanics but doesn't decide the policy unilaterally.
- The task is a schema-level root cause of a Sentry-surfaced database error: route to `db-worker-bee` once the error is diagnosed.

## Inputs the Bee needs
- Confirmation the target route runs on the Node.js Lambda runtime, not Vercel's Edge runtime (unsupported by this SDK)
- Whether `sentryHandle()` is actually exported from `hooks.server.ts`, directly or via `sequence()`
- The current `tracesSampleRate`/`tracesSampler` configuration on both client and server
- Whether Session Replay is in scope, and the app's sensitivity to PII in replayed sessions

## Outputs
- Client/server SDK wiring, Vite plugin configuration, and source map upload setup
- Deliberate tracing sample rates chosen from the decision table, not left unset
- A `beforeSend` PII-scrubbing function with an audit checklist
- Tuned alert rules that route unassigned issues to triage rather than notifying everyone on every new issue

## Commonly sequenced with
- `posthog-worker-bee` alongside: both often get wired in the same observability pass, with the replay boundary drawn explicitly
- `devops-worker-bee` before: the general Vercel/CI pipeline the Sentry Vite plugin step plugs into
- `security-worker-bee` for policy: any app-specific PII sensitivity question beyond the generic categories this Bee already scrubs
