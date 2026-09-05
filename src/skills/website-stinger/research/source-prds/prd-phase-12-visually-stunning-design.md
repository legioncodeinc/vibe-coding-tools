# Phase 12: Visually Stunning Business Website Design

> **Site Template Guide**: PRD Phase 12 of 12

---

## Phase Overview

### Goals

Establish the CSS token architecture, fluid typography, Svelte-native motion (replacing Framer Motion), dark mode via `mode-watcher`, and visual enhancement via the three Svelte animation libraries. All visual decisions are CSS custom properties: single source of truth.

Svelte animation library references:
- [sv-animations (Magic UI ported to Svelte)](https://sv-animations.vercel.app/magic/docs/components/animated-beam): 50+ components, CLI install via shadcn-svelte
- [Aceternity UI Svelte](https://aceternity.sveltekit.io/components): Svelte ports of Aceternity components (3D Card, Lamp, Tracing Beam, Spotlight)
- [animation-svelte](https://animation-svelte.vercel.app/): Svelte Luxe + Magic UI + Indie UI components using `motion-sv`

### Scope

**In scope:**
- `apps/web/src/app.css`: full CSS token architecture with `.dark` inversion
- `mode-watcher` for dark mode (replaces `next-themes`)
- `shadcn-svelte` component library initialization
- `svelte/transition` + `svelte/animate` for entrance and stagger animations
- One or more components from Svelte animation libraries
- Fluid typography via `clamp()`
- OG image: static `/og-default.png` at 1200×630px

**Out of scope:**
- Brand identity decisions (colors, typography, user-provided)
- Custom illustration or photography
- 3D rendering or WebGL effects

### Dependencies

- Phase 1: `apps/web/` exists
- Phase 2: Tailwind v4 plugin configured in `vite.config.ts`
- Phase 11: CRO patterns reference token-named CSS properties

---

## User Stories

### Story 1: Visitor: Consistent Visual Language

> As a **Visitor**, I want the website to use a consistent color palette, spacing scale, and typography across all pages so that it feels professionally designed.

**Acceptance criteria:**
- All colors referenced via `var(--color-*)` custom properties
- All spacing referenced via `var(--space-*)` or Tailwind utilities mapped to tokens
- All font sizes use fluid `clamp()` expressions from a defined type scale
- No hardcoded pixel or hex values outside `app.css`

### Story 2: Visitor: Dark Mode

> As a **Visitor**, I want the site to respect my system dark mode preference automatically, with the ability to toggle manually, so that I can read comfortably in my preferred environment.

**Acceptance criteria:**
- `mode-watcher` installed and `<ModeWatcher />` mounted in `+layout.svelte`
- `.dark` class applied to `<html>` when dark mode active
- All color tokens inverted in `.dark` block in `app.css`
- Dark mode toggle available (button/icon in nav)
- Preference persists across sessions (localStorage via `mode-watcher`)
- No component-level dark mode conditionals (only token-level)

### Story 3: Visitor: Accessible Motion

> As a **Visitor** with vestibular disorders, I want all animations to be disabled when I have `prefers-reduced-motion: reduce` set so that I can browse without discomfort.

**Acceptance criteria:**
- `@media (prefers-reduced-motion: reduce)` in `app.css` sets all duration variables to `0ms`
- `svelte/transition` animations respect the zeroed-out duration
- No animation plays when `prefers-reduced-motion: reduce` is set

### Story 4: Developer: At Least One Svelte Animation Library Component

> As a **Developer**, I want to use a pre-built animated component from one of the three Svelte animation libraries (sv-animations, Aceternity Svelte, animation-svelte) so that the site has a memorable, high-quality visual element without building it from scratch.

**Acceptance criteria:**
- At least one component integrated from: sv-animations, Aceternity UI Svelte, or animation-svelte
- Component renders correctly in both light and dark mode
- `prefers-reduced-motion` causes the animation to not play (transition duration = 0)
- Lighthouse Performance ≥ 90 after integration

---

## CSS Token Architecture

See `website-stinger/templates/design-tokens.css` for the full token block. Key structure:

```css
:root {
  /* Brand */
  --color-brand-primary:    hsl(220 90% 56%);
  --color-brand-secondary:  hsl(280 80% 60%);

  /* Neutrals — light mode defaults */
  --color-surface:          hsl(0 0% 100%);
  --color-text-primary:     hsl(220 15% 12%);

  /* Geometry */
  --radius-md: 0.5rem;

  /* Motion */
  --duration-base:  250ms;
  --ease-standard:  cubic-bezier(0.4, 0, 0.2, 1);
}

.dark {
  --color-surface:       hsl(220 15% 10%);
  --color-text-primary:  hsl(0 0% 95%);
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0ms;
    --duration-base: 0ms;
    --duration-slow: 0ms;
  }
}
```

---

## Svelte Animation Libraries

### sv-animations (CLI install)

```bash
pnpm dlx shadcn-svelte@latest add https://sv-animations.vercel.app/r/animated-beam.json
pnpm dlx shadcn-svelte@latest add https://sv-animations.vercel.app/r/border-beam.json
pnpm dlx shadcn-svelte@latest add https://sv-animations.vercel.app/r/marquee.json
pnpm add motion-sv
```

Best components for business sites: **Animated Beam** (integrations section), **Border Beam** (highlight card), **Marquee** (logo scrolling), **Number Ticker** (stats), **Blur Fade** (content entrance).

### Aceternity UI Svelte (copy-paste)

Access component source from [aceternity.sveltekit.io/components](https://aceternity.sveltekit.io/components). Key components:
- **Background Beams**: hero background
- **Spotlight**: hero highlight effect
- **Lamp Effect**: section header
- **Moving Border**: button highlight
- **Tracing Beam**: long-form content scroll indicator

Verify Svelte 5 compatibility before using. Some components may use Svelte 4 reactive syntax.

### animation-svelte (motion-sv)

Access from [animation-svelte.vercel.app](https://animation-svelte.vercel.app/). Key collections:
- **Svelte Luxe**: dark-mode card backgrounds, animated borders, shine effects
- **Svelte Magic UI**: Orbiting Circles, Animated Beam port, Ripple, Meteors
- **Indie UI**: professional UI components with subtle motion

---

## Dark Mode: mode-watcher

```svelte
<!-- In +layout.svelte -->
<script lang="ts">
  import { ModeWatcher } from 'mode-watcher';
</script>
<ModeWatcher defaultMode="system" />
```

Toggle:
```svelte
<script lang="ts">
  import { toggleMode, mode } from 'mode-watcher';
</script>

<button onclick={toggleMode} aria-label="Toggle dark mode">
  {#if $mode === 'dark'}☀️{:else}🌙{/if}
</button>
```

---

## Fluid Typography Scale

```css
:root {
  --text-xs:   clamp(0.65rem, 1.2vw, 0.75rem);
  --text-sm:   clamp(0.75rem, 1.5vw, 0.875rem);
  --text-base: clamp(1rem, 2vw, 1.125rem);
  --text-lg:   clamp(1.125rem, 2.5vw, 1.25rem);
  --text-xl:   clamp(1.25rem, 3vw, 1.5rem);
  --text-2xl:  clamp(1.5rem, 4vw, 2rem);
  --text-3xl:  clamp(1.875rem, 5vw, 3rem);
  --text-4xl:  clamp(2.25rem, 6vw, 3.75rem);
  --text-hero: clamp(2.5rem, 8vw, 5rem);
}
```

---

## OG Default Image

- File: `apps/web/static/og-default.png`
- Dimensions: exactly 1200×630px
- Brand-colored background with site name and tagline
- Referenced in `generateSEO()` as `DEFAULT_OG_IMAGE = ${PUBLIC_SITE_URL}/og-default.png`

---

## Risks and Open Questions

- **R-1:** `motion-sv` (used by sv-animations and animation-svelte) is in active development. Pin to a specific version. Check [GitHub](https://github.com/JonasKruckenberg/motion-sv) for breaking changes before upgrading.
- **R-2:** Aceternity UI Svelte components may use Svelte 4 reactive syntax (`$:`, `export let`, event modifiers). Verify each component compiles without warnings under Svelte 5 before integrating. The `svelte/compiler` will flag Svelte 4 patterns.
- **R-3:** Multiple animation libraries on the same page increase the JavaScript bundle. Use Lighthouse to verify Performance ≥ 90 after integrating any component. Prefer CSS animations over JS animations where possible.
- **Q-1:** Should dark mode default to `system` (respects OS preference) or `light` (more predictable)? `system` is recommended for 2026. Sites that need consistent brand appearance regardless of OS may prefer `light`.
