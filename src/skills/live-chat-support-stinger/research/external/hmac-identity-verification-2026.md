---
source_url: multiple (intercom developer hub, crisp docs, github/intercom/identity-verification-code-samples, developers.intercom.com, docs.crisp.chat, chatwoot docs, zendesk developer docs, github/productdevbook/ahize)
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: identity-verification
stinger: live-chat-support-stinger
---

# HMAC Identity Verification Patterns Across Live Chat Platforms (2026)

## Summary

HMAC-SHA256 identity verification is the standard mechanism for preventing user impersonation in live chat widgets. The core pattern is universal: a server-side signing function hashes a user identifier with a platform-specific secret key, and the resulting hash is passed to the widget on the client side. The secret must NEVER be exposed in client-side code. Intercom is currently migrating from HMAC to JWT; new Intercom integrations should use JWT. Crisp, Chatwoot, and most other platforms continue to use HMAC-SHA256 with email or user ID as the message.

## Why HMAC Identity Verification is Non-Negotiable

Without identity verification, any visitor who inspects your page's JavaScript can discover user identifiers (email, user_id, plan level) and modify them to impersonate another user. The widget will serve them that user's entire conversation history, allow them to interact as that user, and expose any plan-level attributes passed to the widget.

From Crisp's documentation:
> "If you use an unsecure identification token, such as an email address — a token which can be known from unauthenticated users — the attack described above is still possible. For instance, if you set CRISP_TOKEN_ID to the user's email address (which is then a value that can be known to an attacker), then the attacker can recover any previous chat session with the attacked user by setting the CRISP_TOKEN_ID value to the email he wants to target."

## Universal HMAC Pattern

The pattern is identical across all platforms:

```
user_identifier → HMAC-SHA256(secret_key, user_identifier) → hex digest → pass to widget boot call
```

The secret key stays server-side. The hex digest is safe to expose to the browser (it's a one-way hash). The widget sends the hash to the platform on connection; the platform recomputes the hash server-side using the same secret and verifies they match.

## Platform-Specific Implementations

### Intercom

**Current recommendation: JWT (HMAC still supported for backward compat)**

Intercom docs (2026): "JWTs are the recommended method to secure your Messenger. Check out our migration guide to switch from HMAC to JWT."

**Legacy HMAC (still supported):**
- Message: `user_id` (preferred) or `email` (only if you're not sending user_id)
- Algorithm: HMAC-SHA256
- Output: hex digest
- Field name: `user_hash` in the `boot()` call

```typescript
// Server-side (Node.js / TypeScript)
import crypto from 'crypto';

function generateIntercomUserHash(userId: string): string {
  return crypto
    .createHmac('sha256', process.env.INTERCOM_IDENTITY_SECRET!)
    .update(userId)
    .digest('hex');
}

// In an API route (Next.js App Router)
// app/api/intercom-settings/route.ts
import { getServerSession } from 'next-auth';
import { createHmac } from 'crypto';

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const userId = session.user.id;
  const userHash = createHmac('sha256', process.env.INTERCOM_IDENTITY_SECRET!)
    .update(userId)
    .digest('hex');
    
  return Response.json({
    app_id: process.env.INTERCOM_APP_ID,
    user_id: userId,
    user_hash: userHash,
  });
}
```

**Client-side boot call (widget):**
```javascript
window.Intercom('boot', {
  app_id: 'your_app_id',
  user_id: userId,       // Must match what was signed
  user_hash: userHash,   // From server
  email: userEmail,
  name: userName,
});
```

**Secret rotation (Intercom API):**
```
POST /secure_mode_secrets   → creates new secret (returned ONCE, persist immediately)
GET  /secure_mode_secrets   → lists secrets (metadata only, hash never returned again)
DELETE /secure_mode_secrets/{id}  → retires old secret after rollout complete
```

**Rotation procedure:**
1. `POST /secure_mode_secrets` to create new secret → capture value immediately
2. Deploy new signing code using new secret
3. Verify new `user_hash` values are being accepted
4. `DELETE /secure_mode_secrets/{old_id}` to retire old secret

---

### Crisp

**Method: HMAC-SHA256 on email address**

Crisp uses email (not user_id) as the signed identifier. Available from the Mini plan.

**Setup:**
1. Dashboard > Settings > Workspace Settings > Advanced configuration > Identity Verification
2. Enable "Verify user emails with cryptographic signatures"
3. Copy the generated secret key to backend environment

```javascript
// Server-side (Node.js)
const crypto = require('crypto');

const secretKey = process.env.CRISP_IDENTITY_SECRET;

function signEmail(email) {
  return crypto
    .createHmac('sha256', secretKey)
    .update(email)
    .digest('hex');
}
```

```javascript
// Client-side: set email with signature
$crisp.push(['set', 'user:email', [userEmail, emailSignature]]);
```

**Critical Crisp notes:**
- Must use HMAC-SHA256 specifically (no other algorithm accepted)
- Signature is passed as second element of the array alongside the email
- Use `CRISP_TOKEN_ID` for session continuity (server-generated UUID per user, never email)
- Call `$crisp.push(['do', 'session:reset'])` on user logout to unbind the browser session

**From Crisp docs:**
> "Make sure you are signing with HMAC-SHA256. The chatbox is strict on this and checks you are using the correct signature hash algorithm."
> "Never use your verification secret key to generate signatures in your front-end directly."

---

### Help Scout (Beacon)

Help Scout's Beacon widget uses a similar HMAC pattern to confirm identity. The secret is available in the Beacon settings panel.

```javascript
// Server-side (Node.js)
const crypto = require('crypto');

function generateBeaconUserHash(userEmail) {
  return crypto
    .createHmac('sha256', process.env.HELPSCOUT_SECRET_KEY!)
    .update(userEmail)
    .digest('hex');
}
```

```javascript
// Client-side
Beacon('identify', {
  email: userEmail,
  name: userName,
  signature: userHash  // From server
});
```

---

### Chatwoot

Chatwoot uses HMAC-SHA256 with the user's identifier (email or contact ID). Secret found in: Inboxes > Settings > Configuration > Identity Validation.

```javascript
// Node.js
const crypto = require('crypto');
const key = process.env.CHATWOOT_HMAC_TOKEN;
const message = userEmail; // or userId

const hash = crypto
  .createHmac('sha256', key)
  .update(message)
  .digest('hex');
```

Supported languages: PHP, Node.js, Ruby, Elixir, Go, Python.

---

### Platform Identity Verification Method Summary

| Platform | Algorithm | Message | Plan Required | Migration |
|---|---|---|---|---|
| Intercom | HMAC-SHA256 (→ JWT) | user_id (or email) | All plans | Migrating to JWT |
| Crisp | HMAC-SHA256 | email | Mini+ | Stable |
| Help Scout Beacon | HMAC-SHA256 | email | Standard+ | Stable |
| Chatwoot | HMAC-SHA256 | email or userId | All plans | Stable |
| Zendesk Messaging | HMAC-SHA256 (HS256 JWT) | external_id | All plans | JWT recommended |

---

## Next.js App Router Integration Pattern

The canonical pattern for Next.js App Router with any of these platforms:

```typescript
// app/api/chat-identity/route.ts
import { createHmac } from 'crypto';
import { auth } from '@/lib/auth';  // Your auth provider (Clerk, Supabase, etc.)

export async function GET() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const userId = session.user.id;
  
  // For Intercom (HMAC)
  const intercomHash = createHmac('sha256', process.env.INTERCOM_SECRET!)
    .update(userId)
    .digest('hex');
    
  // For Crisp (email-based)  
  const crispHash = createHmac('sha256', process.env.CRISP_SECRET!)
    .update(session.user.email!)
    .digest('hex');
  
  return Response.json({
    userId,
    email: session.user.email,
    intercomHash,
    crispHash,
  }, {
    headers: {
      'Cache-Control': 'no-store',  // CRITICAL: never cache identity tokens
    }
  });
}
```

**Critical: Always set `Cache-Control: no-store`** on identity token responses. From Zendesk docs: "Configure your JWT endpoint to send headers that prevent caching (Cache-Control: no-store) so a token isn't reused unexpectedly by the browser or an intermediary cache."

---

## Security Checklist

From researching multiple platforms, the universal security checklist is:

- [ ] Secret key stored in environment variables (never in code or version control)
- [ ] All signing happens server-side (API route, not client component)
- [ ] Identity endpoint returns `Cache-Control: no-store`
- [ ] Endpoint requires authentication before returning hash (401 if not logged in)
- [ ] Secret rotation procedure documented
- [ ] On user logout: reset/clear the chat session (prevent session hijacking after logout)
- [ ] HTTPS enforced (symmetric secrets must be protected in transit)
- [ ] Test that widget rejects an invalid hash (verify enforcement is active)

---

## `ahize` Library (2026 OSS Tool)

An open-source zero-dependency abstraction layer discovered in research: `ahize` (github.com/productdevbook/ahize, published 2026-04-16).

```typescript
// Typed cross-provider identity verification
import * as chat from 'ahize/intercom';

await chat.identify({
  id: 'user_1',
  email: 'ada@example.com',
  verification: { kind: 'hmac', hash: process.env.INTERCOM_USER_HASH! },
});
```

Supports: Intercom (HMAC + JWT), Crisp (HMAC), Zendesk (JWT callback), HubSpot (JWT), Chatwoot. Pass wrong `kind` for a provider and you get a TypeScript compilation error. May be worth referencing in the stinger's `guides/02-widget-integration.md`.

---

## Key Quotations

- "Identity Verification helps to make sure that conversations between you and your users are kept private and that one user can't impersonate another." (Intercom developer hub)
- "Be careful not to leak your secret key onto your frontend client or anywhere publicly accessible. If you've leaked your secret key, contact us to get a new one." (Intercom developer hub)
- "Generate all your signatures on your backend, and never leak the secret key." (Crisp docs)
- "The raw secret is only available once, in the response to POST /secure_mode_secrets. Persist it at that moment." (Intercom Identity Verification Secrets API docs)
- "Rotation flow: create the new secret, roll it out to every client signing user_hash values, then delete the old secret with DELETE /secure_mode_secrets/{id} once traffic has cut over." (Intercom docs)
- "HMAC-SHA256 is still recognized as secure by the industry, and is widely used to authenticate data across the Internet." (Crisp docs, 2025)

## Annotations for stinger-forge

- **guides/03-identity-verification.md**: The canonical pattern across all platforms is nearly identical. The stinger can provide a single "universal" HMAC snippet and then platform-specific notes. The Next.js App Router endpoint above should be the primary example.
- **Critical non-negotiable from command brief**: The stinger must include a callout box: "NEVER sign in client-side code. If you've leaked your secret, rotate immediately."
- **Intercom JWT migration**: Include a section noting that new Intercom integrations should use JWT, not HMAC, and link to the migration guide.
- **Session continuity vs identity verification**: Crisp has two separate mechanisms — session continuity (CRISP_TOKEN_ID, server-generated UUID) and identity verification (HMAC on email). These are complementary; the stinger should explain both.
- **Replay prevention**: The `created_at` timestamp pattern for replay prevention (briefly mentioned in the command brief) was found in Zendesk's JWT docs as token expiration. The stinger should recommend short-lived tokens (1 hour) and `Cache-Control: no-store`.
