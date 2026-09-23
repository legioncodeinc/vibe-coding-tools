# Universal reactivity in .svelte.js / .svelte.ts

## What it is

Besides `.svelte` component files, Svelte 5 also compiles `.svelte.js` and `.svelte.ts` files. They behave like any normal JS/TS module except runes are legal inside them. This is what "universal reactivity" means: reactive logic no longer has to live inside a component, it can live in a plain module and be imported anywhere, including other modules [raw/12-svelte-boundary-and-universal-reactivity.md]. This concept didn't exist prior to Svelte 5, it's the direct fix for the Svelte 4 problem where refactoring reactive logic out of a component's top level forced you onto a completely separate reactivity model (stores) [raw/06-migration-guide.md, raw/11-svelte5-release-blog.md].

## The export restriction, and how to work around it

You cannot export a directly-reassigned `$state` binding:

```js
// state.svelte.js: this does NOT work as expected across module boundaries
export let count = $state(0);
```

Why: the Svelte compiler transforms every in-file reference to a `$state` binding into get/set calls under the hood. That transform only applies within the file being compiled. A different file that imports `count` doesn't get the same transform applied to its own references, so a reassignment from the importing file doesn't hook into the reactive get/set machinery the way an in-file reassignment does [raw/12-svelte-boundary-and-universal-reactivity.md].

Three ways around it, in order of how idiomatic they are:

### 1. Encapsulate behind accessor functions

```js
// counter.svelte.js
let count = $state(0);

export function getCount() {
	return count;
}
export function increment() {
	count++;
}
```

The exported bindings (`getCount`, `increment`) are plain functions, not reassigned state, so the restriction doesn't apply [raw/13-runes-community-explainer-2026.md].

### 2. Export a class with $state fields

```ts
// theme.svelte.ts
class ThemeState {
	current = $state<'light' | 'dark'>('light');

	toggle() {
		this.current = this.current === 'light' ? 'dark' : 'light';
	}
}

export const theme = new ThemeState();
```

Class fields marked `$state` are compiled to get/set methods on the prototype, so access always goes through a method call rather than a bare compiler-transformed binding, which is why this pattern sidesteps the cross-module restriction cleanly. It also matches how `$state` should be used on classes generally: Svelte does not proxy class instances themselves, wrapping `new ThemeState()` in `$state(...)` would have no effect. Mark the individual fields instead [raw/01-runes-overview-and-state.md, raw/12-svelte-boundary-and-universal-reactivity.md].

### 3. Don't reassign the exported binding at all, only mutate it

If the exported value is an object or array (not a primitive), mutating its properties in place works fine across module boundaries, deep `$state` reactivity is proxy-based and doesn't depend on the compiler's per-file get/set transform the way primitive reassignment does. Only direct reassignment of the exported binding itself is the actual restriction [raw/12-svelte-boundary-and-universal-reactivity.md].

## SSR-safety: don't put shared request-scoped state at module scope

This is a community-sourced best practice, not independently verified against an official SvelteKit doc page in this archive, treat it as strong convention rather than official mandate when you cite it [raw/14-svelte5-best-practices-openreplay.md, distillation section 14 item 6].

The concern: module-level `$state` in an SSR app (SvelteKit) is shared across every request the server handles, since the module is only evaluated once per server process, not once per request. If you put user-specific or request-specific state there, one user's data can leak into another user's response.

The recommended pattern is Svelte's context API (`setContext`/`getContext`), backed by a class with `$state` fields, instantiated fresh per request or per component tree:

```ts
// lib/theme.svelte.ts
import { getContext, setContext } from 'svelte';

class ThemeContext {
	current = $state('light');
	toggle() {
		this.current = this.current === 'light' ? 'dark' : 'light';
	}
}

const KEY = Symbol('theme');

export const setTheme = () => setContext(KEY, new ThemeContext());
export const getTheme = () => getContext<ThemeContext>(KEY);
```

Call `setTheme()` once near the root of the component tree (e.g. root layout) and `getTheme()` anywhere beneath it. This scopes the state per request in SSR and per component-tree instance on the client, while still getting full type safety and reactivity from the class fields.

## When to reach for this pattern vs. a plain module export

- **Plain module with accessor functions:** fine for state that's genuinely global and not request-sensitive (a client-only UI preference that isn't user-specific, a feature flag resolved once at build time).
- **Class + context API:** required whenever the state is per-user, per-request, or per-session in an SSR environment. Default to this for anything touching auth, user preferences fetched from a database, or per-request derived data.

## Gap flag

The exact mechanics of how the compiler's per-file get/set transform works, and whether there are additional escape hatches beyond the three above, come from the `$state` docs page's "Passing state across modules" section, which was captured via the archive's `$state` fetch but is terse on the compiler-internals explanation. Treat the "why" explanation above as accurate to what was archived, but don't extend it further without checking the source [raw/01-runes-overview-and-state.md, raw/12-svelte-boundary-and-universal-reactivity.md].
