# {{product}} UX/UI: Core Design Brief

> **{{product}} · Source of Truth for every UI decision**
> **Status:** Authoritative: supersedes {{prior_doc_or_"N/A"}} as of {{YYYY-MM-DD}}
> **Owner:** `ux-ui-svelte-worker-bee` agent + skill
> **Companion assets:** [`01-master-tokens.css`](01-master-tokens.css) · [`02-{{utility_layer_name}}.css`](02-{{utility_layer_name}}.css) · [`03-components/`](03-components/) · [`04-screens/`](04-screens/) · [`05-html-examples/`](05-html-examples/)

This brief describes the **target state** of the {{product}} UI. When current
code diverges from this document, this document wins and the code must be
changed to match, not the other way around.

---

## 0. Reading Order

1. Read **§1 Principles** so the mental model is locked.
2. Skim **§2 Tokens**, **§3 Surfaces & Depth** to know the vocabulary.
3. Cross-reference each component / screen section as needed.

---

## 1. Core Principles (non-negotiable)

1. **{{principle_1_title}}.** {{one-line rule. one-line justification.}}
2. **{{principle_2_title}}.** ...
3. **{{principle_3_title}}.** ...
4. **{{principle_4_title}}.** ...
5. **{{principle_5_title}}.** ...
6. **{{principle_6_title}}.** ...
7. **{{principle_7_title}}.** ...
8. **Accessibility is structural, not cosmetic.** WCAG 2.2 AA is the floor.
   All interactive elements have a 44x44pt touch target.
   `prefers-reduced-motion` disables decorative motion.

---

## 2. Token System

Full spec in [`01-master-tokens.css`](01-master-tokens.css). This section
explains the semantics.

### 2.1 Surfaces (the stage)

| Token | Value | Use |
|---|---|---|
| `--color-background` | `{{hex}}` | Full-page background. Never a card. |
| `--color-card` | `{{hex}}` | Every floating surface. |
| `--color-card-secondary` | `{{hex}}` | Nested surface. |
| `--color-border` | `{{hex}}` | 1px dividers on card. |
| `--color-border-light` | `{{hex}}` | Inner hairlines. |

### 2.2 Brand (the accents)

| Token | Value | Use |
|---|---|---|
| `--color-primary` | `{{hex}}` (tenant-primary) | Headings, primary text. |
| `--color-accent` | `{{hex}}` (tenant-accent) | CTA fill, progress, active states. |
| `--color-accent-ink` | `{{hex}}` | Dark-accent text on light backgrounds. |

### 2.3 Text hierarchy

| Token | Value | Use |
|---|---|---|
| `--color-text-strong` | `{{hex}}` | Card titles, major numbers. |
| `--color-text-primary` | `{{hex}}` | Body copy, row labels. |
| `--color-text-body` | `{{hex}}` | Secondary paragraph copy. |
| `--color-text-muted` | `{{hex}}` | Metadata, hint text (4.5:1 floor). |
| `--color-text-quiet` | `{{hex}}` | Timestamps, ghost placeholders. |

### 2.4 Spacing ladder

One nine-stop ladder. `--space-0..8`.

### 2.5 Radii

`--radius-badge`, `--radius-input`, `--radius-button`, `--radius-card`,
`--radius-card-lg`, `--radius-tile`, `--radius-pill`.

### 2.6 Motion

Three curves (`--ease-out-subtle`, `--ease-in-out-ui`, `--ease-spring-soft`),
four durations (`--dur-instant`, `--dur-fast`, `--dur-default`, `--dur-slow`).

### 2.7 Typography scale

Nine sizes: `--text-10` through `--text-48` with companion
`--text-{n}--line-height` tokens.

---

## 3. Surfaces & Depth

{{short description of the surface metaphor: glass, paper, flat, etc.}}

### 3.1 The recipe

{{the CSS composition for the default surface}}

### 3.2 Depth tiers

| Tier | Use |
|---|---|
| `depth-0` | Flush / no shadow. |
| `depth-1` | Cards, list items. |
| `depth-2` | Nav shells, popovers. |
| `depth-3` | Hero card, modals. |

---

## 4. Typography

- Display face: {{name}}.
- Body face: {{name}}.
- Type scale: nine sizes (see §2.7).
- Line length: 55-75ch for body copy.
- Paragraph spacing: `--space-paragraph` (18px default).

---

## 5. Color Usage Rules

- Body copy on `--color-background` uses `--color-text-primary` or darker.
- `--color-text-muted` is the floor for secondary copy.
- {{accent}}-on-{{background}} is banned for body text (contrast).
- Use `--color-accent-ink` for any {{accent-colored}} text.

---

## 6. Components

Summary of each component group. Full briefs in `03-components/`.

- [`buttons-and-ctas.md`](03-components/buttons-and-ctas.md): primary, secondary, outline, ghost.
- [`badges-and-pills.md`](03-components/badges-and-pills.md): status, tier, count.
- [`cards-and-surfaces.md`](03-components/cards-and-surfaces.md): card, nested card, hero.
- [`inputs-and-search.md`](03-components/inputs-and-search.md): text, textarea, select.
- [`nav-<location>.md`](03-components/): one per nav zone.
- [`progress-bars.md`](03-components/progress-bars.md): standard, hero.
- {{...additional component groups...}}

---

## 7. Screens

Summary per screen. Full briefs in `04-screens/`.

- [`dashboard.md`](04-screens/dashboard.md)
- [`profile.md`](04-screens/profile.md)
- {{...}}

---

## 8. Motion

- Entry: 150ms fade + 4px rise, `--ease-out-subtle`.
- Press: `.press-scale` (scale 0.97, opacity 0.92, 120ms).
- State change: 200ms color tween, `--ease-in-out-ui`.
- Reorder (FLIP): 240ms, `--ease-spring-soft`.
- Under `prefers-reduced-motion: reduce`: all transitions ≤ 80ms,
  transforms suppressed.

---

## 9. Iconography

- Set: {{heroicons | lucide | custom}}.
- Line weight: {{1.5px default}}.
- Active/inactive: {{filled vs outlined convention}}.
- Size: 20px default, 24px for nav, 16px inline.

---

## 10. Accessibility

- WCAG 2.2 AA.
- 44x44pt touch target floor.
- Focus-visible: 2px `--color-accent` outline, 2px offset. Never remove.
- `prefers-reduced-motion`, `prefers-color-scheme`, `prefers-contrast`.

---

## 11+ Product-specific sections

{{any feature that needs its own contract: AI chat, icon customizer,
admin mode, etc.}}

---

*This document is owned by `ux-ui-svelte-worker-bee`. Changes follow the commit
message convention `ux-ui-svelte-worker-bee: <section>: <change>`.*
