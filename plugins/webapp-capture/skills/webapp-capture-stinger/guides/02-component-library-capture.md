# 02. Route: capture the entire component library

Turns a live app into a component inventory an AI can build a design system from: one folder per unique component with code, measured styles, screenshots, assets, and a written purpose, plus a ledger, raw observed tokens, and DTCG candidate tokens. Read `00-foundation.md` first.

Method: Brad Frost's interface inventory, done by machine. Catalog distinct treatments rather than every DOM instance, and group similar treatments side by side, because that is what exposes unintentional inconsistency [raw/inventory--interface-inventory-brad-frost.md].

## Pipeline

| Stage | Who | Script or prompt | Output |
| --- | --- | --- | --- |
| 1. Extract | code, parallel headless browsers | `inventory/extract.mjs` | `_raw/<state>.json`, `_raw/crops/` |
| 2. Group | code | `inventory/cluster.mjs` | `_raw/groups.json` |
| 3. Tokens | code | `inventory/tokens.mjs`, `inventory/tokens-dtcg.mjs` | `tokens-raw.json`, `candidate.tokens.json` |
| 4. Sheets and batches | code | `inventory/sheets.mjs` | `_raw/ai/sheets/<gid>.webp`, `_raw/ai/batch-NN.json` |
| 5. Describe | Sonnet agents, one per batch of 10 | `inventory/prepare-describe.mjs` fills `prompts/describe-groups.md` | `_raw/ai/desc-NN.json` |
| 6. Merge | Sonnet agent(s) | `inventory/prepare-merge.mjs` fills `prompts/merge-components.md` (and `reconcile-components.md` when sharded); `inventory/validate-merge.mjs` checks the result | `_raw/ai/components.json` |
| 7. Build | code | `inventory/build.mjs` | `components/`, `ledger.json`, `assets/` |
| 8. Claude Design handoff | code | `inventory/design-handoff.mjs` fills `prompts/claude-design-handoff.md` | `<app>-claude-design-handoff-<date>.zip` |
| 9. shadcn/ui map (optional) | Sonnet agent(s) + code | see `guides/04-shadcn-map.md` | `shadcn/shadcn-map.json`, `shadcn/SHADCN-MAP.md`, `shadcn/globals.css` |

Code does everything deterministic. Models only do judgment: naming, purpose, and whether two groups are one component.

## Stage 1: extract

```bash
CAPTURE_CONFIG=library/design/capture.config.json node <skill>/scripts/parallel.mjs inventory/extract.mjs --shards 6
```

Per page state the collector walks every visible element and records:

- **Candidates**: interactive elements (native controls and ARIA widget roles), elements with a visual boundary (background, border, shadow), structural elements (tables, headings, nav), and icon-font glyphs. Each carries tag, role, classes, a child-shape signature, computed styles, rect, text, aria label, state, icons, images, redacted outerHTML, and context (page title, nearest section heading outside the sidebar, field label, parent text).
- **Style statistics** for every text node and box: colors, backgrounds, borders, radii, shadows, font family, size, weight, line height, letter spacing, spacing.
- **CSS custom properties**, once, from the first route: names from `document.styleSheets[*].cssRules` (guarded, since cross-origin sheets throw `SecurityError`) and resolved values from `getComputedStyle(documentElement).getPropertyValue()` [raw/inventory--mdn-cssstylesheet-cssrules.md] [raw/inventory--mdn-cssstyledeclaration-getpropertyvalue.md].
- **Crops** of the first two instances per rough signature, via `locator.screenshot()` with animations disabled [raw/playwright--screenshots.md].

Why these APIs: `getComputedStyle` returns resolved values, which is what renders [raw/inventory--mdn-window-getcomputedstyle.md]; `getBoundingClientRect` gives geometry relative to the viewport [raw/inventory--mdn-element-getboundingclientrect.md]; `compareDocumentPosition` decides whether a heading precedes an element [raw/inventory--mdn-node-comparedocumentposition.md].

Verify coverage before moving on: every configured route has at least one state file. Missing routes are almost always a naming collision or an error in a shard log.

## Stage 2: group

`cluster.mjs` builds exact signatures (category, child shape, background, border, radius, shadow, font, color, quantized padding, display), then merges near-duplicates within a category using a weighted similarity of style fields, design-relevant classes, and child shape, counting only the signals both groups have. Two rules learned in production:

- **No chaining.** Compare each group to its cluster's most common variant, not to any member; transitive union-find merged 168 unrelated wrappers into one group.
- **Icons are their own category.** Glyph name is content, not identity.

Expect roughly a 25 to 1 reduction: 25,698 elements became 948 groups on OmniRoute's 87 routes.

## Stage 3: tokens

- `tokens.mjs` writes `tokens-raw.json`: every observed value with use count and route count, colors converted to hex, including computed values the browser serializes as `lab()` or `oklab()` (observed on a Tailwind v4 app, whose default palette is defined in OKLCH [raw/inventory--tailwind-v4-colors.md]; conversion uses Ottosson's Oklab matrices [raw/inventory--oklab-bottosson.md]), fully rounded radii normalized to `full`, and CSS variables grouped by prefix with light and dark declarations kept per selector.
- `tokens-dtcg.mjs` writes a candidate file in the DTCG Format Module 2025.10 shape: `$type` on groups, `$value` per token, color values as `colorSpace`/`components`/`alpha`/`hex` objects, dimensions as `value`/`unit` [raw/inventory--dtcg-format-spec.md] [raw/inventory--dtcg-color-module.md]. Observation data goes in `$extensions`, which tools must preserve [raw/inventory--dtcg-format-spec.md]. Candidate names reuse the app's CSS variable names when a value matches one; otherwise they are provisional.
- Do not infer `$type` by inspecting a value; the spec forbids it, so types come from the group [raw/inventory--dtcg-format-spec.md].
- Style Dictionary v4 consumes DTCG, but does not yet fully support 2025.10, so a downstream build may need the older DTCG subset [raw/inventory--style-dictionary-dtcg.md].
- On Tailwind v4 apps, `--color-*`, `--font-*`, `--text-*`, `--radius-*`, `--shadow-*`, `--spacing-*` and the other `@theme` namespaces map directly to utilities [raw/inventory--tailwind-v4-theme.md]. Several variables resolving to one value is a redundancy finding for route 03.

## Stage 4: sheets and batches

`sheets.mjs` composes up to four variant crops per group into one labeled image and writes batches of 10 groups. One image per group means one Read per group, which is what keeps describe agents from skipping images.

## Stage 5: describe (Sonnet, batches of 10)

1. Run `inventory/prepare-describe.mjs`. It writes `_raw/ai/INSTRUCTIONS.md` from the template with the app's name, context, and absolute paths, and prints the batch list and the exact three-line prompt to give each agent.
2. Dispatch one Sonnet agent per batch with that prompt.
3. Above the harness subagent cap, run the batches through a workflow with its own concurrency instead of launching agents per notification.
4. For reruns, `prepare-describe.mjs --pending` lists only batches without a valid output.

Model choice, from the pilot: Haiku batches of 47 made 10 tool calls for 47 groups, skipped most images, and wrote generic, sometimes wrong descriptions. Sonnet with batches of 10, composite sheets, and context fields opened every available image and produced specific, token-rich descriptions. Use Sonnet. Spot check two batches against their sheets before trusting the rest.

Validate with `inventory/prepare-merge.mjs`: it exits non-zero and lists the batches to rerun if any group is missing, duplicated, malformed, or not valid JSON.

## Stage 6: merge

1. `inventory/prepare-merge.mjs` builds `_raw/ai/merge-input.json` (each description plus instances, variant count, routes, regions, category, icons, and sheet path), fills the merge instructions, and prints the dispatch plan: one merge agent, or kind-based shards plus a reconcile agent when there are more than `SHARD_ABOVE` (default 200) groups.
2. Dispatch as printed. For sharded runs, wait for every shard before the reconcile agent.
3. Run `inventory/validate-merge.mjs`. It fails unless every group is assigned exactly once, names are unique kebab-case, and every `related[]` name exists. `--fix` drops dangling related names and duplicate assignments (review what it changed).

Scale rule: one merge agent handles about 200 groups well (the pilot merged 187 into 68 components in 14 minutes, opening 19 sheets to settle uncertain merges). Above that, shard the merge by kind (buttons and links; cards, panels, banners; inputs, selects, switches, forms; tables; badges, pills, tags; navigation and layout; icons, logos, images), then run one reconciliation agent over the shard outputs to unify names, `related` links, and cross-kind parts. The merge output must assign every input gid exactly once, to a component or to `unassigned` with a reason.

Classify components with Atomic Design levels as a labeling lens, not a build order [raw/inventory--atomic-design-brad-frost-ch2.md]. Role categories from the ARIA roles reference help separate widgets, landmarks, and live regions, and flag abstract roles used in markup [raw/inventory--mdn-aria-roles-reference.md].

## Stage 7: build

```bash
RAW=library/design/_raw DEST=library/design SOURCE="<app> <origin> (<theme>)" node <skill>/scripts/inventory/build.mjs
```

Each `component.md` shows the merge agent's described values and a table measured in the browser. Keep both: computed values are canonicalized and can legitimately differ from authored ones [raw/inventory--mdn-window-getcomputedstyle.md], and the measured table caught the model reporting the wrong text color and weight on the pilot's primary button.

Record icon font axes where they vary (fill, weight, grade, optical size), since the same glyph renders differently under different axis settings [raw/inventory--material-symbols-guide.md].

## Stage 8: Claude Design handoff (always the last step)

```bash
CAPTURE_CONFIG=library/design/capture.config.json node <skill>/scripts/inventory/design-handoff.mjs
```

Packages everything a design tool needs into one zip in the inventory folder: every component folder (component.md, styles.json, code.html, assets.json, and up to `SHOTS_PER_COMPONENT` screenshots, keeping the first of each variant), `ledger.json`, candidate DTCG tokens plus a readable `tokens-summary.md`, the newest visual and code audit reports, the first screenshot of every page and tab state, the icon and image inventory, the shadcn/ui map when one exists, and `CLAUDE-DESIGN-INSTRUCTIONS.md`: a brief filled with the app's name, context, theme, route and state counts, key numbers, and the top inconsistencies from the ledger, telling Claude Design how to read the package and what to produce (foundations, typography, spacing and elevation, component specs, inconsistency resolutions, a visual guide, and a DTCG `tokens.json`).

Images are converted to lossless WebP, which is pixel-identical and much smaller (the OmniRoute package: 252 components, 791 component and 104 page screenshots in 31 MB). Set `KEEP_PNG=1` to keep PNGs. The script warns above 200 MB; lower `SHOTS_PER_COMPONENT` to shrink it.

Deliver the zip to the user with the upload instruction printed at the top of the brief: upload the zip to Claude Design and ask it to read `CLAUDE-DESIGN-INSTRUCTIONS.md` and follow it.

## Final layout

```text
library/design/
  ledger.json
  tokens-raw.json
  candidate.tokens.json
  <app>-claude-design-handoff-<date>.zip
  shadcn/          (optional: shadcn-map.json, SHADCN-MAP.md, globals.css)
  assets/icons.json
  assets/images.json
  components/<name>/component.md | code.html | styles.json | assets.json | screenshots/
  _raw/            (extraction data; keep out of commits unless the user wants it, it is large)
```

## Done when

- All routes and real tabs have state files; blind spots from `00-foundation.md` are listed.
- Every group is described once and assigned once.
- Two random components were spot checked against their screenshots and measured tables.
- `ledger.json` inconsistencies are handed to route 03, and the user has reviewed a sample before any commit.
