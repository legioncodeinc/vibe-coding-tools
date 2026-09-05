# Template: CSS Token Layer (`tokens.css` / `globals.css`)

Copy and customize. Replace `{brand-name}` and `{brand-hex-*}` placeholders. Add/remove semantic tokens as needed. Keep the three-section structure (primitives → light semantics → dark semantics) even if some sections are sparse.

---

```css
@import "tailwindcss";

/* ── Tailwind v4 dark mode via class ─────────────────────────── */
@custom-variant dark (&:where(.dark, .dark *));

/* ── 1. Primitive tokens (NEVER reference these in components) ─ */
:root {
  /* Brand palette */
  --primitive-brand-100: {brand-hex-lightest};
  --primitive-brand-200: {brand-hex-light};
  --primitive-brand-500: {brand-hex-mid};
  --primitive-brand-600: {brand-hex-mid-dark};
  --primitive-brand-900: {brand-hex-darkest};

  /* Neutral gray scale */
  --primitive-gray-50:  #f9fafb;
  --primitive-gray-100: #f3f4f6;
  --primitive-gray-200: #e5e7eb;
  --primitive-gray-300: #d1d5db;
  --primitive-gray-400: #9ca3af;
  --primitive-gray-500: #6b7280;
  --primitive-gray-600: #4b5563;
  --primitive-gray-700: #374151;
  --primitive-gray-800: #1f2937;
  --primitive-gray-900: #111827;

  /* Semantic status colors (primitives) */
  --primitive-red-400:   #f87171;
  --primitive-red-500:   #ef4444;
  --primitive-green-400: #4ade80;
  --primitive-green-500: #22c55e;
  --primitive-yellow-400:#facc15;
  --primitive-blue-400:  #60a5fa;
  --primitive-blue-500:  #3b82f6;
}

/* ── 2. Semantic tokens — light (default) ─────────────────────── */
:root {
  color-scheme: light;

  /* Surfaces */
  --color-background:        var(--primitive-gray-100);
  --color-surface:           #ffffff;
  --color-surface-elevated:  #ffffff;
  --color-surface-overlay:   rgba(0, 0, 0, 0.4);

  /* Borders */
  --color-border:            var(--primitive-gray-200);
  --color-border-strong:     var(--primitive-gray-300);

  /* Text */
  --color-text-primary:      var(--primitive-gray-900);
  --color-text-muted:        var(--primitive-gray-500);
  --color-text-disabled:     var(--primitive-gray-300);
  --color-text-inverse:      #ffffff;

  /* Primary brand action */
  --color-primary:           var(--primitive-brand-500);
  --color-primary-hover:     var(--primitive-brand-600);
  --color-primary-foreground:#ffffff;
  --color-primary-subtle:    var(--primitive-brand-100);

  /* Semantic statuses */
  --color-destructive:       var(--primitive-red-500);
  --color-destructive-foreground: #ffffff;
  --color-success:           var(--primitive-green-500);
  --color-warning:           var(--primitive-yellow-400);
  --color-info:              var(--primitive-blue-500);

  /* Focus ring */
  --color-focus-ring:        var(--primitive-brand-500);
}

/* ── 3. Semantic tokens — dark override ───────────────────────── */
.dark {
  color-scheme: dark;

  /* Surfaces */
  --color-background:        var(--primitive-gray-900);
  --color-surface:           var(--primitive-gray-800);
  --color-surface-elevated:  var(--primitive-gray-700);
  --color-surface-overlay:   rgba(0, 0, 0, 0.6);

  /* Borders */
  --color-border:            var(--primitive-gray-700);
  --color-border-strong:     var(--primitive-gray-600);

  /* Text */
  --color-text-primary:      var(--primitive-gray-100);
  --color-text-muted:        var(--primitive-gray-400);
  --color-text-disabled:     var(--primitive-gray-600);
  --color-text-inverse:      var(--primitive-gray-900);

  /* Primary brand action */
  --color-primary:           var(--primitive-brand-200);
  --color-primary-hover:     var(--primitive-brand-100);
  --color-primary-foreground:var(--primitive-gray-900);
  --color-primary-subtle:    rgba({brand-hex-mid-rgb}, 0.15); /* adjust per brand */

  /* Semantic statuses */
  --color-destructive:       var(--primitive-red-400);
  --color-destructive-foreground: var(--primitive-gray-900);
  --color-success:           var(--primitive-green-400);
  --color-warning:           var(--primitive-yellow-400);
  --color-info:              var(--primitive-blue-400);

  /* Focus ring */
  --color-focus-ring:        var(--primitive-brand-200);
}

/* ── 4. Multi-brand overrides (add one block per brand) ────────── */
[data-brand="{brand-name}"] {
  --color-primary:           {brand-hex-mid};
  --color-primary-hover:     {brand-hex-mid-dark};
  --color-primary-foreground:#ffffff;
  --brand-logo-src:          url('/brands/{brand-name}/logo.svg');
  --brand-font-family:       '{BrandFont}', system-ui, sans-serif;
}

[data-brand="{brand-name}"].dark,
[data-brand="{brand-name}"] .dark {
  --color-primary:           {brand-hex-light};
  --color-primary-hover:     {brand-hex-lightest};
  --color-primary-foreground:var(--primitive-gray-900);
}

/* ── 5. Motion safety ─────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

---

## Usage notes

- Replace all `{...}` placeholders before committing.
- Remove the multi-brand section (§4) if the app is single-brand.
- Add brand blocks for each additional brand.
- Reference `guides/01-css-token-architecture.md` for the full naming convention.
- Reference `guides/05-tailwind-v4-dark-mode.md` for the `@custom-variant` line.
