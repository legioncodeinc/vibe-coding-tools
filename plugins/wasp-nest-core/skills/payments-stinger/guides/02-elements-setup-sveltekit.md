# 02, Elements setup in SvelteKit (Svelte 5)

How Stripe.js and Elements load and mount in a SvelteKit app, and the client/server split that keeps secret keys off the client.

Source: [raw/stripe--payment-element--overview.md], [raw/stripe--custom-checkout-session--quickstart.md], [raw/stripe--contact-details-element--link-authentication.md], [raw/stripe--address-element--overview.md], [raw/stripe--express-checkout-element--overview.md], [raw/stripe--sveltekit--stripe-integration-tutorial.md], [raw/stripe--pci--compliance-scope.md].

## The client/server split

| Piece | Lives where | Why |
|---|---|---|
| `STRIPE_SECRET_KEY` | `$env/static/private`, used only in `src/lib/server/stripe.ts` | Never touches a browser bundle |
| `PUBLIC_STRIPE_PUBLISHABLE_KEY` | `$env/static/public` | Safe client-side, passed to `loadStripe()` |
| `loadStripe(...)`, Element mount/confirm | `+page.svelte`, runs in the browser | Card data never reaches your server, Stripe.js tokenizes inside its own iframe |
| Checkout Session / PaymentIntent creation | `+server.ts` under `src/routes/api/...` | Needs the secret key |

Full checklist: `references/env-var-checklist.md`.

## Loading Stripe.js

Always load from `js.stripe.com` at runtime via `@stripe/stripe-js`'s `loadStripe()`, never bundle or self-host a copy. This is both a PCI requirement and how Stripe ships security patches to the tokenization layer without a redeploy on your end [raw/stripe--pci--compliance-scope.md].

```ts
import { loadStripe } from '@stripe/stripe-js';
import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from '$env/static/public';

const stripe = await loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY);
```

Call this in `onMount` (or an `$effect` on first mount), not at module scope, `loadStripe` returns a promise that resolves against `window`, which doesn't exist during SvelteKit's SSR pass.

## Mounting order for combined Elements

When using more than one Element (Contact Details, Address, Payment, Express Checkout), they must share one Elements/checkout instance for cross-Element autofill (Link-saved data) to work, and they have a required display order:

1. Contact Details Element (email + Link auth), first
2. Address Element (optional, shipping/billing), after Contact Details
3. Payment Element, last; it dynamically hides fields the Address Element already collected [raw/stripe--address-element--overview.md] [raw/stripe--contact-details-element--link-authentication.md]

Express Checkout Element (wallet buttons) can render anywhere, but suppresses the Payment Element's own wallet buttons when both are present to avoid duplicate UI [raw/stripe--payment-element--overview.md].

## Two integration shapes, don't mix their APIs

- **Custom Checkout Session (default):** `stripe.initCheckoutElementsSdk({ clientSecret })` → `checkout.createPaymentElement()` / `checkout.createContactDetailsElement()` / `checkout.createAddressElement()` / `checkout.createExpressCheckoutElement()`. Confirm via `checkout.confirm()`.
- **Raw Payment Intents:** `stripe.elements({ clientSecret, appearance })` → `elements.create('payment')` / `elements.create('address')` / `elements.create('linkAuthentication')` / `elements.create('expressCheckout')`. Confirm via `stripe.confirmPayment({ elements, ... })`.

Full worked examples of both: `references/elements-mount-confirm.md`.

## Svelte 5 runes pattern

Use `$state` for submission/error UI state, `bind:this` to get the DOM node for mounting, and `onMount` for the async Stripe.js load + Element mount sequence. Don't reach for stores here, this is local component state, not cross-route shared state.

```svelte
<script lang="ts">
  let mountEl: HTMLDivElement;
  let submitting = $state(false);
  let errorMessage = $state<string | null>(null);
  // ... see references/elements-mount-confirm.md for the full flow
</script>
```

## Deployment requirement

Checkout Session/PaymentIntent creation and webhook receipt need real server endpoints. `adapter-static` cannot host `+server.ts` routes at all, use `adapter-vercel`, `adapter-netlify`, `adapter-node`, or `adapter-cloudflare` [raw/stripe--sveltekit--stripe-integration-tutorial.md].

## Next steps

- `guides/07-theming-with-appearance-api.md`, styling Elements to match the product.
- `references/server-create-checkout-session.ts`, the server side of session/intent creation.
