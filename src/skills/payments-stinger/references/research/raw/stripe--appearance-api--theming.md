# Elements Appearance API

- URL: https://docs.stripe.com/elements/appearance-api
- Fetched: 2026-08-14
- Source type: official docs
- Component: Appearance API / theming

## Facts

- The Appearance API customizes the look and feel of Elements (Payment Element, Address Element, Express Checkout Element, etc.) to match your site's design.
- The article has two variants depending on integration: Checkout Sessions API (`?api-integration=checkout`) vs Payment Intents API (`?api-integration=paymentintents`), the Appearance object shape is shared, but where you pass it differs (into `CheckoutElementsProvider`/`initCheckoutElementsSdk` for Custom Checkout, vs into `stripe.elements({ appearance, clientSecret })` for raw Payment Intents).
- Per the checkout UI comparison table (stripe--checkout--ui-comparison.md): the Elements-based custom checkout gets "Full CSS customization via the Appearance API", the deepest customization tier Stripe offers, versus 15 configurable settings for hosted full-page Checkout and roughly 70 configurable settings for the embedded form.
- Appearance supports custom fonts (e.g., Google Fonts) via a font set passed alongside the appearance object at Checkout/Elements init time.
- CSP note (from the security guide): if you load web fonts via a CSS file for use with Elements, its URL must be allowed by your `connect-src` CSP directive.
