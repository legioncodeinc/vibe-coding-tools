# 04. Route: map the captured library onto shadcn/ui

Turns the component library from guide 02 into a migration map for [shadcn/ui](https://ui.shadcn.com): which shadcn component (and variant, size, and subcomponents) rebuilds each captured component, which new variants and custom tokens are needed, the exact install command, and a draft theme (`globals.css`) that makes a fresh shadcn/ui install look like the captured app. Requires a built library (`ledger.json`). Read `00-foundation.md` first.

## Deliverables

Written to `<output.inventory>/shadcn/` and carried inside the Claude Design handoff zip:

| File | Contents |
| --- | --- |
| `SHADCN-MAP.md` | Human and AI readable migration guide: summary by strategy, `init` and `add` commands, new variants, custom tokens, a table of every component, and per-component details (variants, tokens, states, shadcn-svelte equivalent, gaps, composition outline) |
| `shadcn-map.json` | The same, machine readable, including the theme decisions |
| `globals.css` | Theme draft: captured values converted to OKLCH under the captured theme's selector, custom tokens, and the `@theme inline` mapping |
| `batches/` | Agent inputs and outputs (`batch-NN.json`, `map-NN.json`) |

## Grounding

- shadcn/ui's registry lists 54 installable `registry:ui` items as of the fetch date, and its docs add guide-only entries: `data-table` and `date-picker` are guides built from `table` plus TanStack Table and from `popover` plus `calendar`, and `typography` is a style guide [raw/shadcn--components-index.md] [raw/shadcn--data-table.md]. `toast` is deprecated in favor of `sonner` [raw/shadcn--components-index.md].
- Components are added with `npx shadcn@latest add <component>` after `npx shadcn@latest init` [raw/shadcn--cli.md]; project settings live in `components.json` [raw/shadcn--components-json.md].
- `button` variants are `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`, and sizes `default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`, defined with `cva` [raw/shadcn--button.md]. `badge` variants are `default`, `secondary`, `destructive`, `outline`, `ghost`, `link` [raw/shadcn--badge.md].
- Theme tokens are CSS variables under `:root` and `.dark` in OKLCH: `background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent` (each with a `-foreground` pair where documented), `destructive`, `border`, `input`, `ring`, `chart-1` to `chart-5`, the `sidebar-*` set, and `radius`, from which `radius-sm` to `radius-4xl` are derived. New tokens (for example `--warning`) are added under both selectors and exposed with `@theme inline` [raw/shadcn--theming.md] [raw/shadcn--tailwind-v4.md].
- shadcn-svelte is built on Bits UI and uses namespace imports with dot notation (`Select.Root`) where React uses flat exports (`Select`, `SelectTrigger`) [raw/shadcn--svelte-components-index.md] [raw/shadcn--svelte-theming.md].
- Recent shadcn/ui source expresses variants through semantic classes and `data-slot` or `data-variant` attributes, so compare the installed component source before copying variant recipes [raw/shadcn--button.md].

`references/shadcn-catalog.json` encodes these names, variants, and tokens; `shadcn-build.mjs` rejects any mapping outside it. Refresh the catalog when shadcn/ui adds components.

## Steps

1. **Prepare.** `CAPTURE_CONFIG=... node <skill>/scripts/inventory/shadcn-prepare.mjs`. Writes batches of 30 components (each with the ledger entry, parts, related components, and measured variant styles), fills `MAP-INSTRUCTIONS.md` and `THEME-INSTRUCTIONS.md`, and prints the per-agent prompts.
2. **Map.** Dispatch one Sonnet agent per batch with the printed map prompt, plus one Sonnet theme agent with the theme prompt, in parallel. Each mapping agent picks a strategy per component:

   | Strategy | Meaning |
   | --- | --- |
   | `direct` | One shadcn component with an existing variant |
   | `variant` | One shadcn component plus a new cva variant |
   | `compose` | Several shadcn components combined |
   | `custom` | No catalog match; Tailwind and theme tokens |
   | `skip` | Not rebuilt as a component (layout fragments, third-party logos) |

3. **Build.** `CAPTURE_CONFIG=... node <skill>/scripts/inventory/shadcn-build.mjs`. It fails and lists batches to rerun if any component is unmapped or mapped twice, names a component not in the catalog, uses `toast`, or uses a `button`, `badge`, or `alert` variant or size that is neither in the catalog nor declared as a new variant. On success it converts theme hex values to OKLCH (sRGB to XYZ, then Ottosson's Oklab matrices [raw/inventory--oklab-bottosson.md]) and writes the three deliverables.
4. **Rerun what failed.** `shadcn-prepare.mjs --pending` lists batches without a valid map.
5. **Spot check.** Open three `compose` or `custom` entries in `SHADCN-MAP.md` next to their component screenshots. The composition must plausibly rebuild what the screenshot shows.
6. **Package.** Rerun `inventory/design-handoff.mjs` so the Claude Design zip carries the `shadcn/` folder.

## Using the map

- Run the printed `init` and `add` commands in the target app, merge `globals.css` into its global stylesheet (do not overwrite an existing file), then add the new variants to each component's cva definition.
- Build `direct` components first, then `variant`, then `compose`, then `custom`: later components reuse earlier ones.
- Only the captured theme has measured values; the other theme block keeps shadcn defaults until someone designs it.
- The map is a plan, not generated code. Implementation is a code change and goes through the Ship Gate.
