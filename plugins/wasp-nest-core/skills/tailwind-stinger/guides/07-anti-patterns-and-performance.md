# Anti-patterns and performance

## Anti-pattern 1: premature `@apply`

The documented default hierarchy for handling repeated class combinations, in order of preference:

1. **Nothing.** A lot of apparent duplication is actually a single render inside a loop; there's no real duplication to solve.
2. **Multi-cursor editing**, for duplication localized to one file.
3. **A component or template partial**, for duplication across files. This is the primary recommended mechanism, not `@apply`. A component encapsulates both markup and styling; `@apply` only encapsulates styling and still leaves the HTML duplicated everywhere it's used.
4. **`@apply`, only for small, highly reusable primitives** (buttons, form controls) and only in templating languages without a real component system, where a partial "feels heavy-handed" for something as small as a button class.

[raw/08-arbitrary-values-and-custom-styles.md], [raw/12-utility-first-fundamentals-and-anti-patterns.md]

Explicit warning from the official docs: don't use `@apply` "just to make things look cleaner." Doing so throws away the actual advantages of utility-first CSS:

- You're back to inventing class names.
- You're back to jumping between files to change a style.
- Changes get scarier because the resulting CSS is global again.
- The CSS bundle grows instead of staying flat.

[raw/08-arbitrary-values-and-custom-styles.md]

In a Svelte 5 project specifically, this means: reach for a component (`Button.svelte` with `$props()`), not a `.btn { @apply ...; }` class, for anything reused more than once. `@apply` in a Svelte `<style>` block also requires a `@reference` import, which is one more thing to keep in sync with the token file; that's a second reason to prefer components here.

## Anti-pattern 2: copying Tailwind's internal utility CSS into hand-written CSS

When someone needs to replicate what a utility class does inside custom CSS (e.g. re-implementing `divide-y` by hand), the maintainer guidance is explicit: don't copy Tailwind's internal `--tw-*` implementation variables. Convert the repeated pattern into a component instead. If hand-written CSS genuinely needs to reuse a value, reference the public design-token variables (`--spacing-5`, `--color-gray-200`), not internal state variables that exist purely as utility-class plumbing. [raw/08-arbitrary-values-and-custom-styles.md]

## Anti-pattern 3: "utility soup" (unordered, unreadable class lists)

Not an official Tailwind Labs term, this is the community name for long, inconsistently-ordered class strings that are hard to scan or diff. [raw/12-utility-first-fundamentals-and-anti-patterns.md] The official mitigation is not "write fewer utility classes," it's two things done consistently:

1. Extract a component once a class combination repeats across files (see anti-pattern 1).
2. Install `prettier-plugin-tailwindcss` so ordering is automatic and non-negotiable, see `guides/06-class-ordering-and-tooling.md`.

A long class list that's consistently sorted is a feature of utility-first CSS, not a smell; an unsorted one is the actual problem.

## Anti-pattern 4: reaching for an arbitrary value that should be a token

Arbitrary values (`bg-[#1c1f26]`, `top-[117px]`) are explicitly framed as a pixel-perfect escape hatch, not a parallel design system. If the same arbitrary value shows up repeatedly across a codebase, that's a signal it belongs in `@theme` as a real token instead. See `guides/01-theme-and-tokens.md`. [raw/08-arbitrary-values-and-custom-styles.md], [raw/01-theme-directive.md]

## Performance: what's actually fast now, and what isn't automatically fast

The Oxide engine rewrite delivers real, benchmarked wins: official numbers are 3.78x faster full builds, 8.8x faster incremental builds with new CSS, and ~182x faster incremental builds with no new CSS (measured in microseconds), from the same Catalyst UI kit benchmark project. [raw/09-v4-release-notes-performance-features.md] Independent third-party benchmarks report a wider range (from roughly 3.8x up to 19x or 100x+ depending on project and metric); treat the official Catalyst numbers as the citable baseline and third-party numbers as illustrative, not guaranteed. [raw/10-oxide-engine-and-performance.md]

What this buys you architecturally: no PostCSS in the hot path, and fine-grained incremental caching keyed to the specific file that changed, meaning CSS compile time mostly stops being a bottleneck worth manually optimizing around. [raw/10-oxide-engine-and-performance.md]

What it does not automatically fix: bundle-level concerns are still yours to manage. Registered custom properties (`@property`) and `color-mix()`-based opacity utilities are new modern-CSS mechanisms the engine relies on, not something to hand-roll; don't reimplement opacity modifiers or gradient stops with manual CSS variables, use the utilities as shipped, they're already using the fast path. [raw/09-v4-release-notes-performance-features.md]
