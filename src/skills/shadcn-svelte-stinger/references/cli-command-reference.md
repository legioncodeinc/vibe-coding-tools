# CLI command reference

Every shadcn-svelte CLI command and flag, grounded in [distilled-shadcn-svelte.md](research/distilled-shadcn-svelte.md) section 4, citing [raw/01-cli-command-reference.md](research/raw/01-cli-command-reference.md) and [raw/02-installation-sveltekit-and-components-json.md](research/raw/02-installation-sveltekit-and-components-json.md).

All commands work through any package-manager runner: `pnpm dlx`, `npx`, `bun x` (yarn is equivalent). Examples below use `npx`; swap the runner as needed.

## init

Bootstraps a new project: installs dependencies, adds the `cn` util, and creates CSS variables.

```bash
npx shadcn-svelte@latest init
```

You'll be prompted for base color, global CSS file path, and import aliases (lib, components, utils, hooks, ui). This writes `components.json`.

```
Usage: shadcn-svelte init [options]

Options:
  --preset <preset>          the preset to use
  -c, --cwd <path>           the working directory
  --no-deps-install          add dependencies to package.json without running install
  --skip-preflight           ignore preflight checks and continue (default: false)
  --reinstall                reinstall existing components when style changes
  --no-reinstall             skip reinstalling existing components when style changes
  --base-color <name>        the base color for the components
                              (choices: "neutral", "stone", "zinc", "mauve", "olive", "mist", "taupe")
  --css <path>               path to the global CSS file
  --components-alias <path>  import alias for components
  --lib-alias <path>         import alias for lib
  --utils-alias <path>       import alias for utils
  --hooks-alias <path>       import alias for hooks
  --ui-alias <path>          import alias for ui
  --proxy <proxy>            fetch items from registry using a proxy
  -h, --help                 display help for command
```

Non-interactive init (useful for scripting or CI scaffolding):

```bash
npx shadcn-svelte@latest init --base-color slate --css src/app.css \
  --components-alias '$lib/components' --ui-alias '$lib/components/ui' \
  --utils-alias '$lib/utils' --lib-alias '$lib' --hooks-alias '$lib/hooks' \
  --yes
```

Note: `-y`/`--yes` is documented under `add`, not confirmed present on `init` in the archive; when scripting `init` non-interactively, prefer a `--preset` if one is defined, or expect the interactive prompts unless every alias/base-color flag is supplied explicitly.

## add

Adds one or more components (or a URL to a custom registry item) to the project.

```bash
npx shadcn-svelte@latest add button
npx shadcn-svelte@latest add button card dialog
npx shadcn-svelte@latest add https://example.com/r/hello-world.json
```

```
Usage: shadcn-svelte add [options] [components...]

Options:
  -c, --cwd <path>   the working directory (default: the current directory)
  --no-deps-install  add dependencies to package.json without running install
  --skip-preflight   ignore preflight checks and continue (default: false)
  -a, --all          install all components to your project (default: false)
  -y, --yes          skip confirmation prompt (default: false)
  -o, --overwrite    overwrite existing files (default: false)
  --proxy <proxy>    fetch components from registry using a proxy
  -h, --help         display help for command
```

Run with no arguments to see the full list of installable components:

```bash
npx shadcn-svelte@latest add
```

### Upgrade-in-place pattern (all components, overwriting)

```bash
git add . && git commit -m "chore: checkpoint before shadcn-svelte update"
npx shadcn-svelte@latest add --all --overwrite
# then: git diff, and manually re-apply any custom edits component by component
```

Maintainer-endorsed discipline: commit first, update one component at a time when you've made local edits (rather than `--all`), review each diff, re-apply your changes. See [guides/06-customizing-without-breaking-upgrades.md](guides/06-customizing-without-breaking-upgrades.md).

## apply

Applies a preset (a bundled theme/style/font combination) to an existing project.

```bash
npx shadcn-svelte@latest apply a2r6bw
npx shadcn-svelte@latest apply a2r6bw --only theme
```

`--only` accepts `theme` or `font` to apply just that slice of a preset without reinstalling UI components.

```
Usage: shadcn-svelte apply [options]

Arguments:
  preset             the preset to apply

Options:
  --preset <preset>  the preset to apply
  --only [parts]     apply only parts of a preset: theme, font
  -c, --cwd <path>   the working directory (default: the current directory)
  -y, --yes          overwrite existing files without confirmation (default: false)
  -s, --silent       mute output (default: false)
  --no-deps-install  add dependencies to package.json without running install
  --skip-preflight   ignore preflight checks and continue (default: false)
  --proxy <proxy>    fetch items from registry using a proxy
  -h, --help         display help for command
```

## registry build

Generates registry JSON files from a `registry.json` manifest, for anyone hosting their own custom/private registry.

```bash
npx shadcn-svelte@latest registry build
npx shadcn-svelte@latest registry build ./registry.json --output ./static/r
```

```
Usage: shadcn-svelte registry build [options] [registry]

Arguments:
  registry             path to registry.json file (default: ./registry.json)

Options:
  -c, --cwd <path>     the working directory (default: the current directory)
  -o, --output <path>  destination directory for json files (default: ./static/r)
  -h, --help           display help for command
```

## Proxy support

If `HTTP_PROXY` / `http_proxy` env vars are set, all outgoing registry requests respect them. You can also pass `--proxy <proxy>` explicitly on `init`, `add`, `apply`, or via env:

```bash
HTTP_PROXY="<proxy-url>" npx shadcn-svelte@latest init
```

## No dedicated `update` verb

There is no first-class `shadcn-svelte update` command in the current CLI surface. What exists instead: `add <component> --overwrite` (single component), `add --all --overwrite` (everything), and the `apply`/`registry build` machinery for preset-driven updates. This was a documented feature request (2023) that evolved into the overwrite-based flow rather than a dedicated diff/merge command [raw/14-copy-in-philosophy-and-component-anatomy.md]. See [guides/06-customizing-without-breaking-upgrades.md](guides/06-customizing-without-breaking-upgrades.md) for the full workflow.
