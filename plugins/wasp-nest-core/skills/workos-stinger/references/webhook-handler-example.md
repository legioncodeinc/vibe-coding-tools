# Webhook handler example (SvelteKit)

Grounded in [raw/workos--events--webhooks-guide.md]. WorkOS webhook envelope uses a top-level `event` field (not `type`) and a `WorkOS-Signature` header with a composite `t=...,v1=...` value verified via `workos.webhooks.constructEvent`.

## `src/routes/webhooks/workos/+server.ts`

```typescript
import { error, json } from '@sveltejs/kit';
import { WorkOS } from '@workos-inc/node';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

const workos = new WorkOS(env.WORKOS_API_KEY);

// Persist processed event IDs somewhere durable (Redis, a Postgres table with
// a unique constraint on event_id, etc.) - an in-memory Set does not survive
// a restart or multiple server instances, and WorkOS delivery is at-least-once
// and unordered. [raw/workos--events--webhooks-guide.md]
import { hasProcessedEvent, markEventProcessed } from '$lib/server/webhook-log';

export const POST: RequestHandler = async ({ request }) => {
	// constructEvent must receive the RAW body string, not a parsed object -
	// the signature is computed over the exact bytes WorkOS sent.
	const rawBody = await request.text();
	const sigHeader = request.headers.get('workos-signature');

	if (!sigHeader) {
		throw error(400, 'Missing WorkOS-Signature header');
	}

	let webhookEvent;
	try {
		webhookEvent = await workos.webhooks.constructEvent({
			payload: rawBody,
			sigHeader,
			secret: env.WORKOS_WEBHOOK_SECRET
			// tolerance: 180000, // optional, ms, SDK default ~3-5 min
		});
	} catch (err) {
		console.error('WorkOS webhook signature verification failed:', err);
		// 401, not 400 - this is specifically an auth failure, not a bad request
		throw error(401, 'Invalid signature');
	}

	// Acknowledge fast: respond 2xx as soon as the signature is verified, and
	// do the actual processing after. WorkOS retries up to 6 times over 3 days
	// in production if it doesn't see a 2xx quickly. [raw/workos--events--webhooks-guide.md]
	processWebhookAsync(webhookEvent).catch((err) => {
		console.error('Webhook processing failed:', err);
	});

	return json({ received: true });
};

async function processWebhookAsync(webhookEvent: { id: string; event: string; data: unknown }) {
	// Idempotency: dedupe on event id, not on payload content.
	if (await hasProcessedEvent(webhookEvent.id)) {
		console.log('Duplicate WorkOS event, skipping:', webhookEvent.id);
		return;
	}

	// Branch on the top-level `event` field - WorkOS does NOT use `type`.
	switch (webhookEvent.event) {
		case 'dsync.user.created':
		case 'dsync.user.updated': {
			const user = webhookEvent.data as {
				id: string;
				email: string;
				firstName?: string;
				lastName?: string;
				state?: string;
			};
			// Upsert, not insert-only: a duplicate "created" delivery must not
			// fail on a unique-constraint violation.
			await upsertDirectoryUser(user);
			break;
		}
		case 'dsync.user.deleted': {
			const user = webhookEvent.data as { id: string };
			await deleteDirectoryUser(user.id);
			break;
		}
		case 'organization_membership.updated': {
			// e.g. role change via IdP group mapping, or deactivation/reactivation
			await syncMembership(webhookEvent.data);
			break;
		}
		default:
			console.log('Unhandled WorkOS event type:', webhookEvent.event);
	}

	await markEventProcessed(webhookEvent.id);
}

// Stubs - implement against your own data layer.
async function upsertDirectoryUser(_user: unknown) {}
async function deleteDirectoryUser(_id: string) {}
async function syncMembership(_data: unknown) {}
```

## Required dashboard configuration

1. WorkOS Dashboard > Webhooks > add endpoint, set to your deployed `/webhooks/workos` URL (must be public HTTPS - `https://your-app.vercel.app/webhooks/workos` in production, or a tunnel like ngrok for local testing).
2. Subscribe only to the specific event types your handler branches on - WorkOS explicitly discourages subscribing to everything, since it puts unnecessary load on your endpoint [raw/workos--events--webhooks-guide.md].
3. Copy the generated secret into `WORKOS_WEBHOOK_SECRET` for that environment (staging and production have separate endpoints and separate secrets).

## SvelteKit-specific gotcha

SvelteKit's `request.text()` gives the raw body as received. Do not add any body-parsing middleware or `+server.ts` convention that pre-parses JSON before this handler runs, or the raw bytes needed for signature verification will already be lost.
