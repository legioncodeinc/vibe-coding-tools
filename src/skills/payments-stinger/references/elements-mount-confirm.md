# Elements mount and confirm flow (Svelte 5 runes)

Two variants. Pick the one that matches the server endpoint you built: Custom Checkout Session (`ui_mode: elements`, the default this skill recommends) or raw Payment Intents (only when `guides/01-choose-your-integration.md` says raw PI is the right call). Do not mix `checkout.confirm()` semantics with a bare `stripe.elements()` instance, see `references/research/distilled-stripe.md` §3.

Grounded in [raw/stripe--custom-checkout-session--quickstart.md], [raw/stripe--payment-intents--confirm-3ds-status.md], [raw/stripe--payment-element--overview.md].

## Variant A, Custom Checkout Session (default)

```svelte
<!-- src/routes/checkout/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { loadStripe, type Stripe as StripeJS } from '@stripe/stripe-js';
  import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from '$env/static/public';

  let mountEl: HTMLDivElement;
  let submitting = $state(false);
  let errorMessage = $state<string | null>(null);

  let stripe: StripeJS | null = null;
  let checkout: any = null; // Stripe.js does not yet ship a typed CheckoutElementsSdk

  async function fetchClientSecret(): Promise<string> {
    const res = await fetch('/api/checkout/session', { method: 'POST' });
    if (!res.ok) throw new Error('failed to create checkout session');
    const { clientSecret } = await res.json();
    return clientSecret;
  }

  onMount(async () => {
    stripe = await loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY);
    if (!stripe) {
      errorMessage = 'Stripe.js failed to load';
      return;
    }

    checkout = await stripe.initCheckoutElementsSdk({
      clientSecret: fetchClientSecret(),
    });

    const paymentElement = checkout.createPaymentElement({ layout: 'accordion' });
    paymentElement.mount(mountEl);
  });

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (!checkout) return;
    submitting = true;
    errorMessage = null;

    const loadActionsResult = await checkout.loadActions();
    const { actions } = loadActionsResult;
    const { error } = await actions.confirm();

    if (error) {
      errorMessage = error.message ?? 'Payment failed';
      submitting = false;
    }
    // On success, Stripe redirects to the Checkout Session's return_url.
    // No client-side navigation needed here.
  }
</script>

<form onsubmit={handleSubmit}>
  <div bind:this={mountEl}></div>
  {#if errorMessage}
    <p class="error" role="alert">{errorMessage}</p>
  {/if}
  <button type="submit" disabled={submitting}>
    {submitting ? 'Processing…' : 'Pay'}
  </button>
</form>
```

```svelte
<!-- src/routes/checkout/return/+page.svelte -->
<script lang="ts">
  import { page } from '$app/state';
  import { onMount } from 'svelte';

  let status = $state<'loading' | 'complete' | 'failed'>('loading');

  onMount(async () => {
    const sessionId = page.url.searchParams.get('session_id');
    if (!sessionId) {
      status = 'failed';
      return;
    }
    // Server re-fetches the Checkout Session by ID, never trust the URL alone.
    const res = await fetch(`/api/checkout/session/${sessionId}`);
    const data = await res.json();
    status = data.status === 'complete' ? 'complete' : 'failed';
  });
</script>

{#if status === 'loading'}
  <p>Confirming your payment…</p>
{:else if status === 'complete'}
  <p>You're all set. Provisioning runs off the webhook, not this page.</p>
{:else}
  <p>Something didn't go through. Try again.</p>
{/if}
```

## Variant B, raw Payment Intents (only when Elements-with-Checkout-Sessions genuinely doesn't fit)

```svelte
<!-- src/routes/pay/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { loadStripe, type Stripe as StripeJS, type StripeElements } from '@stripe/stripe-js';
  import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from '$env/static/public';
  import { PUBLIC_BASE_URL } from '$env/static/public';

  let mountEl: HTMLDivElement;
  let submitting = $state(false);
  let errorMessage = $state<string | null>(null);

  let stripe: StripeJS | null = null;
  let elements: StripeElements | null = null;

  onMount(async () => {
    stripe = await loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY);
    if (!stripe) {
      errorMessage = 'Stripe.js failed to load';
      return;
    }

    const res = await fetch('/api/payment-intent', { method: 'POST' });
    const { clientSecret } = await res.json();

    elements = stripe.elements({
      clientSecret,
      appearance: { theme: 'stripe' }, // see references/appearance-theming.ts
    });

    const paymentElement = elements.create('payment', { layout: 'tabs' });
    paymentElement.mount(mountEl);
  });

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (!stripe || !elements) return;
    submitting = true;
    errorMessage = null;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${PUBLIC_BASE_URL}/pay/return` },
      redirect: 'if_required',
    });

    if (error) {
      errorMessage = error.message ?? 'Payment failed';
      submitting = false;
      return;
    }
    if (paymentIntent?.status === 'succeeded') {
      // Non-redirect path (e.g. most card payments with redirect: 'if_required').
      // Do not grant entitlements here, that's the webhook's job.
      window.location.href = '/pay/thanks';
    }
  }
</script>

<form onsubmit={handleSubmit}>
  <div bind:this={mountEl}></div>
  {#if errorMessage}
    <p class="error" role="alert">{errorMessage}</p>
  {/if}
  <button type="submit" disabled={submitting}>
    {submitting ? 'Processing…' : 'Pay'}
  </button>
</form>
```

Notes:

- Both variants never grant access/entitlements from client-side state. The return/success pages read status for UX; the webhook handler is the only writer. See `guides/06-webhooks-and-provisioning.md`.
- `redirect: 'if_required'` on `confirmPayment` is what lets non-redirect methods (most cards) resolve without leaving the page; redirect-based methods (iDEAL, some bank debits) still navigate away regardless. [raw/stripe--payment-intents--confirm-3ds-status.md]
