# PCI DSS compliance scope: hosted vs Elements vs custom card forms

- URL: https://stripe.com/guides/pci-compliance ; https://docs.stripe.com/security/guide
- Fetched: 2026-08-14
- Source type: official (Stripe guide + security guide)
- Component: PCI scope by integration type

## Facts

- Official PCI scope table by integration, condensed:

| Integration | Required SAQ | Why |
|---|---|---|
| Checkout or Elements (Payment Element etc.) | SAQ A (lightest) | Card data inputs render inside an iframe served from Stripe's domain, card numbers never touch your servers or even your own JS execution context. |
| Mobile SDK (official iOS/Android UI components, or Elements in a WebView) | SAQ A | Same reasoning, card numbers pass directly customer → Stripe. Writing your own custom card-handling code on top of the SDK forfeits SAQ A eligibility and adds PCI DSS 6.3,6.5 burden. |
| Stripe.js v2 (legacy, card data entered into a form you host yourself, not inside an Element iframe) | SAQ A-EP (heavier) | Your own domain hosts the form fields, even though tokenization still happens via Stripe.js. |

- The practical takeaway for a custom-checkout-first Stripe skill: building your checkout UI with the Payment Element (or Address/Contact Details/Express Checkout Elements) keeps you at SAQ A, the lightest PCI tier, because the actual card-number-collecting DOM elements are iframes Stripe serves, not your own inputs, even though the surrounding page chrome, layout, and appearance are entirely yours. This is why "custom checkout with Elements" is not a PCI tradeoff versus hosted Checkout; both integration types get SAQ A.
- Building a raw HTML `<input>` that collects card numbers yourself (bypassing Elements/Stripe.js entirely) is the scenario that actually increases PCI burden, that is not what this skill recommends and is out of scope.
- Content Security Policy requirements for Elements to function: `frame-src` and `script-src` must allow `https://js.stripe.com` (and `https://connect-js.stripe.com` if using Connect); `connect-src` must allow `https://api.stripe.com`; `img-src` must allow `https://*.stripe.com`. If using the Address Element with your own Google Maps key, also allow `https://maps.googleapis.com` in `connect-src`/`script-src`.
- Always load Stripe.js directly from `js.stripe.com` at runtime, never bundle it or self-host a copy. This is both a PCI requirement and how Stripe silently ships security patches/updates to the tokenization layer.
- Stripe itself is independently certified annually as a PCI Level 1 Service Provider; the merchant's remaining obligation is to correctly integrate (Elements/Checkout, not raw card inputs) and to complete the applicable SAQ annually.
