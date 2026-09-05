# Guide 01: Embedded Newsletter Signup Integration

*Derived from: `research/external/2026-05-20-newsletter-signup-nextjs-loops.md`, `research/external/2026-05-20-beehiiv-embedded-subscribe-form.md`, `research/external/2026-05-20-beehiiv-api-v2-developer-docs.md`, `research/external/2026-05-20-resend-audiences-newsletter-management.md`*

Three integration patterns exist. Use Pattern A (API route handler) as the default for any product that needs source attribution or server-side logic.

---

## Pattern A: API route handler (Next.js App Router)

The recommended production pattern. Your Next.js Route Handler calls the platform API server-side. No CORS issues, API key stays on the server, easy to add rate limiting.

### Loops implementation (production-ready)

Source: `research/external/2026-05-20-newsletter-signup-nextjs-loops.md`

```typescript
// src/app/api/subscribe/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const LOOPS_CREATE = "https://app.loops.so/api/v1/contacts/create";

export async function POST(req: NextRequest) {
  const { email, source = "newsletter" } = await req.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const apiKey = process.env.LOOPS_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const res = await fetch(LOOPS_CREATE, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ email, source, subscribed: true, userGroup: "newsletter" }),
  });

  // Idempotent: already-subscribed is a success, not an error
  if (res.status === 409) {
    return NextResponse.json({ success: true, existing: true });
  }

  if (!res.ok) {
    return NextResponse.json({ error: "Platform error" }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
```

**The `source` parameter is load-bearing.** Pass it as `"homepage-footer"`, `"blog-sidebar"`, `"pricing-page"`, `"popup"` etc. It enables subscriber acquisition source analysis in the Loops dashboard.

### Beehiiv API implementation

Source: `research/external/2026-05-20-beehiiv-api-v2-developer-docs.md`

```typescript
// src/app/api/subscribe/route.ts (Beehiiv variant)
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { email, source = "website" } = await req.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;
  const apiKey = process.env.BEEHIIV_API_KEY;
  if (!publicationId || !apiKey) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const res = await fetch(
    `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        reactivate_existing: false,
        send_welcome_email: true,
        utm_source: source,
        utm_medium: "website",
      }),
    }
  );

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    // Existing subscriber — treat as success
    if (data?.errors?.[0]?.includes("already") || res.status === 409) {
      return NextResponse.json({ success: true, existing: true });
    }
    return NextResponse.json({ error: "Platform error" }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
```

Required environment variables: `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID` (found in Beehiiv Settings > API).

> TODO: Beehiiv API segment-level writes — research confirmed the `POST /subscriptions` endpoint but did not confirm segment-level assignment via API. Verify at developers.beehiiv.com before documenting segment targeting.

### Resend Audiences implementation

```typescript
// src/app/api/subscribe/route.ts (Resend Audiences variant)
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email, firstName } = await req.json();

  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const { error } = await resend.contacts.create({
    email,
    firstName,
    unsubscribed: false,
    audienceId,
  });

  if (error) {
    // Resend returns 409 for existing contacts
    if (error.statusCode === 409) {
      return NextResponse.json({ success: true, existing: true });
    }
    return NextResponse.json({ error: "Platform error" }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
```

---

## React form component (works with all three route handlers above)

```tsx
// components/newsletter-form.tsx
"use client";
import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterForm({ source = "default" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus("success");
      setMessage(data.existing ? "You're already subscribed!" : "You're in! Check your inbox.");
      setEmail("");
    } catch (err: unknown) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Try again.");
    }
  }

  if (status === "success") {
    return <p className="text-sm text-green-600">{message}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        disabled={status === "loading"}
        className="flex-1 rounded border px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {status === "loading" ? "Subscribing..." : "Subscribe"}
      </button>
      {status === "error" && (
        <p className="w-full text-xs text-red-600">{message}</p>
      )}
    </form>
  );
}
```

Usage: `<NewsletterForm source="homepage-hero" />`

---

## Pattern B: Beehiiv iframe embed

Source: `research/external/2026-05-20-beehiiv-embedded-subscribe-form.md`

The fastest path for Beehiiv users. No backend code needed; no API key exposure.

In Beehiiv: Go to **Grow → Subscribe Forms → Embed**. Copy the iframe snippet:

```html
<iframe
  src="https://embeds.beehiiv.com/XXXXXXXX"
  data-test-id="beehiiv-embed"
  width="100%"
  height="320"
  frameborder="0"
  scrolling="no"
  style="border-radius: 4px; border: 2px solid #e5e7eb; margin: 0; background-color: transparent;"
></iframe>
```

Trade-off: limited styling control (only the CSS Beehiiv exposes in its embed customizer). Cannot pass `source` tracking parameters per-embed.

---

## Pattern C: Platform-hosted landing page

The zero-code option. Beehiiv, Kit, and Loops all provide hosted subscribe pages. Link to them from your product. No integration required.

Best when: you are in early validation mode and do not yet have a product to embed the form in.

---

## Domain verification requirements (for Pattern A)

All three platforms require custom sending domain verification before they will send on your behalf:

**Loops** (from `research/external/2026-05-20-newsletter-signup-nextjs-loops.md`):
1. Loops → Settings → Domain → Add your domain
2. Add 3x CNAME (DKIM), 1x MX, 2x TXT (SPF + DMARC)
3. Wait 1-6 hours; click Verify
4. Loops will not send until domain is verified

**Beehiiv**: Settings → Email Domain → Custom Domain. Same DNS record types. Beehiiv provides step-by-step DNS instructions in dashboard.

**Resend Audiences**: If already using Resend for transactional, the domain is already verified. No additional work.

---

## Adding rate limiting (recommended for production)

The code examples above do not include rate limiting. For production, add per-IP rate limiting to the route handler:

```typescript
// Using Upstash Rate Limit (works on Edge runtime)
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 requests per IP per minute
});

// In the handler:
const ip = req.ip ?? "127.0.0.1";
const { success } = await ratelimit.limit(ip);
if (!success) {
  return NextResponse.json({ error: "Too many requests" }, { status: 429 });
}
```

---

## Example

See `examples/embedded-signup-walkthrough.md` for a complete from-scratch walkthrough of the Loops + Next.js integration from environment variable setup to production deployment.
