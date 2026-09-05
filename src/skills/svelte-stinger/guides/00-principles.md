# Principles and first-move checklist

## First move: is this codebase runes mode or legacy mode

Before touching any `.svelte` file, work out which reactivity model you're dealing with. Svelte 5 supports both simultaneously, in the same project, sometimes in the same file tree, so guessing wrong wastes a review pass.

Check, in order:

1. **`package.json`**: is `svelte` pinned to `^5` or `^4`? If `^4`, you're not in runes mode at all, runes don't exist prior to Svelte 5 [raw/01-runes-overview-and-state.md].
2. **Inside the component**: does it use `$state`, `$derived`, `$effect`, or `$props()`? That's runes mode. Does it use top-level `let` with implicit reactivity, `$:` statements, or `export let`? That's legacy mode, even on a Svelte-5-pinned project [raw/06-migration-guide.md].
3. **A single project can mix both.** Components using the new syntax and components using the old syntax can compose together; Svelte 5 is backward-compatible by design, most upgrades are "completely seamless" at the dependency-bump level before any component code changes [raw/11-svelte5-release-blog.md]. Don't assume the whole app moved just because `package.json` says `^5`.
4. **`beforeUpdate`/`afterUpdate` are your tell for legacy-only code.** They're shimmed for backward compatibility but unavailable inside runes-mode components [raw/05-lifecycle-and-inspect.md, raw/06-migration-guide.md]. If you see them working, the component hasn't been migrated.

## Core philosophy

Runes replaced implicit, compiler-inferred reactivity with explicit, portable reactivity primitives. The Svelte team's own stated rationale: Svelte 4's `let`-is-reactive-at-the-top-level model forced a second reactivity model (stores) on any code refactored out of a component; `$:` conflated derived state and side effects and resisted refactoring because its dependencies were determined by static analysis at compile time [raw/06-migration-guide.md, raw/11-svelte5-release-blog.md]. Runes fix this by determining dependencies at runtime and working identically inside and outside components.

The practical consequence for you: reach for `$derived` before `$effect`, always. This shows up as the single most repeated piece of guidance across every source in this archive, official docs and community alike [raw/02-derived-and-effect.md, raw/13-runes-community-explainer-2026.md, raw/14-svelte5-best-practices-openreplay.md]. See `guides/01-runes-fundamentals.md` for the decision rule.

## Severity rubric for reviews

When reviewing a Svelte 5 diff or PR, classify findings:

- **Must-fix:** `$effect` used to sync state (the anti-pattern in `guides/01-runes-fundamentals.md`); `on:` directives or `export let` in a file that otherwise uses runes (mixed idiom within one component is a code smell, not a hard error, but should not ship); mutating a non-bindable prop.
- **Should-refactor:** module-level `$state` shared across an SSR app without a context-API boundary (leak risk between requests, see `guides/05-universal-reactivity-svelte-ts.md`); `$state` used where `$state.raw` would avoid needless proxy overhead on data that's only ever replaced wholesale.
- **Style:** legacy `beforeUpdate`/`afterUpdate` present in an otherwise-runes component (works if not runes-mode, but should migrate to `$effect.pre`/`$effect`); missing `$inspect.trace()` during an active debugging session (not a shipping concern).

## Scope boundary with sibling Stingers

This Stinger owns the Svelte 5 language and SvelteKit 2 mechanics: runes, snippets, the component model, load functions, form actions, remote functions, error boundaries. It does not own Tailwind CSS utility work, shadcn-svelte component internals, or applying the OSPRY design system to specific product surfaces. See the SKILL.md "Critical Directive" section for the current list of sibling skills and when to hand off.

## When research is thin, say so

Section 14 of `references/research/distilled-svelte5.md` lists explicit gaps: SvelteKit `load` details beyond `route` (params, fetch forwarding, setHeaders, parent, depends/invalidate), form-action progressive enhancement and redirects, remote-function `form`/`command`/`prerender` flavours, and the tail of the official migration guide. If a question lands in one of these gaps, say "gap: not covered in archive" and point the user to the live docs rather than guessing at behavior.
