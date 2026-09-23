# Guide 04: Events API

**Sources:** `research/external/2026-05-20-events-api-verification.md`, `research/external/2026-05-20-bolt-sdk-setup-patterns.md`

---

## How the Events API works

1. Your app subscribes to specific event types in the App Settings.
2. When an event occurs in a workspace where the app is installed, Slack sends an HTTP POST to your request URL.
3. Your app must respond with HTTP 200 within **3 seconds**.
4. If no 200 is received, Slack retries up to 3 times with exponential backoff.
5. Slack delivers events at-least-once: your app must deduplicate using `event_id`.

---

## URL verification (one-time setup)

When you first enter a request URL in App Settings, Slack sends a challenge:

```json
{
  "token": "DEPRECATED",
  "challenge": "abc123xyz",
  "type": "url_verification"
}
```

Your endpoint must respond with the `challenge` value:

```json
{ "challenge": "abc123xyz" }
```

Bolt handles this automatically. For custom HTTP handlers:

```python
# FastAPI example
@app.post("/slack/events")
async def slack_events(request: Request):
    body = await request.json()
    if body.get("type") == "url_verification":
        return {"challenge": body["challenge"]}
    # ... process other events
```

> Source: `research/external/2026-05-20-events-api-verification.md`

---

## Request signature verification

Every Slack request includes:
- `X-Slack-Signature` header: `v0=<HMAC-SHA256 signature>`
- `X-Slack-Request-Timestamp` header: Unix timestamp

Verification formula:
```
sig_basestring = "v0:" + timestamp + ":" + raw_request_body
signature = "v0=" + HMAC-SHA256(signing_secret, sig_basestring)
assert signature == X-Slack-Signature  # Use constant-time comparison
```

**Bolt verifies signatures automatically.** Custom HTTP handlers must implement this manually:

```typescript
import crypto from 'crypto';

function verifySlackSignature(signingSecret: string, headers: Headers, body: string): boolean {
  const timestamp = headers.get('x-slack-request-timestamp');
  const receivedSig = headers.get('x-slack-signature');

  // Reject stale timestamps (>5 minutes old) to prevent replay attacks
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp!)) > 300) return false;

  const sigBase = `v0:${timestamp}:${body}`;
  const expected = `v0=` + crypto.createHmac('sha256', signingSecret).update(sigBase).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(receivedSig!));
}
```

> Source: `research/external/2026-05-20-events-api-verification.md`

---

## Event deduplication (event_id)

Slack sends each event at-least-once. Check `event_id` before processing:

```typescript
// Redis-based deduplication (recommended for production)
app.event('app_mention', async ({ event, client }) => {
  const key = `slack:event:${event.event_id}`;
  const alreadyProcessed = await redis.set(key, '1', 'NX', 'EX', 3600);  // NX = only set if not exists
  if (!alreadyProcessed) return;  // Duplicate — skip

  // Process the event
  await handleMention(event, client);
});
```

Alternative: database unique constraint on `event_id` with error handling on insert.

Also check the `X-Slack-Retry-Num` header; if present and > 0, the event is a retry:

```typescript
// Express example
app.post('/slack/events', (req, res) => {
  const retryNum = req.headers['x-slack-retry-num'];
  if (retryNum && parseInt(retryNum) > 0) {
    // This is a retry — check deduplication store before processing
  }
  // ...
});
```

> Source: `research/external/2026-05-20-events-api-verification.md`

---

## Registering event listeners in Bolt

```typescript
// Listen to messages in channels the bot is in
app.event('message', async ({ event, client }) => {
  if (event.subtype) return;  // Ignore edits, deletes, etc.
  console.log(`Message: ${event.text} from ${event.user}`);
});

// Respond to @mentions
app.event('app_mention', async ({ event, say }) => {
  await say(`Hello <@${event.user}>!`);
});

// React to emoji reactions
app.event('reaction_added', async ({ event, client }) => {
  console.log(`${event.user} reacted with :${event.reaction}: to message`);
});

// User joins a channel
app.event('member_joined_channel', async ({ event, client }) => {
  await client.chat.postMessage({
    channel: event.channel,
    text: `Welcome to the channel, <@${event.user}>!`,
  });
});
```

---

## Async work pattern (3-second ACK)

Bolt automatically acknowledges Events API requests before calling your handler. For custom handlers:

```typescript
// Express: acknowledge immediately, then process
app.post('/slack/events', async (req, res) => {
  res.status(200).send();  // Acknowledge immediately

  // Process asynchronously after acknowledging
  processEvent(req.body).catch(console.error);
});
```

---

## Required OAuth scopes by event type

| Event type | Required scope |
|---|---|
| `message.channels` | `channels:history` |
| `message.im` | `im:history` |
| `message.groups` | `groups:history` |
| `app_mention` | `app_mentions:read` |
| `reaction_added` | `reactions:read` |
| `member_joined_channel` | `channels:read` or `groups:read` |

Add scopes under **OAuth & Permissions > Scopes > Bot Token Scopes** in App Settings, then reinstall the app.

---

*See also:* `examples/events-api-handler.md` for a complete deduplication + async dispatch pattern.
