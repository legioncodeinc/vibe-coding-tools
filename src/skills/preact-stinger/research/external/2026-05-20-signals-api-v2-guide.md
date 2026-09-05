---
source_type: official-docs
authority: official
relevance: high
topic: signals-api
url: https://preactjs.com/guide/v10/signals
---

# @preact/signals v2 API Guide

**Version:** 2.9.0 (March 2026, latest at time of research)

## Core primitives (v1 and v2)

```ts
import { signal, computed, effect, batch } from "@preact/signals";

const count = signal(0);
const double = computed(() => count.value * 2);
effect(() => console.log(count.value));
batch(() => { count.value++; count.value++; }); // one render
```

In components, access `.value` in non-JSX expressions; use the signal object directly in JSX for auto-subscription:

```tsx
function Counter() {
  return <button onClick={() => count.value++}>{count}</button>; // auto-subscribe
}
```

## New in v2: createModel / useModel / action

The `createModel` pattern groups signals + derived values + mutators into a testable unit:

```ts
import { createModel } from "@preact/signals";

const counterModel = createModel(() => {
  const count = signal(0);
  const double = computed(() => count.value * 2);
  const increment = action(() => { count.value++; });
  return { count, double, increment };
});

// In component:
function Counter() {
  const { count, double, increment } = useModel(counterModel);
  return <button onClick={increment}>{count} / {double}</button>;
}
```

`action` wraps a function so all signal mutations inside run in a single batch.

## Utility components (v2 only)

```tsx
import { Show, For } from "@preact/signals";

// Show: conditional rendering without re-mounting
<Show when={isLoading}><Spinner /></Show>

// For: keyed list rendering
<For each={items}>{item => <ListItem key={item.id} item={item} />}</For>
```

## useLiveSignal / useSignalRef (v2)

- `useLiveSignal(fn)`: creates a component-scoped computed signal
- `useSignalRef(initialValue)`: returns a signal that also acts as a React ref

## Migration from v1 to v2

The core API (`signal`, `computed`, `effect`, `batch`) is unchanged. v2 adds new exports; existing v1 code runs unmodified. The major version bump was for the `createModel` pattern addition. No breaking changes to existing `signal`/`computed`/`effect` usage.

## @preact/signals-react

`@preact/signals-react` 3.10.1 (May 2026) is the signals adapter for React projects (NOT Preact). It patches React's scheduler. Do not confuse with `@preact/signals` which is the Preact-native package.
