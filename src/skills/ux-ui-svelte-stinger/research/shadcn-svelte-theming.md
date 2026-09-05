# shadcn-svelte: Theming (raw dump)

> **Source:** https://www.shadcn-svelte.com/docs/theming
> **Fetched:** 2026-06-29
> **Method:** Firecrawl-scrape-equivalent web reader
> **Why kept:** Documents the CSS-variable token convention
> (`--background`/`--foreground`/`--primary`/`--card`/etc.) that every copy-in
> component reads. This is the surface OSPRY's token bridge re-points at
> PRD-071 tokens.

---

# Theming

Use CSS Variables to customize the look and feel of your application.

shadcn-svelte uses a fixed set of CSS variables for theming. Components are
written against these variables, not against hardcoded colors. Change the
variables once, every component updates.

## The token convention

shadcn-svelte expects these CSS variables in `:root` (and mirrored in `.dark`):

| Token | Meaning |
|---|---|
| `--background` | Page background |
| `--foreground` | Default text color |
| `--card` | Card / surface background |
| `--card-foreground` | Text on a card |
| `--popover` | Popover / dropdown background |
| `--popover-foreground` | Text in a popover |
| `--primary` | Primary brand action color (buttons, links) |
| `--primary-foreground` | Text on primary |
| `--secondary` | Secondary surface |
| `--secondary-foreground` | Text on secondary |
| `--muted` | Muted / disabled surface |
| `--muted-foreground` | Muted text |
| `--accent` | Accent surface (hover states, highlights) |
| `--accent-foreground` | Text on accent |
| `--destructive` | Destructive action color (delete buttons) |
| `--destructive-foreground` | Text on destructive |
| `--border` | Default border color |
| `--input` | Input border color |
| `--ring` | Focus ring color |
| `--radius` | The base border radius (sm/md/lg/xl scale off it) |

Each comes as a pair: the color and its `-foreground` (the readable text color on
that surface).

## Color format  **[OSPRY: the 2026 default is oklch]**

shadcn-svelte historically used `hsl()` channel triples (`hsl(var(--background))`).
As of Tailwind v4 + Svelte 5, the convention is **full color values in oklch**
(or any CSS color), stored directly:

```css
:root {
  --primary: oklch(0.21 0.006 285.885);
  --primary-foreground: oklch(0.985 0 0);
}
```

Tailwind v4's `@theme inline` then maps `--primary` to `--color-primary`, making
`bg-primary`, `text-primary`, `border-primary`, `ring-primary` utilities
available without the `hsl()` wrapper.

## Why a fixed token set (not arbitrary names)

The whole point is that **components are written against this fixed vocabulary**.
A Button uses `bg-primary text-primary-foreground`. A Card uses `bg-card
text-card-foreground border`. To re-skin the entire component library, you change
the variables in one place (`:root` / `.dark`); you do not edit each component.

**This is why the OSPRY bridge re-points these tokens at PRD-071 tokens rather
than editing each component.** One edit to `:root`, every component inherits the
OSPRY dark-first, green-scarce aesthetic.

## Overriding the default theme  **[OSPRY: THE BRIDGE PATTERN]**

The simplest re-theme is to redefine the variables in `:root`:

```css
/* OSPRY re-point (from ADR-007 Phase 0) */
:root {
  --background: var(--bg-canvas);
  --foreground: var(--text-primary);
  --card: var(--bg-surface);
  --card-foreground: var(--text-primary);
  --popover: var(--bg-elevated);
  --popover-foreground: var(--text-primary);
  --primary: var(--interactive);             /* OSPRY blue */
  --primary-foreground: var(--text-inverse);
  --secondary: var(--bg-subtle);
  --secondary-foreground: var(--text-primary);
  --muted: var(--bg-subtle);
  --muted-foreground: var(--text-secondary);
  --accent: var(--accent-blue-subtle);
  --accent-foreground: var(--accent-blue-on);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: var(--text-inverse);
  --border: var(--border-default);
  --input: var(--border-default);
  --ring: var(--border-focus);
  --radius: 0.5rem;
}
```

Now `bg-primary` resolves to OSPRY's `--interactive`, `text-muted-foreground`
resolves to OSPRY's `--text-secondary`, and so on. Every shadcn-svelte component
inherits the OSPRY look without touching a single `.svelte` file.

## The radius scale

`--radius` is the base. shadcn-svelte derives four radii from it:

```css
--radius-sm: calc(var(--radius) - 4px);
--radius-md: calc(var(--radius) - 2px);
--radius-lg: var(--radius);
--radius-xl: calc(var(--radius) + 4px);
```

Components reference `rounded-md`, `rounded-lg`, etc., which Tailwind v4 maps
from the `--radius-*` namespace.

## The brand accent question  **[OSPRY-CRITICAL]**

The PRD-071 "green-scarce" rule says green appears once per visible region
(verified/identified + success only). The OSPRY `--brand-primary` is green.
The OSPRY `--interactive` (links, focus, active nav) is blue.

In the bridge above, `--primary` points at `--interactive` (blue), NOT at
`--brand-primary` (green). This preserves the green-scarce discipline: the
default primary action button is blue, and green stays reserved for the verified
state.

The white-label `--brand-accent` contract flows through `--interactive` (see
`brand.css`), so an agency's brand color lands in shadcn-svelte buttons
automatically: no component edit, no new CSS surface.
