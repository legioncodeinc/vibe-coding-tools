---
source_type: official-docs
authority: official
relevance: high
topic: fresh-framework
url: https://fresh.deno.dev/docs
---

# Fresh 2.x Framework: Islands Architecture with Preact

**Version:** 2.2.2 (March 2026)

## What is Fresh

Fresh is a Deno-native, server-first web framework built on Preact. It uses an islands architecture: the server renders full HTML; only explicitly marked "island" components hydrate on the client.

## Fresh 2 vs Fresh 1

| Feature | Fresh 1.x | Fresh 2.x |
|---|---|---|
| Build tool | esbuild | Vite |
| React compat | manual config | automatic (Vite plugin aliases React to Preact) |
| Islands dir | `islands/` | `islands/` (same) |
| npm packages | limited | full npm support via Vite |
| Config | `fresh.config.ts` | `deno.json` + `vite.config.ts` |

Fresh 2 is a significant migration from Fresh 1. Existing Fresh 1 projects require a migration step (see the Fresh migration guide at `fresh.deno.dev/docs/1.x/`).

## Islands: the #1 gotcha

**Island props must be serializable.** Fresh serializes props on the server and deserializes on the client. This means:

- Strings, numbers, booleans, arrays, plain objects: OK
- Functions: NOT OK (cannot serialize)
- Class instances: NOT OK
- Preact signals: OK (Fresh has special signal serialization support)

```tsx
// islands/Counter.tsx
import { signal } from "@preact/signals";

interface Props {
  count: Signal<number>; // OK: signals are serializable in Fresh
}

export default function Counter({ count }: Props) {
  return <button onClick={() => count.value++}>{count}</button>;
}
```

## Sharing state between islands via signals

Signals defined outside an island can be shared across multiple islands on the same page; this is Fresh's recommended cross-island state pattern:

```ts
// state.ts (shared module, imported by multiple islands)
import { signal } from "@preact/signals";
export const cartCount = signal(0);
```

## React compat in Fresh 2

The Fresh 2 Vite plugin automatically aliases `react` and `react-dom` to `preact/compat`. npm packages that depend on React work out of the box in Fresh 2 without manual alias configuration.

## Deployment

Fresh deploys to Deno Deploy, but also runs on any Deno-capable server. The Deno Deploy free tier supports Fresh projects.
