# 08, Testing and local development

Source: [raw/stripe--cli--listen-testing-test-clocks.md], [raw/stripe--sveltekit--stripe-integration-tutorial.md], [raw/stripe--pci--compliance-scope.md].

## The rules

1. Live keys (`sk_live_*`) only exist in production deploy infrastructure, never in test scripts, fixtures, CI, dev machines, or screenshots.
2. Local dev runs test mode + Stripe CLI (`stripe listen`).
3. Staging runs test mode + its own registered webhook endpoint, same code path as production, different secrets.
4. Production runs live mode.

## The local dev loop

```bash
# Terminal 1
npm run dev

# Terminal 2, no Dashboard-registered endpoint required
stripe listen --forward-to localhost:5173/api/webhooks/stripe
# > Ready! Your webhook signing secret is whsec_...  (stable for this session, differs from any Dashboard secret)

# Terminal 3
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
```

Put the printed `whsec_...` into local `.env` as `STRIPE_WEBHOOK_SECRET`. It is **not** the same value as any Dashboard-registered production endpoint's secret, never cross-verify one against the other [raw/stripe--cli--listen-testing-test-clocks.md] [raw/stripe--sveltekit--stripe-integration-tutorial.md].

`stripe trigger <event>` can cascade related events, triggering `payment_intent.succeeded` also triggers `payment_intent.created`. Account for that when asserting exact event counts in a test.

`stripe events resend evt_xxx --webhook-endpoint=we_123456` replays a real past event (within 30 days) against a specific endpoint, useful for reproducing a production bug locally without waiting for a fresh live event [raw/stripe--cli--listen-testing-test-clocks.md].

## Test cards

Full table: `references/test-card-table.md`. Highlights:

- `4242 4242 4242 4242`, baseline success.
- Specific decline PANs map to specific decline codes (insufficient funds, lost/stolen card, expired, incorrect CVC, processing error).
- CVC checks are skipped entirely if you omit a CVC, supply one to actually exercise the CVC-decline path.
- General EEA test cards succeed **without** triggering 3DS. Use the dedicated regulatory/3DS test cards to exercise `requires_action` and the confirm-flow's authentication handling.

## Test Clocks for subscription lifecycle testing

Test Clocks freeze and advance simulated time in test mode. Create a subscription at a frozen point, advance the clock, and deterministically observe trial-end, renewal, and dunning webhooks without waiting real days or weeks, this is how you actually test `guides/05-subscriptions-with-custom-ui.md`'s `billing_cycle_anchor` behavior and the cancellation webhook sequencing without a multi-week manual test cycle [raw/stripe--cli--listen-testing-test-clocks.md].

## Sandbox provisioning for coding agents

Stripe's own guidance for AI coding agents: install the Stripe CLI (`npm i -g @stripe/cli`) and run `stripe sandbox create --help` to provision an anonymous sandbox with working test API keys, no account registration required [raw/stripe--payment-element--overview.md]. Useful for spinning up a disposable test environment inside an agentic workflow without asking a human to paste in keys first.

## What testing does NOT need to cover

Card-number-collecting input validation, PCI-scope-relevant DOM behavior, none of that is your code's responsibility to test, because Stripe.js renders those inputs inside its own iframe. Test your side (session/intent creation, webhook handler behavior, entitlement provisioning), not Stripe's (see `guides/09-security-and-pci-scope.md`).
