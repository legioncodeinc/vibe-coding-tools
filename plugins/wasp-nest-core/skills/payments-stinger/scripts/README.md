# scripts/, payments-stinger helpers

Two helpers; each is self-documenting in its file header.

## `replay-webhook-locally.sh`

Replays a Stripe event against your local handler. Two modes:

```bash
# Re-fire a specific past event (debugging a real production failure locally)
./replay-webhook-locally.sh resend evt_1AbC123XYZ

# Trigger a fresh fixture event of a given type
./replay-webhook-locally.sh trigger checkout.session.completed
```

Prerequisites:
- Stripe CLI installed (`brew install stripe/stripe-cli/stripe` or [download](https://docs.stripe.com/stripe-cli)).
- `stripe login` completed (one-time pairing).
- `stripe listen --forward-to localhost:3000/api/stripe/webhook` running in a separate terminal.

See `guides/08-testing-and-local-development.md`.

## `verify-signature-snippet.ts`

Minimal portable HMAC-SHA256 Stripe-Signature verification, no `stripe` SDK dependency. Use only when:

- You can't pull in the SDK (tiny edge runtime, locked dependency surface).
- You want a reference for what `stripe.webhooks.constructEvent` actually does.

For production: **use the SDK.** It handles edge cases (key rotation with multiple `v1=` signatures, timing-safe comparison, tolerance) the SDK maintainers think about so you don't have to.

Self-test:

```bash
npx tsx scripts/verify-signature-snippet.ts
# OK: self-test passed
```

See `guides/06-webhooks-and-provisioning.md`.
