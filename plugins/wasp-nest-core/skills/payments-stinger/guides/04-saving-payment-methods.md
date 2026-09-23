# 04, Saving payment methods, off-session charges

Source: [raw/stripe--setup-intents--save-payment-methods.md], [raw/stripe--payment-intents--confirm-3ds-status.md].

## Setup Intents, not a raw saved PaymentMethod

The Setup Intents API sets up a payment method for future charges with zero charge created, same lifecycle machinery as a PaymentIntent, but no money moves. Attaching a SetupIntent to a `customer` auto-attaches the resulting PaymentMethod to that Customer object.

Stripe explicitly recommends SetupIntents (or `setup_future_usage` on a PaymentIntent) over saving a PaymentMethod directly, specifically to avoid saving invalid or unoptimized payment methods [raw/stripe--setup-intents--save-payment-methods.md].

## `usage`: on_session vs off_session

| Value | Meaning | Tradeoff |
|---|---|---|
| `on_session` | Only ever reuse while the customer is actively in a checkout flow | Defers authentication friction to charge time |
| `off_session` (default) | May be used with or without the customer present | Front-loads authentication (e.g. 3DS) at save time, so later off-session charges usually don't interrupt the customer |

Setting `usage: off_session` on a card under SCA lets Stripe mark subsequent off-session charges as merchant-initiated transactions (MIT), exempt from SCA when a prior agreement/mandate exists, at the cost of more friction during the save step itself [raw/stripe--setup-intents--save-payment-methods.md].

## Consent requirements (compliance, not optional)

- **On-session future use:** collect explicit consent, a "save my payment method" checkbox, not an implied opt-in.
- **Off-session future use:** you need an agreement/mandate covering (a) the customer's permission for you to initiate the charge(s), (b) the anticipated frequency (one-time vs recurring), and (c) how the amount will be determined.

[raw/stripe--setup-intents--save-payment-methods.md]

## Save flow with the Payment Element

```ts
// Server: create a SetupIntent
const setupIntent = await stripe.setupIntents.create({
  customer: customerId,
  usage: 'off_session',
});
// return setupIntent.client_secret to the client

// Client: same Payment Element mount pattern as a payment, but against a
// SetupIntent's client secret via elements.create('payment') and
// stripe.confirmSetup instead of stripe.confirmPayment. Under Custom
// Checkout Sessions, use `mode: 'setup'` on the Checkout Session instead, // see guides/01-choose-your-integration.md, "Modes within Checkout Sessions".
```

## Charging a saved payment method later (off-session)

```ts
try {
  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount,
      currency: 'usd',
      customer: customerId,
      payment_method: savedPaymentMethodId,
      off_session: true,
      confirm: true,
    },
    { idempotencyKey: `off-session-charge:${customerId}:${invoiceId}` },
  );
} catch (err: any) {
  if (err.code === 'authentication_required') {
    // Bring the customer back online to complete authentication.
    const intent = await stripe.paymentIntents.retrieve(err.raw.payment_intent.id);
    // Surface intent.client_secret to a recovery UI.
  }
}
```

Even a properly SCA-authenticated saved card can occasionally require the customer to come back online, this is a bank-side risk decision, not something you can fully eliminate. Build a recovery path rather than assuming off-session charges never need re-authentication [raw/stripe--payment-intents--confirm-3ds-status.md] [raw/stripe--setup-intents--save-payment-methods.md].

## Idempotency

Every off-session charge attempt needs a deterministic `Idempotency-Key` (e.g. `off-session-charge:<customer>:<invoice>`) so a retried request under a timeout doesn't double-charge. See `guides/09-security-and-pci-scope.md` for the full semantics.
