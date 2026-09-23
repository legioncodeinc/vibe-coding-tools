# Guide 01: Signals API

> Source: `research/external/2026-05-20-signals-api-v2-guide.md`

`@preact/signals` is a reactive state primitive that works both inside and outside the Preact vdom. This guide covers the v1 core primitives and the v2 model pattern.

---

## Installation

```bash
npm install @preact/signals
```

---

## v1 Core primitives (stable, unchanged in v2)

### signal

Creates a reactive value. Reading `.value` inside a component creates a subscription.

```ts
import { signal } from "@preact/signals";
const count = signal(0);
count.value++; // triggers subscribers
```

### computed

Creates a derived signal that re-evaluates when dependencies change.

```ts
const double = computed(() => count.value * 2);
```

### effect

Runs a side effect when signals it reads change. Returns a cleanup function.

```ts
const cleanup = effect(() => {
  document.title = `Count: ${count.value}`;
});
cleanup(); // unsubscribe
```

### batch

Groups multiple signal mutations into a single render.

```ts
import { batch } from "@preact/signals";
batch(() => {
  count.value++;
  name.value = "updated";
}); // one component re-render
```

---

## Using signals in components

In JSX, pass the signal object (not `.value`) for automatic subscription:

```tsx
function Counter() {
  // Accessing count.value here would create a dependency inside render
  // Passing `count` directly to JSX is the idiomatic pattern:
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => count.value++}>+1</button>
    </div>
  );
}
```

For imperative access outside JSX, use `.value`:

```ts
console.log(count.value); // read
count.value = 5; // write
```

---

## v2: The createModel / useModel pattern

`createModel` groups signals, computed values, and actions into a testable, sharable unit. Added in `@preact/signals` v2.

```ts
import { createModel } from "@preact/signals";

const counterModel = createModel(() => {
  const count = signal(0);
  const double = computed(() => count.value * 2);
  const increment = action(() => { count.value++; });
  const reset = action(() => { count.value = 0; });
  return { count, double, increment, reset };
});
```

Use in a component with `useModel`:

```tsx
import { useModel } from "@preact/signals";

function Counter() {
  const { count, double, increment, reset } = useModel(counterModel);
  return (
    <div>
      <p>{count} × 2 = {double}</p>
      <button onClick={increment}>+</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### `action`

`action` wraps a function so all signal mutations inside run in a single batch:

```ts
import { action } from "@preact/signals";
const addItem = action((item: string) => {
  items.value = [...items.value, item];
  count.value++;
}); // one re-render, not two
```

---

## v2 Utility components

### Show

Conditional rendering without unmounting/remounting:

```tsx
import { Show } from "@preact/signals";
<Show when={isLoading}><Spinner /></Show>
```

### For

Keyed list rendering:

```tsx
import { For } from "@preact/signals";
<For each={items}>{item => <ListItem key={item.id} item={item} />}</For>
```

---

## v2 Hook utilities

- `useLiveSignal(fn)`: creates a component-scoped computed signal (re-evaluates per render).
- `useSignalRef(initialValue)`: returns a signal that also acts as a DOM ref.

---

## Migrating from v1 to v2

The core API (`signal`, `computed`, `effect`, `batch`) is unchanged. v2 adds new exports. Existing v1 code runs unmodified: v2 is additive, not breaking.

---

## Signals + vdom coexistence rules

1. **Never call `signal.value` conditionally inside render**; React-style rules-of-hooks apply: signals read in render create dependencies at every call site.
2. **Batch mutations in event handlers**: multiple `signal.value =` writes in a single event handler without `batch()` will cause multiple renders.
3. **Don't share a global signal between incompatible render trees** (e.g., two separate Preact roots) without explicit coordination.

> See `examples/happy-path-signals-component.md` for a worked example.
