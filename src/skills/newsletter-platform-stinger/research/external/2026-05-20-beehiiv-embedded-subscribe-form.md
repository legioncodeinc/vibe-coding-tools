---
source_url: https://www.beehiiv.com/support/article/12977090590487-creating-and-embedding-beehiiv-subscribe-forms
title: "Creating an embedded subscribe form | beehiiv Help"
source_type: official-docs
authority: official
relevance: high
topic: embedded-signup
stinger: newsletter-platform-stinger
fetched: 2026-05-20
---

# Beehiiv Embedded Subscribe Forms - Official Documentation (2026)

## Summary

Official Beehiiv documentation for creating and embedding subscribe forms on external websites. Two approaches available: (1) script-tag embed for external sites, (2) native Website Builder blocks for the Beehiiv-hosted site. The script embed is the integration path for Next.js or custom web products.

## Integration approaches

### Approach 1: Script Tag Embed (for external/custom sites)

1. Go to Subscribers > Subscribe forms → Create new form
2. Customize fields (email required; can add name, phone, custom fields)
3. Configure post-submission: success message OR redirect URL
4. Toggle double opt-in (per-form, overrides publication-level setting)
5. Save → Get embed code → Copy script tag
6. Paste script tag into HTML (inline forms go in body; popup/slide/sticky go anywhere)

**Available form layouts**: Inline, Popup, Slide left, Slide right, Sticky top, Sticky bottom

**Key limitation**: "Embedded subscribe forms do not route subscribers through multi-step signup flows. You can configure a single redirect URL on successful submission."

### Approach 2: Native Website Builder Blocks (Beehiiv-hosted site only)

- Cannot be used with external sites
- Supports multi-step signup flows
- Connects directly to automation triggers

## Double opt-in

- Configurable per-form via Settings tab
- Setting: "Require double opt-in" - forces email confirmation via double opt-in email
- Overrides publication-level opt-in setting when publication-level setting is disabled

## Attribution tracking

- Optional: copy the Attribution tracking script (JavaScript) to pass UTM parameters to Beehiiv
- Paste just before closing `</body>` tag on the page containing the form

## Embed code formats

- Script tag format (single script to paste)
- Works with WordPress, Webflow, Squarespace, Shopify, Wix, BigCommerce, WooCommerce

## Custom fields available

- Email (required)
- Name
- Phone number
- Birthday/date fields
- True/false options
- List selection (multi-option)

## Integration pattern for Next.js (non-embed approach)

For Next.js App Router, the **programmatic API approach** (not the script embed) is preferred:

```typescript
// app/api/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  // Beehiiv API v2
  const res = await fetch(
    `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        reactivate_existing: false,
        send_welcome_email: true,
        utm_source: 'website',
        utm_medium: 'signup-form',
      }),
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
```

Required env vars: `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`

## Annotations for stinger-forge

- The script-tag embed is the zero-code path; the API integration is the developer path for Next.js.
- For `guides/01-embedded-signup.md`, provide BOTH options: script tag (simplest, 5 minutes) and API Route Handler (cleanest for Next.js App Router, no third-party script injection).
- The `utm_source` and `utm_medium` parameters in the API call are the Beehiiv equivalent of Loops' `source` parameter - use them for acquisition tracking.
- Double opt-in is a deliverability best practice - include it as a recommended default in the guide.
- The "single redirect URL" limitation of embedded forms (no multi-step flows) is important to flag - if the user needs a multi-step onboarding (e.g., "choose topics"), they must use the Beehiiv Website Builder or build custom flow.
