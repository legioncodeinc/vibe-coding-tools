# Theming and CSS variables

Full token table in [references/theming-token-reference.md](../references/theming-token-reference.md). This guide covers the mechanics, generically, for any Svelte project. It does not cover OSPRY's PRD-071 token bridge or `--brand-*` contract; that's `ux-ui-svelte-stinger`'s domain.

## The convention

Tokens come in `<name>` / `<name>-foreground` pairs. `<name>` is the background color; `<name>-foreground` is the text painted on it. The word "background" itself is dropped from the base pair's name [research/raw/05-theming-tokens.md]:

```css
--primary: oklch(0.205 0 0);
--primary-foreground: oklch(0.985 0 0);
```

```svelte
<div class="bg-primary text-primary-foreground">Hello</div>
```

## Where tokens live

Two blocks in your global CSS file: `:root` (light values) and `.dark` (dark values). `--radius` is the one exception, set once in `:root` only, since it's not a color [research/raw/05-theming-tokens.md].

## The Tailwind v4 bridge

A CSS custom property in `:root`/`.dark` is not automatically a Tailwind utility. You expose it by re-declaring it inside `@theme inline`:

```css
@theme inline {
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
}
```

Only after this does `bg-primary` work as a utility class [research/raw/06-tailwind-v4-migration.md]. This is the single most common thing to check when a new color "doesn't work": was it added to `:root`/`.dark` but never re-declared in `@theme inline`?

The dark-mode variant itself is wired by one line: `@custom-variant dark (&:is(.dark *));`: this is what makes every `dark:` utility respond to a `.dark` class anywhere in the ancestor chain [research/raw/06-tailwind-v4-migration.md]. If `dark:` utilities aren't responding, check this line exists before debugging anything else.

## Adding a new token, step by step

```css
:root {
  --warning: oklch(0.84 0.16 84);
  --warning-foreground: oklch(0.28 0.07 46);
}

.dark {
  --warning: oklch(0.41 0.11 46);
  --warning-foreground: oklch(0.99 0.02 95);
}

@theme inline {
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
}
```

Now `bg-warning` and `text-warning-foreground` are valid utility classes [research/raw/05-theming-tokens.md].

## No more tailwind.config file

Tailwind v4 config lives entirely in CSS via `@theme` / `@theme inline` / `@plugin`. There is no `tailwind.config.js` or `.ts` to edit; if one exists in a project you're reviewing that has already migrated to v4, that's a leftover that should have been deleted during migration [research/raw/06-tailwind-v4-migration.md].

## Color format

Current shadcn-svelte ships OKLCH values (`oklch(1 0 0)`); Tailwind-v3-era projects instead wrapped the same tokens in `hsl(...)`. Either is a valid CSS color; OKLCH is preferred going forward for perceptually-even lightness across hues [research/raw/06-tailwind-v4-migration.md].

## Base color presets

Chosen once at `init` via `--base-color`, cannot change after without regenerating components: `neutral`, `stone`, `zinc`, `gray`, `slate` have full documented palettes; `mauve`, `olive`, `mist`, `taupe` are valid CLI choices whose full palette values weren't captured in this skill's research archive (gap: verify against current docs if you need one of these four) [research/raw/05-theming-tokens.md], [research/raw/01-cli-command-reference.md].

## Registry-driven tokens

A custom or private registry item can ship `cssVars.light` / `cssVars.dark` / `cssVars.theme` in its `registry-item.json`; installing that item via `add` writes those variables into the project's CSS file automatically, including non-color theme values like `spacing` or `breakpoint-*` [research/raw/09-registry-item-json-schema.md]. See [guides/01-installation-and-cli.md](01-installation-and-cli.md) and the registry section of [references/cli-command-reference.md](../references/cli-command-reference.md) for the registry system itself.
