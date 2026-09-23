# Example: Crisp HMAC-SHA256 + Next.js App Router

A complete Crisp integration for Next.js 15 App Router with HMAC-SHA256 identity verification on email, session continuity via CRISP_TOKEN_ID, and logout cleanup.

---

## Environment variables

```env
CRISP_SECRET_KEY=your_crisp_hmac_secret     # Server only — never NEXT_PUBLIC_
NEXT_PUBLIC_CRISP_WEBSITE_ID=your_website_id # Public — safe for client
```

---

## Identity API Route

```typescript
// app/api/support/identity/route.ts
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Your database client

async function getOrCreateCrispTokenId(userId: string): Promise<string> {
  // Store tokenId in your DB so it persists across sessions
  const existing = await db.user.findUnique({ where: { id: userId }, select: { crispTokenId: true } });
  if (existing?.crispTokenId) return existing.crispTokenId;

  const tokenId = crypto.randomUUID();
  await db.user.update({ where: { id: userId }, data: { crispTokenId: tokenId } });
  return tokenId;
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Crisp requires HMAC-SHA256 on email (NOT user_id)
  const userHash = crypto
    .createHmac('sha256', process.env.CRISP_SECRET_KEY!)
    .update(session.user.email)
    .digest('hex');

  const tokenId = await getOrCreateCrispTokenId(session.user.id);

  return NextResponse.json(
    {
      userHash,
      email: session.user.email,
      name: session.user.name ?? '',
      tokenId,
    },
    {
      headers: { 'Cache-Control': 'no-store' },
    }
  );
}
```

---

## Client component

```tsx
// app/components/CrispWidget.tsx
'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

declare global {
  interface Window {
    $crisp: unknown[][];
    CRISP_WEBSITE_ID: string;
  }
}

const WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID!;

function loadCrispScript() {
  if (typeof window === 'undefined' || window.$crisp) return;
  window.$crisp = [];
  window.CRISP_WEBSITE_ID = WEBSITE_ID;
  const script = document.createElement('script');
  script.src = 'https://client.crisp.chat/l.js';
  script.async = true;
  document.head.appendChild(script);
}

export function CrispWidget() {
  const { data: session, status } = useSession();

  useEffect(() => {
    loadCrispScript();
  }, []);

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.email) return;

    fetch('/api/support/identity', { cache: 'no-store' })
      .then((res) => res.json())
      .then((identity) => {
        // Verified identity — email + HMAC hash
        window.$crisp?.push(['set', 'user:email', [identity.email, identity.userHash]]);
        window.$crisp?.push(['set', 'user:nickname', [identity.name]]);
        // Session continuity — prevents losing conversation on page reload
        window.$crisp?.push(['set', 'session:data', [[['crisp_token_id', identity.tokenId]]]]);
      })
      .catch(() => {
        // Graceful degradation: anonymous session
      });
  }, [status, session?.user?.email]);

  return null;
}
```

---

## Logout cleanup

```typescript
// In your sign-out handler:
window.$crisp?.push(['do', 'session:reset']); // REQUIRED — prevents session hijack
await signOut();
```

Skipping `session:reset` allows the previous user's conversation to appear for the next logged-in user on a shared device.

---

## Mount in layout

```tsx
// app/layout.tsx
import { CrispWidget } from '@/components/CrispWidget';
export default function RootLayout({ children }) {
  return (
    <html><body>
      {children}
      <CrispWidget />
    </body></html>
  );
}
```
