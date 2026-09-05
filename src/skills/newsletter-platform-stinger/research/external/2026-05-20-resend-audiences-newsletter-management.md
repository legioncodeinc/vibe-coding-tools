---
source_url: https://resend.com/docs/dashboard/audiences/introduction
title: "Resend Audiences - Manage contacts easily"
source_type: official-docs
authority: official
relevance: high
topic: resend-audiences
stinger: newsletter-platform-stinger
fetched: 2026-05-20
---

# Resend Audiences: Newsletter List Management

## Summary

Official Resend documentation for Audiences, the contact management and broadcast feature. Resend Audiences is not a standalone newsletter platform - it is the marketing/broadcast layer on top of Resend's transactional email infrastructure. Designed for developers who already use Resend for transactional email and want to manage a newsletter list in the same platform without switching tools.

## What Resend Audiences provides

- **Contacts**: individual email addresses, each with custom properties, subscription status, and full interaction history
- **Properties**: custom contact attributes (first_name, last_name, email, unsubscribed are default; add custom ones)
- **Segments**: groups of contacts for targeted broadcasts
- **Topics**: user-facing email preference management (opt in/out of specific email types)
- **Broadcasts**: one-to-many email sends to an Audience
- **Automatic unsubscribe handling**: unsubscribe links + one-click unsubscribe headers auto-generated; unsubscribed contacts skipped automatically

## API integration code

```typescript
import { Resend } from 'resend';
const resend = new Resend('re_xxxxxxxxx');

// Add contact to audience
await resend.contacts.create({
  email: 'user@example.com',
  firstName: 'Jane',
  lastName: 'Doe',
  unsubscribed: false,
  audienceId: 'your-audience-id',
  properties: {
    company_name: 'Acme Corp',
  },
});
```

## API endpoints (from documentation)

- `POST /audiences` - create new audience
- `GET /audiences` - list all audiences
- `GET /audiences/:id` - get single audience
- `DELETE /audiences/:id` - remove audience (irreversible)
- `POST /audiences/:audienceId/contacts` - create contact
- `GET /audiences/:audienceId/contacts` - list contacts
- `PATCH /audiences/:audienceId/contacts/:id` - update contact
- `DELETE /audiences/:audienceId/contacts/:email` - remove contact by email
- `DELETE /audiences/:audienceId/contacts/:id` - remove contact by ID

## Pricing (2024/2025)

- Free plan: 1,000 contacts, unlimited emails, 1 audience
- Paid plans starting at $40/month for 5,000 contacts, unlimited audiences

## When Resend Audiences makes sense

The use case: **developer already using Resend for transactional email** who wants to add a newsletter without adding a second email platform. Avoids:
- Two contact lists to sync
- Two platforms to bill
- Two sets of unsubscribe tracking

## What Resend Audiences does NOT provide

- Growth tools (referral programs, recommendation networks, Boosts)
- Native monetization (ad network, paid subscriptions)
- A website/web archive for newsletters
- Automation sequences based on user behavior (beyond basic Broadcasts)
- Platform discovery/SEO

## Typical Next.js integration pattern

In `src/app/api/subscribe/route.ts`:
```typescript
// Server Action or Route Handler
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.contacts.create({
  email: formData.get('email') as string,
  audienceId: process.env.RESEND_AUDIENCE_ID!,
  unsubscribed: false,
});
```

Required env vars: `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`, `FROM_EMAIL`

## Annotations for stinger-forge

- Resend Audiences belongs in `guides/00-platform-selection.md` under: "Best for: developers already on Resend for transactional email who want a lightweight newsletter list without switching platforms."
- The key differentiator vs Beehiiv/Loops/Kit: zero additional platform; works within the existing Resend account.
- Limitation to flag: Resend Audiences is not a newsletter business platform. No ad network, no referrals, no growth tools. It is appropriate for a "product update newsletter" use case but not a monetization-first newsletter.
- The Broadcasts feature is the marketing email counterpart to transactional `resend.emails.send()`.
- For `guides/01-embedded-signup.md`: the Resend integration code is the cleanest for Next.js App Router developers.
- Important: Resend Audiences is for marketing; `resend.emails.send()` is for transactional. They are separate subsystems and the unsubscribe handling does NOT cross over.
