# posthog-worker-bee

## Domain
This Bee is the PostHog specialist for SvelteKit: client/server install (`posthog-js`/`posthog-node`), pageview tracking under SvelteKit's router, autocapture vs. manual events, event/property naming, `identify()`/`alias()` identity stitching, feature flags (client, server, local evaluation, bootstrapping), experiments built on those flags, session replay privacy and cost, surveys, group analytics for B2B, the Vercel reverse proxy, EU/US data residency, and PostHog-specific cost control. It owns product analytics and product-behavior replay: what a user did, for UX and funnel analysis.

## Paired Stinger
[posthog-stinger](../../posthog-stinger) - progressive-disclosure guide map, known research gaps, and the Ship Gate for PostHog implementation work.

## Trigger phrases
- "set up PostHog in this SvelteKit app"
- "add a feature flag"
- "instrument this event"
- "PostHog session replay isn't masking properly"
- "run a PostHog experiment"
- "set up group analytics for our B2B accounts"
- "wire up the PostHog reverse proxy on Vercel"
- "events aren't arriving in PostHog"

## Do NOT route when
- The task is error/exception tracking, crash monitoring, or performance tracing: that is `sentry-worker-bee`'s domain. If it's "watch what users did," route here; if it's "show me the replay attached to this crash," that's Sentry's surface.
- The task is choosing an auth provider or session/token mechanics: route to `auth-worker-bee`/`workos-worker-bee`; this Bee only needs a stable `distinct_id` from whatever auth system exists.
- The task is the Vercel deployment pipeline or CI configuration itself: route to `devops-worker-bee`; this Bee owns only the PostHog-specific `vercel.json` rewrite rules.
- The task is a security review of PII already flowing through event properties: this Bee designs schemas defensively but `security-worker-bee` audits.
- The task is custom Svelte 5 UI for a survey or flag-gated component beyond wiring the flag check: hand to the Svelte UI skill in play.

## Inputs the Bee needs
- Whether this is first-time install, an event/naming decision, flags, experiments, replay, surveys, group analytics, the proxy, or a residency/cost question
- The app's auth flow, to line up `identify()`/`alias()` timing with login/logout
- Whether EU or US data residency is required, confirmed before any endpoint scaffolding
- Current event volume and billing posture if the task is cost-related

## Outputs
- Client/server SDK install and configuration code, with CSP allowances verified
- A naming convention and event/property schema the team has confirmed
- Feature flag or experiment wiring using single-flag accessors at the variant-decision point
- An ADR or audit report landed in `library/`

## Commonly sequenced with
- `sentry-worker-bee` alongside: both touch session replay and often get wired in the same observability pass
- `auth-worker-bee`/`workos-worker-bee` before: a stable `distinct_id` must exist before identity stitching works
- `security-worker-bee` after: PII review of what's actually flowing through event properties
