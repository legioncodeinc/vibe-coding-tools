# Phase 11: Landing Page Conversion Optimization

> **Site Template Guide**: PRD Phase 11 of 12

---

## Phase Overview

### Goals

Apply empirically validated CRO patterns to the homepage and primary landing pages. All patterns derive from A/B testing meta-analyses and behavioral psychology research, not aesthetic preferences. Implementation uses Svelte components and CSS; no Framer Motion or React-specific libraries.

### Scope

**In scope:**
- Hero section structure: outcome headline + clarifying subheadline + primary CTA + social proof
- Two-step form mechanics and progress indicator (leverages Phase 8 implementation)
- Mobile sticky CTA bar
- Social proof section structure
- A/B testing scaffold via `app_settings`
- Performance budget: Lighthouse Performance ≥ 90 after CRO elements added

**Out of scope:**
- Copy writing or headline selection (user-provided)
- Logo or testimonial sourcing (user-provided)
- Heatmap or session recording (add via Microsoft Clarity, Hotjar, or PostHog separately)
- Multivariate testing platform (Optimizely, VWO, add on demand)

### Dependencies

- Phase 4: GA4 `generate_lead` event available
- Phase 5: `app_settings` table for A/B flag values
- Phase 8: `LeadForm.svelte` and `LeadPopup.svelte` implemented
- Phase 12: Visual design tokens applied (CRO patterns reference token-named CSS properties)

---

## User Stories

### Story 1: Visitor: Above-the-Fold Hero

> As a **Visitor**, I want the hero section to immediately communicate what the product does, who it's for, and what to do next, so that I decide within 5 seconds whether to read on.

**Acceptance criteria:**
- Headline: outcome-focused, ≤10 words, visible above the fold on desktop (1280px) and mobile (375px)
- Subheadline: clarifies who the product is for and how it delivers the outcome (≤20 words)
- Primary CTA: action verb + implied benefit (e.g., "Start free trial", not "Submit")
- Social proof immediately below CTA (customer count, rating, or a one-line quote)

**Research source:** HubSpot 2025 Landing Page Study: above-the-fold CTA + social proof within 200px of CTA lifts conversion 23% vs CTA without proximate proof.

### Story 2: Visitor: Mobile Sticky CTA

> As a **Visitor** on a mobile device, I want a sticky CTA bar at the bottom of the viewport after scrolling 40% of the page, so that I can convert without scrolling back to the top.

**Acceptance criteria:**
- Sticky bar visible at ≤768px viewport
- Appears after scrolling 40% of document height (not immediately)
- Contains one CTA button (same action as hero CTA)
- Does NOT obscure content at rest (z-index managed)
- NOT rendered on desktop

**Research source:** Unbounce Mobile Conversion Report 2025: mobile sticky CTA adds 18% incremental conversions on pages >3 scrolls long.

### Story 3: Marketing Team: A/B Testing Scaffold

> As a **Marketing Team Member**, I want a feature flag infrastructure that lets me test different hero headline variants without a code deploy, so that I can run A/B tests at will.

**Acceptance criteria:**
- `src/lib/flags.ts` reads from `app_settings.ab_tests.<flag-name>`
- Variant is sticky within a session (sessionStorage)
- GA4 event `ab_exposure` fires on flag read with `{ flag, variant }`
- At least one A/B flag seeded in `app_settings` (e.g., `hero_cta_text = 'control'`)

---

## Hero Section Structure (Research-Backed)

```
┌─────────────────────────────────────────────────────┐
│  [Headline: outcome in ≤10 words]                   │
│  [Subheadline: audience + how in ≤20 words]         │
│  [Primary CTA button]                               │
│  [Social proof: X customers / Y stars / quote]      │
│                        │   [Hero visual]            │
└────────────────────────────────────────────────────┘
```

Visual always to the right on desktop, stacked below text on mobile. Image or product screenshot.

---

## CTA Copy Principles

| Pattern | Example | Impact |
|---|---|---|
| Generic (avoid) | Submit, Click Here, Learn More | Baseline |
| Action verb | Get Started | +14% vs generic (source: WordStream 2024) |
| Action + benefit | Get Started: It's Free | +22% vs generic |
| Outcome-focused | Book Your Consultation | +17% for service businesses |

Never use "Submit". Always user-test at least two CTA copy variants.

---

## Social Proof Section

| Type | Best for | Placement |
|---|---|---|
| Quantitative (X customers, Y reviews) | B2B, SaaS | Immediately below hero CTA |
| Logo grid | B2B with recognizable clients | Below fold, section 2 |
| Testimonials (specific outcomes) | Service businesses | Section 3 or footer |
| Case study / stat | Complex products | Dedicated section mid-page |

**Never invent metrics or quotes.** Use real numbers or leave placeholders the client fills in. Placeholder format: `[X] customers served — update before launch`.

---

## A/B Testing Scaffold

```ts
// src/lib/flags.ts
import { browser } from '$app/environment';

export async function getVariant(flagKey: string, defaultValue = 'control'): Promise<string> {
  if (!browser) return defaultValue;

  const cached = sessionStorage.getItem(`ab_${flagKey}`);
  if (cached) return cached;

  const res = await fetch(`/api/settings?category=ab_tests&key=${flagKey}`);
  if (!res.ok) return defaultValue;

  const { value } = await res.json();
  const variant = (value as string) ?? defaultValue;
  sessionStorage.setItem(`ab_${flagKey}`, variant);

  // Track exposure
  window.gtag?.('event', 'ab_exposure', { flag: flagKey, variant });

  return variant;
}
```

Usage in a marketing page:
```svelte
<script lang="ts">
  import { getVariant } from '$lib/flags';
  import { onMount } from 'svelte';

  let ctaText = $state('Get Started');
  onMount(async () => {
    const v = await getVariant('hero_cta_text');
    ctaText = v === 'test' ? 'Try Free Today' : 'Get Started';
  });
</script>
```

---

## Performance Budget

Every CRO enhancement must maintain Lighthouse Performance ≥ 90. Common CRO elements that hurt performance:
- Large hero images → use `@sveltejs/enhanced-img` with correct `sizes`
- Exit-intent script → mount in `onMount`, not inline
- Animation on scroll → use `svelte/transition` with `prefers-reduced-motion` guard

Measure with `pnpm build && pnpm preview` + Lighthouse before marking Phase 11 done.

---

## Risks and Open Questions

- **R-1:** Sticky CTA adds a fixed-position element that can interfere with cookie consent banners. Ensure z-index stacking is managed: cookie banner > sticky CTA > all other fixed elements.
- **R-2:** Social proof metrics must be real and verifiable. Invented numbers are a legal liability (FTC guidelines, ASA in UK). Use placeholder copy until real metrics are available.
- **Q-1:** Should the A/B flag variant assignment be deterministic (based on user ID or session ID) or random? Random (current design) is simpler but can produce sampling imbalances for low-traffic sites. For high-traffic sites, use a deterministic hashing approach (hash of `user.id + flag_key`).
