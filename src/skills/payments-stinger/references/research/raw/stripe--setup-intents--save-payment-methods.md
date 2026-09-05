# Setup Intents, save payment methods, off-session use

- URL: https://docs.stripe.com/payments/setup-intents ; https://docs.stripe.com/api/setup_intents ; https://docs.stripe.com/api/setup_intents/create
- Fetched: 2026-08-14
- Source type: official docs
- Component: Setup Intents

## Facts

- The Setup Intents API sets up a payment method for future payments without charging anything, same lifecycle machinery as a PaymentIntent (tracks status, can trigger authentication steps), but no charge is created.
- If attached to a `customer`, a successful SetupIntent automatically attaches the resulting payment method to that Customer object.
- `usage` parameter tells Stripe how you intend to use the saved method later:
  - `on_session`, only reuse while the customer is actively in a checkout flow.
  - `off_session` (default), may be used with or without the customer present; this is the safer default because it front-loads any required authentication (e.g., 3DS) during the save step, so a later off-session charge doesn't need to interrupt the customer.
  - Setting `usage: off_session` for a card under SCA lets Stripe mark subsequent off-session charges as merchant-initiated transactions (MIT), which are exempt from SCA when a prior agreement/mandate exists, but this creates more upfront friction during the save step itself.
- Consent requirements (compliance, not just UX): for on-session future use, explicitly collect consent (e.g., a "save my payment method" checkbox). For off-session future use, you need an agreement/mandate covering: the customer's permission for you to initiate the charge(s), the anticipated frequency (one-time vs recurring), and how the amount will be determined.
- Stripe explicitly recommends using SetupIntents (or `setup_future_usage` on a PaymentIntent) over saving a raw PaymentMethod, specifically to avoid saving invalid or unoptimized payment methods.
- Even with a properly saved off-session card, some off-session charges will still require the customer to come back online for authentication (bank-side risk decision), build a revenue-recovery/retry flow rather than assuming off-session charges never fail on auth.
