# @theme directive reference

Copy-paste-ready patterns for Tailwind v4's CSS-first token system. Grounded in the distillation §2 and §3; every claim traces back to [raw/01-theme-directive.md] and [raw/07-functions-and-directives.md].

## Namespace-to-utility map

Define a variable in one of these namespaces inside `@theme` and Tailwind generates the matching utility classes or variants automatically. [raw/01-theme-directive.md]

| Namespace | Generates | Example variable | Example utility |
| --- | --- | --- | --- |
| `--color-*` | Color utilities (bg, text, border, fill, ring, etc) | `--color-mint-500: oklch(0.72 0.11 178);` | `bg-mint-500`, `text-mint-500` |
| `--font-*` | Font family utilities | `--font-display: "Satoshi", sans-serif;` | `font-display` |
| `--text-*` | Font size utilities | `--text-huge: 4rem;` | `text-huge` |
| `--font-weight-*` | Font weight utilities | `--font-weight-extrabold: 850;` | `font-extrabold` |
| `--tracking-*` | Letter spacing utilities | `--tracking-wider: 0.08em;` | `tracking-wider` |
| `--leading-*` | Line height utilities | `--leading-tight: 1.1;` | `leading-tight` |
| `--breakpoint-*` | Responsive viewport variants | `--breakpoint-3xl: 120rem;` | `3xl:grid-cols-6` |
| `--container-*` | Container query variants + size utilities | `--container-8xl: 96rem;` | `@8xl:flex-row`, `max-w-8xl` |
| `--spacing-*` | Spacing/sizing utilities (padding, margin, gap, size, etc) | `--spacing: 4px;` (base multiplier) | `px-4`, `gap-6` |
| `--radius-*` | Border radius utilities | `--radius-xl: 1rem;` | `rounded-xl` |
| `--shadow-*` | Box shadow utilities | `--shadow-brand: 0 4px 14px oklch(0.5 0.2 250 / 0.4);` | `shadow-brand` |
| `--ease-*` | Transition timing functions | `--ease-snappy: cubic-bezier(0.2, 0, 0, 1);` | `ease-snappy` |
| `--animate-*` | Animation utilities (pair with `@keyframes`) | `--animate-fade-in: fade-in 0.3s ease-out;` | `animate-fade-in` |

Full namespace list: [raw/01-theme-directive.md].

## Extend, override, reset

```css
@import "tailwindcss";

@theme {
  /* Extend: adds a new token alongside the defaults */
  --font-script: "Great Vibes", cursive;

  /* Override: redefines an existing default token */
  --breakpoint-sm: 30rem;
}
```

Reset one namespace and rebuild it from scratch:

```css
@theme {
  --color-*: initial;
  --color-white: #fff;
  --color-brand: oklch(0.6 0.2 250);
}
```

Reset everything and go fully custom:

```css
@theme {
  --*: initial;
  --spacing: 4px;
  --font-body: Inter, sans-serif;
  --color-brand: oklch(0.6 0.2 250);
}
```

Source: [raw/01-theme-directive.md].

## `@theme inline` for values that reference other variables

Use `inline` whenever a theme token points at another variable (a font loader export, a value from a parent component, etc). Without `inline`, the reference can resolve to the wrong fallback because of where in the DOM the variable gets read.

```css
@theme inline {
  --font-sans: var(--font-inter);
}
```

Source: [raw/01-theme-directive.md].

## Animation keyframes co-located with the token

```css
@theme {
  --animate-fade-in-scale: fade-in-scale 0.3s ease-out;

  @keyframes fade-in-scale {
    0% {
      opacity: 0;
      transform: scale(0.95);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
}
```

Source: [raw/01-theme-directive.md].

## Sharing a token set across projects

```css
/* packages/brand/theme.css */
@theme {
  --*: initial;
  --spacing: 4px;
  --color-lagoon: oklch(0.72 0.11 221.19);
  --color-coral: oklch(0.74 0.17 40.24);
}
```

```css
/* apps/admin/app.css */
@import "tailwindcss";
@import "../../packages/brand/theme.css";
```

Source: [raw/01-theme-directive.md].

## Using theme tokens outside utility classes

```css
/* Custom CSS reading a theme variable directly */
@layer components {
  .typography p {
    font-size: var(--text-base);
    color: var(--color-gray-700);
  }
}
```

```html
<!-- Arbitrary value combined with a theme token via calc() -->
<div class="relative rounded-xl">
  <div class="absolute inset-px rounded-[calc(var(--radius-xl)-1px)]"></div>
</div>
```

Source: [raw/01-theme-directive.md].

## Registering a custom utility off a theme namespace

```css
@theme {
  --tab-size-2: 2;
  --tab-size-4: 4;
  --tab-size-github: 8;
}

@utility tab-* {
  tab-size: --value(--tab-size-*);
}
```

This matches `tab-2`, `tab-4`, `tab-github`. Add bare and arbitrary support in the same rule:

```css
@utility tab-* {
  tab-size: --value([integer]);
  tab-size: --value(integer);
  tab-size: --value(--tab-size-*);
}
```

Source: [raw/07-functions-and-directives.md].

## When NOT to reach for `@theme`

This reference file is about the general Tailwind v4 mechanics only. It does not define what OSPRY's actual token values should be, how they map into `@theme inline` for the portal/web/wl apps, or the white-label `--brand-*` contract. That is `ux-ui-svelte-stinger`'s domain (`guides/02-token-bridge.md` there); read `.claude/skills/ux-ui-svelte-stinger/SKILL.md` first if the question is "what token value should this OSPRY component use," not "how does `@theme` work."
