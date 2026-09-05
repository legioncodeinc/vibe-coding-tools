# shadcn-svelte: CLI (raw dump)

> **Source:** https://www.shadcn-svelte.com/docs/cli
> **Fetched:** 2026-06-29
> **Method:** Firecrawl-scrape-equivalent web reader
> **Why kept:** The `init` and `add` commands are the two commands the Bee uses
> every time it brings in a new component. Documents exactly what each writes,
> so the Bee knows what to expect and what to review.

---

Use the shadcn-svelte CLI to add components to your project.

## init

Use the `init` command to initialize dependencies for a new project: installs
dependencies, adds the `cn` utility, and creates CSS variables for theming.

```bash
npx shadcn-svelte@latest init
```

You can also pass options to skip prompts:

```bash
npx shadcn-svelte@latest init --base-color slate
```

Options:

- `-c, --cwd <cwd>`: the working directory.
- `--base-color <name>`: the base color (neutral, gray, slate, zinc, stone).
- `--no-deps`: skip installing dependencies.
- `--no-src-dir`: use root-relative paths instead of `src/`.
- `-y, --yes`: skip confirmation prompt.
- `-f, --force`: force overwrite of existing `components.json`.
- `-s, --silent`: mute output.
- `--src-dir` / `--no-src-dir`: toggle the src dir.
- `--css <css>`: path to the global CSS file.
- `--components-alias <path>`: components alias (e.g. `$lib/components`).
- `--utils-alias <path>`: utils alias (e.g. `$lib/utils`).
- `--ui-alias <path>`: UI alias (e.g. `$lib/components/ui`).
- `--hooks-alias <path>`: hooks alias (e.g. `$lib/hooks`).
- `--lib-alias <path>`: lib alias (e.g. `$lib`).
- `--overwrite`: overwrite existing config.

## add

Use the `add` command to add components to your project.

```bash
npx shadcn-svelte@latest add [component]
```

The CLI:

1. Reads `components.json` to find the components and utils aliases.
2. Fetches the component's Svelte source from the shadcn-svelte registry.
3. Writes the component source files into `$lib/components/ui/<component>/`.
4. Installs any npm dependencies the component needs (Bits UI, etc.).

Examples:

```bash
npx shadcn-svelte@latest add button
npx shadcn-svelte@latest add button card dialog
npx shadcn-svelte@latest add --all
```

Options:

- `-o, --overwrite`: overwrite existing files.
- `-c, --cwd <cwd>`: working directory.
- `-a, --all`: add all components.
- `-y, --yes`: skip confirmation prompt.
- `-f, --force`: force overwrite.
- `-p, --path <path>`: the registry path.

## diff

Check for updates to your components against the registry:

```bash
npx shadcn-svelte@latest diff
```

Useful when a component has been updated upstream (an accessibility fix, a
behavior patch) and you want to see what changed before manually merging it into
your copy-in version.

## What lives where after a component is added

For example, `npx shadcn-svelte@latest add button` produces:

```
$lib/components/ui/button/
├── index.ts        # re-exports Button, buttonVariants, type Button
├── button.svelte   # the actual <Button> component
└── index.ts        # exports
```

These files are **owned by the project**. They are not in `node_modules`. You
can edit them, theme them, and they survive `npm install`. This is the core
shadcn model (Open Source, Open Code, Build Your Own) and it is what makes the
phased rollout in ADR-007 possible: each component lands independently.
