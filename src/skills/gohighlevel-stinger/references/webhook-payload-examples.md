# Webhook payload examples and signature verification

Grounding: [raw/ghl--webhooks--integration-guide-and-signature-verification.md], [raw/ghl--sdk--official-typescript-sdk-and-error-handling.md], [raw/ghl--webhooks--inbound-trigger-workflow-setup.md].

## Outbound webhook envelope (HighLevel -> your endpoint)

Every outbound webhook shares a common envelope; event-specific fields live alongside it. Confirmed fields (`type`/event name, `timestamp`, `webhookId`, and usually `locationId` or `companyId`):

```json
{
  "type": "ContactCreate",
  "locationId": "HjiMUOsCCHCjtxEf8PR",
  "timestamp": "2026-08-14T15:04:05.000Z",
  "webhookId": "abc123",
  "id": "contactRecordId",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com"
}
```

Do not assume every event type has identical fields beyond the envelope -- 58+ event types exist across Contact, Opportunity, Task, Appointment, Invoice, Product, Association, Location, and User categories. [raw/ghl--webhooks--integration-guide-and-signature-verification.md]

## Signature headers (verify raw body bytes, not re-serialized JSON)

| Header | Algorithm | Status |
|---|---|---|
| `X-GHL-Signature` | Ed25519 | Current -- verify this first when present |
| `X-WH-Signature` | RSA-SHA256 (PKCS#1 v1.5) | Legacy -- deprecated 2026-09-01 |

### Verify X-GHL-Signature (Ed25519) -- Node.js

```javascript
const crypto = require('crypto');
const ghlPublicKey = process.env.GHL_ED25519_PUBLIC_KEY; // pull the current PEM from the live docs page

function verifyGhlSignature(rawBody, signatureB64, publicKeyPem) {
  if (!signatureB64) return false;
  const payloadBuffer = Buffer.from(rawBody, 'utf8');
  const signatureBuffer = Buffer.from(signatureB64, 'base64');
  return crypto.verify(null, payloadBuffer, publicKeyPem, signatureBuffer);
}

app.post('/webhooks/ghl', express.raw({ type: 'application/json' }), (req, res) => {
  const ghlSig = req.header('x-ghl-signature');
  const legacySig = req.header('x-wh-signature');
  const rawBody = req.body; // Buffer, from express.raw()

  let valid = false;
  if (ghlSig) {
    valid = verifyGhlSignature(rawBody.toString('utf8'), ghlSig, ghlPublicKey);
  } else if (legacySig) {
    valid = verifyLegacySignature(rawBody.toString('utf8'), legacySig, legacyPublicKey); // RSA fallback
  }
  if (!valid) return res.status(401).send('invalid signature');

  const event = JSON.parse(rawBody.toString('utf8'));
  const ageMs = Date.now() - new Date(event.timestamp).getTime();
  if (ageMs > 5 * 60 * 1000) return res.status(200).send('stale, dropped'); // 5-minute replay window

  // ... process event.type, dedupe on event.webhookId ...
  res.status(200).json({ received: true });
});
```

### Verify X-WH-Signature (legacy RSA) -- Node.js

```javascript
const crypto = require('crypto');
function verifyLegacySignature(rawBody, signatureB64, publicKeyPem) {
  const verifier = crypto.createVerify('SHA256');
  verifier.update(rawBody);
  return verifier.verify(publicKeyPem, signatureB64, 'base64');
}
```

Grounding for both: [raw/ghl--webhooks--integration-guide-and-signature-verification.md]

## Retry behavior

No first-party retry-schedule specification was found in this research (a documented gap). Treat outbound webhook delivery as at-least-once and dedupe on `webhookId`; do not assume a specific retry count or backoff schedule without verifying against your own account's delivery logs.

## Inbound webhook trigger (workflow trigger, not a REST resource)

- HighLevel generates a unique URL per trigger; POST/GET/PUT JSON to it starts the workflow.
- **No signature or auth scheme exists for this URL** -- treat the URL itself as the secret. [raw/ghl--webhooks--inbound-trigger-workflow-setup.md]
- Minimal example payload for a lead-capture workflow (email required if a Find/Create Contact step is present):

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "+14155550101",
  "source": "external-form",
  "utm_source": "google",
  "utm_medium": "cpc"
}
```

- Keys must be single strings without spaces (CamelCase or snake_case); arrays are accepted in the payload but unusable inside downstream actions. [raw/ghl--webhooks--inbound-trigger-workflow-setup.md]
- If the payload shape changes, re-select the Mapping Reference in the trigger UI -- mapping is bound to the sample captured at setup, not inferred dynamically per request.

## Rotating a compromised inbound trigger URL

There is no rotation endpoint. Delete the Inbound Webhook Trigger and add a new one; a new URL is generated and the old URL stops firing the workflow. Update every external sender to the new URL. [raw/ghl--webhooks--inbound-trigger-workflow-setup.md]
