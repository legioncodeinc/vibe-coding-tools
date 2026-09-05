# Distilled research: shadcn-svelte

Dense reference distilled from the raw archive in `raw/`. Every claim below is cited to the raw file it traces to. Research window: 2026-02 through 2026-08-14, plus official docs of any date.

## 1. What shadcn-svelte is

shadcn-svelte is an unofficial, community-led Svelte port of shadcn/ui, built and maintained primarily by huntabyte, "not affiliated with shadcn, but we did get his blessing" [raw/14-copy-in-philosophy-and-component-anatomy.md]. It is explicitly framed as "not a component library. It is how you build your component library" [raw/14-copy-in-philosophy-and-component-anatomy.md]. Five stated principles: Open Code, Composition, Distribution, Beautiful Defaults, AI-Ready [raw/14-copy-in-philosophy-and-component-anatomy.md].

## 2. Foundation stack

| Layer | Library | Role | Citation |
| --- | --- | --- | --- |
| Headless primitives (primary) | Bits UI (currently v2, per homepage banner "Bits UI v2 Now Available") | WAI-ARIA-compliant unstyled components; source for most CLI-installed primitives (button, dialog, select, alert-dialog, etc.) | [raw/03-bits-ui-foundation.md] |
| Headless primitives (secondary/historical) | Melt UI (classic `@melt-ui/svelte`, and Svelte-5-native "next"/`melt` package) | "Inspired the internal architecture" of Bits UI per Bits UI's own acknowledgments; used directly by some community styles | [raw/04-melt-ui-foundation.md], [raw/03-bits-ui-foundation.md] |
| Styling | Tailwind CSS v4 (CSS-first `@theme`/`@theme inline`) | Utility classes and design tokens | [raw/06-tailwind-v4-migration.md] |
| Variant management | tailwind-variants (`tv()`) | Component variant/size class composition | [raw/14-copy-in-philosophy-and-component-anatomy.md] |
| Class merging | clsx + tailwind-merge, exposed as `cn()` | Merges conditional classes with Tailwind conflict resolution | [raw/06-tailwind-v4-migration.md] |
| Forms | Formsnap + sveltekit-superforms + Zod (zod4/zod4Client adapters) | Accessible form field composition, client/server validation | [raw/10-forms-formsnap-superforms.md] |
| Dark mode | mode-watcher (`ModeWatcher`, `toggleMode`) | Pre-paint theme class application, no flash-of-wrong-theme | [raw/07-dark-mode.md] |
| Toasts | svelte-sonner (Svelte port of `sonner`) | Not a Bits UI primitive; matches shadcn/ui React's own non-Radix choice for Toast | [raw/13-component-gaps-vs-react.md], [raw/06-tailwind-v4-migration.md] |
| Icons | @lucide/svelte | Default icon set referenced throughout docs and examples | [raw/06-tailwind-v4-migration.md], [raw/07-dark-mode.md] |

Gap: the raw archive does not contain an official shadcn-svelte statement enumerating exactly which specific components resolve through Melt UI directly versus Bits UI; inference is that the primary CLI-installed set (button, dialog, select, etc.) resolves through Bits UI based on its own docs and observed component source imports [raw/04-melt-ui-foundation.md].

## 3. Version state (as of fetch)

| Fact | Value | Citation |
| --- | --- | --- |
| Latest npm version at fetch time | 1.4.2, published Jul 14, 2026 | [raw/11-changelog-and-versions.md] |
| Stable 1.0.0 shipped | Jun 2025 | [raw/11-changelog-and-versions.md] |
| Svelte 5 / Tailwind v4 prerelease track | `1.0.0-next.0` through `1.0.0-next.19`, Oct 2024 - May 2025 | [raw/11-changelog-and-versions.md] |
| Total published versions | 107, first published May 26, 2023 | [raw/11-changelog-and-versions.md] |
| Most recent named styles | Rhea (May 2026, compact density variant of Luma) and Sera (Apr 2026, typographic/editorial style) | [raw/11-changelog-and-versions.md] |
| GitHub repo stats at fetch | 8,635 stars, 527 forks, 81 open issues, MIT license, 180 contributors, 103 releases | [raw/11-changelog-and-versions.md] |

Conflict flag: the GitHub repo summary card's "latest release" field showed `shadcn-svelte@1.2.7` (2026-04-02) while the npm registry showed `1.4.2` (2026-07-14) at the same fetch pass; npm's registry is the more current source of truth for "latest version" [raw/11-changelog-and-versions.md].

## 4. CLI commands

| Command | Purpose | Key flags | Citation |
| --- | --- | --- | --- |
| `init` | Bootstrap a project: installs deps, adds `cn` util, creates CSS variables, writes `components.json` | `--preset`, `--base-color`, `--css`, `--*-alias` flags, `--no-deps-install`, `--skip-preflight`, `--reinstall`/`--no-reinstall`, `--proxy` | [raw/01-cli-command-reference.md] |
| `add [component...]` | Add one or more components/registry items to the project | `--all`, `-y`/`--yes`, `-o`/`--overwrite`, `--no-deps-install`, `--skip-preflight`, `--proxy` | [raw/01-cli-command-reference.md] |
| `apply <preset>` | Apply a preset (theme/style bundle) to an existing project | `--only theme\|font` to apply a subset without reinstalling components | [raw/01-cli-command-reference.md] |
| `registry build [registry.json]` | Generate registry JSON files for a custom registry, default output `./static/r` | `-o`/`--output` | [raw/01-cli-command-reference.md] |

Package managers: pnpm dlx, npx, yarn (implied), bun x are all documented as equivalent invocation forms throughout [raw/01-cli-command-reference.md], [raw/02-installation-sveltekit-and-components-json.md].

There is no dedicated `update` command as a first-class verb in the current CLI surface; version history shows this was requested (2023, issue #298) and evolved instead into `add --overwrite`, a short-lived `update utils` capability, and now the `apply`/`registry build` machinery. The documented current-generation upgrade path is `add --all --overwrite` after committing [raw/14-copy-in-philosophy-and-component-anatomy.md], [raw/06-tailwind-v4-migration.md].

## 5. The copy-in model and why it matters for upgrades

Components are NOT an npm dependency; the CLI copies component source directly into the consuming project, by default under `$lib/components/ui/<component>/` (aliasable via `components.json`) [raw/02-installation-sveltekit-and-components-json.md]. Unlike shadcn/ui React (which can define a full component in one file), Svelte doesn't support multiple components per file, so shadcn-svelte splits each component into a folder with multiple files plus an `index.ts` barrel export [raw/02-installation-sveltekit-and-components-json.md].

Why this matters for upgrades: "One of the major advantages of using shadcn-svelte is that the code you end up with is exactly what you'd write yourself. There are no hidden abstractions... when a dependency has a new release, you can just follow the official upgrade paths" [raw/06-tailwind-v4-migration.md]. The tradeoff is explicit: no black-box breaking changes from an opaque npm package, but also no automatic updates; you own the diff [raw/14-copy-in-philosophy-and-component-anatomy.md].

Maintainer-endorsed customize-without-breaking-upgrades workflow (huntabyte, verbatim guidance): commit all code before updating; update one component at a time rather than `--all` once you've made edits; review the diffs after each update; revert or re-apply anything that conflicts with your modifications [raw/14-copy-in-philosophy-and-component-anatomy.md]. A community-endorsed variant of the same workflow: `add <component> --overwrite`, then `git diff` and manually redo prior modifications [raw/14-copy-in-philosophy-and-component-anatomy.md].

Historical caution: a real bug (issue #1532, resolved by `1.0.0-next.11`) broke the `update`/overwrite flow specifically when `components.json` used non-default aliases; current versions (1.4.2 at fetch time) are well past this fix, but it demonstrates alias customization is a documented historical edge case worth testing after any CLI upgrade [raw/14-copy-in-philosophy-and-component-anatomy.md].

## 6. Component registry system

Two related but distinct schema files:

- `registry.json`: defines a whole custom registry (name, homepage, items list, aliases, `overrideDependencies`) [raw/08-registry-json-schema.md].
- `registry-item.json`: defines a single registry item (name, title, description, type, author, dependencies, registryDependencies, files, cssVars, css, docs, categories, meta) [raw/09-registry-item-json-schema.md].

Registry item `type` values: `registry:block` (multi-file complex components), `registry:component` (simple components), `registry:lib` (lib/utils), `registry:hook`, `registry:ui` (single-file primitives), `registry:page` (file-based routes), `registry:file` (misc, requires `target`), `registry:style` (e.g. `new-york`), `registry:theme` [raw/09-registry-item-json-schema.md].

`registryDependencies` entries resolve four ways: (1) a shadcn-svelte registry item name like `button`; (2) a full remote URL like `https://example.com/r/hello-world.json`; (3) a `local:` prefixed alias resolved by the CLI at build time into a relative path; (4) a relative path when not using the CLI build step [raw/09-registry-item-json-schema.md].

Custom/private registries: fully self-hostable; only requirement is valid JSON conforming to the registry-item schema. A starter template is available via `pnpm dlx degit huntabyte/shadcn-svelte/registry-template#next-tailwind-4` [raw/08-registry-json-schema.md]. `registry.json` is only required if using the shadcn-svelte CLI's own `registry build` step; other build systems just need to emit conformant JSON [raw/08-registry-json-schema.md].

`overrideDependencies` lets a registry author force a specific dependency version range (e.g. pin to `@next`), overriding what `registry build` would auto-detect from `package.json`; docs warn to use sparingly to avoid version conflicts [raw/08-registry-json-schema.md].

Style/theme extension: a `registry:style` item with `extends: "none"` builds a style from scratch (own deps, own registryDependencies, own cssVars); one without `extends: "none"` extends the base shadcn-svelte style [raw/09-registry-item-json-schema.md].

## 7. Theming: CSS variable vocabulary

Convention: `background`/`foreground` pairs; the `background` suffix is omitted for the base color name (e.g. `--primary` is the background, `--primary-foreground` is the text color) [raw/05-theming-tokens.md].

Full default (neutral-derived) token list: `--radius`, `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--border`, `--input`, `--ring`, `--chart-1` through `--chart-5`, `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border`, `--sidebar-ring` [raw/05-theming-tokens.md]. `--radius` is set once in `:root` only, not duplicated in `.dark` [raw/05-theming-tokens.md].

Default color format is OKLCH; Tailwind v3-era projects instead wrapped values in `hsl()` [raw/06-tailwind-v4-migration.md]. Base color presets selectable at `init` via `--base-color`: neutral, stone, zinc, gray, slate documented with full palettes; mauve, olive, mist, taupe additionally listed as valid CLI choices without full palette values captured in this archive (gap) [raw/05-theming-tokens.md], [raw/01-cli-command-reference.md].

Adding a custom color/token: define it in `:root`/`.dark`, then re-declare it inside `@theme inline` as `--color-<name>: var(--<name>);` to expose it as a Tailwind utility class (`bg-warning`, `text-warning-foreground`, etc.) [raw/05-theming-tokens.md].

Registry-driven token installation: a `registry-item.json`'s `cssVars.light`/`cssVars.dark`/`cssVars.theme` blocks let a registry item install new colors or override theme variables (spacing, breakpoints, fonts) directly via the CLI, which updates the project's CSS file automatically [raw/09-registry-item-json-schema.md].

## 8. Tailwind v4 integration mechanics

The `@theme inline` directive is the bridge layer: CSS custom properties defined in `:root`/`.dark` get re-exposed as Tailwind theme values (`--color-background: var(--background);` etc.) so utility classes like `bg-background` work [raw/06-tailwind-v4-migration.md]. `@custom-variant dark (&:is(.dark *));` is what makes `dark:` utilities respond to a `.dark` class anywhere in the ancestor chain [raw/06-tailwind-v4-migration.md]. `tw-animate-css` replaces the deprecated `tailwindcss-animate` for v4 [raw/06-tailwind-v4-migration.md]. The Vite plugin path (`@tailwindcss/vite`) is the recommended integration over PostCSS [raw/06-tailwind-v4-migration.md]. There is no `tailwind.config.js`/`.ts` file in the v4 model; config lives in CSS via `@theme`/`@theme inline`/`@plugin` [raw/06-tailwind-v4-migration.md] (community corroboration: "There is no config file to edit. That is a Tailwind 3 habit." [raw/07-dark-mode.md]).

Every primitive that renders a DOM element carries a `data-slot` attribute (e.g. `data-slot="button"`) as of the Tailwind v4 generation of components, for CSS/JS targeting without relying on class names [raw/06-tailwind-v4-migration.md], corroborated in the current Button source [raw/14-copy-in-philosophy-and-component-anatomy.md].

## 9. Dark mode

Implementation: `mode-watcher` package. `<ModeWatcher />` mounted once in the root layout writes the `.dark` class before paint (avoids flash-of-wrong-theme, the bug a hand-rolled `onMount`-based toggle almost always has); `toggleMode()` flips the mode from anywhere [raw/07-dark-mode.md]. Troubleshooting: a visible light-to-dark flash on load means `ModeWatcher` was left out of the root layout or theme logic was placed in `onMount` instead [raw/07-dark-mode.md].

Gap: the official shadcn-svelte `/docs/dark-mode` page body (framework-specific setup tabs, if any) was not fully retrieved in this fetch pass; the mode-watcher walkthrough above is sourced from a corroborating community blog, not verified verbatim against the official page's full body text [raw/07-dark-mode.md].

## 10. Forms: Formsnap + Superforms + Zod

This is the documented, current recommended pattern per the official `/docs/forms` page [raw/10-forms-formsnap-superforms.md]. Stack: Zod schema (source of truth for shape + generates TS types) -> `superValidate(zod4(schema))` in a `+page.server.ts` `load` function -> `superForm(initialForm, { validators: zod4Client(schema) })` on the client -> `Form.Field` / `Form.Control` (with a `{#snippet children({ props })}` render pattern) / `Form.Label` / `Form.Description` / `Form.FieldErrors` composition, installed via `pnpm dlx shadcn-svelte@latest add form` [raw/10-forms-formsnap-superforms.md].

The `zod4`/`zod4Client` adapter names indicate Superforms' current major depends on Zod v4's adapter API; server-side validation happens in `actions`, returning `fail(400, { form })` on invalid submissions [raw/10-forms-formsnap-superforms.md].

Conflict/version note: the `formsnap` npm package's own README example still shows Svelte 4 syntax (`export let data`, `let:attrs` slot props) [raw/10-forms-formsnap-superforms.md]. The shadcn-svelte `/docs/forms` page uses full Svelte 5 runes idiom (`$props()`, `{#snippet children({ props })}`) and should be treated as authoritative for any Svelte-5-runes-idiom guide output, not the formsnap package README [raw/10-forms-formsnap-superforms.md].

## 11. Accessibility inherited from Bits UI

Bits UI's own claim: "Production-Ready Accessibility... WAI-ARIA compliance, Keyboard navigation by default, Focus management handled for you, Screen reader support built-in" [raw/03-bits-ui-foundation.md]. Concrete mechanics observed on the Alert Dialog component: focus trap on by default (`trapFocus`, default `true`), auto-focus-on-open moves to `Content` for screen reader correctness (overridable via `onOpenAutoFocus`), auto-focus-on-close returns to the trigger (overridable via `onCloseAutoFocus`), scroll lock on by default (`preventScroll`, default `true`), configurable Escape-key behavior (`escapeKeydownBehavior`: close/ignore/defer-otherwise-close/defer-otherwise-ignore, plus `onEscapeKeydown` override), configurable outside-interaction behavior (`interactOutsideBehavior` + `onInteractOutside`) [raw/12-accessibility-bits-ui.md].

Conflict flag (documented, not smoothed over): the Alert Dialog narrative docs state the default `interactOutsideBehavior` is `'ignore'`, but the API reference table for the same prop on the same page lists the default as `'close'`. The archive does not resolve this; treat as an open documentation inconsistency and verify actual runtime behavior before asserting a default in any downstream guide [raw/12-accessibility-bits-ui.md].

Bits UI actively tracks WAI-ARIA Authoring Practices Guide (APG) conformance as an engineering target, not just general ARIA attribute presence: a merged PR fixed Tab/Shift-Tab handling in dropdown menus specifically to match "the WAI APG Menu pattern" [raw/12-accessibility-bits-ui.md]. Focus-scope internals receive active maintenance (e.g. a Jan 2026 fix for single-tabbable-item focus handling) [raw/12-accessibility-bits-ui.md].

Forms accessibility: the `Form.*` wrapper components automatically apply correct `aria-*` attributes based on field state and associate labels via `for`/`id`, per the official forms guide [raw/10-forms-formsnap-superforms.md].

## 12. Known gaps versus shadcn/ui (React)

The most commonly cited comparison tool (`jasongitmail/shadcn-compare`) is unreliable for the shadcn/shadcn-svelte columns specifically: it marks well-known shipped components (Button, Dialog, Select, Accordion) as ❌ for both shadcn (React) and shadcn-svelte, which contradicts both projects' own docs, suggesting a stale or narrowly-scoped crawler rather than a real absence. This is flagged as a data-quality problem in the tool itself, not treated as ground truth [raw/13-component-gaps-vs-react.md]. The bits-ui/melt-ui columns in the same table (mostly showing primitives present) are more plausible signals of what exists at the primitive layer [raw/13-component-gaps-vs-react.md].

Genuine, corroborated gaps and parity notes:

- **Toast**: shadcn-svelte does not use a Bits UI toast primitive; it uses `svelte-sonner` (a Svelte port of the `sonner` React library). This mirrors shadcn/ui React's own choice (`sonner` directly, not a Radix primitive), so this is parity, not a gap [raw/13-component-gaps-vs-react.md].
- **Navigation Menu**: historically absent, blocked on the underlying Bits UI primitive; maintainer confirmed (2025-era discussion) it would ship "now that Bits UI v1 is out." The Bits UI primitive itself is now available per the comparison table. Gap: this archive could not independently re-verify current presence in the official shadcn-svelte component docs list, only that the blocking dependency has shipped [raw/13-component-gaps-vs-react.md].
- **Drawer (Vaul-based)**: historically gated because shadcn/ui React's Drawer depends on Vaul, a React-only library; had to be ported to Svelte first (`vaul-svelte`) before shadcn-svelte could ship an equivalent. `vaul-svelte@next` now appears as a current dependency in the Tailwind v4 upgrade command, indicating this gap has since closed [raw/13-component-gaps-vs-react.md], [raw/06-tailwind-v4-migration.md].
- **General pattern**: when a shadcn/ui React component depends on a React-only headless library (Vaul, cmdk-style command palettes, etc.), shadcn-svelte availability is gated on someone first porting that headless dependency to Svelte, not merely re-skinning a Svelte-native equivalent [raw/13-component-gaps-vs-react.md].
- **Project's own framing**: "Here you can find all the components available in the library. We are working on adding more components" -- shadcn-svelte is explicitly an actively-growing port, not released in lockstep with shadcn/ui React [raw/13-component-gaps-vs-react.md], [raw/14-copy-in-philosophy-and-component-anatomy.md].

## 13. Component anatomy (Button worked example, current generation)

Structure: a folder per component (e.g. `ui/button/`) containing a variants/types file (commonly named e.g. `a.ts` or similar, kept separate from the `.svelte` file), the `.svelte` component itself, and an `index.ts` barrel [raw/14-copy-in-philosophy-and-component-anatomy.md].

Why variants/types live in a separate `.ts` file rather than a `<script module>` block inside the `.svelte` file: `tsc --noEmit` cannot resolve types exported from a `<script module>` block inside a `*.svelte` file when re-exported through `index.ts` (fails with `TS2614`); moving them to a plain `.ts` file avoids this for consumers running `tsc` in CI, without affecting the Svelte LSP or dev server [raw/14-copy-in-philosophy-and-component-anatomy.md].

Pattern building blocks, all Svelte 5 runes idiom: `tv()` from `tailwind-variants` for variant/size class composition; `cn()` (clsx + tailwind-merge) for class merging; `$props()` destructuring with `class: className`, `variant`, `size`, `ref = $bindable(null)`, `...restProps`; `{@render children?.()}` snippet rendering; `data-slot="button"` on the rendered element; conditional `<a>`/`<button>` rendering based on presence of an `href` prop, with `aria-disabled`, `role="link"`, and `tabindex={-1}` applied to the anchor form when `disabled` is set [raw/14-copy-in-philosophy-and-component-anatomy.md].

## 14. Known unknowns / gaps summary (do not treat as guesses)

- Exact Melt UI vs. Bits UI component-by-component split: not documented officially [raw/04-melt-ui-foundation.md].
- Full OKLCH values for the mauve/olive/mist/taupe base-color presets: CLI lists them as valid choices, but the theming docs page only rendered full palettes for neutral/stone/zinc/gray/slate [raw/05-theming-tokens.md].
- Official `/docs/dark-mode` page full body text: not fully captured; mode-watcher walkthrough sourced from a corroborating community blog instead [raw/07-dark-mode.md].
- Current presence of Navigation Menu in the official shadcn-svelte component list: primitive exists in Bits UI; not independently re-verified against the live shadcn-svelte docs component index in this archive [raw/13-component-gaps-vs-react.md].
- Alert Dialog `interactOutsideBehavior` default: narrative text says `'ignore'`, API table says `'close'`; unresolved in the source itself [raw/12-accessibility-bits-ui.md].
- Older changelog entries (March 2026 and earlier) are listed by title only in the fetched changelog page, without expanded body text [raw/11-changelog-and-versions.md].
