# Payment Intents: confirm, 3DS/SCA, status verification

- URL: https://docs.stripe.com/payments/payment-intents/verifying-status ; https://docs.stripe.com/js/payment_intents/confirm_payment ; https://docs.stripe.com/js/payment_intents/handle_next_action ; https://docs.stripe.com/js/payment_intents/confirm_card_payment
- Fetched: 2026-08-14
- Source type: official docs
- Component: Payment Intents lifecycle

## Facts

- `stripe.confirmPayment({ elements, confirmParams: { return_url }, redirect })` confirms a PaymentIntent using data collected by the Payment Element (or manually via `confirmParams`).
- `stripe.confirmPayment` attempts to complete any required action automatically, 3DS dialog, redirect to a bank authorization page, and only resolves once that step completes or times out.
- By default `confirmPayment` always redirects to `return_url` after a successful confirmation, even for card payments. Set `redirect: "if_required"` to only redirect for genuinely redirect-based payment methods; in that mode you must handle successful non-redirect confirmations (`{paymentIntent}` returned directly) and redirect-based ones (browser navigates away) as two separate code paths.
- On return from a redirect, Stripe appends `payment_intent` and `payment_intent_client_secret` query params to your `return_url`; use these to `stripe.retrievePaymentIntent(clientSecret)` and inspect `paymentIntent.status`.
- Status values relevant to client-side handling: `succeeded` (or `requires_capture` for manual capture), `requires_action` (3DS or other auth needed, maps to "Incomplete" in Dashboard, sometimes shown as "Partially paid"/"Waiting on funding"/"Failed" depending on the specific auth/error condition).
- `stripe.handleNextAction({ clientSecret })` is the lower-level primitive for finishing confirmation of a PaymentIntent stuck in `requires_action` status, used in "finalize payments on the server" flows; throws if the PaymentIntent isn't in that status. Can take several seconds, disable the form and show a spinner while it runs, and make sure success/error messaging is accessible for screen readers going through a 3DS challenge.
- `stripe.confirmCardPayment` is the older, lower-level card-specific confirm call; sets `setup_future_usage` to indicate intent to charge this payment method later off-session (this is what triggers SCA-compliant authentication during the *first* charge so later off-session charges don't need it).
- `off_session: true, confirm: true` on a server-side `paymentIntents.create` call is how you charge a saved payment method with no customer present; catch `authentication_required` error codes and retrieve the PaymentIntent to recover, since some off-session charges still require the customer to come back online for authentication (see also stripe--setup-intents--save-payment-methods.md for the merchant-initiated-transaction exemption path).
