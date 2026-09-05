# Guide 02: Widget Integration

Installation patterns for live chat widgets in 2026 stacks. Covers JS snippet placement, React SDK patterns, Next.js App Router integration, CSP headers, and async-loading best practices.

---

## General installation principles

1. **Always async-load the widget script.** Live chat scripts range from 50–200 KB. Synchronous loading blocks page render and hurts Core Web Vitals (LCP). All platforms provide async-safe installation instructions; use them.
2. **Place the widget component in a layout, not a page.** For React/Next.js, mount the widget once in a root layout component. Do not re-mount on every page navigation.
3. **Fetch the identity hash from a Server Action or API Route before booting the widget.** Never hardcode the hash. See `guides/03-identity-verification.md`.
4. **Set CSP headers to allow the widget's CDN domain.** Intercom, Crisp, and Plain each have documented CDN domains. Missing CSP entries silently block the widget in production.

---

## Next.js App Router patterns

### General pattern

```tsx
// app/components/SupportWidget.tsx
'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react'; // or Clerk, Supabase, etc.

type IdentityPayload = {
  userHash: string;
  userId: string;
  email: string;
  name: string;
};

async function fetchIdentityHash(): Promise<IdentityPayload> {
  const res = await fetch('/api/support/identity', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch identity hash');
  return res.json();
}

export function SupportWidget() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user) return;

    fetchIdentityHash().then((identity) => {
      // Platform-specific boot call goes here
      // See platform sections below
    });
  }, [session?.user?.id]);

  return null; // Widget renders its own UI
}
```

Mount in `app/layout.tsx`:
```tsx
// app/layout.tsx
import { SupportWidget } from '@/components/SupportWidget';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <SupportWidget />
      </body>
    </html>
  );
}
```

---

## Platform-specific installation

### Intercom (App Router)

```tsx
// app/components/SupportWidget.tsx — Intercom section
'use client';
import { useEffect } from 'react';

declare global {
  interface Window {
    Intercom: (...args: unknown[]) => void;
    intercomSettings: Record<string, unknown>;
  }
}

function loadIntercom(appId: string) {
  if (window.Intercom) return;
  const script = document.createElement('script');
  script.src = `https://widget.intercom.io/widget/${appId}`;
  script.async = true;
  document.body.appendChild(script);
}

export function IntercomWidget({ appId }: { appId: string }) {
  useEffect(() => {
    loadIntercom(appId);
  }, [appId]);

  return null;
}
```

Boot with verified identity (after fetching hash from server — see guide 03):
```typescript
window.Intercom('boot', {
  app_id: process.env.NEXT_PUBLIC_INTERCOM_APP_ID,
  user_id: identity.userId,
  email: identity.email,
  name: identity.name,
  user_hash: identity.userHash, // JWT or HMAC; see guide 03
});
```

---

### Crisp (App Router)

```tsx
// app/components/CrispWidget.tsx
'use client';
import { useEffect } from 'react';

declare global {
  interface Window {
    $crisp: unknown[][];
    CRISP_WEBSITE_ID: string;
  }
}

export function CrispWidget({ websiteId }: { websiteId: string }) {
  useEffect(() => {
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = websiteId;
    const script = document.createElement('script');
    script.src = 'https://client.crisp.chat/l.js';
    script.async = true;
    document.head.appendChild(script);
  }, [websiteId]);

  return null;
}
```

Identify user with HMAC (after fetching from server):
```typescript
window.$crisp.push(['set', 'user:email', [identity.email, identity.userHash]]);
window.$crisp.push(['set', 'user:nickname', [identity.name]]);
```

**Session continuity:** Add `CRISP_TOKEN_ID` for session persistence across reloads:
```typescript
// On the server, generate and store a UUID per user session
window.$crisp.push(['set', 'session:data', [[['crisp_token_id', identity.tokenId]]]]);
```
Reset on logout: `window.$crisp.push(['do', 'session:reset']);`

---

### Plain (App Router)

Plain is API-first and does not use a traditional JavaScript widget for most integrations. Customer interactions happen through:
- Slack Connect (primary B2B channel)
- Plain's hosted chat portal (requires Horizon plan)
- Custom integrations via Plain's GraphQL API + Machine Users

If using Plain's chat interface, consult `plain.com/docs` for the specific chat channel configuration. Identity is managed through the GraphQL API's `upsertCustomer` mutation rather than a client-side widget boot call.

---

## CSP header configuration

Add these directives to your `next.config.js` or middleware-level headers:

```javascript
// next.config.js
const ContentSecurityPolicy = `
  script-src 'self' 'unsafe-inline' https://widget.intercom.io https://js.intercomcdn.com https://client.crisp.chat;
  frame-src 'self' https://intercom-sheets.com https://share.vidyard.com;
  img-src 'self' data: https://uploads.intercomcdn.com https://static.intercomassets.com;
  connect-src 'self' https://api.intercom.io https://api.eu.intercom.io wss://*.intercom.io https://api.crisp.chat;
`;
```

Check each platform's docs for the full CDN domain list — domains change with platform updates.

---

## ahize: multi-platform abstraction (optional)

`ahize` (github.com/productdevbook/ahize, April 2026) is a typed, zero-dependency library providing a unified `load/identify/track/show` interface over Intercom, Crisp, Zendesk, and Chatwoot. Useful when:
- Migrating between platforms
- Running A/B tests across platforms
- Building a support abstraction layer

**Note:** Evaluate stability before adopting in production — the library is early-stage (April 2026).
