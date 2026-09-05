# Express Checkout Element

- URL: https://docs.stripe.com/elements/express-checkout-element ; https://docs.stripe.com/js/custom_checkout/create_express_checkout_element
- Fetched: 2026-08-14
- Source type: official docs
- Component: Express Checkout Element

## Facts

- One-click payment method buttons in a single integration: Link, Apple Pay, Google Pay, PayPal, Klarna, Amazon Pay.
- Under Custom Checkout Sessions (`ui_mode: elements`), you create it via `checkout.createExpressCheckoutElement(options)`.
- Options include `buttonTheme` per payment method (applePay/googlePay/paypal/klarna), `buttonType` (call-to-action text, e.g. `buy`, `checkout`, `pay`, `subscribe`), `layout` (grid arrangement), and `paymentMethodOrder`.
- `paymentMethods` config lets you force a method to `always` show (subject to platform support) or `never` show; default is `auto`, which lets Stripe decide based on conversion optimization and platform eligibility.
- Availability is genuinely platform-gated: e.g. Apple Pay on non-Safari desktop browsers only shows when explicitly set to `always`; Klarna is unsupported on Firefox and on several iOS in-app webviews; PayPal/Amazon Pay/Klarna are unsupported inside in-app webviews generally.
- Requires domain registration (same as other wallet-backed payment methods) in both test and live mode.
- When Apple Pay/Google Pay are shown via Express Checkout Element alongside a Payment Element, Payment Element suppresses its own wallet buttons to avoid duplicate UI (see stripe--payment-element--overview.md).
- Theme coordination: if you set a dark Appearance theme, Express Checkout Element automatically switches Apple Pay/Google Pay button themes to a compatible (usually light) variant for visibility.
