# Example: Happy Path (Signals Component)

> Demonstrates: `guides/01-signals-api.md`

## Scenario

Build a todo list component using Preact Signals v2 with the `createModel` pattern.

## Input

Request: "I want to build a todo list in Preact with signals. Show me the v2 way."

## Output

### State model (`src/todoModel.ts`)

```ts
import { createModel, signal, computed, action } from "@preact/signals";

export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export const todoModel = createModel(() => {
  const todos = signal<Todo[]>([]);
  const remaining = computed(() => todos.value.filter(t => !t.done).length);

  const addTodo = action((text: string) => {
    todos.value = [...todos.value, { id: Date.now(), text, done: false }];
  });

  const toggleTodo = action((id: number) => {
    todos.value = todos.value.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    );
  });

  const clearDone = action(() => {
    todos.value = todos.value.filter(t => !t.done);
  });

  return { todos, remaining, addTodo, toggleTodo, clearDone };
});
```

### Component (`src/TodoList.tsx`)

```tsx
import { useModel } from "@preact/signals";
import { For, Show } from "@preact/signals";
import { useState } from "preact/hooks";
import { todoModel } from "./todoModel";

export function TodoList() {
  const { todos, remaining, addTodo, toggleTodo, clearDone } = useModel(todoModel);
  const [input, setInput] = useState("");

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (input.trim()) {
      addTodo(input.trim());
      setInput("");
    }
  }

  return (
    <div>
      <h1>Todos — <small>{remaining} remaining</small></h1>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onInput={e => setInput((e.target as HTMLInputElement).value)}
          placeholder="Add todo..."
        />
        <button type="submit">Add</button>
      </form>

      <For each={todos}>
        {todo => (
          <div key={todo.id}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{ textDecoration: todo.done ? "line-through" : "none" }}>
              {todo.text}
            </span>
          </div>
        )}
      </For>

      <Show when={computed(() => todos.value.some(t => t.done))}>
        <button onClick={clearDone}>Clear done</button>
      </Show>
    </div>
  );
}
```

## What this example demonstrates

- `createModel` encapsulates state, derived values, and actions in one testable unit.
- `action` batches all mutations inside: `addTodo` causes one re-render.
- `For` is used for keyed list rendering (v2 utility component).
- `Show` is used for conditional rendering without unmounting (v2 utility component).
- `remaining` is a `computed`: it updates automatically when `todos` changes.
- `useModel` subscribes the component to all signals returned by the model.
