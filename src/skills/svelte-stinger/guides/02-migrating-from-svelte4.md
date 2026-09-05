# Migrating from Svelte 4

Full side-by-side table lives in `references/migration-cheatsheet.md`. This guide covers the procedure and the parts that need human judgment.

## Procedure

1. **Bump dependencies first, migrate syntax second.** Svelte 5 is backward-compatible with Svelte 4 syntax; bumping `svelte` and `@sveltejs/vite-plugin-svelte` to their Svelte-5 majors is, in most cases, "completely seamless" on its own, with zero component changes required immediately [raw/11-svelte5-release-blog.md]. Don't block the dependency bump on a full rewrite.
2. **If starting from Svelte 3, migrate to Svelte 4 first.** The Svelte 5 migration guide assumes a Svelte 4 starting point [raw/11-svelte5-release-blog.md].
3. **Run the automated migration script:** `npx sv migrate svelte-5`. It converts, project-wide: `let` → `$state`, `on:click` → `onclick`, slot creation → render tags (`<slot>` → `{@render children()}`), slot usage → snippets, and obvious `new Component(...)` → `mount(Component, ...)` calls [raw/06-migration-guide.md]. For one component at a time, use the "Migrate Component to Svelte 5 Syntax" command in VS Code's Svelte extension, or the Playground's Migrate button [raw/06-migration-guide.md, raw/11-svelte5-release-blog.md].
4. **Hand-review what the script flags or skips.** See "What needs manual review" below.
5. **Don't wait on your component libraries.** shadcn-svelte, Skeleton, Flowbite Svelte, and similar don't need to have migrated to Svelte 5 themselves before your app can upgrade [raw/11-svelte5-release-blog.md].

## What needs manual review

### Ambiguous `$:` statements → `run()` shim

When the migration script can't determine whether a `$:` statement is a pure derivation or has side effects, it wraps the statement in a `run()` function imported from `svelte/legacy` instead of guessing. `run()` deliberately mimics `$:`'s old behavior (runs once on the server, then as `$effect.pre` on the client) as a safe stopgap, it is not the Svelte 5 idiomatic end state [raw/06-migration-guide.md]. Every `run()` call the script leaves behind is a to-do: read the statement, classify it as producing a value (convert to `$derived`) or performing an action (convert to `$effect`), and remove the `run()` wrapper.

### `createEventDispatcher` is never auto-converted

The script leaves `createEventDispatcher` calls alone because converting an event-emitting component to callback props could break every consumer of that component, and the script can't verify all call sites [raw/06-migration-guide.md]. Convert by hand:

```js
// Svelte 4
const dispatch = createEventDispatcher();
function inflate(power) { dispatch('inflate', power); }
```

```js
// Svelte 5
let { inflate } = $props(); // parent passes a callback prop directly
```

Update every call site that listened with `on:inflate={...}` to instead pass `inflate={...}` as a prop.

### `beforeUpdate`/`afterUpdate` are never auto-converted

Same reasoning: the script can't infer whether the callback body is measuring the DOM, performing a derivation, or something else entirely [raw/06-migration-guide.md]. The canonical replacement pattern (a chat window that autoscrolls only when new messages arrive, not on unrelated state changes) is worked through in `guides/04-component-lifecycle.md`.

### Bindable props need an explicit opt-in

In Svelte 4, every `export let` was implicitly bindable, any parent could `bind:` to any prop. In runes mode, props are not bindable by default; add `$bindable()` to the specific props that need two-way flow [raw/03-props-bindable-host.md, distillation section 3]. This is a deliberate tightening, review every `bind:someProp` usage in the parent and confirm the corresponding child prop is declared `$bindable()`.

## Verify, don't assume, after migration

- Grep for leftover `on:` directives and `export let` in files the script touched, mixed idiom within a single component is a smell even if it technically compiles under legacy-mode fallback.
- Confirm any component using `beforeUpdate`/`afterUpdate` has genuinely been converted, not left running in legacy mode by accident, since those hooks silently stop working once a component adopts runes [raw/05-lifecycle-and-inspect.md].
- Re-run the test suite; see `guides/07-testing-and-performance.md` for the runes-aware testing setup, since Vitest test files need `.svelte.` in the filename to use runes themselves.

## Gap flag

The tail of the official migration guide (beyond the `run()` shim explanation) covers `bind:` default-value semantics, hydration-mismatch handling for `src`/`{@html}` (no longer auto-repaired; dev-mode warns instead), and comment-preservation requirements for hydration. This archive's fetch was truncated before capturing that section in full; some of it was recovered secondhand from search-result highlights and is flagged as thinner sourcing in `references/research/raw/06-migration-guide.md`. Treat those specific claims as needing a fresh docs check before you cite them as settled.
