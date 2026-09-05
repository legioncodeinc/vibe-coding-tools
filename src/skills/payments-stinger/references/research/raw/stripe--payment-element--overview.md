# Payment Element

- URL: https://docs.stripe.com/payments/payment-element
- Fetched: 2026-08-14
- Source type: official docs
- Component: Payment Element

## Facts

- The Payment Element is a UI component for the web that accepts more than 100 payment methods, validates input, and handles errors. Use it alone or combined with other Elements.
- Stripe's own guidance to coding agents, verbatim: "Stripe recommends using the Checkout Sessions API with the Payment Element over Payment Intents for most integrations... Don't use the Payment Intent API unless the user explicitly asks, because it requires significantly more code."
- Two compatible APIs for the Payment Element:
  - Checkout Sessions API (`ui_mode: "elements"`), covers price_data or full line items, tax, discounts, shipping, subscriptions, and Adaptive Pricing (Adaptive Pricing is Checkout-Sessions-only).
  - Payment Intents API, lower-level, models only the payment step; you build tax, discounts, shipping, subscriptions, and currency conversion yourself.
- With Checkout Sessions + Payment Element, the `client_secret` initializes Checkout itself via `stripe.initCheckoutElementsSdk(...)` (vanilla JS) or `CheckoutElementsProvider` (React, imported from `@stripe/react-stripe-js/checkout`). Confirmation differs from raw Payment Intents: `checkout.confirm()` / `actions.confirm()`, not `stripe.confirmPayment`.
- Payment Element config options: `layout` (tabs/accordion), `defaultValues` (prefill customer info), `business`, `paymentMethodOrder`, `fields` (show/hide), `readOnly`, `terms` (mandate/legal display), `wallets` (Apple Pay/Google Pay toggle).
- Can be combined with the Express Checkout Element; when combined, wallet buttons (Apple Pay, Google Pay) render only in the Express Checkout Element to avoid duplication.
- Payment methods can be managed from the Dashboard without code, and Dynamic payment methods automatically shows the most relevant methods per customer (location, currency, amount).
- Coding-agent note from Stripe itself: install the Stripe CLI (`npm i -g @stripe/cli`) and run `stripe sandbox create --help` to provision an anonymous sandbox with working API keys, no account registration required.
