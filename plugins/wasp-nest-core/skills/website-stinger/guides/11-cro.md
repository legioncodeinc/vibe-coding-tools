# 11: Landing Page Conversion Optimization

Source PRD: `research/source-prds/prd-phase-11-landing-page-conversion-optimization.md`

The CRO science in this guide is framework-agnostic. Principles derive from A/B testing meta-analyses and behavioral psychology research. Svelte component patterns replace the Next.js / React patterns from the previous iteration.

---

## Hero section structure (CRO-backed)

The hero is the single most impactful conversion element. Research-backed structure:

```svelte
<!-- apps/web/src/lib/components/Hero.svelte -->
<script lang="ts">
  let { headline, subheadline, ctaText = 'Get Started', ctaHref = '#contact', socialProofCount } = $props<{
    headline: string;
    subheadline: string;
    ctaText?: string;
    ctaHref?: string;
    socialProofCount?: number;
  }>();
</script>

<section class="hero" aria-label="Hero">
  <!-- 1. Headline: outcome-focused, ≤10 words -->
  <h1 class="hero-headline">{headline}</h1>

  <!-- 2. Subheadline: clarifies who it's for and how -->
  <p class="hero-subheadline">{subheadline}</p>

  <!-- 3. Primary CTA: action verb + benefit -->
  <a href={ctaHref} class="btn-primary hero-cta">{ctaText}</a>

  <!-- 4. Social proof: reduces anxiety immediately below CTA -->
  {#if socialProofCount}
    <p class="hero-proof">Trusted by {socialProofCount.toLocaleString()}+ teams</p>
  {/if}

  <!-- 5. Hero image / product demo: positioned right on desktop, below on mobile -->
  <div class="hero-visual">
    <slot name="visual" />
  </div>
</section>
```

**Research source:** CRO meta-analysis (HubSpot, Nielsen Norman, Unbounce 2025 reports): above-the-fold CTA + social proof below CTA lifts conversion 23% vs CTA without proof.

---

## Mobile sticky CTA

A sticky bottom bar below 768px captures scroll-time intent without blocking desktop reading:

```svelte
<!-- apps/web/src/lib/components/MobileStickyCTA.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';

  let { text, href } = $props<{ text: string; href: string }>();
  let visible = $state(false);

  onMount(() => {
    const handler = () => {
      // Show after scrolling 40% of page height
      visible = window.scrollY > document.body.scrollHeight * 0.4;
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  });
</script>

{#if visible}
  <div class="mobile-sticky-cta" role="complementary" aria-label="Mobile CTA">
    <a {href} class="btn-primary">{text}</a>
  </div>
{/if}

<style>
  .mobile-sticky-cta {
    display: none;
  }
  @media (max-width: 768px) {
    .mobile-sticky-cta {
      display: flex;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1rem;
      background: white;
      box-shadow: 0 -4px 16px rgb(0 0 0 / 10%);
      z-index: 100;
    }
  }
</style>
```

---

## Social proof section

Quantitative social proof outperforms qualitative (testimonials) by 3:1 for B2B. Include:

1. **Metrics:** `X customers`, `Y stars`, `Z reviews`: source-backed numbers only, never invented.
2. **Logos:** recognizable brand logos (if permission granted).
3. **Testimonials:** specific outcome quote + full name, title, company + headshot.

```svelte
<!-- Social proof pattern — NEVER invent metrics or quotes -->
<section class="social-proof" aria-label="Customer evidence">
  <p class="proof-metrics">{metricsText}</p>
  <!-- Logos grid -->
  <!-- Testimonials: minimum 3 -->
</section>
```

Leave placeholders the user fills in. Never generate fake testimonials.

---

## A/B testing scaffold

Feature flags from `app_settings` drive A/B variants without a deploy:

```ts
// apps/web/src/lib/flags.ts
import { browser } from '$app/environment';

export async function getVariant(key: string, defaultValue = 'control'): Promise<string> {
  // During SSR, read from page server data passed via load function
  // During CSR, read from sessionStorage (sticky variant)
  if (!browser) return defaultValue;

  const stored = sessionStorage.getItem(`ab_${key}`);
  if (stored) return stored;

  // Fetch from app_settings
  const res = await fetch(`/api/settings?category=ab_tests&key=${key}`);
  const { value } = await res.json();
  const variant = value ?? defaultValue;

  sessionStorage.setItem(`ab_${key}`, variant);
  return variant;
}
```

```svelte
<!-- Usage in a page -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { getVariant } from '$lib/flags';

  let ctaText = $state('Get Started');

  onMount(async () => {
    const variant = await getVariant('hero_cta_text');
    ctaText = variant === 'test' ? 'Try Free Today' : 'Get Started';
  });
</script>
```

---

## Page speed CRO impact

Every 1s LCP improvement correlates with +8% conversion rate (source: Cloudflare Research 2025).

Run Lighthouse on every homepage change:

```bash
cd apps/web
pnpm build && pnpm preview
npx lighthouse http://localhost:4173 --output=json --output-path=./lighthouse-report.json
```

Performance ≥ 90 before Phase 11 is complete.

---

## Form CRO: superforms patterns

- Two-step forms: +35% completion vs single-step for ≥5 fields (Formstack 2025).
- Progress indicator (Step 1 of 2) reduces abandonment.
- Error messages below fields (not toast) reduce cognitive load.
- Submit button text: specific action verb beats generic "Submit" by 17%.

---

## Phase acceptance criteria

| ID | Criterion |
|---|---|
| 11.1 | Hero: headline + subheadline + CTA + social proof above fold on desktop |
| 11.2 | Mobile sticky CTA appears after 40% scroll at ≤768px viewport |
| 11.3 | CTA button copy is action-verb specific (not "Submit") |
| 11.4 | Social proof section present: no invented metrics; placeholders if real numbers unavailable |
| 11.5 | A/B flag infrastructure wired (`ab_tests` category in `app_settings`) |
| 11.6 | Lighthouse Performance ≥ 90 on production build |
| 11.7 | `apps/web/src/lib/flags.ts` present and importable |
