# 12: Visually Stunning Design System

Source PRD: `research/source-prds/prd-phase-12-visually-stunning-design.md`

Svelte animation sources:
- [sv-animations: Animated Beam + 50+ components](https://sv-animations.vercel.app/magic/docs/components/animated-beam): Magic UI ported to Svelte; CLI install via `pnpm dlx shadcn-svelte@latest add https://sv-animations.vercel.app/r/<component>.json`
- [Aceternity UI Svelte](https://aceternity.sveltekit.io/components): Svelte ports of Aceternity components (3D Card, Lamp Effect, Tracing Beam, Spotlight, etc.)
- [animation-svelte](https://animation-svelte.vercel.app/): Svelte Luxe + Magic UI components with motion-sv

---

## Goal

Establish the CSS token architecture, fluid typography, Svelte transitions/animations, and dark mode. All visual decisions are single-source-of-truth CSS custom properties.

---

## CSS design tokens: app.css

```css
/* apps/web/src/app.css */
@import 'tailwindcss';
@import '@fontsource-variable/inter';

@layer base {
  :root {
    /* Brand */
    --color-brand-primary:    hsl(220 90% 56%);
    --color-brand-secondary:  hsl(280 80% 60%);
    --color-brand-accent:     hsl(45 95% 55%);

    /* Neutrals */
    --color-surface:          hsl(0 0% 100%);
    --color-surface-elevated: hsl(0 0% 97%);
    --color-border:           hsl(0 0% 88%);
    --color-text-primary:     hsl(220 15% 12%);
    --color-text-secondary:   hsl(220 10% 45%);
    --color-text-muted:       hsl(220 8% 65%);

    /* Feedback */
    --color-success:  hsl(145 65% 42%);
    --color-warning:  hsl(38 90% 50%);
    --color-error:    hsl(0 75% 55%);

    /* Geometry */
    --radius-sm:  0.25rem;
    --radius-md:  0.5rem;
    --radius-lg:  1rem;
    --radius-xl:  1.5rem;
    --radius-full: 9999px;

    /* Motion */
    --duration-fast:   150ms;
    --duration-base:   250ms;
    --duration-slow:   400ms;
    --ease-standard:   cubic-bezier(0.4, 0, 0.2, 1);
    --ease-decelerate: cubic-bezier(0, 0, 0.2, 1);
    --ease-accelerate: cubic-bezier(0.4, 0, 1, 1);

    /* Spacing (fluid) */
    --space-xs:  clamp(0.25rem, 0.5vw, 0.5rem);
    --space-sm:  clamp(0.5rem, 1vw, 1rem);
    --space-md:  clamp(1rem, 2vw, 2rem);
    --space-lg:  clamp(2rem, 4vw, 4rem);
    --space-xl:  clamp(4rem, 8vw, 8rem);

    /* Typography */
    --font-sans:  'Inter Variable', system-ui, sans-serif;
    --font-mono:  'JetBrains Mono', 'Fira Code', monospace;
  }

  .dark {
    --color-surface:          hsl(220 15% 10%);
    --color-surface-elevated: hsl(220 15% 14%);
    --color-border:           hsl(220 12% 22%);
    --color-text-primary:     hsl(0 0% 95%);
    --color-text-secondary:   hsl(220 10% 65%);
    --color-text-muted:       hsl(220 8% 45%);
  }

  @media (prefers-reduced-motion: reduce) {
    --duration-fast: 0ms;
    --duration-base: 0ms;
    --duration-slow: 0ms;
  }
}
```

---

## Dark mode: mode-watcher

```bash
pnpm add mode-watcher
```

```svelte
<!-- apps/web/src/routes/+layout.svelte -->
<script lang="ts">
  import { ModeWatcher } from 'mode-watcher';
</script>

<ModeWatcher defaultMode="system" />
<!-- ... -->
```

Dark mode toggle:

```svelte
<script lang="ts">
  import { toggleMode } from 'mode-watcher';
</script>

<button onclick={toggleMode} aria-label="Toggle dark mode">
  🌙 / ☀️
</button>
```

---

## shadcn-svelte components

```bash
pnpm dlx shadcn-svelte@latest init
# Select: Svelte 5 / SvelteKit, Tailwind CSS
pnpm dlx shadcn-svelte@latest add button card dialog form input label
```

---

## Svelte transitions: entrance animations

SvelteKit has built-in `svelte/transition` and `svelte/animate`. Use these instead of Framer Motion:

```svelte
<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
</script>

<!-- Fade-up entrance -->
<div
  in:fly={{ y: 20, duration: 400, delay: 100, easing: quintOut }}
  out:fade={{ duration: 200 }}
>
  <slot />
</div>
```

Stagger children:

```svelte
{#each items as item, i}
  <div in:fly={{ y: 20, duration: 350, delay: i * 60, easing: quintOut }}>
    {item.text}
  </div>
{/each}
```

Always respect `prefers-reduced-motion`:

```svelte
<script lang="ts">
  import { prefersReducedMotion } from 'mode-watcher';

  const duration = $derived(prefersReducedMotion ? 0 : 400);
</script>
```

---

## Svelte animation libraries

The following libraries provide pre-built animated components compatible with Svelte 5:

### 1. sv-animations (Magic UI port)

CLI installation:

```bash
pnpm dlx shadcn-svelte@latest add https://sv-animations.vercel.app/r/animated-beam.json
pnpm dlx shadcn-svelte@latest add https://sv-animations.vercel.app/r/border-beam.json
pnpm dlx shadcn-svelte@latest add https://sv-animations.vercel.app/r/marquee.json
```

Key components: Animated Beam, Border Beam, Marquee, Orbiting Circles, Meteors, Ripple, Shimmer Button, Number Ticker, Blur Fade, Aurora Text, Dot Pattern. All use `motion-sv`.

### 2. Aceternity UI Svelte (aceternity.sveltekit.io)

Components are copy-paste from the site (not a CLI package). Key components: 3D Card Effect, Background Beams, Spotlight, Lamp Effect, Tracing Beam, Moving Border, Floating Navbar. All use Framer Motion's Svelte alternative. Verify compatibility with Svelte 5 before using.

### 3. animation-svelte (animation-svelte.vercel.app)

Includes Svelte Luxe (dark-mode components), Svelte Magic UI port, and Indie UI. Install via: `pnpm add motion-sv` plus copy-paste component source.

> **Usage guideline:** Use at most 2 to 3 animated components per page. Animations must degrade to `opacity: 1` when `prefers-reduced-motion` is set. Performance budget: Lighthouse Performance ≥ 90 after adding any animated component.

---

## Fluid typography: clamp()

```css
/* In app.css @layer base: */
:root {
  --text-sm:    clamp(0.75rem, 1.5vw, 0.875rem);
  --text-base:  clamp(1rem, 2vw, 1.125rem);
  --text-lg:    clamp(1.125rem, 2.5vw, 1.25rem);
  --text-xl:    clamp(1.25rem, 3vw, 1.5rem);
  --text-2xl:   clamp(1.5rem, 4vw, 2rem);
  --text-3xl:   clamp(1.875rem, 5vw, 3rem);
  --text-4xl:   clamp(2.25rem, 6vw, 3.75rem);
  --text-hero:  clamp(2.5rem, 8vw, 5rem);
}
```

---

## OG image (social sharing)

For static OG images, place in `apps/web/static/og-default.png` (1200×630px).

For dynamic OG images per post, use a `+server.ts` route with `@vercel/og`:

```bash
pnpm add @vercel/og
```

```ts
// apps/web/src/routes/og/[slug]/+server.ts
import { ImageResponse } from '@vercel/og';

export const GET = ({ params }) =>
  new ImageResponse(
    `<div style="..."><h1>${params.slug}</h1></div>`,
    { width: 1200, height: 630 }
  );
```

---

## Phase acceptance criteria

| ID | Criterion |
|---|---|
| 12.1 | CSS tokens defined in `app.css`: all colors/spacing/motion as custom properties |
| 12.2 | `.dark` token overrides invert without component-level conditionals |
| 12.3 | Dark mode toggle works via `mode-watcher`; persists across sessions |
| 12.4 | `prefers-reduced-motion` zeroes out all transition durations |
| 12.5 | Fluid type scale applied: headings use `var(--text-*)` |
| 12.6 | At least one animated component from sv-animations, Aceternity, or animation-svelte |
| 12.7 | Lighthouse Performance ≥ 90 after animations added |
| 12.8 | OG default image (`/og-default.png`) present and is 1200×630px |
