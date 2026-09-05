# Sentry's Vercel integrations: the legacy Releases/Source Maps integration vs. the newer Vercel Marketplace integration

- URL: https://docs.sentry.io/integrations/deployment/vercel/ ; https://vercel.com/marketplace/sentry/sentry ; https://vercel.com/marketplace/sentry
- Fetched: 2026-08-14
- Source type: Official docs (docs.sentry.io) + official Vercel Marketplace listing pages (vercel.com)
- Component: Vercel integration

## Content

### Two distinct integrations exist - do not conflate them

1. **"Releases and Source Map Integration"** (the older, still-supported integration): links a Sentry project to a Vercel project specifically to auto-notify Sentry of deployments and auto-upload source maps. Requires an existing Sentry organization.
2. **"Vercel Marketplace" integration** (newer): a one-click onboarding flow **designed for new Sentry users**, unifying billing inside the Vercel platform itself. **There is no path for an existing Sentry organization to adopt the Marketplace integration** - it's specifically a new-org onboarding surface, not an upgrade path for existing Sentry customers.

For an existing Sentry organization, Path 1 is the relevant one. For a brand-new project starting from zero with no existing Sentry org, Path 2 is Vercel's own recommended fast path.

### Path 1: Releases and Source Map Integration - install and configure

Requires Sentry owner/manager/admin permissions to install.

1. Install from the Sentry integrations page, select the Vercel scope, the Vercel project(s), and review requested permissions. This step **creates an internal integration** in Sentry used to generate an auth token for building releases. **If that internal integration is later deleted, the whole Vercel integration stops working** - it's not just a scoping artifact, it's load-bearing.
2. During project linking, select a Sentry project + Vercel project pair. This **auto-generates environment variables in the selected Vercel project** (visible in Vercel under Project Settings > General > Environment Variables):
   - `SENTRY_ORG` - Sentry organization name
   - `SENTRY_PROJECT` - linked Sentry project name
   - `SENTRY_AUTH_TOKEN` - the auth token from the auto-created Vercel Internal Integration
   - `NEXT_PUBLIC_SENTRY_DSN` - the linked project's DSN (Next.js-flavored env var name; for a non-Next.js SvelteKit app, use the framework-appropriate public DSN env var instead, or reference the DSN via the SvelteKit SDK's own config pattern)
3. Redeploy the Vercel project to trigger the first Sentry-tracked release.

Having these auto-injected means the manual "CLI Configuration" step otherwise required for the Sentry bundler plugins (webpack/Vite/esbuild/Rollup) can be skipped - the plugin picks up `SENTRY_AUTH_TOKEN`/`SENTRY_ORG`/`SENTRY_PROJECT` from environment automatically rather than needing them hardcoded in `vite.config.ts`.

### Usage checklist (from official docs)

- Instrument the app code with the Sentry SDK first.
- Install a repository integration (GitHub/GitLab/Bitbucket) and add the relevant repo, if commit association/suspect-commits matters.
- Add the appropriate Sentry bundler plugin (Vite plugin for SvelteKit) to the build config - **for Sentry's own Next.js and SvelteKit SDKs this step is already done for you** as part of SDK setup (i.e., `@sentry/sveltekit`'s Vite plugin wiring already covers this, separate from whether the Vercel integration itself is installed).
- If a Vercel project was already integrated with Sentry previously, make sure the Sentry project being (re-)linked is the same one already receiving errors, to avoid a split-brain project setup.

### Drains (logs + traces)

The same integration can additionally set up **Vercel Drains** (log drain + OTLP trace drain) to forward Vercel runtime/application logs and traces into Sentry, so they show up connected to errors/traces/replays inside Sentry rather than only in the Vercel dashboard.

### Uninstalling

Two matching steps required: (1) uninstall from Sentry side (`Settings > Integrations > Vercel > Configurations > Uninstall`), and (2) separately delete the internal integration Sentry created (`Settings > Developer Settings`, trash icon next to "Vercel Internal Integration") - confirmed by typing a provided string. Skipping step 2 leaves a dangling internal integration.

### Troubleshooting: "Failed to fetch" during setup

Typically caused by an **ad blocker interfering with the Vercel<->Sentry handshake during installation**. Fix: disable the ad blocker and redo the install flow.

### Path 2: Vercel Marketplace integration

Designed for brand-new Sentry users onboarding via Vercel's marketplace UI. During setup, the user names both the new Sentry "Installation" (organization) and its projects/resources.

**Billing**: credit card settings can only be changed inside Vercel; subscription plan tier (Developer/Team/Business) and pay-as-you-go budgets are configured inside Sentry itself.

**User access**: only the person who runs the one-click setup gets a Sentry user account automatically; other teammates need an explicit Sentry org invite even though they may already have SSO-style "Open in Sentry" access from within Vercel. Non-social-login users get prompted to set a password on first login.

**Auto-configured environment variables** (per project, Marketplace path):

- `SENTRY_PROJECT`
- `SENTRY_AUTH_TOKEN` (from the Vercel Internal Integration)
- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_ORG`
- `SENTRY_VERCEL_LOG_DRAIN_URL` (for Vercel Log Drains)
- `SENTRY_OTLP_TRACES_URL` (for Vercel Trace Drains)
- `SENTRY_PUBLIC_KEY` (auth for log/trace drains)

This is a superset of the legacy path's variable list - the Marketplace path additionally wires the drain URLs and a separate public key automatically as part of onboarding, where the legacy path treats drains as a distinct, separately-configured step.

**Deletion is asymmetric and irreversible in one direction**: deleting the integration from the Vercel side does **not** delete the Sentry organization - it only severs the Vercel<->Sentry connection, permanently and irreversibly. This is deliberate, so historical Sentry data remains accessible even if the org stops actively ingesting new events. After deletion, the org can still fall back to the legacy (Path 1) integration if needed - **only one integration type can be active at a time**, so this is a migration path, not a simultaneous-use scenario.

### Vercel's own marketplace listing (feature framing, less technical detail)

Vercel's marketplace page for Sentry frames the integration around: distributed tracing (root-causing slow API calls across services), session replay (real-world impact of errors), and unified runtime/application log visibility connected to errors/traces/replays. Installation via `npx @sentry/wizard@latest -i sourcemaps --saas --coming-from vercel` is shown for source-map-specific setup coming from a Vercel-initiated flow, distinct from the general `npx @sentry/wizard@latest -i sourcemaps` command shown in the standalone source-maps docs (see the source maps raw file) - the `--saas --coming-from vercel` flags appear to just tell the wizard which onboarding context it's running in.

### Practical implication for this skill's SvelteKit/Vercel/Neon stack

For an existing Hive project (not a brand-new Sentry signup), Path 1 (Releases and Source Map Integration) is the relevant one to document and default to. Path 2 (Marketplace) is worth knowing about only for the "first Sentry project ever, greenfield, sign up through Vercel" case - flag this distinction explicitly rather than defaulting instructions to whichever one happens to come up first in search results, since picking the wrong one wastes the operator's setup time re-doing billing/org configuration.
