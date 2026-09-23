/**
 * payments-stinger, server endpoint creating a Custom Checkout Session
 * (ui_mode: elements) and, as an alternative, a raw PaymentIntent.
 *
 * Default path: Custom Checkout Session. Reach for the raw PaymentIntent
 * variant only when guides/01-choose-your-integration.md says so.
 *
 * Grounded in:
 *   raw/stripe--custom-checkout-session--quickstart.md
 *   raw/stripe--payment-intents--confirm-3ds-status.md
 *   raw/stripe--sveltekit--stripe-integration-tutorial.md
 *   raw/stripe--idempotency--api-requests.md
 */

// src/lib/server/stripe.ts
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  // Pin explicitly. Do not rely on the SDK default drifting across upgrades.
  apiVersion: '2025-09-30.clover',
});

// ---------------------------------------------------------------------------
// src/routes/api/checkout/session/+server.ts
// Creates a Custom Checkout Session (ui_mode: elements), the default path.
// ---------------------------------------------------------------------------

// import { json, error } from '@sveltejs/kit';
// import type { RequestHandler } from './$types';
// import { stripe } from '$lib/server/stripe';
// import { PUBLIC_BASE_URL } from '$env/static/public';

export const createCheckoutSessionHandler = async ({ locals }: { locals: App.Locals }) => {
  const user = locals.user; // however your auth resolves the session
  if (!user) {
    throw errorStub(401, 'not authenticated');
  }

  // Resolve price server-side by lookup_key. Never trust a price/amount from
  // the client (guides/09-security-and-pci-scope.md: never trust the client).
  const prices = await stripe.prices.list({
    lookup_keys: ['starter_monthly'],
    active: true,
    limit: 1,
  });
  const price = prices.data[0];
  if (!price) throw errorStub(500, 'no active price for lookup_key');

  const session = await stripe.checkout.sessions.create(
    {
      ui_mode: 'elements',
      mode: 'payment',
      customer_email: user.email,
      line_items: [{ price: price.id, quantity: 1 }],
      automatic_tax: { enabled: true },
      billing_address_collection: 'auto',
      return_url: `${processEnvBaseUrl()}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
      metadata: { app_user_id: user.id },
    },
    // Idempotent create: a retried request under a network timeout does not
    // create a second Checkout Session for the same logical attempt.
    { idempotencyKey: `checkout-session:${user.id}:${Date.now().toString().slice(0, -4)}0000` },
  );

  return jsonStub({ clientSecret: session.client_secret });
};

// ---------------------------------------------------------------------------
// src/routes/api/checkout/session/[id]/+server.ts
// Return-page status check, READ ONLY. Never grant entitlements here.
// ---------------------------------------------------------------------------

export const getCheckoutSessionStatusHandler = async ({
  params,
}: {
  params: { id: string };
}) => {
  const session = await stripe.checkout.sessions.retrieve(params.id);
  return jsonStub({ status: session.status, paymentStatus: session.payment_status });
};

// ---------------------------------------------------------------------------
// src/routes/api/payment-intent/+server.ts
// Alternative: raw PaymentIntent, only when Checkout Sessions genuinely
// doesn't fit the checkout model (see guides/01-choose-your-integration.md).
// ---------------------------------------------------------------------------

export const createPaymentIntentHandler = async ({ locals }: { locals: App.Locals }) => {
  const user = locals.user;
  if (!user) throw errorStub(401, 'not authenticated');

  const amount = await resolveTrustedAmountServerSide(user);

  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount,
      currency: 'usd',
      customer: user.stripeCustomerId,
      automatic_payment_methods: { enabled: true },
      metadata: { app_user_id: user.id },
    },
    { idempotencyKey: `payment-intent:${user.id}:cart:${amount}` },
  );

  return jsonStub({ clientSecret: paymentIntent.client_secret });
};

// ----- Stubs so this file reads standalone; replace with real SvelteKit imports -----
declare function errorStub(status: number, message: string): never;
declare function jsonStub(body: unknown): Response;
declare function processEnvBaseUrl(): string;
declare function resolveTrustedAmountServerSide(user: { id: string }): Promise<number>;
declare global {
  namespace App {
    interface Locals {
      user?: { id: string; email: string; stripeCustomerId?: string };
    }
  }
}
