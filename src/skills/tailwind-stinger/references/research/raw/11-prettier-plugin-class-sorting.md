# Automatic Class Sorting with Prettier
- URL: https://tailwindcss.com/blog/automatic-class-sorting-with-prettier
- Fetched: 2026-08-14
- Source type: official docs (Tailwind Labs blog)
- Component: class-ordering

Published: 2022-01-24.

The official `prettier-plugin-tailwindcss` scans templates for class attributes containing Tailwind CSS classes and sorts them automatically following Tailwind's recommended class order. "It works seamlessly with custom Tailwind configurations, and because it's just a Prettier plugin, it works anywhere Prettier works, including every popular editor and IDE, and of course on the command line."

Install:

```
npm install -D prettier prettier-plugin-tailwindcss
```

Add to Prettier config:

```json
{ "plugins": ["prettier-plugin-tailwindcss"] }
```

Can also be loaded via the `--plugin` CLI flag or the `plugins` option of the Prettier API.

## How classes are sorted

"At its core, all this plugin does is organize your classes in the same order that Tailwind orders them in your CSS." Classes in the `base` layer sort first, then `components`, then `utilities`. Utilities are sorted in the same order Tailwind sorts them in generated CSS, so overriding classes always appear later in the list. The order is loosely based on the box model: high-impact layout classes come first, decorative classes come later, and related utilities are kept together.

- Modifiers like `hover:` and `focus:` are grouped together, sorted after plain utilities.
- Responsive modifiers (`sm:`, `md:`, etc.) are grouped and sorted in the same order they're configured (smallest to largest by default).
- Custom classes that don't come from Tailwind (e.g. classes for a third-party library) always sort to the front of the class list, making it easy to spot at a glance when an element uses them.

Example before/after:

```html
<!-- Before -->
<button class="text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800">Submit</button>
<!-- After -->
<button class="bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3">Submit</button>
```

## Customization

There is intentionally no way to change the sort order. "We think Prettier gets it right when it comes to being opinionated and offering little in terms of customizability, at the end of the day the biggest benefit to sorting your classes is that it's just one less thing to argue with your team about." The plugin respects `tailwind.config.js` (v3) and works with installed Tailwind plugins.

## Package details and API (v4-relevant options)
- URL: https://github.com/tailwindlabs/prettier-plugin-tailwindcss
- Fetched: 2026-08-14
- Source type: official docs (GitHub README, tailwindlabs org)
- Component: class-ordering

- Requires Prettier v3+ (ESM-only as of v0.5.x; cannot be loaded via `require()`).
- Sorts classes in the `class` attribute, framework-specific equivalents (`className`, `:class`, `[ngClass]`), and Tailwind `@apply` directives, by default.
- `createSorter` options relevant to v4 projects: `stylesheetPath` (optional) — path to the CSS stylesheet used by Tailwind CSS v4+, resolved relative to `base`, replacing the v3-era `configPath` (path to a `tailwind.config.js`).
- `preserveWhitespace` and `preserveDuplicates` options (both default `false`).
- Compatibility rule: `prettier-plugin-tailwindcss` must be loaded last relative to other Prettier plugins.

## Editor setup guidance
- URL: https://tailwindcss.com/docs/editor-setup
- Fetched: 2026-08-14
- Source type: official docs
- Component: class-ordering

The official Prettier plugin "works seamlessly with custom Tailwind configurations, and because it's just a Prettier plugin, it works anywhere Prettier works, including every popular editor and IDE, and of course on the command line." Cursor (and other VS Code-compatible editors) get the plugin's sorting for free through standard Prettier integration, alongside the official Tailwind CSS IntelliSense extension.
