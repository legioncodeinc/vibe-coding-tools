# Mermaid authoring reference

Cited from `research/distilled-research-article.md`. Mermaid v11/v12.

## Hard limits (stock renderer defaults)

| Key | Default | Why it matters |
|---|---|---|
| `maxTextSize` | **50000 characters** | Binds before any file-size ceiling. Target < 45,000 |
| `maxEdges` | **500** | Hard cap on drawn edges |
| `securityLevel` | `"strict"` | Does NOT sanitize labels, see below |

## Sanitization is yours

Testing showed `<b>` and `<img onerror=...>` becoming real DOM elements under `strict` as well
as `loose`. Any generator consuming user-authored text must sanitize:

| Input | Do |
|---|---|
| `<` `>` | Substitute (e.g. parentheses). This is a security control |
| `"` | Substitute, or use entity `#quot;` |
| `#` | Entity `#35;` |
| newline | `<br/>` (renders correctly at every security level) |
| lowercase `end` as a node id | Capitalize. Lowercase `end` breaks the flowchart |
| node id starting `o`/`x` right after `---` | Add a space or capitalize; otherwise you get a circle/cross edge |

Always wrap labels in double quotes: `id["text"]`.

## Layout: the rank rule

Nodes sharing a rank stack perpendicular to the flow direction. A parent fanning out to N
children puts all N on one rank, producing a single very long line.

**Fix for sets:** chain the children into rows with the invisible link `~~~`, which emits no
path element.

```
W --> E0
E0 ~~~ E1 ~~~ E2 ~~~ E3
W --> E4
E4 ~~~ E5 ~~~ E6 ~~~ E7
```

**Column count, derived not fixed:**

```python
cols = max(2, round(0.91 * math.sqrt(n)))   # targets a ~1.8 aspect ratio
```

Measured cell size ~389 x 178px for a three-line label under **v11 / Dagre**. Re-measure
before trusting on v12 / ELK.

Measured at N=30: plain fan-out 605x5316 (0.11) vs row-chained 2280x916 (2.49).

**Do not grid a sequence.** Row chaining is for sets (a workflow's emails). A workflow's steps
are a sequence; a tall column is the honest shape.

**Do not grid a node that carries real edges.** The layout engine then has to satisfy both the
invisible row and the real edge, and the real edges sweep across the diagram. Measured ink per
edge on a 46-node chart: chain everything 1290, chain nothing 767, chain only the edgeless 637.

**Group by connected component.** Give each component its own labelled subgraph and put the
unconnected nodes in a box that says why they are unconnected. A node with no visible reason
for being alone reads as a bug.

**Then chain the containers, never the connected nodes.** `SGC1 ~~~ SGC2 ~~~ SGC3` lays the
boxes out along the flow direction. Measured cost: none. Ink 597 and detour 1.095 were
identical chained and unchained, while the aspect flipped from 0.36 (tall stack) to 2.98
(left-to-right row). Containers carry no edges between themselves, so the layout engine
satisfies the invisible row without bending a real edge; individual nodes in a component do
carry edges, which is why chaining those degraded ink to 1290.

## Picking a direction

For a graph with wide ranks, the direction that reads across the screen is the opposite of
intuition. `LR` flows left to right but stacks each rank's parallel nodes **vertically**;
`TD` flows downward but spreads them **horizontally**.

| Shape | Want a wide chart | Want a tall chart |
|---|---|---|
| Bipartite / wide ranks | `TD` | `LR` |
| Sequence | `LR` | `TD` |

Measured on a 16-node bipartite chart: `LR` 558x1458 (ratio 0.38), `TD` 2687x231 (ratio
11.63), with detour essentially unchanged at 1.050 vs 1.053. Do not chain nodes to widen a
connected component; every chaining variant pushed detour to 1.188 or worse.

## Straightness

Do not reach for `curve` to get straighter lines. Measured on a wide fan-out, the default is
already the straightest: default 840 ink / 1.097 detour, linear 868 / 1.133, monotoneY 869,
stepBefore and stepAfter 915, cardinal 935, natural 956. `layout: elk` silently falls back in
the plain `mermaid@11` ESM build.

Verify straightness by measuring, not by eye: mean `path.flowchart-link` `getTotalLength()`
(ink per edge), and that divided by straight-line endpoint distance (detour, 1.0 is perfect).

**Detour is the straightness measure; ink is the length measure.** They diverge whenever the
canvas size changes: switching a bipartite chart from `LR` to `TD` raised ink 423 to 616 while
detour barely moved, because the lines are longer, not bendier. Judge straightness on detour.

## Subgraph trap

> "If any of a subgraph's nodes are linked to the outside, subgraph direction will be ignored."

Put the parent node **inside** its own subgraph rather than pointing in from outside.

## Version drift

v12 flowcharts default to ELK layout, `redux-color` theme, `neo` look. Pin the old behavior:

```
---
config:
  theme: default
  look: classic
  layout: dagre
---
```

`defaultRenderer` was removed in v12. The config schema lists a global `layout` default of
`"swimlane"` while the flowchart page names ELK; the per-diagram default governs. Set `layout`
explicitly when it matters.

## Styling

Use `classDef` plus `:::class`. External CSS is silently overridden because Mermaid injects
`!important` scoped to the SVG id.

## Validation

`mermaid.render(id, code)` resolving without throwing is a reliable syntax check. Confirm
grouping by counting `.cluster` elements in the result.
