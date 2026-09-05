# Theming token reference

The generic shadcn-svelte CSS variable vocabulary, grounded in [distilled-shadcn-svelte.md](research/distilled-shadcn-svelte.md) section 7, citing [raw/05-theming-tokens.md](research/raw/05-theming-tokens.md) and [raw/06-tailwind-v4-migration.md](research/raw/06-tailwind-v4-migration.md).

This is the library's own generic token set. It is NOT the OSPRY-specific token bridge, PRD-071 system, or `--brand-*` white-label contract; those belong to `ux-ui-svelte-stinger`. See the [Boundary section in SKILL.md](../SKILL.md).

## Convention

Pairs of `<name>` / `<name>-foreground`. The plain name is the background color; `-foreground` is the text color painted on top of it. The word "background" itself is omitted from the base pair name (`--primary`, not `--primary-background`) [raw/05-theming-tokens.md].

```css
--primary: oklch(0.205 0 0);
--primary-foreground: oklch(0.985 0 0);
```

```svelte
<div class="bg-primary text-primary-foreground">Hello</div>
```

## Full default token list

| Token | Purpose |
| --- | --- |
| `--radius` | Base corner radius; set once in `:root`, not duplicated in `.dark` |
| `--background` / `--foreground` | Page-level background/text |
| `--card` / `--card-foreground` | Card surface |
| `--popover` / `--popover-foreground` | Popover/menu surface |
| `--primary` / `--primary-foreground` | Primary action color |
| `--secondary` / `--secondary-foreground` | Secondary action color |
| `--muted` / `--muted-foreground` | De-emphasized text/surfaces |
| `--accent` / `--accent-foreground` | Hover/active accent surfaces |
| `--destructive` | Destructive action color (no separate `-foreground` in the default set; check current upstream if you need one) |
| `--border` | Border color |
| `--input` | Input border/background |
| `--ring` | Focus ring color |
| `--chart-1` through `--chart-5` | Chart palette |
| `--sidebar` / `--sidebar-foreground` | Sidebar surface |
| `--sidebar-primary` / `--sidebar-primary-foreground` | Sidebar primary action |
| `--sidebar-accent` / `--sidebar-accent-foreground` | Sidebar accent |
| `--sidebar-border` | Sidebar border |
| `--sidebar-ring` | Sidebar focus ring |

[raw/05-theming-tokens.md]

## Default value format

OKLCH is the default value format shipped by current shadcn-svelte (`oklch(1 0 0)` style). Tailwind-v3-era projects instead wrapped the same semantic values in `hsl(...)` [raw/06-tailwind-v4-migration.md]. Either format works as a valid CSS color value; OKLCH is preferred for perceptually-even lightness across hues.

## Base color presets

Selectable at `init` time via `--base-color`, cannot be changed after init without regenerating components: `neutral`, `stone`, `zinc`, `gray`, `slate` (full palettes documented), plus `mauve`, `olive`, `mist`, `taupe` (valid CLI choices; full palette values are a gap in this archive) [raw/05-theming-tokens.md], [raw/01-cli-command-reference.md].

## The Tailwind v4 bridge: `@theme inline`

Tokens defined in `:root`/`.dark` are plain CSS custom properties. To make them usable as Tailwind utility classes (`bg-primary`, `text-muted-foreground`, etc.), they must be re-declared inside `@theme inline`:

```css
@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}
```

The `dark` variant hook: `@custom-variant dark (&:is(.dark *));` makes every `dark:` utility respond to a `.dark` class anywhere in the ancestor chain [raw/06-tailwind-v4-migration.md].

## Adding a new token

1. Add the light and dark values to `:root` and `.dark`.
2. Re-declare it in `@theme inline` under a `--color-*` name so Tailwind exposes the utility class.

```css
:root {
  --warning: oklch(0.84 0.16 84);
  --warning-foreground: oklch(0.28 0.07 46);
}

.dark {
  --warning: oklch(0.41 0.11 46);
  --warning-foreground: oklch(0.99 0.02 95);
}

@theme inline {
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
}
```

```svelte
<div class="bg-warning text-warning-foreground">Careful</div>
```

[raw/05-theming-tokens.md]

## Registry-driven token installation

A `registry-item.json` can ship its own `cssVars.light` / `cssVars.dark` / `cssVars.theme` blocks; the CLI writes them into the consuming project's CSS file automatically on `add`. `cssVars.theme` can also override non-color theme values like `spacing`, `breakpoint-*`, or `font-*` [raw/09-registry-item-json-schema.md (via distillation section 6-7)].

## Data-slot convention (Tailwind v4 generation)

Every primitive that renders a DOM element carries `data-slot="<name>"` (e.g. `data-slot="button"`), for targeting a specific sub-element in CSS or JS without depending on class names [raw/06-tailwind-v4-migration.md].
