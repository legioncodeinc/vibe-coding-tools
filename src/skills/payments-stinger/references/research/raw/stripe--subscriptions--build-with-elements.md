# Build a subscriptions integration with Elements

- URL: https://docs.stripe.com/payments/advanced/build-subscriptions ; https://docs.stripe.com/billing/subscriptions/build-subscriptions ; https://docs.stripe.com/billing/subscriptions/trials
- Fetched: 2026-08-14
- Source type: official docs
- Component: Subscriptions with custom UI

## Facts

- Stripe documents subscription-with-Elements integration under two variants, matching the same two-API split as one-time payments: Checkout Sessions (`ui_mode: elements`) and raw Payment Intents ("elements" api-integration). Same tradeoff logic applies, Checkout Sessions carries tax/discount/proration logic for you, raw Payment Intents doesn't.
- Trial offers (the newer Trial Offer API, `api-version=2026-03-25.preview` at time of research) let you configure free or paid introductory periods with a single API integration, replacing the legacy `trial_end` parameter approach.
- Important scope limit: Trial Offers are supported only when creating subscriptions directly via the Subscriptions API. They are explicitly NOT supported by: hosted Checkout (must use legacy `trial_end`), Payment Links, or "Elements with Checkout Sessions." This means a custom-Elements-with-Checkout-Sessions subscription flow that needs a discounted/paid trial period must fall back to the legacy `trial_end` parameter, not the new Trial Offer object.
- You cannot mix the legacy `trial_end` parameter and the new Trial Offer API on the same subscription.
- `billing_cycle_anchor` behavior when a trial ends matters for proration correctness: `now` (default) resets the anchor to the moment the trial ends, generating a full-amount invoice with no proration for the new cycle; `unchanged` keeps the original anchor, which prorates the partial period between trial-end and the next natural anchor date.
- Example: a 7-day $1 trial transitioning to $20/month with `now` behavior bills the full $20 for the Jan 8 to Feb 8 period with zero proration; with `unchanged` behavior the period would be prorated against the original anchor date.
- For upgrade/downgrade (plan switching) proration behavior in a custom UI, use the Subscriptions API's update endpoint directly and read `proration_behavior`; the Customer Portal's built-in plan-switch UI caps at 10 configurable products (see stripe--customer-portal--vs-custom-billing-ui.md), a custom UI is the only way past that cap.
