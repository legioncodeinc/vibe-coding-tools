# React hooks reference (source side of the translation table)
- URL: https://react.dev/reference/react/hooks
- Fetched: 2026-09-04
- Source type: official docs

## Hooks by category

State: `useState` (declares a state variable you can update directly), `useReducer` (state variable with update logic in a reducer).
Context: `useContext` (reads and subscribes to context).
Refs: `useRef` (mutable value not used for rendering, most often a DOM node; updating does not re-render), `useImperativeHandle` (customizes the ref exposed by a component).
Effects: `useEffect` (connects to an external system; cleanup function returned), `useLayoutEffect` (fires before browser repaint; measuring layout), `useInsertionEffect` (libraries inserting dynamic CSS), `useEffectEvent` (non-reactive event fired from effects).
Performance: `useMemo` (caches a computation), `useCallback` (caches a function definition), `useTransition` (non-blocking state transition), `useDeferredValue` (defers updating non-critical UI).
Library-author: `useDebugValue`, `useId` (unique id for accessibility), `useSyncExternalStore` (subscribe to an external store), `useActionState`.
React 19: `useOptimistic` (optimistic UI during async actions), `use` (reads a Promise or Context in render).

## Canonical examples

```js
// State
const [index, setIndex] = useState(0);

// Effect with cleanup
useEffect(() => {
  const connection = createConnection(roomId);
  connection.connect();
  return () => connection.disconnect();
}, [roomId]);

// Memoization
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
```

Custom Hooks are plain JavaScript functions composing the above.
