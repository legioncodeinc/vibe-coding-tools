# vercel-worker-bee

## Domain
Owns Vercel platform configuration specifically for the SvelteKit (Svelte 5) + Neon Postgres stack: `@sveltejs/adapter-vercel` setup and its runtime/regions/memory/maxDuration/isr/images options, the Node.js-vs-Edge runtime decision, ISR and the three-tier Cache-Control precedence, environment variables per Production/Preview/Development, Vercel cron jobs, the SvelteKit image-optimization gap and its two mitigation paths, Routing Middleware, the Vercel Firewall/WAF and rate limiting, cost control and Spend Limits, `vercel.json`, Turborepo monorepo deploys, Instant Rollback, and the Vercel-Neon integration.

## Paired Stinger
[vercel-stinger](../../vercel-stinger) - adapter setup and runtime choice, caching/ISR precedence, env vars, cron limits, image optimization, middleware/firewall, Neon integration, and deploys/domains/rollback/cost control.

## Trigger phrases
- "deploy this to Vercel"
- "set up adapter-vercel"
- "why is my Vercel bill so high"
- "set up ISR for this route"
- "add a Vercel cron job"
- "set up rate limiting on Vercel"
- "connect Neon to Vercel"
- "roll back this deployment"

## Do NOT route when
- The ask is the SvelteKit app's own route/component logic, not the deployment configuration: route to ux-ui-svelte-worker-bee.
- The ask is the Neon schema or migrations themselves, not the `DATABASE_URL` wiring: route to db-worker-bee.
- The ask is TanStack library usage inside the deployed app: route to tanstack-worker-bee.
- The ask is general non-Vercel CI/CD pipeline design: route to devops-worker-bee.
- The ask is a security audit of the resulting deployment/firewall configuration: route to security-worker-bee.

## Inputs the Bee needs
- The surface in play: adapter setup, caching, env vars, cron, images, middleware/firewall, cost, or Neon integration.
- The target plan (Hobby vs. paid) when cron scheduling is involved, since limits differ.
- Whether Vercel-Managed or Neon-Managed integration is already enabled (they are mutually exclusive).
- Confirmation of new-route runtime intent, since Node.js is now the default recommendation over Edge.

## Outputs
- `@sveltejs/adapter-vercel` configuration and runtime choice with rationale.
- Cache-Control header strategy respecting the `Vercel-CDN-Cache-Control` > `CDN-Cache-Control` > `Cache-Control` precedence.
- An audited `vercel env ls` pass across all three environments, or a cron/middleware/firewall configuration.
- A Neon integration decision (Vercel-Managed vs. Neon-Managed vs. Manual) and a Spend Limit set before shipping variable-cost surfaces.

## Commonly sequenced with
- ux-ui-svelte-worker-bee: for the route/component logic the deployment config wraps.
- db-worker-bee: for the Neon schema behind the `DATABASE_URL` this Bee wires.
- tanstack-worker-bee: when a Query prefetch pattern interacts with ISR/Cache-Control behavior.
- security-worker-bee: for auditing the resulting firewall/deployment configuration.
