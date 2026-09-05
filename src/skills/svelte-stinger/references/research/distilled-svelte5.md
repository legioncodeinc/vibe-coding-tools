# Svelte 5 distilled research

Dense, cited synthesis of the raw archive in `raw/`. Every claim below traces to a raw file. Conflicts and gaps are called out explicitly rather than smoothed over. Research window: Svelte 5 stable release (Oct 2024) through 2026-08 community sources; official docs are undated but reflect the current svelte.dev/kit.svelte.dev state as of fetch.

## 1. The seven runes: field reference

| Rune | Purpose | Key facts |
|---|---|---|
| `$state(initial)` | Declares reactive state | Arrays/plain objects become deeply reactive proxies; mutating a nested property triggers updates without reassignment [raw/01-runes-overview-and-state.md]. Destructuring a reactive value breaks reactivity for the destructured binding (evaluated once, like normal JS) [raw/01-runes-overview-and-state.md]. |
| `$state.raw(initial)` | Shallow, non-deep state | Cannot be mutated, only reassigned; mutating has no effect. Reduces proxy overhead for large data you only ever replace [raw/01-runes-overview-and-state.md]. |
| `$state.snapshot(proxy)` | Static, non-proxy copy | For passing to external APIs (`structuredClone`) that choke on Proxies. Uses `toJSON()` if present [raw/01-runes-overview-and-state.md]. |
| `$state.eager(value)` | Forces immediate UI update | For state read inside an `await` expression, where updates otherwise wait for the async work to resolve; use sparingly, only for user-action feedback [raw/01-runes-overview-and-state.md]. |
| `$derived(expression)` | Computed value | Expression must be free of side effects; lazy (pull-based) and memoized; skips downstream updates if the new value is referentially identical to the old [raw/02-derived-and-effect.md]. Overridable by reassignment since Svelte 5.25 (not `const`) [raw/02-derived-and-effect.md]. |
| `$derived.by(fn)` | Computed value, multi-statement | Equivalent to `$derived(fn())`; use when the computation doesn't fit a single expression [raw/02-derived-and-effect.md]. |
| `$effect(fn)` | Side effect on dependency change | Browser-only, never runs during SSR; runs after mount, then in a microtask after state changes, batched; tracks only synchronously-read reactive values; optional teardown function return [raw/02-derived-and-effect.md]. Official guidance: escape hatch, not a default tool; never use to sync one state to another (use `$derived`/`$derived.by` instead) [raw/02-derived-and-effect.md]. |
| `$effect.pre(fn)` | Pre-DOM-update effect | Same tracking semantics as `$effect`, but runs before the DOM updates; canonical use: autoscroll measurement via `tick()` [raw/02-derived-and-effect.md]. Also the runes-mode replacement for `beforeUpdate` [raw/05-lifecycle-and-inspect.md]. |
| `$effect.tracking()` | Introspection | Returns whether the current code runs inside a tracking context (effect/template) [raw/02-derived-and-effect.md]. |
| `$effect.pending()` | Async-await introspection | Count of pending promises in the current boundary (not child boundaries), tied to the experimental `await`-in-components feature [raw/02-derived-and-effect.md]. |
| `$effect.root(fn)` | Manual non-auto-cleanup scope | Creates effects outside component init; returns a cleanup function you call manually [raw/02-derived-and-effect.md]. |
| `$props()` | Declares component inputs | Destructure with fallback values (`= 42`), renaming (`{ class: klass }`), rest (`...rest`); fallback values are not made reactive proxies [raw/03-props-bindable-host.md]. Don't mutate props unless bindable; mutating a non-reactive-proxy prop is a no-op, mutating a reactive-proxy prop works but warns (`ownership_invalid_mutation`) [raw/03-props-bindable-host.md]. |
| `$props.id()` | Unique per-instance ID | Added 5.20.0; stable across server/client hydration; for `for`/`aria-labelledby` linking [raw/03-props-bindable-host.md]. |
| `$bindable(fallback?)` | Marks a prop as two-way bindable | Enables `bind:propName` from the parent; without it, mutating a prop only warns, doesn't formally support two-way flow [raw/03-props-bindable-host.md]. |
| `$host()` | Access custom-element host | Only valid when compiling with `<svelte:options customElement="...">`; used to dispatch `CustomEvent`s [raw/03-props-bindable-host.md]. |
| `$inspect(...)` | Dev-only reactive console.log | No-op in production; re-fires on change of any argument, tracks deeply [raw/05-lifecycle-and-inspect.md]. |
| `$inspect(...).with(fn)` | Custom inspect callback | `fn(type, ...values)` where `type` is `"init"`/`"update"`, replaces default `console.log` [raw/05-lifecycle-and-inspect.md]. |
| `$inspect.trace(label?)` | Effect/derived re-run tracing | Must be first statement in the function body; added 5.14; prints which reactive state caused a re-run [raw/05-lifecycle-and-inspect.md]. |

## 2. When NOT to use $effect (explicit anti-pattern)

Official guidance, restated consistently across sources: `$effect` is an escape hatch for things like third-party library integration, canvas/DOM work, analytics, not a tool for keeping state in sync [raw/02-derived-and-effect.md, raw/13-runes-community-explainer-2026.md, raw/14-svelte5-best-practices-openreplay.md].

- **Anti-pattern:** `let doubled = $state(); $effect(() => { doubled = count * 2; });` → **Fix:** `let doubled = $derived(count * 2);` [raw/02-derived-and-effect.md, raw/13, raw/14]
- **Anti-pattern:** two-way effect-linked inputs (e.g. "money spent"/"money left" each written by an effect watching the other) → **Fix:** derive one from the other and use `oninput` callbacks or function bindings (`bind:value={() => left, updateLeft}`) [raw/02-derived-and-effect.md]
- **If you must** write `$state` inside an effect and hit an infinite loop from reading and writing the same state, wrap the read in `untrack` (imported from `svelte`) [raw/02-derived-and-effect.md, raw/13-runes-community-explainer-2026.md]
- Gut-check heuristic from community sources: "if your effect body ends in an assignment to another `$state`, you almost certainly want `$derived` instead" [raw/13-runes-community-explainer-2026.md]

## 3. Svelte 4 → 5 migration map

| Svelte 4 | Svelte 5 | Notes |
|---|---|---|
| `let x = 0` (implicitly reactive top-level) | `let x = $state(0)` | Reactivity explicit now works outside component top level too (e.g. `.svelte.js`) [raw/06-migration-guide.md] |
| `$: double = count * 2` | `let double = $derived(count * 2)` | [raw/06-migration-guide.md] |
| `$: { sideEffect(); }` | `$effect(() => { sideEffect(); })` | Timing differs: `$:` ran once per tick before render; `$effect` runs after mount and in a microtask after changes [raw/06-migration-guide.md] |
| `export let optional = 'x'; export let required;` | `let { optional = 'x', required } = $props();` | [raw/06-migration-guide.md] |
| `export { klass as class }` | `let { class: klass } = $props();` | [raw/06-migration-guide.md] |
| `$$restProps` | `let { foo, bar, ...rest } = $props();` | [raw/06-migration-guide.md] |
| `$$props` | `let props = $props();` (don't destructure) | [raw/06-migration-guide.md] |
| `on:click={handler}` | `onclick={handler}` | Event attributes, case-sensitive, no colon [raw/04-snippets-and-events.md, raw/06-migration-guide.md] |
| `createEventDispatcher()` + `dispatch('inflate', power)` | callback props: `let { inflate } = $props(); inflate(power);` | `createEventDispatcher` is deprecated in Svelte 5 [raw/06-migration-guide.md] |
| `<button on:click>` (event forwarding) | `let { onclick } = $props(); <button {onclick}>` | Callback props can be spread instead of forwarded one by one [raw/06-migration-guide.md] |
| `on:click|once|preventDefault={handler}` | wrapper functions: `onclick={once(preventDefault(handler))}` | Modifiers removed except `capture` (→ `onclickcapture`), `passive`/`nonpassive` (need an action) [raw/06-migration-guide.md] |
| `<button on:click={one} on:click={two}>` | `onclick={(e) => { one(e); two(e); }}` | Duplicate attributes/handlers are disallowed in Svelte 5 [raw/06-migration-guide.md] |
| `<slot />` | `{@render children()}` via `let { children } = $props();` | Slots deprecated (still work); snippets are the replacement [raw/04-snippets-and-events.md, raw/06-migration-guide.md] |
| `<slot name="header" />` | `let { header } = $props(); {@render header()}` | Named slots → named snippet props [raw/06-migration-guide.md] |
| `<List let:item>` passing data up | snippet params: `{#snippet item(text)}...{/snippet}` | [raw/06-migration-guide.md] |
| `beforeUpdate(fn)` | `$effect.pre(() => { ... })` | Shimmed for compatibility but unavailable in runes-mode components [raw/05-lifecycle-and-inspect.md, raw/06-migration-guide.md] |
| `afterUpdate(fn)` | `$effect(() => { ... })` | Same as above [raw/05-lifecycle-and-inspect.md] |
| `new Component(...)` | `mount(Component, options)` | Migration script converts this automatically [raw/06-migration-guide.md] |
| bindable prop, implicitly (every `export let` was bindable) | `$bindable()` explicitly required | Runes-mode props are not bindable by default [raw/06-migration-guide.md: this specific line is from the same page but appeared in a search-highlight, not the full raw fetch; see Section 8 gap note] |

**Migration script:** `npx sv migrate svelte-5` automates: dependency bumps, `let`→`$state`, `on:click`→`onclick`, slot creation→render tags, slot usage→snippets, `new Component()`→`mount()`. Manual cleanup still needed for: `$:` statements the script can't classify (converted to a `run()` shim from `svelte/legacy` that behaves like `$:`, server-once + `$effect.pre`-on-client, rather than a clean `$derived`/`$effect` split), `createEventDispatcher` usage (not converted, too risky), and `beforeUpdate`/`afterUpdate` (not converted, intent is ambiguous) [raw/06-migration-guide.md].

## 4. Snippets and render tags (replacing slots)

- Declared with `{#snippet name(params)}...{/snippet}`, rendered with `{@render name(args)}`; parameters support defaults and destructuring but not rest params [raw/04-snippets-and-events.md]
- Scope: visible to siblings and their children in the same lexical scope; a snippet nested inside another is not visible outside it; snippets can reference themselves and each other recursively [raw/04-snippets-and-events.md]
- Passed to components either **explicitly** as named props (`<Table {header} {row} />`) or **implicitly** by declaring them inside the component's open/close tags; non-snippet content inside a component's tags implicitly becomes the `children` prop [raw/04-snippets-and-events.md]
- Cannot have a prop literally named `children` if the component also receives tag content [raw/04-snippets-and-events.md]
- Optional snippet props: `{@render children?.()}` or an `{#if children}...{:else}fallback{/if}` [raw/04-snippets-and-events.md]
- Typed via the `Snippet` interface from `'svelte'`; `Snippet<[T]>` for a single-parameter snippet, tighten with a component generic (`<script lang="ts" generics="T">`) [raw/04-snippets-and-events.md]
- Exportable from `<script module>` since Svelte 5.5.0, provided they don't reference non-module `<script>` declarations [raw/04-snippets-and-events.md]
- `createRawSnippet` exists for advanced/programmatic snippet creation [raw/04-snippets-and-events.md]

## 5. Event attributes (replacing on: directives)

- `onclick={handler}` replaces `on:click={handler}`; case-sensitive (`onClick` listens for a custom `Click` event, different from `click`) [raw/04-snippets-and-events.md]
- Shorthand (`{onclick}`) and spread (`{...props}`) both work since handlers are just attributes [raw/04-snippets-and-events.md]
- Event attributes always fire after binding-driven events (`oninput` fires after `bind:value` updates) [raw/04-snippets-and-events.md]
- `ontouchstart`/`ontouchmove` are passive by default for scroll performance; use the `on` function from `svelte/events` (inside an action) for the rare case you need to prevent those defaults [raw/04-snippets-and-events.md]
- **Event delegation:** a fixed list of events (`click`, `input`, `keydown`, `pointerdown`, etc., full list in raw/04) are delegated through a single root listener. Gotchas: manually-dispatched events need `{ bubbles: true }` to reach the root; don't call `stopPropagation()` via raw `addEventListener`, prefer the `on` function from `svelte/events` for correct ordering [raw/04-snippets-and-events.md]

## 6. Component lifecycle in runes mode

Two-part lifecycle only: creation and destruction. No "before update"/"after update" hook because the smallest reactive unit is the effect, not the component [raw/05-lifecycle-and-inspect.md].

- `onMount(fn)`: runs once mounted to DOM; browser-only (no SSR run); returned function runs on unmount, but **only if `fn` is synchronous** (an `async` `onMount` callback returns a `Promise`, so no cleanup registration happens) [raw/05-lifecycle-and-inspect.md]
- `onDestroy(fn)`: runs immediately before unmount; the only one of the four classic hooks that also runs in SSR [raw/05-lifecycle-and-inspect.md]
- `tick()`: returns a Promise resolving after pending state changes apply (or next microtask if none); used inside `$effect.pre` to act after the DOM catches up [raw/05-lifecycle-and-inspect.md]
- `beforeUpdate`/`afterUpdate`: shimmed for backward compat but **not available in runes-mode components**; canonical replacements are `$effect.pre` and `$effect` respectively, because they track only the specific state referenced instead of firing on every update [raw/05-lifecycle-and-inspect.md]

## 7. Universal reactivity: .svelte.js / .svelte.ts

- Behave like normal `.js`/`.ts` modules except runes are usable; enables reusable reactive logic and cross-module shared state [raw/12-svelte-boundary-and-universal-reactivity.md]
- **You cannot export a directly-reassigned `$state` binding.** The compiler transforms in-file references to `$state` into get/set calls; an importing file doesn't get the same transform, so external reassignment breaks. Workarounds: don't reassign the exported binding directly (mutate instead), wrap it in an object/getter-setter pair, or export a class with the state as a field [raw/12-svelte-boundary-and-universal-reactivity.md]
- Community-documented accessor pattern: export `getCount()`/`increment()` functions instead of the raw `count` binding [raw/13-runes-community-explainer-2026.md]
- Class instances are not proxied by `$state`; use `$state` on individual class fields (public or private) instead, wrapping `new Foo()` in `$state(...)` has no effect [raw/01-runes-overview-and-state.md, raw/06-migration-guide.md: the migration guide's `foo.value` class example was captured via search highlight, not full fetch; treat the exact migration-guide code sample as thin]
- Method `this` binding gotcha: `<button onclick={todo.reset}>` loses `this`; use an inline arrow (`onclick={() => todo.reset()}`) or declare the method as an arrow class field [raw/01-runes-overview-and-state.md]
- SSR-safety pattern (community, not from official docs): don't put shared `$state` at module scope in an SSR app (SvelteKit) since it's shared across every request on the server and can leak between users; use Svelte's context API (`setContext`/`getContext`) with a class holding `$state` fields instead, scoped per request [raw/14-svelte5-best-practices-openreplay.md: **this is a community best practice, not verified against official SvelteKit docs in this archive; flagged as sourced from a single secondary source**]

## 8. SvelteKit 2: load functions

| Kind | File | Runs | Notes |
|---|---|---|---|
| Universal load | `+page.js` / `+layout.js` | Server (SSR + hydration) then browser only, unless `ssr = false` (browser-only always) | Can return non-serializable values (component constructors, custom classes) [raw/08-sveltekit-load.md] |
| Server load | `+page.server.js` / `+layout.server.js` | Server only, always | Must return `devalue`-serializable data (JSON + `BigInt`/`Date`/`Map`/`Set`/`RegExp`/cyclical refs); can include promises, which stream [raw/08-sveltekit-load.md] |

- If a route has both, server `load` runs first and its return value becomes the `data` property of the universal `load`'s argument [raw/08-sveltekit-load.md]
- Data access: `let { data } = $props()` in `+page.svelte` (typed via generated `PageProps`, added 2.16.0; earlier versions type `data` individually) [raw/08-sveltekit-load.md]
- Layout data cascades to child layouts and the page; last `load` to return a given key wins on key collision [raw/08-sveltekit-load.md]
- `page.data` from `$app/state` (added SvelteKit 2.12) lets any layout read the current page's (or a child layout's) data, e.g. for `<svelte:head><title>{page.data.title}</title></svelte:head>`; pre-2.12 or Svelte-4 code uses the `$app/stores` `page` store instead [raw/08-sveltekit-load.md]
- Both load kinds receive `params`, `route`, `url`, plus `fetch`, `setHeaders`, `parent`, `depends`, `untrack`; server load additionally gets `clientAddress`, `cookies`, `locals`, `platform`, `request` [raw/08-sveltekit-load.md]
- **Gap:** this archive's fetch of the load-functions page was truncated mid-`route`/`params` example; `params` details beyond the type shape, `fetch` credential-forwarding semantics, `setHeaders`, `parent()`, `depends`/`invalidate`, and `load`-triggered redirects/errors are not covered here [raw/08-sveltekit-load.md]

## 9. SvelteKit 2: form actions

- `+page.server.js` exports `actions`; a plain `<form method="POST">` works without JS; actions always use POST (GET must be side-effect-free) [raw/09-sveltekit-form-actions.md]
- **Default action:** `export const actions = { default: async (event) => {...} }` [raw/09-sveltekit-form-actions.md]
- **Named actions:** `export const actions = { login: ..., register: ... }`, invoked via `action="?/register"`; `formaction="?/register"` on a button posts to a different named action than the parent form [raw/09-sveltekit-form-actions.md]
- Default and named actions cannot coexist on the same page (a persisted `?/name` query param after a non-redirected named-action POST would route a later default POST through the stale named action) [raw/09-sveltekit-form-actions.md]
- Action return value is available via the page's `form` prop (and app-wide via `page.form` until next update); read `request.formData()` inside the action [raw/09-sveltekit-form-actions.md]
- `PageProps` (bundling `data` + `form`) added SvelteKit 2.16.0; earlier versions or Svelte 4 type/declare them individually [raw/09-sveltekit-form-actions.md]
- `cookies.set()` defaults: `httpOnly: true`, `secure: true` (except dev, where `secure` defaults `false`), `path: '/'` [raw/09-sveltekit-form-actions.md]
- **Validation errors:** use the `fail(status, data)` helper (typically 400/422); status surfaces via `page.status`, data via `form` [raw/09-sveltekit-form-actions.md]
- **Gap:** the raw fetch was cut off inside the `fail()` login-action worked example. Progressive enhancement (`use:enhance`), redirects thrown from actions, and the `error`/`redirect` SvelteKit helpers as used inside actions are **not covered** in this archive [raw/09-sveltekit-form-actions.md]

## 10. SvelteKit 2: remote functions (experimental)

Available since SvelteKit 2.27; explicitly experimental (not covered by semver, "likely to contain bugs"). Requires opt-in flags: `kit.experimental.remoteFunctions: true` and `compilerOptions.experimental.async: true` in `svelte.config.js` [raw/10-sveltekit-remote-functions.md].

- Declared in `.remote.js`/`.remote.ts` files (anywhere in `src` except `src/lib/server`); always execute server-side even when called from the client, via a generated fetch-wrapper endpoint [raw/10-sveltekit-remote-functions.md]
- **`query(fn)`**: reads dynamic server data; behaves like a Promise (`await getPosts()`) or exposes `.loading`/`.error`/`.current`; unresolved/errored queries are caught by the nearest `<svelte:boundary>`; cannot be used on a fully-prerendered page [raw/10-sveltekit-remote-functions.md]
- Query args are validated with a Standard Schema library (Zod/Valibot shown); both args and return values serialize via `devalue`; object/map/set **arguments** (not return values) are key-sorted for cache-key stability regardless of property order [raw/10-sveltekit-remote-functions.md]
- **Deduplication:** identical query invocations share a server-side request-scoped cache and a client-side single instance (`getPosts() === getPosts()`); cache persists while the query is actively rendered/awaited/referenced [raw/10-sveltekit-remote-functions.md]
- `.refresh()` re-fetches a query on demand [raw/10-sveltekit-remote-functions.md]
- **`query.batch(fn)`**: batches same-macrotask calls to solve the N+1 problem; server callback gets all args as an array and must return an `(input, index) => output` resolver [raw/10-sveltekit-remote-functions.md]
- **`query.live(fn)`**: real-time data via an async generator; SSR takes the first yielded value and serializes it for hydration; client keeps one shared connection per active use, disconnects when unused, auto-reconnects with backoff; exposes `.connected`/`.reconnect()` instead of `.refresh()`; instances are themselves async-iterable for `for await` consumption; **must not** be cached in a service worker unless the response has `Cache-Control: no-store` [raw/10-sveltekit-remote-functions.md]
- **Gap:** the raw fetch was cut off at the `## form` heading. The `form` and `command` remote-function flavours, and the `prerender` flavour, are **not documented** in this archive [raw/10-sveltekit-remote-functions.md]

## 11. <svelte:boundary> and error/pending UI

Added Svelte 5.3.0. `<svelte:boundary onerror={handler}>` walls off part of a tree to provide `pending` UI while contained `await` expressions first resolve, and/or `failed`/`onerror` handling for render-time or effect errors [raw/12-svelte-boundary-and-universal-reactivity.md].

- `pending` snippet: shown only on the boundary's first creation until all contained `await`s resolve; not shown again for later async updates (use `$effect.pending()` for that) [raw/12-svelte-boundary-and-universal-reactivity.md]
- `failed` snippet: receives `(error, reset)`; `reset()` recreates the boundary's contents [raw/12-svelte-boundary-and-universal-reactivity.md]
- `onerror(error, reset)`: for reporting or lifting error state out of the boundary into surrounding component state; errors in `onerror` itself bubble to a parent boundary if present [raw/12-svelte-boundary-and-universal-reactivity.md]
- Errors from event handlers, `setTimeout`, or other non-render async work are **not** caught by boundaries [raw/12-svelte-boundary-and-universal-reactivity.md]
- Server-side: boundaries have no effect by default (a render-time error fails the whole render); since Svelte 5.51, `render(..., { transformError })` lets a `failed`-snippet boundary render on the server too. Frameworks like SvelteKit are expected to wire this via a hook rather than exposing `render()` directly; as of this archive's fetch, SvelteKit's own hook integration is described as forthcoming, not yet confirmed shipped [raw/12-svelte-boundary-and-universal-reactivity.md]

## 12. Testing Svelte 5

- Svelte is testing-framework agnostic; Vitest is the team's recommendation for Vite/SvelteKit projects [raw/07-testing.md]
- Files named `*.svelte.test.js` (containing `.svelte`) can use runes directly inside test bodies, since Vitest processes them like source files [raw/07-testing.md]
- Effects under test must be wrapped in `$effect.root(() => {...})`, with manual `flushSync()` calls to synchronously resolve pending microtask-scheduled effects [raw/07-testing.md]
- Low-level component testing uses `mount`/`unmount`/`flushSync` from `svelte` directly against a jsdom `document.body`; described in the docs as workable but "brittle" since it's coupled to exact DOM structure [raw/07-testing.md]
- **`@testing-library/svelte`** (community, supports Svelte 3/4/5): setup via the `svelteTesting` Vite plugin (auto-cleanup + browser-condition resolution, both individually toggleable) plus `@testing-library/jest-dom`; Jest setup needs `svelte-jester@5+` with an adjusted transform regex and a `transformIgnorePatterns` entry when targeting Svelte 5 [raw/07-testing.md]
- **`vitest-browser-svelte`** (community): renders components in real-browser Vitest Browser Mode rather than jsdom; API (`render`, `.locator`, `.rerender()`, `.unmount()`) auto-retries assertions against rerendered elements; supports snippet testing via wrapper components (simple case) or `createRawSnippet` (when you need to assert on snippet arguments) [raw/07-testing.md]
- Svelte docs also mention Storybook (via Vitest browser mode + Testing Library's play function) and Playwright (framework-unaware end-to-end) as supported testing layers, without further detail archived here [raw/07-testing.md]

## 13. Performance patterns and common mistakes (community-sourced, cross-checked against official anti-effect guidance)

- Prefer `$derived`/`$derived.by` over `$effect` for any computed value; this is called out as **the single most common Svelte 5 mistake** across two independent community sources plus the official docs [raw/02-derived-and-effect.md, raw/13-runes-community-explainer-2026.md, raw/14-svelte5-best-practices-openreplay.md]
- Use `$state.raw` for data you replace wholesale (e.g. freshly fetched API payloads you never mutate in place) to skip proxy overhead; use full `$state` only when you need fine-grained nested mutation [raw/14-svelte5-best-practices-openreplay.md]
- Derive prop-dependent values with `$derived`, not a one-time plain assignment, so they stay in sync as props change [raw/14-svelte5-best-practices-openreplay.md]
- `$derived` is lazy/pull-based and referentially-memoized: an unread derived never recomputes, and a recomputed-but-identical value doesn't propagate to dependents [raw/02-derived-and-effect.md, raw/13-runes-community-explainer-2026.md]
- Keyed `{#each}` blocks (key by stable ID, never array index) avoid DOM-recycling bugs, a general Svelte-list-rendering best practice restated for Svelte 5 by a community source; **not independently verified against an official `{#each}` doc page in this archive** [raw/14-svelte5-best-practices-openreplay.md]
- `$inspect.trace()` is recommended for pinpointing which dependency triggered an effect/derived re-run [raw/05-lifecycle-and-inspect.md, raw/14-svelte5-best-practices-openreplay.md]

## 14. Conflicts and gaps (explicit)

**No direct factual conflicts were found between sources archived in this collection.** Community sources (raw/13, raw/14) consistently restate and cite the same official-docs anti-`$effect` guidance found in raw/02; no contradiction surfaced.

**Gaps, called out rather than guessed at:**

1. **SvelteKit `load` details beyond `route`:** `params` object shape/usage, `fetch` forwarding semantics, `setHeaders`, `parent()`, `depends`/`invalidate()`, and `load`-triggered redirects/errors are not in this archive (raw/08 fetch truncated). Any guide content on these topics must either be sourced from a follow-up fetch or explicitly marked unverified.
2. **SvelteKit form actions:** progressive enhancement (`use:enhance`), action-triggered redirects, and the `error`/`redirect` helpers are not in this archive (raw/09 fetch truncated at the `fail()` example).
3. **SvelteKit remote functions:** the `form`, `command`, and `prerender` flavours are entirely undocumented in this archive (raw/10 fetch cut off at the `## form` heading, before any body content).
4. **Migration guide tail:** the raw/06 fetch was truncated inside the `run()` shim explanation; anything the official guide covers after that point (further legacy-mode caveats, `bind:` default-value behavior, hydration-mismatch handling, comment-preservation requirements for hydration) is only partially represented, some of it recovered secondhand via search-result highlights in raw/06's sourcing pass and flagged inline there as thinner than a full fetch.
5. **`{@attach}` (attachments):** referenced once by a community source (raw/14) as an alternative to `$effect` for DOM-level integrations, but never independently documented in this archive. Do not treat `{@attach}` claims as grounded until a dedicated fetch of its docs page is archived.
6. **SSR module-state-leak guidance (context API over module `$state`):** sourced from a single community blog (raw/14), not cross-verified against an official SvelteKit doc page in this archive. Treat as a strong community convention, not an official mandate, when citing it in guides.
7. **`<svelte:boundary>` server-side `transformError` + SvelteKit's `handleError` hook integration:** as of the raw/12 fetch, the docs describe SvelteKit's hook support as forthcoming rather than confirmed shipped. Guides should not assert this integration exists without re-verifying against current SvelteKit release notes.
8. **Performance benchmarks:** no source in this archive contains hard numbers (bundle size deltas, render-time benchmarks) comparing Svelte 5 runes mode to Svelte 4. Community source raw/13 states "Performance is similar [to Svelte 4]; the compiler still produces efficient JavaScript, the main difference is what you write, not what the browser runs" as a qualitative claim only, not a benchmark. Do not cite specific performance numbers for Svelte 5 without new research.
