# Env var checklist (SvelteKit)

Grounded in [raw/stripe--sveltekit--stripe-integration-tutorial.md], [raw/stripe--webhooks--receive-and-verify.md], [raw/stripe--pci--compliance-scope.md].

## The split

SvelteKit only exposes vars prefixed `PUBLIC_` to client code, via `$env/static/public` (or `$env/dynamic/public`). Everything else, loaded via `$env/static/private`, is server-only and SvelteKit blocks importing it into a client bundle at the module-resolution level, this is a framework-enforced guard, not just a naming convention you have to remember.

| Variable | Prefix | Loaded via | Never in client code |
|---|---|---|---|
| `STRIPE_SECRET_KEY` (`sk_test_...` / `sk_live_...`) | none | `$env/static/private` | Yes, secret key |
| `STRIPE_WEBHOOK_SECRET` (`whsec_...`) | none | `$env/static/private` | Yes, webhook signing secret |
| `PUBLIC_STRIPE_PUBLISHABLE_KEY` (`pk_test_...` / `pk_live_...`) | `PUBLIC_` | `$env/static/public` | Safe client-side by design |
| `PUBLIC_BASE_URL` | `PUBLIC_` | `$env/static/public` | Safe, used for `return_url` construction |

## Placement convention

- Server-only Stripe client instance: `src/lib/server/stripe.ts`. Anything under `src/lib/server/` is import-blocked from client-side code by SvelteKit, a second guard beyond the `PUBLIC_` prefix rule.
- Webhook route: `src/routes/api/webhooks/stripe/+server.ts`.

## Per-environment secrets are NOT interchangeable

- `STRIPE_WEBHOOK_SECRET` differs between the Stripe CLI's local `stripe listen` output and every Dashboard-registered production endpoint. Never reuse the CLI-printed secret in a deployed environment's `STRIPE_WEBHOOK_SECRET`, and never verify CLI-forwarded events against a Dashboard endpoint's secret.
- Test-mode and live-mode keys on the *same* endpoint have different `whsec_*` values too.

## Deployment target requirement

Checkout Session creation and webhook receipt need server endpoints, an SSR-capable adapter is required (Vercel, Netlify, Cloudflare, or self-hosted Node). `adapter-static` cannot host these routes at all.

## Minimal `.env` (local dev)

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...          # from `stripe listen`, not the Dashboard
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
PUBLIC_BASE_URL=http://localhost:5173
```

## Production checklist

- [ ] `STRIPE_SECRET_KEY` is `sk_live_...`, stored in the platform's secrets vault (Vercel/Netlify env vars, not committed).
- [ ] `STRIPE_WEBHOOK_SECRET` is the secret from the production Dashboard-registered endpoint, not the CLI's local secret.
- [ ] `PUBLIC_STRIPE_PUBLISHABLE_KEY` is `pk_live_...`.
- [ ] `PUBLIC_BASE_URL` matches the actual deployed domain (hardcoding `localhost` here breaks `return_url` in production).
- [ ] No `sk_*` or `whsec_*` value appears in any committed `.env` file, log line, or CI artifact.
