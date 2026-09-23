# CSS Token Architecture: dark-mode-theming-stinger

*Covers: `:root` / `.dark` variable layout, semantic naming convention, multi-brand block pattern, `color-scheme` property.*

*Sources: `research/external/2026-05-20-css-variables-dark-mode.md`, `research/external/2026-05-20-multi-brand-css-runtime-swap.md`*

---

## Canonical `globals.css` structure

```css
@import "tailwindcss";

/* ── 1. Tailwind v4 dark-mode variant ──────────────────────────── */
@custom-variant dark (&:where(.dark, .dark *));

/* ── 2. Primitive tokens (no theme variant) ───────────────────── */
:root {
  /* Blue scale */
  --primitive-blue-200: #bfdbfe;
  --primitive-blue-500: #3b82f6;
  --primitive-blue-600: #2563eb;
  /* Gray scale */
  --primitive-gray-100: #f3f4f6;
  --primitive-gray-300: #d1d5db;
  --primitive-gray-600: #4b5563;
  --primitive-gray-800: #1f2937;
  --primitive-gray-900: #111827;
  /* etc. */
}

/* ── 3. Semantic tokens — light (default) ─────────────────────── */
:root {
  color-scheme: light;

  --color-background:        var(--primitive-gray-100);
  --color-surface:           #ffffff;
  --color-surface-elevated:  #ffffff;
  --color-border:            #e5e7eb;

  --color-text-primary:      var(--primitive-gray-900);
  --color-text-muted:        var(--primitive-gray-600);
  --color-text-disabled:     var(--primitive-gray-300);

  --color-primary:           var(--primitive-blue-500);
  --color-primary-hover:     var(--primitive-blue-600);
  --color-primary-foreground:#ffffff;

  --color-destructive:       #ef4444;
  --color-destructive-foreground: #ffffff;
  --color-success:           #10b981;
  --color-warning:           #f59e0b;
  --color-info:              var(--primitive-blue-500);
}

/* ── 4. Semantic tokens — dark override ───────────────────────── */
.dark {
  color-scheme: dark;

  --color-background:        var(--primitive-gray-900);
  --color-surface:           var(--primitive-gray-800);
  --color-surface-elevated:  #374151;
  --color-border:            #374151;

  --color-text-primary:      var(--primitive-gray-100);
  --color-text-muted:        #9ca3af;
  --color-text-disabled:     #6b7280;

  --color-primary:           var(--primitive-blue-200);
  --color-primary-hover:     #93c5fd;
  --color-primary-foreground:var(--primitive-gray-900);

  --color-destructive:       #fca5a5;
  --color-destructive-foreground: var(--primitive-gray-900);
  --color-success:           #6ee7b7;
  --color-warning:           #fde68a;
  --color-info:              var(--primitive-blue-200);
}

/* ── 5. Brand overrides (multi-tenant) ────────────────────────── */
[data-brand="acme"] {
  --color-primary:           #0070f3;
  --color-primary-hover:     #005bb5;
  --color-primary-foreground:#ffffff;
}
[data-brand="acme"].dark,
[data-brand="acme"] .dark {
  --color-primary:           #3291ff;
  --color-primary-hover:     #60a5fa;
}
```

---

## Naming convention

| Pattern | Example | Use for |
|---------|---------|---------|
| `--color-{role}` | `--color-background` | Semantic surface/background tokens |
| `--color-text-{role}` | `--color-text-primary` | Text color tokens |
| `--color-{component}-{property}` | `--color-primary-foreground` | Foreground color on a colored surface |
| `--primitive-{palette}-{shade}` | `--primitive-blue-500` | Raw primitive values |

Do NOT expose `--primitive-*` tokens in component styles. They are building blocks only.

---

## Audit checklist

When auditing an existing token file:

- [ ] Every semantic token has both a light (`:root`) and dark (`.dark`) value
- [ ] No component file references `--primitive-*` tokens directly
- [ ] No raw hex values in component files
- [ ] `color-scheme` property is set on both `:root` and `.dark`
- [ ] Multi-brand blocks do NOT redeclare primitive tokens (only semantic overrides)
- [ ] Brand-dark combinations are handled by composing selectors, not duplicating the dark block

---

## Common audit findings

| Finding | Severity | Fix |
|---------|----------|-----|
| Component uses `#3b82f6` inline | High | Replace with `var(--color-primary)` |
| Dark override block only covers some tokens | High | Complete the dark token set |
| Brand block overrides primitive tokens | Medium | Move override to semantic token level |
| Missing `color-scheme` property | Medium | Add to `:root` and `.dark` |
| Semantic token points to hex instead of primitive | Low | Replace hex with `var(--primitive-*)` |

*Example demonstrating this guide: `examples/happy-path-app-router.md`*
