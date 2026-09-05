# Build a checkout page with the Checkout Sessions API (Custom Checkout / Elements ui_mode)

- URL: https://docs.stripe.com/checkout/custom/quickstart (also https://docs.stripe.com/payments/quickstart-checkout-sessions)
- Fetched: 2026-08-14
- Source type: official docs
- Component: Custom Checkout Session (ui_mode: elements)

## Facts

- This is Stripe's actual "custom checkout page" product: a Checkout Session created with `ui_mode: "elements"`, rendered with Stripe Elements on your own domain, not a hosted or embedded Stripe page.
- Server-side: create a Checkout Session with `ui_mode: elements`, using your secret/restricted key. This must happen server-side; the secret key can't be exposed client-side.
- The Checkout Session's `return_url` parameter defines where Stripe redirects the customer after the payment attempt; Stripe redirects to a page hosted on your own site.
- Client-side fetches the Checkout Session's `client_secret` from your server, then initializes Checkout:
  - Vanilla JS: `checkout = stripe.initCheckoutElementsSdk({ clientSecret: promise })`, then `paymentElement = checkout.createPaymentElement(); paymentElement.mount("#payment-element")`.
  - React: render `CheckoutElementsProvider` with `clientSecret`, then use the `useCheckoutElements()` hook inside a form component to access the `checkout` object.
- The `checkout` object is "the backbone of your checkout page", it holds Checkout Session data and methods to update it (distinct from the raw `elements` object used with Payment Intents).
- Add the Payment Element to the form: `checkout.createPaymentElement()` renders an iframe with a dynamic form covering all configured payment method types.
- Theming: create an Appearance object and pass it to `CheckoutElementsProvider` (or `initCheckoutElementsSdk`) to theme the Payment Element to match your site; supports custom fonts via a font set option.
- Confirmation: call `checkout.confirm()` (vanilla: `actions.confirm()` from `checkout.loadActions()`) when the customer clicks pay, not `stripe.confirmPayment`.
- After the payment attempt, build a return page at the `return_url` you configured; Stripe substitutes a `{CHECKOUT_SESSION_ID}` template variable so you can retrieve the session's status on that page.
- This "elements" ui_mode is explicitly one of three payment UIs available under the single Checkout Sessions API, alongside `stripe-hosted` (full page) and `embedded_page` (embedded form) modes, see stripe--checkout--ui-comparison.md.
