# jasongitmail/shadcn-compare (component coverage comparison)

- URL: https://github.com/jasongitmail/shadcn-compare
- Fetched: 2026-08-14
- Source type: community
- Component: gaps

"Compares components available in shadcn (React), shadcn-svelte, bits-ui (Svelte), & melt-ui (Svelte). Updated daily via cron." Last updated at fetch time: 2026-04-02T00:40:50.029Z.

## Comparison table (excerpt, ❌ = not present as a first-class shadcn-svelte/shadcn doc entry, 🟢 = present with link)

| Component Name | shadcn (React) | shadcn-svelte | bits-ui | melt-ui |
| --- | --- | --- | --- | --- |
| Accordion | ❌ | ❌ | 🟢 | 🟢 |
| Alert Dialog | ❌ | ❌ | 🟢 | ❌ |
| Aspect Ratio | ❌ | ❌ | 🟢 | ❌ |
| Avatar | ❌ | ❌ | 🟢 | 🟢 |
| Button | ❌ | ❌ | 🟢 | ❌ |
| Calendar | ❌ | ❌ | 🟢 | 🟢 |
| Checkbox | ❌ | ❌ | 🟢 | 🟢 |
| Collapsible | ❌ | ❌ | 🟢 | 🟢 |
| Combobox | ❌ | ❌ | 🟢 | 🟢 |
| Command | ❌ | ❌ | 🟢 | ❌ |
| Context Menu | ❌ | ❌ | 🟢 | 🟢 |
| Date Field | ❌ | ❌ | 🟢 | 🟢 |
| Date Picker | ❌ | ❌ | 🟢 | 🟢 |
| Date Range Field | ❌ | ❌ | 🟢 | 🟢 |
| Date Range Picker | ❌ | ❌ | 🟢 | 🟢 |
| Dialog | ❌ | ❌ | 🟢 | 🟢 |
| Dropdown Menu | ❌ | ❌ | 🟢 | 🟢 |
| Label | ❌ | ❌ | 🟢 | 🟢 |
| Link Preview | ❌ | ❌ | 🟢 | 🟢 |
| Menubar | ❌ | ❌ | 🟢 | 🟢 |
| Meter | ❌ | ❌ | 🟢 | ❌ |
| Navigation Menu | ❌ | ❌ | 🟢 | ❌ |
| PIN Input | ❌ | ❌ | 🟢 | ❌ |
| Pagination | ❌ | ❌ | 🟢 | 🟢 |
| Popover | ❌ | ❌ | 🟢 | 🟢 |
| Progress | ❌ | ❌ | 🟢 | 🟢 |
| Radio Group | ❌ | ❌ | 🟢 | 🟢 |
| Range Calendar | ❌ | ❌ | 🟢 | 🟢 |
| Rating Group | ❌ | ❌ | 🟢 | ❌ |
| Scroll Area | ❌ | ❌ | 🟢 | 🟢 |
| Select | ❌ | ❌ | 🟢 | 🟢 |
| Separator | ❌ | ❌ | 🟢 | 🟢 |
| Slider | ❌ | ❌ | 🟢 | 🟢 |
| Switch | ❌ | ❌ | 🟢 | 🟢 |
| Table Of Contents | ❌ | ❌ | ❌ | 🟢 |
| Tabs | ❌ | ❌ | 🟢 | 🟢 |
| Tags Input | ❌ | ❌ | ❌ | 🟢 |
| Time Field | ❌ | ❌ | 🟢 | ❌ |
| Time Range Field | ❌ | ❌ | 🟢 | ❌ |
| Toast | ❌ | ❌ | ❌ | 🟢 |
| Toggle | ❌ | ❌ | 🟢 | 🟢 |
| Toggle Group | ❌ | ❌ | 🟢 | 🟢 |
| Toolbar | ❌ | ❌ | 🟢 | 🟢 |
| Tooltip | ❌ | ❌ | 🟢 | 🟢 |
| Tree | ❌ | ❌ | ❌ | 🟢 |

Caveat on reading this table: the ❌ marks under "shadcn (React)" and "shadcn-svelte" columns for widely-known shipped components (Button, Dialog, Select, Accordion, etc.) look surprising, since these components visibly exist in both ecosystems' official docs. This strongly suggests the comparison tool's crawler/matching logic (likely matching against a specific URL slug pattern on ui.shadcn.com/docs/components and shadcn-svelte.com/docs/components) is stale, broken, or scoped only to a subset it could positively verify at crawl time, not a reliable signal that these components are actually absent. Gap: flagged as a data-quality problem in the source tool itself; do not treat the shadcn / shadcn-svelte ❌ columns as ground truth. The bits-ui and melt-ui columns (mostly 🟢) are more plausible signals of what's available at the primitive layer.

## Toast: a genuine, corroborated gap

Contrasting evidence: shadcn-svelte does NOT ship a Toast primitive from Bits UI; it uses `svelte-sonner` (a Svelte port of the `sonner` React toast library) instead, per raw/06-tailwind-v4-migration.md's dependency list (`svelte-sonner@latest`) and its usage in raw/10-forms-formsnap-superforms.md's SPA form example (`import { toast } from "svelte-sonner";`). This is a genuine, corroborated architectural difference: shadcn/ui (React) also uses `sonner` directly (not a Radix primitive) for its Toast, so this is actually parity, not a gap, in that one specific case.

## Navigation Menu: a genuine historical gap, since closed

- URL: https://github.com/huntabyte/shadcn-svelte/discussions/1705
- Fetched: 2026-08-14
- Source type: community
- Component: gaps

"Add Navigation Menu component from shadcn/ui" - a user asked for the Navigation Menu component, calling it "among the most missing ones" relative to shadcn/ui (React). huntabyte's reply: "Yes it will be coming soon now that Bits UI v1 is out." Cross-reference: the jasongitmail/shadcn-compare table above shows Navigation Menu as 🟢 available in bits-ui, meaning the underlying primitive now exists; shadcn-svelte's own `/docs/components/navigation-menu` availability was not independently re-verified in this archive. Gap: could not confirm from primary shadcn-svelte docs whether Navigation Menu is now in the official shadcn-svelte component list, only that the blocking dependency (Bits UI Navigation Menu primitive) has shipped.

## Historical porting lag (Drawer/Vaul, Sonner)

- URL: https://github.com/huntabyte/shadcn-svelte/discussions/556
- Fetched: 2026-08-14
- Source type: community
- Component: gaps

"Updating to latest shadcn/ui" discussion: a user asked whether new shadcn/ui (React) components/updates could be ported. Reply notes the Drawer component (built on Vaul in React) needed Vaul itself ported to Svelte first ("I see the drawer is built on top of Vaul which seems to be react specific"), and that huntabyte had been "streaming porting Vaul to svelte and cleaning up the existing svelte-sonner." This documents a structural gap pattern: when a shadcn/ui (React) component depends on a React-only headless library (Vaul, cmdk, etc.), shadcn-svelte availability is gated on someone porting that headless dependency to Svelte first, not just re-authoring the styled wrapper. (Vaul was subsequently ported and shipped as `vaul-svelte`, referenced as a dependency in raw/06-tailwind-v4-migration.md's `pnpm i ... vaul-svelte@next ...` upgrade command.)

## Summary framing from the official shadcn-svelte docs

Per raw/14-copy-in-philosophy-and-component-anatomy.md (Introduction page): "Here you can find all the components available in the library. We are working on adding more components." This is the project's own framing: it is an actively-growing, community-maintained port, not a 1:1 mirror released in lockstep with shadcn/ui (React); new components land as the underlying Svelte headless-primitive ecosystem (mainly Bits UI, occasionally Melt UI or a fresh Svelte port of a React-only dependency) catches up.
