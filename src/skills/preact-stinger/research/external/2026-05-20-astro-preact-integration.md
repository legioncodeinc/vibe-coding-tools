---
source_type: official-docs
authority: official
relevance: high
topic: astro-integration
url: https://docs.astro.build/en/guides/integrations-guide/preact/
---

# Astro Preact Integration

**Package:** `@astrojs/preact` 5.1.2 (April 2026)

## Installation

```bash
npx astro add preact
# or manually:
npm install @astrojs/preact
```

`astro.config.mjs`:
```js
import preact from "@astrojs/preact";
export default { integrations: [preact()] };
```

## The 5 client: directives

| Directive | When it hydrates | Use case |
|---|---|---|
| `client:load` | On page load | Immediately interactive |
| `client:idle` | When browser is idle | Non-critical interactions |
| `client:visible` | When element enters viewport | Below-the-fold content |
| `client:media="(max-width: 768px)"` | When media query matches | Responsive interactivity |
| `client:only="preact"` | Client-only (no SSR) | Components that need browser APIs |

`client:only` requires specifying the renderer: `client:only="preact"`.

## Critical bug: useId collision (fixed in 5.0.1)

Prior to `@astrojs/preact` 5.0.1 (March 2026), using multiple Preact islands on the same page could produce duplicate `useId` values, causing accessibility violations (duplicate aria attributes). **Require `@astrojs/preact` >= 5.0.1.**

## Multi-framework support

If the project uses both React and Preact islands, include both renderers:
```js
integrations: [react(), preact({ include: ["**/preact-islands/**"] })]
```
The `include` option scopes which files use the Preact renderer to avoid conflicts.

## Signals in Astro islands

`@preact/signals` works in Astro Preact islands. Shared signals (defined in a non-island module) can be imported by multiple islands for cross-island reactivity: the same pattern as Fresh.

## compat mode

Enable `preact/compat` in Astro by adding the Vite alias in `astro.config.mjs`:
```js
vite: {
  resolve: {
    alias: {
      "react": "preact/compat",
      "react-dom": "preact/compat",
    },
  },
},
```
This allows React-compatible npm packages to work within Preact islands.
