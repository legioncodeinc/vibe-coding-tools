# Distilled research: GHL export to Mermaid

Every claim below cites a file in `raw/`. Where sources disagree, both readings are stated and
the operative one is named. Where evidence is thin, it says so.

| Cite | File |
|---|---|
| `[flow]` | `raw/mermaid--flowchart-syntax--official-docs.md` |
| `[cfg]` | `raw/mermaid--config-schema--official-docs.md` |
| `[meas]` | `raw/mermaid--label-rendering-and-layout--own-measurements.md` |
| `[exp]` | `raw/supersnapshot--location-export-schema--observed.md` |
| `[noapi]` | `raw/ghl--workflows--no-read-api-for-step-logic.md` |

---

## 1. Why an export is the only input

HighLevel documents no endpoint to create, edit, publish, or **read** the logic or steps of a
workflow; `/workflows/` lists workflows and enrolls contacts, nothing more `[noapi]`. Workflow
structure is therefore unavailable over the API at any documented version, and a browser-side
snapshot export is the only practical source `[noapi]`.

This bounds the component honestly: it reads an export, cannot write back, and cannot refresh
itself. A stale export yields a stale chart with no platform signal `[noapi]`.

## 2. The export already contains a resolved graph

The SuperSnapshot location export carries two derived structures beyond the raw asset lists
`[exp]`:

| Key | Contents |
|---|---|
| `_workflowSteps.steps` | Flat step list; each step has `workflowId`, `stepId`, `type`, `next[]`, `references[]`, optional `branches[]`, `waitDuration`, `subject` |
| `_graph` | `{id, type, ghlId, name, ...}` nodes and `{from, to, type, via, resolved}` edges, where `from` is always a `workflow:` node and `via` is `"workflow_step:<stepId>"` |

So this is a **projection problem, not a parsing problem**. Linkage is pre-resolved; the work
is slicing and rendering `[exp]`.

### Traversal rules that are verified, not assumed

- Every workflow has **exactly one** root step (a step no `next[]` points to) `[exp]`.
- **Zero** `next[]` targets fall outside their own workflow `[exp]`.
- `order` is **not** a workflow sequence. It is branch-scoped; one workflow has 77 steps all at
  `order: 0`. Sequence must come from traversing `next[]` `[exp]`.
- Scope the "targeted" set **per workflow**. Testing `next[]` against a set pooled across all
  workflows falsely reports rootless workflows `[exp]`.
- `branches[]` entries are `{id, name, conditionCount}` where `id` is a sibling step also
  listed in `next[]`, so a branch is both an edge label and a node `[exp]`.

### Known gaps in the export

- **75 of 75 `goto` steps carry an empty `next[]`.** The jump destination is not recorded, so
  those paths dead-end `[exp]`.
- 7 workflows have no surviving trigger record `[exp]`.
- Single-sample schema: field presence comes from one account; code defensively `[exp]`.

## 3. Email assets: body present, metadata mostly absent

`email_actions` carries message body in `html` and `bodyPreview` `[exp]`. Any generator that
renders or shares extracts must exclude those fields explicitly.

Of the emails a workflow actually references, only a small minority are `email_actions` with a
`subject`; the large majority are `email_templates`, which carry **no subject and no sender at
all** — only `name`, `templateType`, and `folderPath` `[exp]`.

Template `name` values are long and read like subject lines `[exp]`. This is the real cause of
oversized account-wide email diagrams: node **names**, not message bodies.

## 4. Mermaid: the limits that actually bind

| Key | Default | Consequence |
|---|---|---|
| `maxTextSize` | **50000** | Binding limit for a pasted diagram; tighter than a 100 KiB file ceiling `[cfg]` |
| `maxEdges` | **500** | "Defines the maximum number of edges that can be drawn in a graph" `[cfg]` |

Target well under 50,000 characters per chart. A measured 253-node / 263-edge chart came to
41,656 characters, already 83% of the default budget `[meas]`.

## 5. Sanitization is the author's job, not the renderer's

The schema documents `securityLevel: "strict"` as the default and says it encodes HTML tags in
text `[cfg]`. **Direct testing contradicts this for flowchart node labels.** Under mermaid v11
with default `htmlLabels`, a `<b>` tag and an `<img src=q onerror=alert(1)>` tag each became a
real DOM element under `strict` as well as `loose` `[meas]`.

> **CONFLICT, unresolved.** Documented behavior `[cfg]` vs observed behavior `[meas]`. The
> operative guidance is the observed one, because it fails unsafe.

Therefore a generator consuming user-authored text (workflow names, email subjects, tag names)
must substitute or strip `<` and `>` itself. That is a real control, not cosmetics `[meas]`.

Safe and confirmed:

- `<br/>` produces a genuine line break at every security level tested `[meas]`.
- Entity codes decode correctly: `#quot;` to `"`, `#35;` to `#` `[flow][meas]`.
- Quoting a label permits otherwise troublesome characters, e.g. parentheses `[flow][meas]`.
- The literal word `end` in lowercase **breaks** a flowchart; capitalize it `[flow]`.
- A node id beginning `o` or `x` immediately after `---` creates a circle or cross edge; add a
  space or capitalize `[flow]`.
- External CSS cannot style Mermaid nodes reliably; internal styles use `!important`. Use
  `classDef` `[flow]`.

## 6. Layout: why diagrams come out enormous, and the fix

Every node is assigned to a **rank**; nodes sharing a rank stack perpendicular to the flow
direction `[flow]`. A parent fanning out to N children puts all N on one rank, which in `LR`
is a single tall column `[meas]`.

Measured at N = 30, three-line labels `[meas]`:

| Layout | Rendered | Ratio |
|---|---|---|
| Plain fan-out in a subgraph, `LR` | 605 x 5316 | 0.11 |
| **Children chained into rows with `~~~`** | **2280 x 916** | **2.49** |
| Nested row subgraphs, outer `TB` | 2086 x 1256 | 1.66 |
| `TB` fan-out, no subgraph | 9266 x 231 | 40.11 |

`~~~` is the documented invisible link, intended "where you want to alter the default
positioning of a node" `[flow]`. **It emits no path element at all**: counting
`path.flowchart-link` returned exactly the number of visible edges in every variant `[meas]`.

### The column formula

Width scales with column count and is independent of N; height scales with `ceil(N/cols)`.
Derived cell size ~389px wide by ~178px tall for a three-line label `[meas]`. Hence
`ratio = cols^2 * 2.185 / N`, and for a target ratio of 1.8:

```
cols = 0.91 * sqrt(N)
```

Verified against measured renders at N = 5, 12, 27, 45, 70 `[meas]`.

**A fixed column count fails across a wide range**: at 8 columns, N=70 gives a good 1.82 but
N=27 gives 3.99 `[meas]`.

### Subgraph direction has a trap

> "If any of a subgraph's nodes are linked to the outside, subgraph direction will be ignored.
> Instead the subgraph will inherit the direction of the parent graph." `[flow]`

Observed: moving the parent node *inside* its own subgraph restored the intended direction and
cut one real chart from 8324 to 7118 tall `[meas]`.

### v11 vs v12: a live risk

Flowcharts in **v12** default to ELK layout with the `redux-color` theme and `neo` look; the
previous appearance needs `theme: default, look: classic, layout: dagre` in front matter
`[flow]`. The `defaultRenderer` option was removed in v12 `[flow]`.

> **CONFLICT.** The config schema page lists the global `layout` default as `"swimlane"`
> `[cfg]`, while the flowchart page names ELK as the flowchart default `[flow]`. The
> per-diagram default governs flowcharts. Set `layout` explicitly when layout matters `[cfg]`.

> **SCOPE LIMIT ON THE FORMULA.** All cell-size measurements were taken on **v11**, i.e.
> Dagre `[meas]`. The 389x178 constants and therefore `0.91*sqrt(N)` must be re-measured
> before being trusted on v12+ ELK `[meas]`.

### Collapsible subgraphs (v11.17.0+)

`one@{ view: collapsed }` hides a subgraph's internals and draws it as a single node carrying
the title; boundary-crossing edges redirect to the collapsed node and fully internal edges are
dropped `[flow]`. An alternative to chunking for taming large diagrams, untested here.

## 7. Validation

`mermaid.render(id, code)` resolving without throwing is a reliable syntax check `[meas]`.
Subgraphs render as `.cluster` elements, which is how to confirm grouping actually took
`[meas]`.

## 8. What is deliberately not reshaped

A workflow chart's aspect reflects its real topology: a linear 20-step sequence is a tall
column, a wide fan-out is a wide row `[meas]`. Forcing those into a grid with invisible links
would misrepresent the flow. Grid layout is for **sets** (a workflow's emails), not for
**sequences** (a workflow's steps).
