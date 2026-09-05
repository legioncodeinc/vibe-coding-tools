# Migrating v3 to v4

Full breaking-change table: `references/v3-to-v4-migration-cheatsheet.md`. This guide is the procedure.

## Step 1: branch

Per this repo's plan-construction protocol, branch off `main` before touching anything. This is also the first step the community migration source recommends independently. [raw/13-v3-to-v4-migration-community-guide.md]

## Step 2: run the upgrade tool, don't hand-migrate

```bash
npx @tailwindcss/upgrade
```

Requires Node 20+. It rewrites `@tailwind` directives to `@import "tailwindcss"`, converts as much of `tailwind.config.js` into `@theme` as it can, updates dependencies, and renames utility classes across templates. [raw/02-v3-to-v4-upgrade-guide.md]

Do this on a project already updated to the latest v3.4 first; running the codemod against a stale v3 install gives it more to reconcile and produces a messier diff. [raw/13-v3-to-v4-migration-community-guide.md]

## Step 3: read the diff before trusting it

The tool handles the bulk of the work but not everything. Anything in a complex JS config that doesn't map cleanly to CSS is left for manual porting. Review the generated `@theme` block against the original config by hand.

## Step 4: fix the two changes most likely to cause a silent visual bug

1. **Default border/divide color**: v3 defaulted to `gray-200`; v4 defaults to `currentColor`. A bare `border` class will now draw in whatever the text color is. Add an explicit color, or add the compatibility base-layer rule from the cheatsheet.
2. **`outline-none` rename**: v3's `outline-none` kept an invisible-but-forced-colors-visible outline; that behavior is now `outline-hidden`. The new `outline-none` really does set `outline-style: none`. A form input or popover search field relying on the old semantics will visibly regress (a real reported production bug). [raw/02-v3-to-v4-upgrade-guide.md], [raw/13-v3-to-v4-migration-community-guide.md]

## Step 5: set up dark mode if the project uses the class strategy

v4's default dark mode is `prefers-color-scheme`, with zero setup. If the project toggles a `.dark` class or `data-theme` attribute, that now has to be declared explicitly via `@custom-variant`. See `guides/04-dark-mode-and-variants.md`. Missing this step is the most common "dark mode stopped working after the v4 upgrade" report. [raw/05-dark-mode-custom-variant.md]

## Step 6: confirm the browser support floor

Safari 16.4+, Chrome 111+, Firefox 128+. If the project has a documented requirement to support older browsers, v4 is not currently an option; stay on v3.4. [raw/02-v3-to-v4-upgrade-guide.md]

## Step 7: cleanup pass

- Search for `!` at the start of class names and consider migrating to the trailing `!` syntax (old form still works but is deprecated).
- Search for `transform-none` used to reset `scale`/`rotate`/`translate` and replace with the individual reset (`scale-none`, etc).
- Search for `transition-[...,transform]` and split into the individual properties (`opacity,scale`) if the utilities being transitioned are the new individual transform utilities.
- Search for `@apply` inside `.svelte`, `.vue`, or CSS-module files and add `@reference` where missing (see `references/v3-to-v4-migration-cheatsheet.md`).

Full table of every rename, removal, and default-value change: `references/v3-to-v4-migration-cheatsheet.md`, sourced from [raw/02-v3-to-v4-upgrade-guide.md].

## What NOT to do

Don't hand-roll the migration by grepping for `@tailwind` and doing find-and-replace. The upgrade tool exists because the rename surface (shadow/blur/radius scale, gradients, transform utilities, arbitrary-value CSS-variable syntax) is large enough that manual migration reliably misses something. [raw/13-v3-to-v4-migration-community-guide.md]
