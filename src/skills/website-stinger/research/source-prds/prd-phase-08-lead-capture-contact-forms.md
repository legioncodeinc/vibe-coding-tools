# Phase 8: Lead Capture & Contact Forms

> **Site Template Guide**: PRD Phase 8 of 12

---

## Phase Overview

### Goals

Two-step lead capture form with superforms + Zod validation, exit-intent popup, first-touch attribution merge, and Supabase insert. A notification trigger fires after successful lead capture (Phase 10 webhook or Supabase email Edge Function if Phase 10 is skipped).

### Scope

**In scope:**
- `src/lib/schemas/lead.ts`: Zod schemas for Step 1 and Step 2
- `src/routes/contact/+page.server.ts`: form action with validation and Supabase insert
- `src/lib/components/LeadForm.svelte`: two-step form with progress indicator
- `src/lib/components/LeadPopup.svelte`: exit-intent popup (mouse-leave detection)
- Attribution merge from `localStorage` into lead payload
- `generate_lead` GA4 event on success
- `src/routes/api/notify-lead/+server.ts`: internal endpoint to trigger notification

**Out of scope:**
- A/B testing of form copy or layout (Phase 11)
- Phone number verification (add Twilio Verify if needed)
- Chat/live support widget (add separately)

### Dependencies

- Phase 5: `public.leads` table exists with RLS allowing anon INSERT
- Phase 4: `getAttribution()` and `clearAttribution()` available from attribution module

---

## User Stories

### Story 1: Visitor: Complete Two-Step Lead Form

> As a **Visitor**, I want to submit a contact form in two steps (basic info → details) so that the initial step feels low-friction and I'm progressively committed once I see the second step.

**Acceptance criteria:**
- Step 1 collects: name (required), email (required, validated), phone (optional)
- Step 2 collects: message (optional), referral source (dropdown), referral name (conditional)
- Step 1 validates before advancing: TypeScript compiler enforces field types
- Step 2 submit button shows loading state during submission
- On success: Step 3 (thank-you state) rendered within the same form component

### Story 2: Visitor: Referral Tracking

> As a **Visitor**, I want to optionally select how I heard about the service so that the business can track referral sources.

**Acceptance criteria:**
- `referral_source` dropdown options: "A friend", "Search engine", "Social media", "Event", "Other"
- `referral_name` text field shown only when `referral_source === 'friend'`
- Both fields are optional: no validation error if left blank

Note: Options are generic and industry-agnostic. There is no "athlete", "coach", or sport-specific option.

### Story 3: System: Attribution Merge

> As the **System**, I want first-touch UTM attribution data merged into the lead record at insert time so that lead source can be analyzed without relying on GA4 session data.

**Acceptance criteria:**
- `getAttribution()` called before form submission; values passed as hidden fields
- `utm_source`, `utm_medium`, `utm_campaign` stored in the `public.leads` row
- If no UTM data (direct visit), fields are null in the database
- `clearAttribution()` called after successful submission

### Story 4: Marketing Team: Exit-Intent Popup

> As a **Marketing Team Member**, I want an exit-intent popup to appear when a visitor moves their cursor toward the browser chrome (desktop only) so that I can capture leads who would otherwise leave without converting.

**Acceptance criteria:**
- Popup fires on `mouseleave` when `e.clientY <= 0` (top of viewport, not bottom)
- Popup appears at most once per session (sessionStorage `lead_popup_dismissed`)
- Popup dismissed by clicking outside or the close button
- Popup NOT triggered on mobile (touch devices do not have mouse events)

---

## Zod Schema

```ts
// src/lib/schemas/lead.ts
import { z } from 'zod';

export const step1Schema = z.object({
  name:  z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
});

export const step2Schema = z.object({
  message:          z.string().min(10).optional(),
  source:           z.enum(['contact_form', 'popup', 'footer', 'hero']).default('contact_form'),
  referral_source:  z.enum(['friend', 'search', 'social', 'event', 'other']).optional(),
  referral_name:    z.string().optional(),
});

export const leadSchema = step1Schema.merge(step2Schema);
```

The `referral_source` enum contains only generic options. No sport-specific, industry-specific, or domain-specific values.

---

## Lead Insert Shape

```ts
{
  email: string,
  name: string,
  phone?: string,
  message?: string,
  source: 'contact_form' | 'popup' | 'footer' | 'hero',
  referral_source?: 'friend' | 'search' | 'social' | 'event' | 'other',
  referral_name?: string,
  utm_source?: string,
  utm_medium?: string,
  utm_campaign?: string,
}
```

---

## Notification Trigger

After successful Supabase insert, trigger a notification:

**If Phase 10 is active (webhooks):**
```ts
await fetch('/api/notify-lead', {
  method: 'POST',
  body: JSON.stringify({ event_type: 'lead.created', leadId: data.id }),
});
```

**If Phase 10 is skipped (TypeScript-as-CMS fallback / simple site):**
```ts
// Call Supabase Edge Function that sends email via Resend
await fetch(`${SUPABASE_URL}/functions/v1/notify-lead-email`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
  body: JSON.stringify({ leadId: data.id }),
});
```

---

## GA4 Event

```ts
// After successful submission in onUpdated superform callback:
if (browser && window.gtag) {
  window.gtag('event', 'generate_lead', { method: source });
}
```

---

## Risks and Open Questions

- **R-1:** Exit-intent popup fires on any `mouseleave` with `clientY <= 0`: this includes moving to the browser's browser chrome, which is the intended trigger. On laptops with small screens, this can fire accidentally. Consider adding a `setTimeout` delay (e.g., user must be on the page ≥15 seconds) before enabling the listener.
- **R-2:** `referral_name` (free text) could contain PII. Ensure it is treated as PII in any data export or GDPR compliance review. Mention in the legal docs (Phase: optional, not covered here) and in the privacy policy.
- **Q-1:** Should the `source` field be configurable at the component level (e.g., a hero form sets `source: 'hero'`) or always default to `contact_form`? The current design passes `source` as a hidden field; the component renders it. This is correct.
