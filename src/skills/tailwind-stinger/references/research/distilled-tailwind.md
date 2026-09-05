# Distilled research: Tailwind CSS v4

Dense, cited synthesis of the raw archive in `raw/`. Every claim carries a citation to the raw file it came from. Where sources conflict, both readings are stated with the preferred official one flagged. Where the archive is thin, that gap is stated explicitly rather than smoothed over.

## 1. The v4 mental model

| Claim | Detail | Citation |
| --- | --- | --- |
| Config paradigm shift | v4 default is CSS-first config via `@theme` in a CSS file; `tailwind.config.js` is no longer auto-detected (still loadable explicitly via `@config`) | [raw/02-v3-to-v4-upgrade-guide.md], [raw/09-v4-release-notes-performance-features.md] |
| Import syntax | `@tailwind base/components/utilities;` (v3) replaced by a single `@import "tailwindcss";` (v4) | [raw/02-v3-to-v4-upgrade-guide.md] |
| Engine | Ground-up rewrite ("Oxide"), Rust-powered parts + Lightning CSS, single dependency | [raw/10-oxide-engine-and-performance.md] |
| Browser floor | Safari 16.4+, Chrome 111+, Firefox 128+; depends on `@property` and `color-mix()`; no graceful degradation below floor | [raw/02-v3-to-v4-upgrade-guide.md], [raw/13-v3-to-v4-migration-community-guide.md] |
| Zero-config content detection | Template files auto-discovered; `.gitignore`'d paths and binary extensions auto-excluded; `@source` adds explicit paths | [raw/09-v4-release-notes-performance-features.md] |

## 2. @theme directive and design tokens

| Claim | Detail | Citation |
| --- | --- | --- |
| What `@theme` does | Defines CSS variables that also instruct Tailwind to generate new utility classes; must be top-level (not nested) | [raw/01-theme-directive.md] |
| `@theme` vs `:root` | Use `@theme` when a token should generate a utility class; use `:root` for a variable that shouldn't | [raw/01-theme-directive.md] |
| Namespace-to-utility mapping | Full table of 19 namespaces (`--color-*`, `--font-*`, `--text-*`, `--spacing-*`, `--breakpoint-*`, `--container-*`, `--radius-*`, `--shadow-*`, `--ease-*`, `--animate-*`, etc.) each mapping to specific utility/variant families | [raw/01-theme-directive.md], [raw/07-functions-and-directives.md] |
| Extending vs overriding vs resetting | Extend: add new var. Override: redefine an existing name. Reset one namespace: `--color-*: initial;` then redefine. Reset everything: `--*: initial;` | [raw/01-theme-directive.md] |
| `@theme inline` | Use when a theme variable references another variable (e.g. a Next/SvelteKit font variable), so the generated utility inlines the resolved value instead of a variable reference that can break in nested-scope resolution | [raw/01-theme-directive.md] |
| `@theme static` | Forces generation of all CSS variables even if unused (default only generates used ones) | [raw/01-theme-directive.md] |
| Animation keyframes | Define `@keyframes` inside `@theme` next to the `--animate-*` variable to bundle them; define outside `@theme` if they must always ship regardless of usage | [raw/01-theme-directive.md] |
| Sharing tokens across projects | Theme variables are just CSS, so a shared `theme.css` can be imported per-project or published as an npm package | [raw/01-theme-directive.md] |
| Generated CSS variables | All theme variables compile to real `:root` custom properties usable in arbitrary values, inline styles, or JS via `getComputedStyle` | [raw/01-theme-directive.md] |

## 3. Directives reference (complete set)

| Directive | Purpose | v3 compat only? | Citation |
| --- | --- | --- | --- |
| `@import "tailwindcss"` | Import Tailwind (replaces `@tailwind` trio) | No, v4 standard | [raw/02-v3-to-v4-upgrade-guide.md] |
| `@theme` | Design tokens → utilities/variants | No | [raw/01-theme-directive.md], [raw/07-functions-and-directives.md] |
| `@source` | Add source files not auto-detected | No | [raw/07-functions-and-directives.md] |
| `@utility` | Register custom utility (static, complex, or functional with `-*`) | No, replaces `@layer utilities`/`@layer components` hijacking from v3 | [raw/02-v3-to-v4-upgrade-guide.md], [raw/07-functions-and-directives.md] |
| `@variant` | Apply a variant inside custom CSS | No | [raw/07-functions-and-directives.md], [raw/08-arbitrary-values-and-custom-styles.md] |
| `@custom-variant` | Define a new named variant, shorthand or block+`@slot` form | No | [raw/07-functions-and-directives.md], [raw/05-dark-mode-custom-variant.md] |
| `@apply` | Inline utilities into custom CSS | No, but usage discipline strongly recommended (see §8) | [raw/07-functions-and-directives.md] |
| `@reference` | Import theme/utilities/variants into a scoped stylesheet (Vue/Svelte `<style>`, CSS modules) without duplicating output CSS | No | [raw/07-functions-and-directives.md], [raw/02-v3-to-v4-upgrade-guide.md] |
| `@config` | Load a legacy JS config file explicitly | Yes, compat only | [raw/07-functions-and-directives.md] |
| `@plugin` | Load a legacy JS plugin | Yes, compat only | [raw/07-functions-and-directives.md] |
| `theme()` function | Dot-notation theme value access | Deprecated, use CSS vars instead | [raw/07-functions-and-directives.md] |
| `--alpha()` | Build-time opacity adjustment via `color-mix()` | No | [raw/07-functions-and-directives.md] |
| `--spacing()` | Build-time spacing scale calculation | No | [raw/07-functions-and-directives.md] |

## 4. @utility: functional utility syntax

| Feature | Syntax | Citation |
| --- | --- | --- |
| Simple | `@utility content-auto { content-visibility: auto; }` | [raw/07-functions-and-directives.md] |
| Complex (nesting) | `@utility scrollbar-hidden { &::-webkit-scrollbar { display: none; } }` | [raw/07-functions-and-directives.md] |
| Functional, theme-matched | `--value(--tab-size-*)` resolves against `@theme` keys | [raw/07-functions-and-directives.md] |
| Functional, bare value | `--value(integer)` etc; types: `number`, `integer`, `ratio`, `percentage` | [raw/07-functions-and-directives.md] |
| Functional, literal | `--value("inherit", "initial", "unset")` | [raw/07-functions-and-directives.md] |
| Functional, arbitrary | `--value([integer])`; broader type list incl. `color`, `length`, `url`, `vector`, `*` | [raw/07-functions-and-directives.md] |
| Defaults | `--value(integer, --default(4))` | [raw/07-functions-and-directives.md] |
| Negative values | Register separate `@utility inset-*` / `@utility -inset-*` | [raw/07-functions-and-directives.md] |
| Modifiers | `--modifier()` mirrors `--value()` for the modifier segment (e.g. `text-lg/7`) | [raw/07-functions-and-directives.md] |
| Fractions | `ratio` CSS type signals value+modifier as one fraction, e.g. `aspect-3/4` | [raw/07-functions-and-directives.md] |
| Constraints | Must be top-level; name alphanumeric + lowercase start (`/` and `%` special-cased); functional names end in single trailing `-*`; must define ≥1 property; later duplicate `@utility` blocks with the same name win | [raw/07-functions-and-directives.md] (community mirror portion) |
| Sort order changed from v3 | Custom utilities now sort by property count, so component-style utilities (`.btn`) can be overridden by other Tailwind utilities without extra config | [raw/02-v3-to-v4-upgrade-guide.md] |

## 5. Migration v3 → v4

### Tooling

| Step | Detail | Citation |
| --- | --- | --- |
| Automated tool | `npx @tailwindcss/upgrade`, requires Node 20+, run on a clean branch, review the diff | [raw/02-v3-to-v4-upgrade-guide.md], [raw/13-v3-to-v4-migration-community-guide.md] |
| PostCSS package split | `tailwindcss` (v3 PostCSS plugin) → `@tailwindcss/postcss` (v4); `postcss-import` and `autoprefixer` no longer needed | [raw/02-v3-to-v4-upgrade-guide.md] |
| CLI package split | `tailwindcss` CLI → `@tailwindcss/cli` | [raw/02-v3-to-v4-upgrade-guide.md] |
| Vite | Migrate from PostCSS plugin to `@tailwindcss/vite` for best perf/DX | [raw/02-v3-to-v4-upgrade-guide.md], [raw/03-vite-plugin-installation.md] |

### Breaking changes catalog

| Category | v3 | v4 | Citation |
| --- | --- | --- | --- |
| Deprecated utilities removed | `bg-opacity-*`, `text-opacity-*`, `border-opacity-*`, `divide-opacity-*`, `ring-opacity-*`, `placeholder-opacity-*`, `flex-shrink-*`, `flex-grow-*`, `overflow-ellipsis`, `decoration-slice`, `decoration-clone` | Opacity modifiers (`bg-black/50`), `shrink-*`, `grow-*`, `text-ellipsis`, `box-decoration-slice`, `box-decoration-clone` | [raw/02-v3-to-v4-upgrade-guide.md] |
| Shadow/blur/radius/ring rename | `shadow-sm`→`shadow-xs`, `shadow`→`shadow-sm`, `blur-sm`→`blur-xs`, `blur`→`blur-sm`, `rounded-sm`→`rounded-xs`, `rounded`→`rounded-sm`, `outline-none`→`outline-hidden`, `ring`→`ring-3` | Bare names still work for backward compat but visually differ unless updated | [raw/02-v3-to-v4-upgrade-guide.md] |
| `outline-none` semantics changed | v3 `outline-none` was really an invisible-but-still-forced-colors-visible outline | New `outline-none` sets `outline-style: none` for real; old behavior is `outline-hidden` | [raw/02-v3-to-v4-upgrade-guide.md]; real production bug reported from this exact confusion in [raw/13-v3-to-v4-migration-community-guide.md] |
| Default border/divide color | `gray-200` | `currentColor` | [raw/02-v3-to-v4-upgrade-guide.md], [raw/13-v3-to-v4-migration-community-guide.md] |
| Default ring width/color | 3px / `blue-500` | 1px / `currentColor` | [raw/02-v3-to-v4-upgrade-guide.md], [raw/13-v3-to-v4-migration-community-guide.md] |
| space-x/y and divide-x/y selector | `:not([hidden]) ~ :not([hidden])` | `:not(:last-child)` (perf fix on large pages) | [raw/02-v3-to-v4-upgrade-guide.md] |
| Container utility config | `center`, `padding` options in JS config | Extend via `@utility container { margin-inline: auto; padding-inline: 2rem; }` | [raw/02-v3-to-v4-upgrade-guide.md] |
| Gradient variant behavior | Overriding part of a gradient in a variant reset the whole gradient | Values preserved; use `via-none` to explicitly unset | [raw/02-v3-to-v4-upgrade-guide.md] |
| Prefix placement | Prefix before utility, mid-string in some setups | Prefix acts like a variant, always first: `tw:flex tw:hover:bg-red-600` | [raw/02-v3-to-v4-upgrade-guide.md] |
| `!important` marker position | Leading `!` after variants | Trailing `!` at end of class name (`flex!`); old form deprecated but still works | [raw/02-v3-to-v4-upgrade-guide.md] |
| Variant stacking order | Right to left | Left to right (matches CSS syntax); e.g. `first:*:pt-0` → `*:first:pt-0` | [raw/02-v3-to-v4-upgrade-guide.md] |
| CSS var arbitrary value shorthand | `bg-[--brand-color]` | `bg-(--brand-color)` | [raw/02-v3-to-v4-upgrade-guide.md] |
| Comma-to-space in grid/object arbitrary values | Auto-converted (v2 compat) | Removed; use underscore: `grid-cols-[max-content_auto]` | [raw/02-v3-to-v4-upgrade-guide.md] |
| Hover on touch | Fired on tap | Wrapped in `@media (hover: hover)`; override with `@custom-variant hover (&:hover);` if needed | [raw/02-v3-to-v4-upgrade-guide.md], [raw/13-v3-to-v4-migration-community-guide.md] |
| `transition`/`transition-colors` scope | Did not include `outline-color` | Includes `outline-color`; set outline color unconditionally to avoid unwanted transition-in | [raw/02-v3-to-v4-upgrade-guide.md] |
| Transform utilities | Combined `transform` property | Individual `rotate`/`scale`/`translate` properties; `transform-none` no longer resets them (use `scale-none` etc); property-list transitions must name the individual property | [raw/02-v3-to-v4-upgrade-guide.md] |
| `corePlugins` disabling | Supported | Removed entirely | [raw/02-v3-to-v4-upgrade-guide.md] |
| `resolveConfig` JS export | Supported | Removed; use CSS vars or `getComputedStyle` | [raw/02-v3-to-v4-upgrade-guide.md] |
| `@apply` in Vue/Svelte/CSS-modules scoped styles | Automatically had access to theme/utilities/variants | Needs explicit `@reference "../app.css";` import, or use CSS vars directly for better perf | [raw/02-v3-to-v4-upgrade-guide.md], [raw/07-functions-and-directives.md] |
| CSS preprocessors | Sass/Less/Stylus commonly layered with Tailwind | Explicitly unsupported in v4; "Tailwind CSS itself is your preprocessor" | [raw/02-v3-to-v4-upgrade-guide.md] |

### Migration order (practitioner synthesis, not an official checklist)

Branch → run `npx @tailwindcss/upgrade` → read diff → fix border-color and `outline` by hand → set up dark mode if using class strategy → confirm browser targets → cleanup pass. [raw/13-v3-to-v4-migration-community-guide.md]: flagged in that raw file as third-party opinion, cross-checked clean against the official upgrade guide.

## 6. Vite plugin and SvelteKit 2 setup

| Step | Detail | Citation |
| --- | --- | --- |
| Packages | `npm install tailwindcss @tailwindcss/vite` | [raw/03-vite-plugin-installation.md], [raw/04-sveltekit-install-guide.md] |
| Vite config (generic) | `plugins: [tailwindcss()]` from `@tailwindcss/vite` | [raw/03-vite-plugin-installation.md] |
| Vite config (SvelteKit) | `plugins: [tailwindcss(), sveltekit()]` (official guide order: tailwindcss before sveltekit) | [raw/04-sveltekit-install-guide.md] |
| CSS entry | `src/app.css` containing only `@import "tailwindcss";` plus any `@theme`/`@custom-variant` blocks | [raw/04-sveltekit-install-guide.md] |
| Root import | `src/routes/+layout.svelte` imports `../app.css`, Svelte 5 runes idiom: `let { children } = $props();` and `{@render children()}` | [raw/04-sveltekit-install-guide.md] |
| Component `<style>` blocks | Need `@reference "tailwindcss";` (or the project's app.css) to use `@apply`/`theme()` inside a Svelte component's scoped style block | [raw/04-sveltekit-install-guide.md] |
| `sv add tailwindcss` | Svelte CLI add-on scaffolds the same setup plus Prettier integration | [raw/04-sveltekit-install-guide.md] |
| Lightning CSS transformer flag | Some community reports needed `css: { transformer: 'lightningcss' }` to fix build issues; not part of the official baseline guide | [raw/04-sveltekit-install-guide.md]: flagged as unconfirmed/conditional, not a general requirement |
| Lightning CSS plugin option | `@tailwindcss/vite` auto-enables Lightning CSS optimization in production (`NODE_ENV`-based); override via `optimize: false` or `optimize: { minify: false }` | [raw/03-vite-plugin-installation.md] |

**Conflict flagged:** [raw/04-sveltekit-install-guide.md]'s official guide lists plugin order as `[tailwindcss(), sveltekit()]`; a GitHub Discussions thread in the same raw file shows a working config with `[sveltekit(), tailwindcss()]`. Both are reported working; prefer the official guide's order (`tailwindcss()` first) as the default recommendation.

## 7. Dark mode

| Claim | Detail | Citation |
| --- | --- | --- |
| Default strategy | `prefers-color-scheme` media query via the built-in `dark:` variant, no setup required | [raw/05-dark-mode-custom-variant.md] |
| Class-based toggle | `@custom-variant dark (&:where(.dark, .dark *));` in the CSS entry file | [raw/05-dark-mode-custom-variant.md] |
| Data-attribute toggle | `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));` | [raw/05-dark-mode-custom-variant.md] |
| Three-way toggle (light/dark/system) | Combine a custom class-based `dark` variant with `window.matchMedia('(prefers-color-scheme: dark)')` and `localStorage`, toggling the class inline in `<head>` to avoid FOUC | [raw/05-dark-mode-custom-variant.md] |
| Multiple selector rules | Shorthand `@custom-variant dark (&:where(...));` only supports one rule; use the block + `@slot` form to combine multiple rules (e.g. data-attribute plus a media-query fallback) | [raw/05-dark-mode-custom-variant.md] |
| Most common failure | Class toggle added to `<html>` but styles don't change: the project forgot to declare `@custom-variant dark`, so Tailwind is still on the default `prefers-color-scheme` strategy | [raw/05-dark-mode-custom-variant.md] |

## 8. Class ordering and tooling

| Claim | Detail | Citation |
| --- | --- | --- |
| Official tool | `prettier-plugin-tailwindcss`, install as Prettier plugin, add to `plugins` array in Prettier config | [raw/11-prettier-plugin-class-sorting.md] |
| Sort logic | Mirrors Tailwind's own CSS layer order (base → components → utilities), then box-model-ish order within utilities so overriding classes sort later; responsive/state modifiers grouped and sorted after plain utilities; non-Tailwind classes sort first | [raw/11-prettier-plugin-class-sorting.md] |
| No customization | Sort order is intentionally not configurable ("one less thing to argue with your team about") | [raw/11-prettier-plugin-class-sorting.md] |
| v4-specific option | `stylesheetPath` in the sorter API points at the v4 CSS entry file (replacing v3's `configPath` to `tailwind.config.js`) | [raw/11-prettier-plugin-class-sorting.md] |
| Load order rule | `prettier-plugin-tailwindcss` must be loaded last among Prettier plugins | [raw/11-prettier-plugin-class-sorting.md] |
| Editor integration | Works in any Prettier-integrated editor (VS Code, Cursor, CLI); pairs with the official Tailwind CSS IntelliSense extension | [raw/11-prettier-plugin-class-sorting.md] |

## 9. Arbitrary values: syntax and when they signal a missing token

| Claim | Detail | Citation |
| --- | --- | --- |
| Syntax | Square brackets for one-off values: `top-[117px]`, `bg-[#bada55]`, works with all modifiers (`hover:`, `lg:`) | [raw/08-arbitrary-values-and-custom-styles.md] |
| CSS variable shorthand | `fill-(--my-brand-color)` is shorthand for `fill-[var(--my-brand-color)]` | [raw/08-arbitrary-values-and-custom-styles.md]; syntax changed from bracket-only in v3, see §5 | [raw/02-v3-to-v4-upgrade-guide.md] |
| Arbitrary properties | `[mask-type:luminance]` for CSS properties with no Tailwind utility | [raw/08-arbitrary-values-and-custom-styles.md] |
| Arbitrary variants | `lg:[&:nth-child(-n+3)]:hover:underline` for on-the-fly selector modification | [raw/08-arbitrary-values-and-custom-styles.md] |
| Whitespace handling | Underscore stands in for space (`grid-cols-[1fr_500px_2fr]`); escape with backslash when a literal underscore is needed and ambiguous | [raw/08-arbitrary-values-and-custom-styles.md] |
| Ambiguity resolution | Tailwind infers property from value shape automatically in most cases; use a CSS-type hint for genuinely ambiguous cases, e.g. `text-(length:--my-var)` vs `text-(color:--my-var)` | [raw/08-arbitrary-values-and-custom-styles.md] |
| When arbitrary values signal a missing token | The docs frame arbitrary values as an escape hatch ("once in a while you need to break out of those constraints to get things pixel-perfect"), implying routine/repeated use of the same arbitrary value is a signal that value belongs in `@theme` instead | [raw/08-arbitrary-values-and-custom-styles.md], [raw/01-theme-directive.md]: this specific inference is a reasonable synthesis of the stated design intent, not a verbatim official warning; flagged as such |

## 10. Container queries

| Claim | Detail | Citation |
| --- | --- | --- |
| Core in v4, no plugin | Replaces the v3 `@tailwindcss/container-queries` plugin | [raw/09-v4-release-notes-performance-features.md], [raw/06-container-queries.md] |
| Basic usage | Parent gets `@container`; children use `@sm:`, `@md:`, etc, mobile-first (applies at that size and up) | [raw/06-container-queries.md] |
| Max-width and ranges | `@max-md:` for below a size; stack `@sm:@max-md:` for a range | [raw/06-container-queries.md] |
| Named containers | `@container/main` + `@sm/main:` to target a specific ancestor when containers nest | [raw/06-container-queries.md] |
| Size containers | `@container-size` (maps to `container-type: size`) needed for block-size-dependent units like `cqb`/`cqh`; added in v4.3.0 (May 2026), arbitrary values needed before that version | [raw/06-container-queries.md] |
| Default scale | `@3xs` (16rem/256px) through `@7xl` (80rem/1280px), 13 steps, all smaller than the equivalent-named viewport breakpoints | [raw/06-container-queries.md] |
| Custom sizes | `--container-*` theme variables in `@theme` | [raw/06-container-queries.md] |
| Height variants gap | No built-in `@min-h-*`/`@max-h-*`; must use arbitrary container variants like `[@container_(height>384px)]:flex-col` | [raw/06-container-queries.md] |
| Practical rule of thumb | Page-level layout → viewport media queries; reusable component layout → container queries; they compile to different at-rules and can coexist on the same page without conflict | [raw/14-container-queries-migration-practice.md]: practitioner guidance, not verbatim official text |
| Nesting gotcha | An `@md:` query targets the nearest ancestor container; named containers are needed to reach a non-nearest ancestor | [raw/06-container-queries.md], [raw/14-container-queries-migration-practice.md] |

## 11. Performance and the Oxide/Rust engine

| Claim | Detail | Citation |
| --- | --- | --- |
| Official benchmark (Catalyst UI kit) | Full build 378ms→100ms (3.78x); incremental w/ new CSS 44ms→5ms (8.8x); incremental w/ no new CSS 35ms→192µs (182x) | [raw/09-v4-release-notes-performance-features.md] |
| Alpha-stage claim | Up to 10x faster full builds reported at the alpha announcement stage; over 35% smaller install footprint | [raw/10-oxide-engine-and-performance.md] |
| Architecture | Rust for the most parallelizable/expensive parts; TypeScript retained for extensibility; single dependency (Lightning CSS); custom CSS parser, ~2x faster parsing than the old PostCSS pipeline | [raw/10-oxide-engine-and-performance.md] |
| Why faster | No PostCSS in the hot path (source-to-output direct parsing); fine-grained incremental caching keyed to the changed file | [raw/10-oxide-engine-and-performance.md] |
| Third-party numbers vary | Independent blogs report figures from 3.8x to 19x depending on project and metric; the largest multipliers (11x, 19x) come from a single independent benchmark methodology and should be treated as illustrative, not guaranteed | [raw/10-oxide-engine-and-performance.md]: internal gap flag included in that raw file |
| Modern CSS platform features used | Native cascade layers, `@property` registered custom properties (enables gradient animation, improves large-page perf), `color-mix()`, logical properties | [raw/09-v4-release-notes-performance-features.md] |

## 12. Anti-patterns: utility soup and premature @apply

| Claim | Detail | Citation |
| --- | --- | --- |
| Preferred de-duplication order | (1) multi-cursor editing / loop-rendered markup needs no abstraction; (2) components or template partials for cross-file reuse; (3) `@apply`, only for small highly-reusable primitives when a component/partial is impractical | [raw/08-arbitrary-values-and-custom-styles.md], [raw/12-utility-first-fundamentals-and-anti-patterns.md] |
| Explicit anti-pattern warning | "Don't use `@apply` just to make things look cleaner." Overuse re-creates hand-written CSS's downsides: constant class-naming, cross-file jumps, riskier global changes, bigger CSS bundles | [raw/08-arbitrary-values-and-custom-styles.md] |
| `@apply` and internal utility variables | Maintainer guidance: don't copy Tailwind's internal `--tw-*` implementation variables into hand-written CSS when trying to replicate a utility's output; extract a component instead, and if hand-writing CSS, use the public design-token variables (`--spacing-5`, `--color-*`), not internal ones | [raw/08-arbitrary-values-and-custom-styles.md] |
| "Utility soup" terminology | Not a verbatim phrase in any archived official source; it is the community/industry name for the long-unordered-class-list readability complaint. Official mitigation is componentization (see above) plus mandatory automatic class ordering via `prettier-plugin-tailwindcss` (§8) | Gap flagged directly in [raw/12-utility-first-fundamentals-and-anti-patterns.md] |
| Utility-first philosophy rationale | No time spent naming classes/choosing selectors; safer localized changes; CSS stops growing linearly with features | [raw/12-utility-first-fundamentals-and-anti-patterns.md] |

## Summary of flagged gaps and conflicts

1. **Plugin order in SvelteKit `vite.config.ts`** (`tailwindcss()` before vs after `sveltekit()`): both work per community reports; official guide's order (`tailwindcss()` first) is the recommended default. See §6.
2. **`css: { transformer: 'lightningcss' }`**: reported by some as a fix for build issues, not part of the official baseline SvelteKit setup; treat as conditional, not a default step. See §6.
3. **Performance multipliers beyond the official benchmark**: independent blogs report figures from 3.8x to 19x/100x+ depending on metric and methodology; the official Catalyst benchmark (378ms→100ms, 3.78x/8.8x/182x) is the one to cite as authoritative. See §11.
4. **"Utility soup" phrase**: community/industry term, not found verbatim in the official archive. See §12.
5. **Container-query breakpoint pixel recommendations for card components** (`@sm`/`@md` "sweet spot"): a single community source's opinion, not official guidance. See §10.
6. **Migration step ordering** (branch → tool → manual fixes → dark mode → browser check → cleanup): a community synthesis, cross-checked clean against the official upgrade guide but not itself an official checklist. See §5.
