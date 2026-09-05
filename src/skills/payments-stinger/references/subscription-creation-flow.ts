/**
 * payments-stinger, subscription creation with custom Elements UI.
 *
 * Default: Custom Checkout Session (ui_mode: elements, mode: subscription).
 * Falls back to direct Subscriptions API creation only for flows that
 * Checkout Sessions genuinely can't represent (e.g. an admin tool creating
 * a subscription for an already-saved payment method with no checkout UI
 * at all). See guides/05-subscriptions-with-custom-ui.md.
 *
 * Grounded in:
 *   raw/stripe--subscriptions--build-with-elements.md
 *   raw/stripe--custom-checkout-session--quickstart.md
 *   raw/stripe--idempotency--api-requests.md
 *   raw/stripe--customer-portal--vs-custom-billing-ui.md
 */

import { stripe } from './server-create-checkout-session'; // same Stripe client instance

// ---------------------------------------------------------------------------
// Default path: Custom Checkout Session in subscription mode.
// ---------------------------------------------------------------------------

export interface CreateSubscriptionCheckoutInput {
  userId: string;
  customerId: string; // Stripe customer ID, resolved server-side
  priceLookupKey: string; // e.g. 'starter_monthly', never a raw price_* id
  /**
   * Trial days via the legacy trial_end-equivalent parameter. The newer
   * Trial Offer API is NOT supported under Elements-with-Checkout-Sessions
   * as of this research, use trial_period_days here, not a trial_offer id.
   */
  trialDays?: number;
}

export async function createSubscriptionCheckoutSession(
  input: CreateSubscriptionCheckoutInput,
): Promise<{ clientSecret: string | null }> {
  const prices = await stripe.prices.list({
    lookup_keys: [input.priceLookupKey],
    active: true,
    limit: 1,
  });
  const price = prices.data[0];
  if (!price) throw new Error(`no active price for lookup_key=${input.priceLookupKey}`);

  const session = await stripe.checkout.sessions.create(
    {
      ui_mode: 'elements',
      mode: 'subscription',
      customer: input.customerId,
      line_items: [{ price: price.id, quantity: 1 }],
      automatic_tax: { enabled: true },
      allow_promotion_codes: true,
      subscription_data: {
        ...(input.trialDays ? { trial_period_days: input.trialDays } : {}),
        metadata: { app_user_id: input.userId },
      },
      // A card during signup avoids surprise dunning at trial end.
      payment_method_collection: 'always',
      return_url: `${baseUrl()}/billing/return?session_id={CHECKOUT_SESSION_ID}`,
      metadata: { app_user_id: input.userId, lookup_key: input.priceLookupKey },
    },
    { idempotencyKey: `sub-checkout:${input.userId}:${input.priceLookupKey}` },
  );

  return { clientSecret: session.client_secret };
}

// ---------------------------------------------------------------------------
// Plan switch, always via the Subscriptions API directly, whether the
// customer-facing entry point is a custom UI or a Portal-bypass admin action.
// The Customer Portal's own plan-switch UI caps at 10 configurable products;
// this function is what you reach for past that cap.
// ---------------------------------------------------------------------------

export async function switchSubscriptionPlan(
  subscriptionId: string,
  newPriceLookupKey: string,
  prorationBehavior: 'create_prorations' | 'none' | 'always_invoice' = 'create_prorations',
) {
  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  const currentItem = sub.items.data[0];

  const prices = await stripe.prices.list({
    lookup_keys: [newPriceLookupKey],
    active: true,
    limit: 1,
  });
  const newPrice = prices.data[0];
  if (!newPrice) throw new Error(`no active price for lookup_key=${newPriceLookupKey}`);

  return stripe.subscriptions.update(
    subscriptionId,
    {
      items: [{ id: currentItem.id, price: newPrice.id }],
      proration_behavior: prorationBehavior,
    },
    { idempotencyKey: `sub-switch:${subscriptionId}:${newPriceLookupKey}` },
  );
}

// ---------------------------------------------------------------------------
// Cancellation, direct API call. Fires the exact same webhook events a
// Portal-initiated cancel would (customer.subscription.updated with
// cancel_at_period_end: true, then customer.subscription.deleted at period
// end). Your webhook handler doesn't need to know which origin triggered it.
// ---------------------------------------------------------------------------

export async function cancelSubscriptionAtPeriodEnd(subscriptionId: string) {
  return stripe.subscriptions.update(
    subscriptionId,
    { cancel_at_period_end: true },
    { idempotencyKey: `sub-cancel:${subscriptionId}` },
  );
}

function baseUrl(): string {
  // Replace with PUBLIC_BASE_URL from $env/static/public in a real endpoint.
  return 'https://example.com';
}
