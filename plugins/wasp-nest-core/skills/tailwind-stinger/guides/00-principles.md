# Principles: the v4 mental model

## CSS-first, not JS-first

Tailwind v4's default posture is config-in-CSS. There is no `tailwind.config.js` by default. Design tokens live in a `@theme` block in the CSS file that imports Tailwind, and that block does double duty: it's a normal CSS custom property, and it's an instruction to Tailwind to generate matching utility classes. A JS config file still works, but it must be loaded explicitly with `@config "../../tailwind.config.js";` and is no longer auto-detected. [raw/02-v3-to-v4-upgrade-guide.md], [raw/09-v4-release-notes-performance-features.md]

Practical consequence: when reviewing or writing Tailwind v4 code, look for `@theme` in the CSS entry file before assuming a JS config exists. If neither exists, the project is running on Tailwind's shipped default theme only.

## Import, don't `@tailwind`

```css
/* v3 (wrong for v4) */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* v4 (correct) */
@import "tailwindcss";
```

If you see the three-directive form in a codebase, that's a v3 leftover and a migration flag. [raw/02-v3-to-v4-upgrade-guide.md]

## Everything is generated from tokens, not hardcoded

Static utilities like `flex` or `object-cover` exist unconditionally. Everything else, colors, font sizes, breakpoints, shadows, is generated because a theme variable in the matching namespace exists. Adding `--color-brand: oklch(...)` to `@theme` is what makes `bg-brand`, `text-brand`, and `border-brand` exist; there is no separate "register a color" step. [raw/01-theme-directive.md]

## The engine is a different thing now (Oxide)

v4 is a ground-up rewrite: a Rust-backed engine, Lightning CSS for vendor prefixing/minification, a custom CSS parser, no PostCSS in the hot path. Official benchmarks: full builds ~3.78x faster, incremental builds with new CSS ~8.8x faster, incremental builds with no new CSS ~182x faster (measured in microseconds). [raw/09-v4-release-notes-performance-features.md], [raw/10-oxide-engine-and-performance.md] This matters for how you reason about DX complaints: "the dev server feels slow" in a v4 project is much more likely to be an app-level bundler issue than a Tailwind compile issue.

## Zero-config content detection

There's no `content: [...]` array to maintain. Tailwind scans the project automatically, respecting `.gitignore` and skipping binary file types. Use `@source "path";` only for genuinely non-standard locations Tailwind's heuristics won't find (e.g. a vendored component library in `node_modules`). [raw/09-v4-release-notes-performance-features.md], [raw/07-functions-and-directives.md]

## Browser floor is real, not a suggestion

Safari 16.4+, Chrome 111+, Firefox 128+. Tailwind v4 depends on `@property` and `color-mix()` for core framework behavior (gradients, opacity, cascade layering); it does not gracefully degrade below that floor. If a project has to support older browsers, the answer is staying on v3.4, not trying to polyfill v4. [raw/02-v3-to-v4-upgrade-guide.md], [raw/13-v3-to-v4-migration-community-guide.md]

## What this skill owns vs. what it hands off

This skill (`tailwind-stinger`) is Tailwind CSS v4 the framework: `@theme` mechanics, the directive/function set, the Vite plugin, migration, dark mode variants, container queries, arbitrary values, class ordering, and performance. It is deliberately generic, usable on any codebase.

It does **not** own:
- Svelte component/runes architecture, hand to `svelte-stinger`.
- shadcn-svelte component library specifics, hand to `shadcn-svelte-stinger`.
- The OSPRY-specific PRD-071 token contract, the `@theme inline` bridge into `apps/portal`/`apps/web`/`apps/wl`, or the white-label brand contract, that's `ux-ui-svelte-stinger`'s domain per ADR-007.

If a question is "how does `@theme` work," you're in the right place. If it's "what should `--interactive` resolve to for OSPRY," go read `ux-ui-svelte-stinger` instead.
