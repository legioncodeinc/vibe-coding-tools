---
source_type: best_practices
authority: high
relevance: high
topic: CSS custom properties for dark mode, semantic vs primitive token pattern
date_retrieved: 2026-05-20
url: https://web.dev/articles/color-scheme
---

# CSS Variables and Dark Mode Token Architecture (2026)

## Semantic vs. primitive token model

The two-tier token model is the 2026 consensus:

```
Primitive tokens  → named raw values (never used directly in components)
Semantic tokens   → theme-aware aliases consumed by components
```

Example:

```css
/* Primitive tokens — no dark/light variant needed */
:root {
  --color-blue-500: #3b82f6;
  --color-blue-200: #bfdbfe;
  --color-gray-900: #111827;
  --color-gray-100: #f3f4f6;
}

/* Semantic tokens — override per theme */
:root {
  --color-background: var(--color-gray-100);
  --color-surface: #ffffff;
  --color-text-primary: var(--color-gray-900);
  --color-text-muted: #6b7280;
  --color-border: #e5e7eb;
  --color-primary: var(--color-blue-500);
  --color-primary-hover: #2563eb;
}

.dark {
  --color-background: var(--color-gray-900);
  --color-surface: #1f2937;
  --color-text-primary: var(--color-gray-100);
  --color-text-muted: #9ca3af;
  --color-border: #374151;
  --color-primary: var(--color-blue-200);
  --color-primary-hover: #93c5fd;
}
```

Components reference semantic tokens only: `color: var(--color-text-primary)`. This means swapping themes requires only changing the selector, not touching any component code.

## `color-scheme` CSS property

```css
:root { color-scheme: light; }
.dark { color-scheme: dark; }
```

This tells the browser to render OS-native chrome (scrollbars, form inputs, date pickers) in the correct scheme. **Always include it.** Without it, dark-mode pages can show light scrollbars in Chrome.

## `meta[name="color-scheme"]`

```html
<meta name="color-scheme" content="light dark" />
```

Declares that the page supports both schemes; lets the browser show the appropriate background color immediately before CSS loads, reducing flash.

## Token naming conventions

- Prefer `--color-{semantic-role}` over `--color-{palette-name}-{shade}` in component code.
- Roles: `background`, `surface`, `surface-elevated`, `border`, `text-primary`, `text-muted`, `text-disabled`, `primary`, `primary-hover`, `primary-foreground`, `destructive`, `destructive-foreground`, `success`, `warning`, `info`.
- Interactive states (`hover`, `active`, `focus`, `disabled`) belong in semantic tokens, not in component styles.
