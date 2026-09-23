/**
 * payments-stinger, canonical SvelteKit webhook handler.
 *
 * src/routes/api/webhooks/stripe/+server.ts
 *
 * Implements the webhook contract:
 *   1. Raw body via request.text(), never request.json() first.
 *   2. Signature verification via stripe.webhooks.constructEvent.
 *   3. Dedup on event.id, marked processed only after side effects succeed.
 *   4. One event per business action, do not also listen for
 *      payment_intent.succeeded if checkout.session.completed already
 *      covers the same provisioning decision.
 *   5. Fast 2xx; heavy work goes to a queue/outbox, not inline.
 *
 * Grounded in:
 *   raw/stripe--webhooks--receive-and-verify.md
 *   raw/stripe--webhooks--signature-errors-raw-body.md
 *   raw/stripe--sveltekit--raw-body-webhook-community.md
 *   raw/stripe--sveltekit--stripe-integration-tutorial.md
 *   raw/stripe--production-failures--webhook-race-conditions.md
 *   raw/stripe--customer-portal--vs-custom-billing-ui.md
 */

import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from '$env/static/private';

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-09-30.clover' });

export const POST: RequestHandler = async ({ request }) => {
  // 1. RAW body. Do not call request.json() before this, the Request body
  //    stream can only be read once, and any re-serialization breaks the HMAC.
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    throw error(400, 'missing stripe-signature header');
  }

  // 2. Verify. This also enforces the SDK's default 300s replay tolerance.
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('webhook signature verification failed', err);
    throw error(400, 'invalid signature');
  }

  // 3. Dedup by event.id BEFORE doing any work.
  const already = await db.processedWebhookEvent.findUnique({ where: { id: event.id } });
  if (already) {
    return json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      // ---- One-time payment provisioning: single source of truth ----
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_status !== 'paid') break;
        await provisionOrder(session);
        break;
      }

      // ---- Subscription lifecycle ----
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        if (sub.cancel_at_period_end) {
          // This fires the moment a cancel is REQUESTED (Portal or API),
          // whether or not the sub has actually ended yet. Confirmation
          // email goes here, not on customer.subscription.deleted.
          await sendCancellationConfirmation(sub);
        }
        await syncSubscriptionState(sub);
        break;
      }
      case 'customer.subscription.deleted': {
        // Fires when the subscription actually ends, access revocation
        // belongs here, not on the .updated cancel-requested event above.
        const sub = event.data.object as Stripe.Subscription;
        await revokeEntitlements(sub);
        break;
      }
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        await extendAccessThroughPeriod(invoice);
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await startDunningNotice(invoice); // do NOT revoke access immediately
        break;
      }

      default:
        // Unhandled event types are expected, Stripe sends everything you're
        // subscribed to. Log for visibility, don't treat as an error.
        console.debug(`unhandled event type: ${event.type}`);
    }

    // 4. Mark processed only on success. If the try block throws, this never
    //    runs, Stripe retries, and the retry becomes a free second attempt.
    await db.processedWebhookEvent.create({
      data: { id: event.id, type: event.type, processedAt: new Date() },
    });

    return json({ received: true });
  } catch (err) {
    console.error(`webhook handler failed for ${event.type} (${event.id})`, err);
    // Do NOT mark processed. Return 500 so Stripe retries.
    throw error(500, 'handler failed');
  }
};

// ----- Stubs, replace with real DB/queue calls -----
declare const db: {
  processedWebhookEvent: {
    findUnique: (args: { where: { id: string } }) => Promise<unknown | null>;
    create: (args: { data: { id: string; type: string; processedAt: Date } }) => Promise<unknown>;
  };
};
declare function provisionOrder(session: Stripe.Checkout.Session): Promise<void>;
declare function syncSubscriptionState(sub: Stripe.Subscription): Promise<void>;
declare function sendCancellationConfirmation(sub: Stripe.Subscription): Promise<void>;
declare function revokeEntitlements(sub: Stripe.Subscription): Promise<void>;
declare function extendAccessThroughPeriod(invoice: Stripe.Invoice): Promise<void>;
declare function startDunningNotice(invoice: Stripe.Invoice): Promise<void>;
