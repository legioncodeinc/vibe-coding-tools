# 03, Payment Intents lifecycle

Applies whether the PaymentIntent is behind a Custom Checkout Session (default) or created directly (the fallback path from `guides/01-choose-your-integration.md`). Either way, this is the state machine actually confirming money movement.

Source: [raw/stripe--payment-intents--confirm-3ds-status.md], [raw/stripe--custom-checkout-session--quickstart.md], [raw/stripe--idempotency--api-requests.md].

## Create → confirm → status

1. **Create server-side.** A Checkout Session (default) or a raw PaymentIntent, either way, this happens with your secret key, never client-side. Amount/price resolution happens server-side too, from a `lookup_key`-resolved Price or a trusted server calculation, never from client input. See `references/server-create-checkout-session.ts`.
2. **Confirm client-side.**
   - Custom Checkout Session: `checkout.confirm()` (via `checkout.loadActions()` → `actions.confirm()`).
   - Raw Payment Intents: `stripe.confirmPayment({ elements, confirmParams: { return_url }, redirect })`.
3. **Handle the result.** Both attempt to complete any required action automatically, a 3DS dialog, a redirect to a bank authorization page, and don't resolve until that step finishes or times out [raw/stripe--payment-intents--confirm-3ds-status.md].

## `redirect: 'if_required'`

By default, `stripe.confirmPayment` always redirects to `return_url` after a successful confirmation, even for card payments that didn't need to leave the page. Set `redirect: 'if_required'` to only redirect when the chosen payment method is genuinely redirect-based (iDEAL, some bank debits). Once you do, you must handle two separate success paths:

- **Non-redirect:** `confirmPayment` resolves with `{ paymentIntent }` directly; check `paymentIntent.status === 'succeeded'`.
- **Redirect-based:** the browser navigates away and comes back to `return_url` with `payment_intent` / `payment_intent_client_secret` query params appended; retrieve status with `stripe.retrievePaymentIntent(clientSecret)` on that return page.

[raw/stripe--payment-intents--confirm-3ds-status.md]

## Status values that matter client-side

| Status | Meaning |
|---|---|
| `succeeded` | Payment complete (or `requires_capture` if using manual capture) |
| `requires_action` | 3DS or other authentication pending, shown as "Incomplete" in the Dashboard, sometimes "Partially paid"/"Waiting on funding"/"Failed" depending on the specific condition |

`stripe.handleNextAction({ clientSecret })` is the lower-level primitive for resuming a PaymentIntent stuck in `requires_action`, used in server-finalization flows. It can take several seconds, disable the form, show a spinner, and make sure success/error messaging is screen-reader accessible through a 3DS challenge [raw/stripe--payment-intents--confirm-3ds-status.md].

## 3DS / SCA in practice

- 3DS challenges surface automatically inside `confirmPayment`/`checkout.confirm()`, you don't orchestrate the dialog yourself, but you do need to keep the form disabled and show a waiting state while it runs.
- For saved payment methods charged later without the customer present, see `guides/04-saving-payment-methods.md`, the SCA-exemption path (merchant-initiated transactions) is decided at save time, not at charge time.

## Off-session charges

```ts
const paymentIntent = await stripe.paymentIntents.create({
  amount,
  currency: 'usd',
  customer: customerId,
  payment_method: savedPaymentMethodId,
  off_session: true,
  confirm: true,
});
```

Catch `authentication_required` error codes and retrieve the PaymentIntent to recover, some off-session charges still require the customer to come back online for authentication even with a properly SCA-authenticated saved card [raw/stripe--payment-intents--confirm-3ds-status.md] [raw/stripe--setup-intents--save-payment-methods.md].

## Idempotency on confirm/create

Any server-side `paymentIntents.create` (or `.confirm`) that could be retried under a network timeout needs an `Idempotency-Key`:

```ts
await stripe.paymentIntents.create(
  { amount, currency: 'usd', customer: customerId, off_session: true, confirm: true },
  { idempotencyKey: `pi-charge:${customerId}:${invoiceId}` },
);
```

Stripe caches the first response (success or error) for the key and replays it verbatim on retry within the API's replay window, see `guides/09-security-and-pci-scope.md` for the full idempotency semantics and `guides/10-production-failure-modes.md` for what goes wrong without it [raw/stripe--idempotency--api-requests.md].

## Provisioning is still webhook-only

Nothing in this guide grants access or entitlements. A `succeeded` status on the client is a UX signal, not the source of truth, see `guides/06-webhooks-and-provisioning.md` for why the webhook is the only writer.
