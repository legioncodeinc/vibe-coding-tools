# Tailwind CSS v3 to v4: The Complete Migration Guide (2026)
- URL: https://www.consolelog.tools/blog/tailwind-v3-to-v4-migration
- Fetched: 2026-08-14
- Source type: blog (community)
- Component: migration

By Mohammed Banani, published 2026-06-01.

Framing: "Tailwind v4 is a ground-up rewrite. The upgrade tool handles most of it, but the CSS-first config, the renamed utilities, the rebuilt dark mode, and the browser-support floor are where teams get stuck."

"For most projects, the migration is one command: run `npx @tailwindcss/upgrade` on a clean branch and let it rewrite your config, your CSS imports, and the renamed utility classes."

## Engine and config comparison table

| Area | v3 | v4 |
| --- | --- | --- |
| Engine | PostCSS plugin | Oxide, Lightning CSS built in |
| Config | `tailwind.config.js` | `@theme` in CSS (JS config still loadable) |
| Import | `@tailwind base;` etc. | `@import "tailwindcss";` |
| PostCSS plugin | `tailwindcss` | `@tailwindcss/postcss` |
| Vite | PostCSS | `@tailwindcss/vite` plugin |
| Browser floor | older browsers | Safari 16.4+, Chrome 111+, Firefox 128+ |

## The fast path: the upgrade tool

"Do not migrate by hand. The official codemod does in seconds what would take you an afternoon of find-and-replace, and it makes fewer mistakes."

```
# Start on a clean branch so you can read the diff
git checkout -b tailwind-v4
# Node 20 or newer is required
npx @tailwindcss/upgrade
```

Two ground rules stated by this source: run the tool on a project already on the latest v3.4 (not an ancient version) so the codemod has less to reconcile; and review the generated CSS, because anything custom in the old JS config that doesn't map cleanly is left for manual porting.

## Breaking changes worth understanding by hand (this source's practical top list)

- **Default border color**: v3 gave `border` a `gray-200` default; v4 defaults to `currentColor`. A bare `border` class will draw in the current text color; be explicit.
- **Shadow, radius, blur scale shift**: old default names were rescaled down a step; something looking heavier/rounder than before is usually this.
- **`outline-none` rename**: v3 `outline-none` (transparent 2px outline kept for accessibility) is now `outline-hidden`; the new `outline-none` actually sets `outline-style: none`. Source reports a real production bug from this: "a search input inside a popover kept showing the global focus ring because the old class name no longer did what we assumed."
- **Ring width default**: dropped from 3px to 1px; add `ring-3` to restore the old look, or set a custom default in `@theme`.
- **Opacity utilities removed**: `bg-opacity-50`, `text-opacity-*`, etc. removed in favor of the slash syntax (`bg-black/50`), which had already been the recommended approach.
- **Hover-only-where-hover-exists**: v4 wraps `hover:` in `@media (hover: hover)`, so it no longer fires on touch-emulated hover on tap.

## Dark mode, rebuilt

"In v4, the `media` strategy (follow the OS preference) is the default and needs no setup. If you want the class-based strategy ... you declare it as a custom variant in CSS," matching the official dark-mode doc [05-dark-mode-custom-variant.md].

## The browser-support cliff

"Tailwind v4 targets modern browsers and uses native features that older ones do not support: cascade layers, the `@property` rule, and `color-mix()`. The practical floor is Safari 16.4, Chrome 111, and Firefox 128, all from early 2023 onward. On browsers older than that, the framework does not gracefully degrade."

## Recommended migration order (this source's synthesis)

"branch, run `npx @tailwindcss/upgrade`, read the diff, fix the border-color and `outline` changes by hand, set up dark mode if you use the class strategy, confirm your browser targets, then run the cleanup pass."

Gap: this is a third-party blog's opinionated checklist, not an official Tailwind Labs migration checklist. Cross-checked against the official upgrade guide [02-v3-to-v4-upgrade-guide.md] and found consistent on every factual claim reused here (border-color default, outline rename, ring default, hover media wrapping, browser floor); no contradictions found.
