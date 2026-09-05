# Example 1: Glass-on-Beige Bootstrap (Happy Path)

A worked example of `design-system-worker-bee` bootstrapping a new design
system for a hypothetical product called **LedgerLine**, a premium
accounting app for creative freelancers. Aesthetic anchor: iOS Liquid
Glass with a warm cream + forest palette.

Demonstrates: `guides/01-interview-procedure.md`, `guides/02-authoring-design-brief.md`,
`guides/03-authoring-tokens.md`, `guides/04-authoring-utility-layer.md`,
`guides/05-authoring-components.md`, `guides/06-authoring-screens.md`,
`guides/07-authoring-html-examples.md`, `guides/08-companion-agent-handoff.md`.

---

## 1. Interview (per `guides/01-interview-procedure.md`)

```
Product:        LedgerLine — premium accounting for creative freelancers
                  who hate spreadsheets.

Anchors:        (1) Stripe Dashboard — "the restraint, the typographic
                    confidence, the trustworthy greys"
                (2) iOS Wallet — "cards that feel like physical objects"
                (3) Notion's sidebar — "quiet nav that doesn't compete"

Vetoes:         (1) QuickBooks — "cluttered, tax-software vibe"
                (2) Xero's lime green — "confident brand, wrong color for us"
                (3) Material-tonal-elevation dashboards — "too flat, too industrial"

Palette:        Primary #14161C (ink), Accent #2A6F5F (forest — brand),
                Background #F7F4ED (warm cream).

Surface:        Glass — floating white cards with a warm rim, shadows
                tinted toward forest.

Depth tiers:    4 (depth-0 flush, depth-1 cards, depth-2 nav/popover,
                depth-3 hero/modal). Same as the reference.

Typography:     Display face — Fraunces (serif, for numbers and headings,
                matches the freelancer-editorial vibe). Body — Inter.

Motion:         Fast (180ms) + default (240ms). No slow bucket.

Radius:         badge 4px · input 10px · button 12px · card 14px ·
                card-lg 18px · pill 9999px.

Icons:          Lucide outlined, 1.5px stroke, active state = filled.

Rendering:      Web + iOS PWA. Tenant theming OFF (single-brand product).
                Dark mode: v2 (not v1). RTL: not in scope.

Non-negotiables:
                - No green-on-cream text body (contrast).
                - Numbers are ALWAYS in display serif (it's an
                  accounting product — numbers are the content).
                - "Invoice sent" success toast is a glass-surface, not
                  an inline alert.

→ Starter kit:  glass-on-beige (customize palette and typography).
```

Confirmed with user: "yes, proceed."

## 2. Scaffold

```
library/knowledge/private/ledgerline-ux-ui/
├── 00-design-brief.md
├── 01-master-tokens.css
├── 02-glass-and-depth.css
├── 03-components/
│   ├── buttons-and-ctas.md
│   ├── badges-and-pills.md
│   ├── cards-and-surfaces.md
│   ├── inputs-and-search.md
│   ├── invoice-surfaces.md        (product-specific)
│   ├── number-display.md          (product-specific: serif numerals)
│   ├── nav-top-left.md
│   ├── progress-bars.md
│   └── toast-surfaces.md
├── 04-screens/
│   ├── dashboard.md
│   ├── invoice-detail.md
│   ├── expenses.md
│   ├── clients.md
│   └── settings.md
├── 05-html-examples/
│   ├── _shared.css
│   ├── index.html
│   ├── invoice-detail.html
│   ├── dashboard.html
│   └── toast-gallery.html
└── README.md
```

## 3. Master brief excerpt (per `guides/02-authoring-design-brief.md`)

`00-design-brief.md` §1, Core Principles:

> 1. **Cream stage, white paper.** The page background is always warm
>    cream (`--color-background`, #F7F4ED). Every interactive surface is
>    a white-glass card floating above it.
> 2. **Numbers speak serif.** Every monetary value, invoice total, and
>    dashboard metric renders in Fraunces. Body labels stay in Inter.
>    Justification: the product IS numbers, so typographic distinction
>    reinforces what the reader should focus on.
> 3. **Forest is a signal, not a surface.** Forest (`--color-accent`) is
>    reserved for confirmed-state success (paid invoice, approved
>    expense) and the single primary CTA per screen.
> 4. **Glass over cream, always.** No cream-on-cream card backgrounds.
>    No white-on-white. The glass surface is load-bearing.
> 5. **Motion has two speeds.** Fast (180ms) for state confirmations,
>    default (240ms) for layout changes. No slow bucket.
> 6. **Accessibility is structural.** 4.5:1 body contrast, 44x44pt touch
>    targets. `prefers-reduced-motion` respected.

## 4. Token layer excerpt (per `guides/03-authoring-tokens.md`)

`01-master-tokens.css`, the brand tokens customized from the starter:

```css
@theme {
  --color-primary: #14161C;      /* ink, single-tenant */
  --color-accent:  #2A6F5F;      /* forest */
  --color-accent-deep: #1F5045;  /* hover/pressed */
  --color-accent-ink:  #1F5045;  /* readable on cream — same as deep here */
}

@theme inline {
  --color-background:     #F7F4ED;   /* warm cream */
  --color-card:           #FFFFFF;
  --color-card-secondary: #FBF8F2;
  --color-border:         #E5DFD2;
  --color-border-light:   #ECE6D8;
  --color-top-edge-light: rgba(255,255,255,0.9);

  --color-text-strong:  #0B0D12;
  --color-text-primary: #1A1E26;
  --color-text-body:    #3A4049;
  --color-text-muted:   #696F7A;
  --color-text-quiet:   #9AA0A8;

  --font-display: "Fraunces", Georgia, serif;
  --font-sans:    "Inter", system-ui, -apple-system, sans-serif;

  /* ... spacing, radii, motion inherited from starter ... */
}
```

## 5. Utility layer excerpt

`02-glass-and-depth.css`, near-identical to the starter kit, with the
addition of a product-specific `.toast-surface` utility (per the
non-negotiable that toasts are glass, not inline alerts):

```css
.toast-surface {
  background: var(--color-card);
  background-color: color-mix(in srgb, var(--color-card) 92%, transparent);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-elevated);
  -webkit-backdrop-filter: saturate(140%) blur(18px);
          backdrop-filter: saturate(140%) blur(18px);
}
```

## 6. Component brief sample

`03-components/number-display.md`:

```markdown
# Number Display

> Anchors to `../00-design-brief.md` §4 (Typography) and §1 (principle 2).

## Purpose

Every monetary value or metric in LedgerLine renders through `<NumberDisplay>`.
This is what delivers "numbers speak serif."

## Variants

- `size="metric"` — dashboard tiles, 32px Fraunces 600.
- `size="invoice-total"` — 48px Fraunces 500, tight tracking.
- `size="inline"` — 16px Fraunces 500, for in-text figures.

## Tokens consumed

- `--font-display`
- `--color-text-strong`, `--color-text-primary`
- `--text-16`, `--text-28`, `--text-48`

## Example

```tsx
<NumberDisplay size="invoice-total" currency="USD">
  {invoice.total}
</NumberDisplay>
```

## Accessibility

- `aria-label` on every instance: "Total: seven thousand four hundred dollars".
- Screen readers see the `<span role="text">` with a human-readable label,
  not the formatted number.

## Common mistakes

- Using Inter for numbers ("looks cleaner") — forbidden. Numbers are
  Fraunces, full stop.
- Rendering currency symbols separately with different styling — the
  symbol is part of the number, same typeface.
```

## 7. Screen brief sample

`04-screens/invoice-detail.md`, ASCII skeleton:

```
┌─────────────────────────────────────┐ ← top nav (glass, pinned)
│ [Back] Invoice #INV-000247          │
├─────────────────────────────────────┤
│ HERO: Invoice total (serif 48px)    │
│        $7,400.00                    │
│        Paid · Sept 14               │
├─────────────────────────────────────┤
│ Line items (cards, each depth-1)    │
├─────────────────────────────────────┤
│ Notes card                          │
├─────────────────────────────────────┤
│ [Duplicate] [Send reminder]         │
│ [Download PDF]  (primary)           │
└─────────────────────────────────────┘
```

## 8. HTML example

`05-html-examples/invoice-detail.html` renders the above skeleton using
`_shared.css`. Double-click opens it; matches the component and screen
briefs pixel-for-pixel. No hex literals, no Tailwind arbitrary values.

## 9. Handoff (per `guides/08-companion-agent-handoff.md`)

`README.md` names `ux-ui-svelte-worker-bee` as the owner. Status table shows:
- Design brief: Authored 2026-04-24.
- Tokens: Authored 2026-04-24.
- Code alignment: Pending (LedgerLine is greenfield: all briefs mark
  "Replaces: N/A, greenfield").

`design-system-worker-bee` exits. `ux-ui-svelte-worker-bee` picks up.

## Outcome

- 1 master brief (~1100 lines).
- 9 component briefs.
- 5 screen briefs.
- 1 token CSS + 1 utility CSS.
- 4 HTML examples.
- 1 README with ownership + status + change control.

Total size: ~150 KB across 22 files. Within the sizing envelope from
`guides/02-authoring-design-brief.md`.
