# 05, Subscriptions with custom UI

Source: [raw/stripe--subscriptions--build-with-elements.md], [raw/stripe--custom-checkout-session--quickstart.md], [raw/stripe--customer-portal--vs-custom-billing-ui.md], [raw/stripe--idempotency--api-requests.md].

## Default creation path

Custom Checkout Session, `mode: subscription`, `ui_mode: elements`, same Elements-first default as one-time payments. See `references/subscription-creation-flow.ts` for the full server function.

```ts
const session = await stripe.checkout.sessions.create({
  ui_mode: 'elements',
  mode: 'subscription',
  customer: customerId,
  line_items: [{ price: price.id, quantity: 1 }],
  automatic_tax: { enabled: true },
  subscription_data: { trial_period_days: 14, metadata: { app_user_id: userId } },
  payment_method_collection: 'always', // card captured at signup, no surprise dunning
  return_url: `${baseUrl}/billing/return?session_id={CHECKOUT_SESSION_ID}`,
});
```

Use `lookup_keys`, never a hardcoded `price_*` ID, marketing changes a price without an emergency redeploy this way. Resolve server-side: `stripe.prices.list({ lookup_keys: [...] })`.

## Trials: use the legacy `trial_period_days`, not the Trial Offer API, under Elements-with-Checkout-Sessions

The newer Trial Offer API is explicitly NOT supported by hosted Checkout (must use legacy `trial_end`), Payment Links, or Elements-with-Checkout-Sessions, it's only supported when creating subscriptions directly via the raw Subscriptions API [raw/stripe--subscriptions--build-with-elements.md]. If a custom-Elements subscription flow needs a discounted or paid trial, this is a genuine gap in the current API surface: fall back to `trial_period_days` (a free trial) on `subscription_data`, or move that specific flow to direct Subscriptions API creation if a paid trial via Trial Offer is a hard requirement. Do not mix the legacy `trial_end` parameter and the Trial Offer API on the same subscription.

## `billing_cycle_anchor` at trial end

| Setting | Effect |
|---|---|
| `now` (default) | Resets the anchor to the moment the trial ends; bills the full amount for the new period with zero proration |
| `unchanged` | Keeps the original anchor; prorates the gap between trial-end and the next natural anchor date |

Get this wrong and a trial-to-paid transition either bills the full amount unexpectedly early or silently prorates when the product team expected a clean full-price charge [raw/stripe--subscriptions--build-with-elements.md].

## Proration on plan switch

```ts
await stripe.subscriptions.update(
  subscriptionId,
  { items: [{ id: currentItemId, price: newPriceId }], proration_behavior: 'create_prorations' },
  { idempotencyKey: `sub-switch:${subscriptionId}:${newPriceLookupKey}` },
);
```

`proration_behavior`: `create_prorations` (default, standard credit/owe split), `none` (new plan starts at next period boundary, no proration), `always_invoice` (invoice the proration delta immediately). Don't hand-calculate prorations in app code: Stripe does this correctly, and re-implementing it is a common source of subtle billing bugs.

## Customer Portal vs custom UI: the actual boundary

Let the Portal own the standard 80%: card update, invoice history, plan switching (capped at 10 configurable products), standard cancellation. Build custom UI only for what the Portal's Dashboard configuration genuinely can't express: metered-usage edits, add-ons, quotes, bespoke cancellation surveys/retention offers, trial extensions, mid-cycle pauses without a subscription schedule, or a product catalog exceeding the 10-product plan-switch cap [raw/stripe--customer-portal--vs-custom-billing-ui.md].

Both a Portal-initiated change and a direct API call (`references/subscription-creation-flow.ts`'s `switchSubscriptionPlan` / `cancelSubscriptionAtPeriodEnd`) fire identical webhook events, your handler doesn't need to know or care which origin triggered the change.

## The cancellation webhook sequencing gotcha

A cancel-at-period-end (Portal or API) fires `customer.subscription.updated` with `cancel_at_period_end: true` **immediately**, not `customer.subscription.deleted`. That event only fires later, when the subscription actually ends (up to a full billing cycle away). Treat these as two distinct actions on two distinct events:

- Cancellation confirmation (email, UI state) → `customer.subscription.updated` where `cancel_at_period_end === true`.
- Access revocation → `customer.subscription.deleted`.

A handler that only listens for `deleted` to do both will confirm the cancellation weeks late, or never notice the request happened until access is already gone [raw/stripe--customer-portal--vs-custom-billing-ui.md]. Full handler shape: `guides/06-webhooks-and-provisioning.md`.

## Cancellation modes

```ts
// Cancel at period end (most common, customer keeps access until renewal)
await stripe.subscriptions.update(subId, { cancel_at_period_end: true });

// Cancel immediately (revokes at once)
await stripe.subscriptions.cancel(subId);
```
