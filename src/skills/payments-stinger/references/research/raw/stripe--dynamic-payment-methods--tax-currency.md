# Dynamic payment methods, currency/region availability, tax with Elements

- URL: https://docs.stripe.com/payments/payment-methods/dynamic-payment-methods ; https://docs.stripe.com/tax/checkout/elements
- Fetched: 2026-08-14
- Source type: official docs
- Component: Payment method availability by region, tax configuration for Elements

## Facts

- Dynamic payment methods is part of Stripe's default integration: configure which payment methods are enabled from the Dashboard (no code), and Stripe's Element/Checkout/Payment Links/Hosted Invoice integrations automatically decide which eligible methods to actually display per transaction to maximize conversion (based on customer location, currency, and amount).
- Stripe supports 135+ presentment currencies, but individual payment methods only support a subset, e.g. ACH Direct Debit is USD-only; SEPA Direct Debit caps out around 10,000 EUR per payment. The *final* amount (post-tax, post-discount) is what's actually used to decide payment method eligibility, not the pre-tax subtotal.
- For payments before API version `2023-08-16`, use `payment_method_types`; from that version forward, `automatic_payment_methods: { enabled: true }` is the modern equivalent and is effectively the default going forward, an integration built or audited against an old SDK/version pin may still be using the older explicit-list parameter.
- Finer-grained region/method control beyond the Dashboard toggle: `excluded_payment_method_types` (per PaymentIntent/SetupIntent/Checkout Session/Payment Element call), Payment Method Configurations (named, reusable rule sets), Payment Method Rules (show/hide by amount/currency condition), and A/B testing tools to temporarily toggle a method and measure conversion impact.
- Stripe Tax with `ui_mode: elements` Checkout Sessions (the custom-checkout path): set `automatic_tax[enabled]=true` on the Checkout Session, plus a `tax_code` and `tax_behavior` (`exclusive` or `inclusive`) per line item (or set defaults in the Dashboard).
- Two ways to collect the address Stripe Tax needs: (a) let the Payment Element collect minimal tax-relevant fields (country + postal code) directly inside each payment method's form when `billing_address_collection=auto` is set on the session, good enough for most jurisdictions but Stripe flags "regional considerations" where minimal fields under- or over-collect versus a full address; or (b) use the dedicated Address Element for a full address when `billing_address_collection=required`, which Stripe explicitly recommends when those regional edge cases apply to your business.
- Tax ID collection (VAT, ABN, GB VAT, etc.) is a separate Element (Tax ID Element) layered on top, with optional real-time synchronous verification against government databases for AU ABNs, EU VAT, and UK VAT numbers (public preview at time of research, behind a beta flag), falls back to format-only validation plus async full verification if the government database is unreachable.
