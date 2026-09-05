# Contact Details Element (formerly Link Authentication Element)

- URL: https://docs.stripe.com/payments/elements/contact-details-element ; https://docs.stripe.com/payments/link/add-link-elements-integration
- Fetched: 2026-08-14
- Source type: official docs
- Component: Contact Details Element / Link authentication

## Facts

- The Contact Details Element is the current name for what was the Link Authentication Element, a single email input field that does double duty: email collection and Link authentication.
- Placement: put the Contact Details Element first, followed by the Address Element (optional), then the Payment Element. Order matters for Link autofill to cascade correctly.
- When a customer's email matches an existing Link account, Stripe sends a secure one-time code to their phone; on success it autofills their Link-saved addresses and payment methods into the Address Element and Payment Element.
- `onChange` prop fires when the user edits the email field or when Link autofills a saved email.
- `defaultValues` lets you prefill the email to kick off Link authentication immediately if you already have it (Stripe recommends passing the email to the Payment Element directly if you already have it, over using this Element from scratch).
- To enable cross-Element autofill, all Elements (Contact Details, Address, Payment) must be created from the same `Elements` object/instance.
- The Contact Details, Address, and Payment Elements do not need to render on the same page/step, they can be split across a multi-step checkout as long as they share the same Elements instance and appear in the documented order.
- Requires domain registration for the payment methods being used (same domain registration step used for Apple Pay/Google Pay/wallets).
