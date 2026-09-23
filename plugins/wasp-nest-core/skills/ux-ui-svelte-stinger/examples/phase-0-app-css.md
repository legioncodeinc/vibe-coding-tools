# Example: Phase 0 `app.css` for the portal

> A worked example of what `apps/portal/src/app.css` looks like after Phase 0
> completes. Demonstrates `01-installation-phase-0.md` and `02-token-bridge.md`
> together.

**Guides demonstrated:** `../guides/01-installation-phase-0.md`,
`../guides/02-token-bridge.md`, `../guides/04-dark-mode-inversion.md`.

```css
/* apps/portal/src/app.css — Phase 0 destination */
@import "tailwindcss";

/* OSPRY INVERSION (04-dark-mode-inversion.md): :root IS the dark theme.
 * shadcn-svelte ships light-first; OSPRY's PRD-071 tokens.css is dark-first,
 * so we invert the convention. The .light block carries the (rare) light theme.
 */
@custom-variant dark (&:is(.dark *));
@custom-variant light (&:is(.light *));

/* ---------------------------------------------------------------------------
 * Layer 1: theme token VALUES (02-token-bridge.md).
 * :root = DARK (the OSPRY default). Every value references a PRD-071 token
 * from tokens.css. The light theme lives under [data-theme="light"] (the
 * attribute selector tokens.css already uses), and the bridge references are
 * IDENTICAL there because the PRD-071 token values themselves swap.
 * ------------------------------------------------------------------------- */
:root,
[data-theme="dark"] {
  --background: var(--bg-canvas);
  --foreground: var(--text-primary);
  --card: var(--bg-surface);
  --card-foreground: var(--text-primary);
  --popover: var(--bg-elevated);
  --popover-foreground: var(--text-primary);
  --primary: var(--interactive);                 /* BLUE, not green — green-scarce */
  --primary-foreground: var(--text-inverse);
  --secondary: var(--bg-subtle);
  --secondary-foreground: var(--text-primary);
  --muted: var(--bg-subtle);
  --muted-foreground: var(--text-secondary);
  --accent: var(--interactive-subtle);
  --accent-foreground: var(--interactive-on);
  --destructive: var(--severity-critical);        /* OSPRY severity-red, both themes */
  --destructive-foreground: var(--text-inverse);
  --border: var(--border-default);
  --input: var(--border-default);
  --ring: var(--border-focus);                   /* WCAG 2.4.11 */
  --radius: 8px;                                  /* = PRD-071 --radius-md */
}

/* LIGHT theme: same bridge references; tokens.css swaps the underlying values
 * under [data-theme="light"]. Opt in by setting data-theme="light" on <html>. */
[data-theme="light"] {
  --background: var(--bg-canvas);   /* tokens.css defines the light value here */
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
  --accent: var(--interactive-subtle);
  --accent-foreground: var(--interactive-on);
  --destructive: var(--severity-critical);
  --destructive-foreground: var(--text-inverse);
  --border: var(--border-default);
  --input: var(--border-default);
  --ring: var(--border-focus);
  --radius: 8px;
}

/* ---------------------------------------------------------------------------
 * Layer 2: the @theme inline block (02-token-bridge.md).
 * STAYS EXACTLY as shadcn-svelte generated it. The `inline` keyword is
 * ESSENTIAL — it makes utilities resolve the token VALUE, not a fixed
 * reference, so theme switches and white-label SSR overrides propagate.
 * NEVER remove `inline`.
 * ------------------------------------------------------------------------- */
@theme inline {
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
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

/* ---------------------------------------------------------------------------
 * Layer 3: base styles. STAYS as shadcn-svelte generated it.
 * ------------------------------------------------------------------------- */
@layer base {
  * {
    border-color: var(--color-border);
  }
  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
  }
}
```

And the matching import block in `apps/portal/src/routes/+layout.svelte`:

```svelte
<script lang="ts">
  // Import order matters (01-installation-phase-0.md):
  // tokens → brand → legacy hand-rolled → app.css (Tailwind v4 + bridge)
  import "$lib/styles/tokens.css";
  import "$lib/styles/brand.css";
  import "$lib/styles/base.css";
  import "$lib/styles/shell.css";
  import "./app.css";

  // ... rest of layout ...
</script>
```

## What to check after landing this

- A copy-in `<Button variant="default">` renders OSPRY blue (`--interactive`).
- A copy-in `<Button>` picks up a resolved agency brand via the chain in
  `05-white-label-preservation.md`.
- The default paint is dark (no FOWT).
- The legacy `base.css` / `shell.css` surfaces render unchanged.
