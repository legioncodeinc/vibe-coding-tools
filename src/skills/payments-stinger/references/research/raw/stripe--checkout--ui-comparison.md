# Stripe Checkout, the three payment UIs (hosted, embedded, elements)

- URL: https://docs.stripe.com/payments/checkout ; https://docs.stripe.com/payments/payment-methods/integration-options
- Fetched: 2026-08-14
- Source type: official docs
- Component: Decision comparison, hosted vs embedded vs Elements custom checkout

## Facts

- All three UIs share the same Checkout Sessions API; they differ only in `ui_mode` and how much of the UI Stripe hosts.
- Comparison table (official, condensed):

| | Full page (hosted/embedded redirect) | Embedded form | Elements (custom checkout) |
|---|---|---|---|
| API | Checkout Sessions | Checkout Sessions | Checkout Sessions |
| Feature list | Billing, Tax, Adaptive Pricing, Stripe Managed Payments, Link, dynamic payment methods, Surcharging, Split-tender | Same minus Split-tender | Adaptive Pricing, Link, dynamic payment methods only |
| Order summary | Full (subtotals, tax, shipping, cross-sell/upsell, trials, discounts) | Limited (subtotals, tax/shipping, discounts) | None, you build it |
| Hosting | Hosted or Embedded | Embedded | Embedded |
| Complexity | Low | Some | Most |
| Customization | 15 configurable settings via brand settings | ~70 settings via Appearance API | Full CSS customization via Appearance API |

- A second comparison table (payment-methods/integration-options) adds Payment Links and the "Advanced integration" (raw Payment Intents) columns:

| | Payment Links | Hosted page | Embedded page | Elements (Checkout Sessions) | Advanced (PaymentIntents) |
|---|---|---|---|---|---|
| Integration effort | No code | Low coding | Low coding | More coding | Most coding |
| Hosting | Stripe-hosted | Stripe-hosted (custom domain optional) | Embed on your site | Embed on your site | Embed on your site |
| UI customization | Limited | Limited | Limited | Extensive (Appearance API) | Extensive (Appearance API) |

- Reading across both tables: the tradeoff for full custom Elements checkout is that you lose Stripe's built-in order summary UI and some built-in feature surfaces (Surcharging, full Billing/Tax UI chrome), in exchange for full CSS control and staying on your own domain the entire time.
- The `ui_mode: elements` Checkout Sessions path is the closest thing Stripe ships to a fully "custom checkout page" while still keeping the Checkout Session as the transaction record (so tax, discounts, subscriptions, and Adaptive Pricing all still work), versus raw Payment Intents where you own all of that logic yourself.
