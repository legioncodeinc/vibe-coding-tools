# Example: Events API Handler with Deduplication

**Demonstrates:** `guides/04-events-api.md`

This example shows a production-ready Events API handler pattern: signature verification (via Bolt), `event_id` deduplication with Redis, async dispatch, and deferred response.

---

## Edge case: Custom HTTP handler (not Bolt)

Most apps should use Bolt: it handles signature verification automatically. This example shows what a bare Express handler must implement for parity.

```typescript
import express from 'express';
import crypto from 'crypto';
import Redis from 'ioredis';

const app = express();
const redis = new Redis(process.env.REDIS_URL!);

// Parse raw body for signature verification (must be before json())
app.use('/slack/events', express.raw({ type: 'application/json' }));

app.post('/slack/events', async (req, res) => {
  const rawBody = req.body as Buffer;
  const bodyString = rawBody.toString();

  // 1. Verify Slack request signature
  if (!verifySlackSignature(process.env.SLACK_SIGNING_SECRET!, req.headers, bodyString)) {
    return res.status(401).send('Invalid signature');
  }

  const payload = JSON.parse(bodyString);

  // 2. URL verification (one-time setup)
  if (payload.type === 'url_verification') {
    return res.json({ challenge: payload.challenge });
  }

  // 3. Acknowledge immediately (within 3 seconds)
  res.status(200).send();

  // 4. Deduplicate using event_id
  if (payload.event?.event_id) {
    const key = `slack:event:${payload.event.event_id}`;
    const isNew = await redis.set(key, '1', 'NX', 'EX', 3600);  // SETNX, TTL 1 hour
    if (!isNew) {
      console.log(`Duplicate event ${payload.event.event_id} — skipping`);
      return;
    }
  }

  // 5. Check retry header (defensive duplicate guard)
  const retryNum = req.headers['x-slack-retry-num'];
  if (retryNum && parseInt(retryNum as string) > 0) {
    console.log(`Retry #${retryNum} for event — deduplication should catch this`);
  }

  // 6. Dispatch async processing
  processEvent(payload).catch(console.error);
});

async function processEvent(payload: any) {
  const event = payload.event;
  if (!event) return;

  switch (event.type) {
    case 'app_mention':
      await handleAppMention(event);
      break;
    case 'message':
      if (event.subtype) return;  // Ignore edits, deletes, bot messages
      await handleMessage(event);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

async function handleAppMention(event: any) {
  // Example: use Slack Web API to reply
  const { WebClient } = require('@slack/web-api');
  const client = new WebClient(process.env.SLACK_BOT_TOKEN);
  await client.chat.postMessage({
    channel: event.channel,
    thread_ts: event.ts,
    text: `Hello <@${event.user}>! You mentioned me.`,
  });
}

async function handleMessage(event: any) {
  console.log(`Message in ${event.channel}: "${event.text}" from ${event.user}`);
}

function verifySlackSignature(
  signingSecret: string,
  headers: any,
  body: string
): boolean {
  const timestamp = headers['x-slack-request-timestamp'];
  const receivedSig = headers['x-slack-signature'];
  if (!timestamp || !receivedSig) return false;

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp)) > 300) return false;  // Reject >5min old

  const sigBase = `v0:${timestamp}:${body}`;
  const expected = `v0=` + crypto
    .createHmac('sha256', signingSecret)
    .update(sigBase)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(expected, 'utf8'),
    Buffer.from(receivedSig, 'utf8')
  );
}

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

## Bolt version (simpler)

When using Bolt, signature verification and acknowledgment are automatic:

```typescript
import { App } from '@slack/bolt';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.event('app_mention', async ({ event, say }) => {
  // Bolt auto-acknowledges Events API payloads before calling the handler
  // Deduplication still needed — Slack delivers at-least-once
  const key = `slack:event:${event.event_id}`;
  const isNew = await redis.set(key, '1', 'NX', 'EX', 3600);
  if (!isNew) return;

  await say({
    text: `Hello <@${event.user}>!`,
    thread_ts: event.ts,
  });
});

(async () => { await app.start(3000); })();
```

---

## Key patterns demonstrated

1. **`express.raw()` before `json()`**: signature verification requires the raw request body; parsing JSON first would break `crypto.createHmac`.
2. **Acknowledge before processing**: `res.status(200).send()` is sent before any database or API calls.
3. **Redis SETNX for deduplication**: `NX` flag means "only set if key does not exist"; returns `null` if already set.
4. **1-hour TTL on deduplication keys**: balances memory usage with Slack's retry window (Slack retries within minutes).
5. **`event.subtype` guard on `message` events**: message edits, deletions, and bot messages all have subtypes; filtering them prevents accidental double-processing.
