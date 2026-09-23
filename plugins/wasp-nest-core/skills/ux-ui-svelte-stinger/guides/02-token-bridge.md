# 02: The token bridge: PRD-071 tokens → shadcn-svelte vocabulary

> The single most important guide in this Stinger. ADR-007 Decision C is the
> bridge: the existing PRD-071 token system becomes the source of truth that
> both legacy CSS AND new shadcn-svelte components read from. Get this right
> and the whole library inherits the OSPRY look; get it wrong and you have two
> parallel design systems fighting each other.

**Research:** `../research/shadcn-svelte-theming.md` (the fixed token
vocabulary), `../research/tailwind-v4-theme-variables.md` (the `@theme inline`
mechanism), `../research/shadcn-svelte-tailwind-v4-migration.md` (the
destination `app.css` shape).

## The three-layer model

Understand this before touching anything. shadcn-svelte v4 theming is three
layers stacked (per `../research/shadcn-svelte-tailwind-v4-migration.md`):

```
Layer 3:  @layer base { body { background: var(--color-background); } }
                       ↑ applies tokens to native CSS
Layer 2:  @theme inline { --color-background: var(--background); }
                       ↑ maps tokens into Tailwind's color namespace
                       ↑ (the `inline` keyword is ESSENTIAL)
Layer 1:  :root { --background: <value>; }
          .dark { --background: <value>; }
                       ↑ defines the theme token values
                       ↑ (OSPRY re-points these at PRD-071 tokens)
```

**OSPRY's bridge happens at Layer 1.** We do not touch Layer 2 or Layer 3.
shadcn-svelte generated those correctly. We replace the Layer 1 token *values*
with references to OSPRY's `tokens.css` variables. Every utility
(`bg-background`, `text-primary`, `border-border`) then resolves through
Layer 2 to an OSPRY token.

## Why `inline` is non-negotiable

From `../research/tailwind-v4-theme-variables.md`:

> When defining theme variables that reference other variables, use the `inline`
> option. Without `inline`, your utility classes might resolve to unexpected
> values because of how variables are resolved in CSS.

Concretely: without `inline`, `bg-background` would emit
`background-color: var(--background)`, and `--background` would be resolved at
the location where it is DEFINED (the `:root`/`.dark` block). With `inline`,
`bg-background` emits `background-color: var(--bg-canvas)` directly (the value
`--background` was bridged to), so it tracks the token correctly across theme
switches and white-label overrides.

**Rule:** the `@theme inline` block in `app.css` must stay exactly as
shadcn-svelte generated it. Never "simplify" it by removing `inline`.

## The token mapping (ratified)

> **Resolved (decision owner, 2026-06-30).** The mapping below is the
> 1:1 contract. The canonical, reviewable artifact for it is the **reverse
> brand guide** at
> [`references/design-system/ospry-shadcn-svelte-token-bridge-guide.html`](../../../../references/design-system/ospry-shadcn-svelte-token-bridge-guide.html):
> open it in a browser, toggle the theme, and walk the rendered elements.
> Every element on that page resolves through the table below. Propose a
> change by editing the mapping table at the top of that HTML file (CSS block
> §2); the elements update live. The mapping was derived from token semantics
> in `apps/portal/src/lib/styles/tokens.css`.

OSPRY's `tokens.css` defines a dark-first palette (per
`apps/portal/src/lib/styles/tokens.css`). The shadcn-svelte vocabulary maps
onto it as follows. Read `tokens.css` before editing; these names are the
documented PRD-071 contract.

### Color tokens

| shadcn-svelte token | OSPRY `tokens.css` token | Why |
|---|---|---|
| `--background` | `var(--bg-canvas)` | Page background |
| `--foreground` | `var(--text-primary)` | Default text |
| `--card` | `var(--bg-surface)` | Card surface |
| `--card-foreground` | `var(--text-primary)` | Text on card |
| `--popover` | `var(--bg-elevated)` | Popover surface |
| `--popover-foreground` | `var(--text-primary)` | Text in popover |
| `--primary` | `var(--interactive)` | **Blue, NOT green**: preserves green-scarce rule |
| `--primary-foreground` | `var(--text-inverse)` | Text on primary |
| `--secondary` | `var(--bg-subtle)` | Secondary surface |
| `--secondary-foreground` | `var(--text-primary)` | Text on secondary |
| `--muted` | `var(--bg-subtle)` | Muted surface |
| `--muted-foreground` | `var(--text-secondary)` | Muted text |
| `--accent` | `var(--accent-blue-subtle)` | Hover/highlight surface |
| `--accent-foreground` | `var(--accent-blue-on)` | Text on accent |
| `--destructive` | `var(--severity-critical)` | OSPRY's severity red (`#FF4D5E` dark / `#DC2839` light) |
| `--destructive-foreground` | `var(--text-inverse)` | Text on destructive |
| `--border` | `var(--border-default)` | Default border |
| `--input` | `var(--border-default)` | Input border |
| `--ring` | `var(--border-focus)` | Focus ring (interactive blue; WCAG 2.4.11) |

### Radius token

| shadcn-svelte token | OSPRY value | Why |
|---|---|---|
| `--radius` | `8px` (= PRD-071 `--radius-md`) | Matches the existing OSPRY medium radius; `sm/md/lg/xl` derive from it per the shadcn-svelte formula |

### The green-scarce rule (CRITICAL)

PRD-071 says green (`--brand-primary`) appears once per visible region, for
verified/identified + success only. The bridge above points `--primary` at
`--interactive` (blue), NOT at `--brand-primary` (green). This is intentional
and load-bearing:

- The default primary action button is blue (interactive).
- Green stays reserved for the verified state, success toasts, and the osprey
  mark's wing tips/talons.
- The white-label `--brand-accent` flows through `--interactive` (see
  `brand.css`), so an agency's brand color lands in primary buttons
  automatically, without using green, and without editing any component.

**Never bridge `--primary` to `--brand-primary`.** It would violate green-scarce
silently and globally.

## The destination `:root` block (the actual edit)

After the bridge, the `:root` block in `app.css` reads (dark-first; see
`04-dark-mode-inversion.md` for why OSPRY inverts the convention):

```css
:root {
  /* OSPRY dark-first: :root IS the dark theme */
  --background: var(--bg-canvas);
  --foreground: var(--text-primary);
  --card: var(--bg-surface);
  --card-foreground: var(--text-primary);
  --popover: var(--bg-elevated);
  --popover-foreground: var(--text-primary);
  --primary: var(--interactive);
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

The `@theme inline { ... }` and `@layer base { ... }` blocks stay exactly as
shadcn-svelte generated them.

## Import order (the cascade matters)

In `+layout.svelte`, the import order must be:

```svelte
<script>
  import "$lib/styles/tokens.css";   // defines --bg-canvas, --text-primary, etc.
  import "$lib/styles/brand.css";    // re-points --brand-accent for white-label
  import "$lib/styles/base.css";     // legacy hand-rolled
  import "$lib/styles/shell.css";    // legacy hand-rolled
  import "./app.css";                // Tailwind v4 + the token bridge above
</script>
```

`app.css` references `var(--bg-canvas)` etc., so `tokens.css` MUST load first.
The token bridge values resolve at paint time because of `inline`, so theme
switches and white-label SSR overrides propagate correctly.

## How to verify the bridge worked

1. **Drop a single copy-in Button** (`npx shadcn-svelte@latest add button`) on
   a test route.
2. **Inspect the rendered button.** Its background should be OSPRY blue
   (`--interactive`), not shadcn's default near-black. Its text should be
   `--text-inverse`.
3. **Toggle dark mode** (if a light theme is wired). The button should swap
   cleanly via the `:root`/`.dark` blocks.
4. **Resolve an agency brand** server-side. The button should pick up the
   agency's `--brand-accent` via the `--interactive` → `--brand-accent`
   propagation in `brand.css`.
5. **Check no existing surface regressed.** The legacy `base.css`/`shell.css`
   should render unchanged; if a surface looks wrong, check import order.

## Common bridge mistakes

- **Bridging `--primary` to `--brand-primary`**: violates green-scarce. Always
  `--interactive`.
- **Removing `inline` from `@theme inline`**: breaks theme-switch tracking.
  Never do this.
- **Importing `app.css` before `tokens.css`**: the bridge variables are
  undefined at first paint; you get a flash of unstyled content.
- **Defining a color literal in the bridge** (e.g. `--background: #0A0B0D`):
  defeats the point. Always `var(--token)`, so the source of truth stays
  `tokens.css`. The one exception is `--destructive`, which OSPRY has no token
  for.
- **Forgetting `--ring`**: focus rings are a core accessibility surface
  (WCAG 2.4.11). Bridge it to `--border-focus`.
