---
source_type: web_spec
authority: authoritative
relevance: high
topic: prefers-color-scheme media query, OS-level detection, color-scheme property
date_retrieved: 2026-05-20
url: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
---

# prefers-color-scheme: MDN Reference (2026)

## Spec

`prefers-color-scheme` is a CSS media feature that detects the user's OS color scheme preference. Valid values: `light` (default) and `dark`.

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #111827;
    --color-text-primary: #f3f4f6;
  }
}
```

## JavaScript detection

```js
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

// Listen for changes (user switches OS theme while app is open)
window.matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    if (e.matches) applyTheme("dark");
    else applyTheme("light");
  });
```

## Relationship to `next-themes`

`next-themes`'s `enableSystem: true` prop reads this media query via `window.matchMedia`. When `defaultTheme="system"`, the library resolves the initial theme from OS preference and only overrides it when the user explicitly picks a manual theme. The key rule: **system preference is the fallback, not the persisted preference**: never overwrite a user's manual selection with the OS value.

## `color-scheme` CSS property vs. the media query

| Concept | What it is |
|---------|-----------|
| `prefers-color-scheme` media query | Reads the OS preference: detection only |
| `color-scheme` CSS property | Informs browser chrome (scrollbars, form inputs) what scheme to render in |

Both should be used together:

```css
:root { color-scheme: light; }
.dark { color-scheme: dark; }
```

## Browser support (2026)

All major browsers (Chrome, Firefox, Safari, Edge) support `prefers-color-scheme`. The `color-scheme` CSS property has universal support. No polyfill needed.
