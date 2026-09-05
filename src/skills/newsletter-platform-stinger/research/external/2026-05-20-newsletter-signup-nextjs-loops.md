---
source_url: https://getcraftly.dev/blog/email-marketing-loops-so-nextjs-template-setup
title: "I Set Up Email Marketing for My Next.js Business in 30 Minutes with Loops"
source_type: blog
authority: practitioner
relevance: high
topic: embedded-signup
stinger: newsletter-platform-stinger
fetched: 2026-05-20
---

# Newsletter Signup - Next.js App Router + Loops Integration (2026)

## Summary

Complete Next.js 16.2 App Router integration guide for Loops newsletter signup. Shows the Route Handler pattern with Edge runtime, email validation, idempotent contact creation (handles already-subscribed case), and a React form component. Published April 2026.

## Route Handler code (src/app/api/subscribe/route.ts)

```typescript
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const CREATE = "https://app.loops.so/api/v1/contacts/create";
const UPDATE = "https://app.loops.so/api/v1/contacts/update";

export async function POST(req: NextRequest) {
  try {
    const { email, source = "newsletter" } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const apiKey = process.env.LOOPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Not configured" }, { status: 500 });
    }

    const res = await fetch(CREATE, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        source,
        subscribed: true,
        userGroup: "newsletter",
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      // Handle already-subscribed (idempotent)
      if (res.status === 409 || data?.message?.includes("already")) {
        const updateRes = await fetch(UPDATE, {
          // ... update existing contact
        });
        return NextResponse.json({ success: true, existing: true });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
```

## React form component

```tsx
"use client";
import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "homepage-footer" }),
      });
      const data = await res.json();
      setStatus("success");
      setMessage(data.existing ? "You're already on the list!" : "Thanks!");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error");
    }
  }

  if (status === "success") return <div className="text-accent">✓ {message}</div>;

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
      />
      <button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "..." : "Subscribe"}
      </button>
    </form>
  );
}
```

## Domain verification requirements for Loops

1. Loops → Settings → Domain → Add your domain
2. Add DNS records:
   - 3x CNAME (DKIM)
   - 1x MX (bounce handling)
   - 1x TXT (SPF)
   - 1x TXT (DMARC)
3. Wait 1-6 hours for propagation
4. Click Verify in Loops dashboard
5. Loops won't send until domain is verified

## Source attribution tracking pattern

Use the `source` parameter to track where subscribers come from:
- `"homepage-footer"`, `"blog-sidebar"`, `"pricing-page"`, `"popup"`, etc.
- Enables subscriber acquisition source analysis in Loops dashboard

## Double opt-in with Loops

Loops handles welcome email sequences natively:
1. Create Loop automation
2. Trigger: "Contact Added"
3. Email 1 (immediate): Welcome email
4. Subsequent emails in sequence

## Annotations for stinger-forge

- This is the primary template for `guides/01-embedded-signup.md` Loops implementation.
- The idempotent contact creation pattern (409/already-subscribed handling) is production-critical and should be in the template.
- The `source` tracking param is a best practice that should be in all template implementations.
- The Edge runtime (`export const runtime = "edge"`) is the correct pattern for Next.js 15+ App Router route handlers.
- Need to add equivalent implementations for Beehiiv API and Resend Audiences in the guide.
- Rate limiting is not shown in this code - flag as an open question for stinger-forge to address.
