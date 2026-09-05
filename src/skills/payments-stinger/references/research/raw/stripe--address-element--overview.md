# Address Element

- URL: https://docs.stripe.com/elements/address-element
- Fetched: 2026-08-14
- Source type: official docs
- Component: Address Element

## Facts

- The Address Element collects shipping or billing addresses and automatically works alongside the Payment Element or Express Checkout Element.
- When a customer provides both an address and a payment method, Stripe combines them into a single PaymentIntent with the address in the correct field, no manual merging needed on your end.
- Link autofill: if created from the same `Elements` object as a Contact Details Element, the Address Element autofills a returning Link customer's saved shipping info once they authenticate.
- Example creation pattern: `const elements = stripe.elements({ clientSecret }); const linkAuthElement = elements.create('linkAuthentication'); const addressElement = elements.create('address', options); const paymentElement = elements.create('payment', paymentElementOptions);`, all three mounted to their own DOM nodes.
- Display order requirement: Address Element must render after the Contact Details/Link Authentication Element (for Link autofill) and before the Payment Element (so Payment Element can dynamically hide address fields it no longer needs to collect).
- Retrieve address details client-side via the `change` event, which fires on any field edit or saved-address selection.
- `defaultValues` prefills address fields to speed up checkout.
- For automatic tax calculations with regional nuance, Stripe recommends the Address Element over the Payment Element's minimal tax-address fields when regional tax rules require a full address (see stripe--dynamic-payment-methods--tax-currency.md).
