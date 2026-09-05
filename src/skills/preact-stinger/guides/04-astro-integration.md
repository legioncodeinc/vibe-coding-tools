# Guide 04: Astro + Preact Integration

> Source: `research/external/2026-05-20-astro-preact-integration.md`

---

## Installation

```bash
npx astro add preact
```

Or manually:

```bash
npm install @astrojs/preact preact
```

**Require `@astrojs/preact` >= 5.0.1.** Version 5.0.1 (March 2026) fixed a `useId` collision bug that caused duplicate aria attributes across Preact islands on the same page. Earlier versions have an accessibility correctness bug.

`astro.config.mjs`:
```js
import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";

export default defineConfig({
  integrations: [preact()],
});
```

---

## Islands: the five `client:` directives

Astro renders everything as static HTML by default. Adding a `client:` directive to a Preact component makes it an interactive island.

| Directive | When it hydrates | Use case |
|---|---|---|
| `client:load` | Immediately on page load | Immediately interactive elements (nav, forms) |
| `client:idle` | When browser is idle | Non-critical UI (newsletter signup) |
| `client:visible` | When element enters viewport | Below-the-fold content, infinite scroll triggers |
| `client:media="(max-width: 768px)"` | When CSS media query matches | Mobile-only interactive elements |
| `client:only="preact"` | Client-only (no SSR at all) | Components requiring browser APIs on mount |

```astro
---
import Counter from "../components/Counter.tsx";
import Chart from "../components/Chart.tsx";
---

<!-- Loads immediately -->
<Counter client:load />

<!-- Loads when idle -->
<Newsletter client:idle />

<!-- Loads when visible in viewport -->
<ProductReviews client:visible />

<!-- Client-only (no SSR), must specify renderer -->
<BrowserOnlyMap client:only="preact" />
```

---

## Signals in Astro islands

`@preact/signals` works in Astro Preact islands. For cross-island state, define signals in a shared module:

```ts
// src/store.ts
import { signal } from "@preact/signals";
export const cartCount = signal(0);
```

```tsx
// src/components/CartBadge.tsx
import { cartCount } from "../store";
export default function CartBadge() {
  return <span>{cartCount}</span>;
}

// src/components/AddToCart.tsx
import { cartCount } from "../store";
export default function AddToCart({ productId }: { productId: string }) {
  function add() { cartCount.value++; }
  return <button onClick={add}>Add to cart</button>;
}
```

Both islands share the same signal instance, so mutations in one island reactively update the other.

---

## Enabling preact/compat in Astro

To use React-compatible npm packages inside Preact islands, add the Vite alias in `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";

export default defineConfig({
  integrations: [preact()],
  vite: {
    resolve: {
      alias: {
        "react": "preact/compat",
        "react-dom": "preact/compat",
      },
    },
  },
});
```

The same compat gaps apply (see `guides/02-compat-migration.md`): no React 19 `use()`, no RSC, no `@types/react`.

---

## Multi-framework setup (React + Preact on the same page)

```js
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import preact from "@astrojs/preact";

export default defineConfig({
  integrations: [
    react(),
    preact({ include: ["**/preact-components/**"] }), // scope Preact to a subfolder
  ],
});
```

The `include` option prevents the Preact renderer from claiming React components as its own.

---

## Known issues and constraints

- **`@astrojs/preact` < 5.0.1**: `useId` collision bug. Two Preact islands using `useId` on the same page produce duplicate IDs. Affects screen readers and form label associations. **Upgrade to >= 5.0.1.**
- **`client:only="preact"`**: Always specify `"preact"` (not just `client:only`) so Astro knows which renderer to use.
- **TypeScript**: Do not install `@types/react` when using compat. Use Preact's built-in types.
