# Guide 03: Identity Verification (HMAC and JWT)

The complete implementation guide for securing live chat widget user identity. Read `guides/00-principles.md` first — Principle 1 (server-side signing, always) governs this entire guide.

---

## Why identity verification matters

Without identity verification, any visitor to your app can open DevTools, find the widget initialization call, and change the `user_id`, `email`, or `name` fields to any value. Your support team would then see false identity data and might:
- Apply discounts or credits to an attacker's account.
- Share sensitive plan details with the wrong person.
- Trust a fraudulent escalation ("I'm a Pro user, I need this fixed now").

Identity verification cryptographically ties the widget session to a server-side claim, making spoofing infeasible without access to the secret.

---

## The universal pattern (HMAC-SHA256)

All platforms that support identity verification follow the same pattern:

```
server_secret + user_identifier → HMAC-SHA256 → hex string → passed to widget boot
```

The secret lives in an environment variable on your server. The user identifier varies by platform (see below). The hex string is generated server-side, returned to the client via a `/api/support/identity` endpoint, and passed to the widget's boot call.

---

## Per-platform implementation

### Intercom — JWT (recommended for new integrations)

Intercom is migrating from HMAC to JWT. New implementations should use JWT; existing HMAC implementations should plan migration (no published deprecation deadline as of May 2026, but JWT is the stated direction).

**JWT implementation (server-side):**

```typescript
// app/api/support/identity/route.ts (Next.js App Router)
import { getServerSession } from 'next-auth';
import { SignJWT } from 'jose';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const secret = new TextEncoder().encode(process.env.INTERCOM_SECRET_KEY!);
  const token = await new SignJWT({
    user_id: session.user.id,
    email: session.user.email,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret);

  return NextResponse.json(
    { token, userId: session.user.id, email: session.user.email },
    { headers: { 'Cache-Control': 'no-store' } } // Critical: never cache identity tokens
  );
}
```

**HMAC implementation (legacy / migration path):**

```typescript
import crypto from 'crypto';

function generateIntercomHmac(userId: string, secretKey: string): string {
  return crypto
    .createHmac('sha256', secretKey)
    .update(userId)
    .digest('hex');
}

// In the API route:
const userHash = generateIntercomHmac(session.user.id, process.env.INTERCOM_SECRET_KEY!);
```

---

### Crisp — HMAC-SHA256 on email

Crisp uses the user's **email** (not user_id) as the message to sign. This is a Crisp-specific requirement — do not use user_id.

```typescript
// app/api/support/identity/route.ts (Next.js App Router)
import { getServerSession } from 'next-auth';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // HMAC-SHA256 on email — Crisp-specific requirement
  const userHash = crypto
    .createHmac('sha256', process.env.CRISP_SECRET_KEY!)
    .update(session.user.email)
    .digest('hex');

  // CRISP_TOKEN_ID: stable UUID per user for session continuity
  // Store in DB; generate once per user, reuse on subsequent calls
  const tokenId = await getOrCreateCrispTokenId(session.user.id);

  return NextResponse.json(
    { userHash, email: session.user.email, name: session.user.name, tokenId },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
```

**Session reset on logout (required):**
```typescript
// In your logout handler, client-side:
window.$crisp?.push(['do', 'session:reset']);
```

Skipping the session reset allows the previous user's conversation to persist for the next user on a shared device.

---

### Help Scout (Beacon)

Help Scout's Beacon uses an `identifyUser()` call with an optional signature for verified identity:

```typescript
// Server-side hash
const signature = crypto
  .createHmac('sha256', process.env.HELP_SCOUT_SECRET_KEY!)
  .update(session.user.email)
  .digest('hex');

// Client-side boot
Beacon('identify', {
  email: session.user.email,
  name: session.user.name,
  signature, // Optional but strongly recommended
});
```

---

## `Cache-Control: no-store` — the critical header

Every identity API endpoint must include `Cache-Control: no-store`. If the response is cached:
- CDN edge caches may serve one user's hash to another user.
- Client-side caches may serve a stale hash after the user logs out.

This is one of the most commonly missed implementation details.

---

## Key rotation procedure

### Intercom
1. Go to Settings → Security → Identity Verification.
2. Click "Rotate secret" — Intercom provides a migration window (usually 24–48 hours) during which both the old and new secrets are valid.
3. Deploy the new secret to production before the window closes.
4. Verify by booting the widget with a test account and confirming no identity verification errors in the Intercom debugger.

### Crisp
1. Go to Crisp Dashboard → Settings → Website → Identity Verification.
2. Generate a new secret — the old secret becomes invalid immediately (no migration window).
3. Deploy to production before rotating; coordinate with your deploy pipeline to avoid a window where the widget is broken.

---

## Testing identity verification

1. Install the widget with identity verification enabled.
2. Log in as a test user.
3. In Intercom/Crisp, confirm the conversation shows the verified user's name and email.
4. Try modifying the `user_hash` field in DevTools to a random value. The platform should reject the identity and either show an anonymous session or block the boot.
5. Log out and verify the session is reset (no previous user data appears for the next user).
