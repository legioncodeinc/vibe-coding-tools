# Example: Intercom HMAC/JWT + Next.js App Router

A complete, production-ready Intercom integration for Next.js 15 App Router. Covers widget installation, JWT identity verification, and logout cleanup.

---

## Files produced

```
app/
+- components/
|  +- IntercomWidget.tsx         (client component — loads and boots Intercom)
+- api/
|  +- support/identity/route.ts  (Server Action returns JWT; never cached)
```

---

## Step 1: Install jose for JWT signing

```bash
npm install jose
```

---

## Step 2: Environment variables

```env
# .env.local
INTERCOM_APP_ID=your_intercom_app_id        # Public — safe for NEXT_PUBLIC_
INTERCOM_SECRET_KEY=your_secret_key          # Secret — server only, never NEXT_PUBLIC_
```

---

## Step 3: Identity API Route

```typescript
// app/api/support/identity/route.ts
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { SignJWT } from 'jose';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const secret = new TextEncoder().encode(process.env.INTERCOM_SECRET_KEY!);

  const token = await new SignJWT({
    user_id: session.user.id,
    email: session.user.email ?? undefined,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret);

  return NextResponse.json(
    {
      token,
      userId: session.user.id,
      email: session.user.email,
      name: session.user.name,
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
```

---

## Step 4: Client component

```tsx
// app/components/IntercomWidget.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

declare global {
  interface Window {
    Intercom: (...args: unknown[]) => void;
    intercomSettings?: Record<string, unknown>;
  }
}

const APP_ID = process.env.NEXT_PUBLIC_INTERCOM_APP_ID!;

function loadIntercomScript(appId: string) {
  if (typeof window === 'undefined' || window.Intercom) return;

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = `https://widget.intercom.io/widget/${appId}`;
  document.body.appendChild(script);
}

export function IntercomWidget() {
  const { data: session, status } = useSession();
  const booted = useRef(false);

  useEffect(() => {
    loadIntercomScript(APP_ID);
  }, []);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      // Boot anonymous session
      window.Intercom?.('boot', { app_id: APP_ID });
      booted.current = true;
      return;
    }

    if (status === 'authenticated' && session?.user && !booted.current) {
      // Fetch JWT from server
      fetch('/api/support/identity', { cache: 'no-store' })
        .then((res) => res.json())
        .then((identity) => {
          window.Intercom?.('boot', {
            app_id: APP_ID,
            user_id: identity.userId,
            email: identity.email,
            name: identity.name,
            user_hash: identity.token, // JWT token
          });
          booted.current = true;
        })
        .catch(() => {
          // Graceful degradation: boot anonymous if identity fetch fails
          window.Intercom?.('boot', { app_id: APP_ID });
          booted.current = true;
        });
    }
  }, [status, session]);

  return null;
}
```

---

## Step 5: Logout cleanup

In your sign-out handler (e.g., a server action or button):

```typescript
// Shutdown Intercom on logout before clearing the session
if (typeof window !== 'undefined') {
  window.Intercom?.('shutdown');
}
await signOut();
```

Calling `shutdown` before clearing the session prevents the previous user's conversation from appearing for the next user on a shared device.

---

## Step 6: Mount in layout

```tsx
// app/layout.tsx
import { IntercomWidget } from '@/components/IntercomWidget';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
          <IntercomWidget />
        </SessionProvider>
      </body>
    </html>
  );
}
```

---

## Verification checklist

- [ ] Widget loads without console errors on the home page.
- [ ] Logged-in user sees their name and email pre-populated in the messenger.
- [ ] Intercom dashboard shows "Verified" badge on the conversation.
- [ ] After logout, Intercom session is cleared (no previous user data visible on re-login).
- [ ] `/api/support/identity` returns 401 for unauthenticated requests.
- [ ] `INTERCOM_SECRET_KEY` does not appear in the browser bundle (run `next build` and grep the `.next/` output).
