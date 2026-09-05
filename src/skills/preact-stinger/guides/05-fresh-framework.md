# Guide 05: Fresh 2.x Framework

> Source: `research/external/2026-05-20-fresh-framework-islands.md`

Fresh is a Deno-native, server-first web framework built on Preact. It uses islands architecture: the server renders full HTML; only explicitly marked components hydrate on the client.

**Current version:** 2.2.2 (March 2026)

---

## Fresh 2 vs Fresh 1

Fresh 2 is a significant rearchitecture:

| Feature | Fresh 1.x | Fresh 2.x |
|---|---|---|
| Build tool | esbuild | Vite |
| npm package support | limited (Deno compat) | full npm support |
| React compat | manual alias | automatic (Vite plugin) |
| Config file | `fresh.config.ts` | `deno.json` + `vite.config.ts` |
| Islands directory | `islands/` | `islands/` (same) |

> TODO: open question; check `fresh.deno.dev/docs/1.x/` for the official 1.x → 2.x migration guide before publishing.

---

## Project structure

```
my-fresh-app/
├── deno.json
├── vite.config.ts
├── routes/
│   ├── index.tsx     (server-rendered page)
│   └── _app.tsx      (app wrapper)
├── islands/
│   ├── Counter.tsx   (hydrated on client)
│   └── Search.tsx
└── components/
    └── Header.tsx    (server-only — NOT an island)
```

Files in `islands/` are automatically islands; files in `components/` are server-only.

---

## The #1 gotcha: serializable props

**Island props must be serializable.** Fresh serializes props on the server and deserializes on the client. This is a hard constraint:

| Prop type | Serializable? |
|---|---|
| string, number, boolean | YES |
| Array of serializable values | YES |
| Plain objects | YES |
| Preact signals | YES (special Fresh support) |
| Functions | NO: will throw |
| Class instances | NO: will throw |
| Date objects | Partial (serializes, but deserializes as string) |

```tsx
// islands/Counter.tsx — CORRECT
interface Props {
  initialCount: number; // serializable
}
export default function Counter({ initialCount }: Props) {
  const count = signal(initialCount);
  return <button onClick={() => count.value++}>{count}</button>;
}

// islands/BadIsland.tsx — WILL FAIL at runtime
interface BadProps {
  onAction: () => void; // NOT serializable
}
```

---

## Sharing state between islands via signals

Define signals outside islands (in a `state.ts` or similar) and import them in multiple islands:

```ts
// state.ts
import { signal } from "@preact/signals";
export const cartCount = signal(0);
```

```tsx
// islands/Cart.tsx
import { cartCount } from "../state.ts";
export default function Cart() {
  return <span>{cartCount}</span>;
}

// islands/AddToCart.tsx
import { cartCount } from "../state.ts";
export default function AddToCart() {
  return <button onClick={() => cartCount.value++}>Add</button>;
}
```

This is Fresh's idiomatic pattern for cross-island reactivity. Signals CAN be passed as island props: Fresh has special serialization support for them.

---

## React compatibility in Fresh 2

The Fresh 2 Vite plugin automatically aliases `react` and `react-dom` to `preact/compat`. npm packages that depend on React work without manual alias config:

```ts
// deno.json (no explicit React alias needed in Fresh 2)
{
  "tasks": { "dev": "deno run -A dev.ts" }
}
```

The same compat gaps apply (see `guides/02-compat-migration.md`).

---

## Routing

Fresh uses file-based routing in `routes/`:

```
routes/
├── index.tsx           → /
├── about.tsx           → /about
├── blog/
│   ├── index.tsx       → /blog
│   └── [slug].tsx      → /blog/:slug
└── api/
    └── users.ts        → /api/users (API route, no JSX)
```

---

## Deployment

Fresh deploys to Deno Deploy. From the project root:

```bash
deployctl deploy --project=my-app main.ts
```

Or configure GitHub Actions for automatic deploys on push.

---

## When Fresh is the right host vs Astro

| Criteria | Choose Fresh | Choose Astro |
|---|---|---|
| Runtime | Deno Deploy (preferred) or Deno server | Node.js, Cloudflare Workers, etc. |
| Ecosystem | Deno-first, npm packages via Vite | Node.js-first, full npm |
| Routing | File-based, server-side | File-based, static by default |
| Multi-framework islands | Preact only (native) | Preact, React, Svelte, Vue (multi) |
| Learning curve | Lower for Deno developers | Lower for Node developers |
