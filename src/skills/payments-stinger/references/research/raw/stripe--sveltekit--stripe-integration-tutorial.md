# Add Stripe Payments to SvelteKit: env vars, server/client split, webhook handler

- URL: https://beag.io/blog/add-stripe-payments-sveltekit/ ; https://github.com/kszongic/sveltekit-stripe-starter ; https://svelte.dev/docs/kit/$env-static-public
- Fetched: 2026-08-14
- Source type: community tutorial + open-source starter + official SvelteKit docs (env var mechanism is official; Stripe usage pattern is community, cross-check against docs.stripe.com for Stripe-specific facts)
- Component: SvelteKit project structure, env var handling, webhook endpoint

## Facts

- SvelteKit env var convention (official, from svelte.dev): only variables prefixed `PUBLIC_` are exposed to client-side code via `$env/static/public` / `$env/dynamic/public`. Everything else loaded via `$env/static/private` / `$env/dynamic/private` is server-only and cannot be imported into client-side code, even by accident, SvelteKit enforces this at the module-resolution level, not just convention.
- Practical env var split for Stripe in SvelteKit: `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` stay unprefixed (server-only); `PUBLIC_STRIPE_PUBLISHABLE_KEY` gets the `PUBLIC_` prefix so client code can call `loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY)`.
- Recommended file convention: put the server-side Stripe client in `src/lib/server/stripe.ts`, importing the secret key from `$env/static/private`. SvelteKit treats anything under `src/lib/server/` as import-blocked from client bundles, which is a second, framework-enforced guard on top of the env var prefix rule.
- A deployment target that supports SSR/server endpoints is required (Vercel, Netlify, Cloudflare, or self-hosted Node), static-only SvelteKit adapters (`adapter-static`) cannot run the server endpoints needed for Checkout Session creation or webhook receipt.
- Webhook route convention: `src/routes/api/webhooks/stripe/+server.ts`, exporting `POST`, reading `request.headers.get('stripe-signature')` and `await request.text()`, calling `stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)`, wrapped in try/catch that returns a SvelteKit `error(400, ...)` on verification failure.
- Common breakage explicitly called out: reading the body as JSON before `constructEvent` (destroys the signature, matches the official docs' Express gotcha, confirming this is a cross-framework issue, not SvelteKit-specific); and a stale/mismatched `STRIPE_WEBHOOK_SECRET` between local CLI and deployed environments.
- The webhook secret differs between the Stripe CLI's local `stripe listen` output and each Dashboard-registered production endpoint, don't reuse the CLI secret in a deployed `STRIPE_WEBHOOK_SECRET` env var.
- `PUBLIC_BASE_URL` (or equivalent) should be an environment variable per deploy target, not hardcoded, since success/return URLs must match the actual deployed domain.
