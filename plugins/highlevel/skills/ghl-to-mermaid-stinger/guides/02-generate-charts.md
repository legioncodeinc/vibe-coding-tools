# Guide 02: Generate the charts

Grounded in `references/mermaid-authoring-reference.md` and the distillation.

## Two chart families, two different layout rules

| Family | Content | Layout rule |
|---|---|---|
| Per-workflow | The step sequence | `flowchart TD`, follow `next[]`. **Do not grid it** |
| Per-set | A workflow's emails, an account's tags | Row-chain with `~~~`, derived column count |

The distinction matters. A sequence's shape carries meaning; a set's does not.

## Per-workflow chart

1. Emit triggers as stadium nodes. If a workflow has none, emit an explicit
   `"No active trigger (manual / inbound only)"` placeholder rather than an empty chart.
2. Emit one node per step using the shape map in `references/export-schema-reference.md`.
3. Collapse branch stubs: a branch child of type `if_else` with a single exit becomes an edge
   label instead of a node. This is the single biggest readability win on condition-heavy
   workflows.
4. Terminate open paths at a shared `End` node.

## Per-set chart

```python
def grid_columns(n):
    if n <= 2:
        return max(1, n)
    return max(2, round(0.91 * math.sqrt(n)))   # ~1.8 aspect ratio

cols = grid_columns(len(ids))
for start in range(0, len(ids), cols):
    row = ids[start:start + cols]
    emit(f"    {parent} --> {row[0]}")
    for left, right in zip(row, row[1:]):
        emit(f"    {left} ~~~ {right}")        # invisible, emits no path element
```

Put the parent node **inside** its own subgraph. Pointing in from outside makes Mermaid ignore
the subgraph's `direction`.

## Labels

Sanitize every label. `securityLevel` will not do it for you; `<b>` and `<img onerror=...>`
both render as live DOM even under `strict`.

```python
s = s.replace('"', "'").replace("<", "(").replace(">", ")").replace("#", "no.")
```

Then wrap in double quotes and truncate. Use `<br/>` for line breaks; it works at every
security level.

## Never leave a node floating

If a node has no edges, the reader assumes the chart is broken. Three fixes, in order of
preference:

1. **Group by connected component**, one labelled subgraph per cluster. Measured best on both
   ink per edge (597) and detour (1.095).
2. **Draw the weaker link you were not drawing.** On the measured account, 7 of 21 apparently
   orphaned workflows shared a tag or an email with another workflow. A dotted
   `-.->|shares tag x11|` edge to the strongest partner turns an orphan into a relationship.
3. **Box the genuine leftovers with a label that says why**, e.g.
   `"Standalone: no starts/removes link to any other workflow (14)"`.

Row-chain inside that box only: those nodes have no real edges, which is exactly the condition
where chaining is safe.

Then chain the **boxes** to each other so they read along the flow direction rather than
stacking:

```
SGC1 ~~~ SGC2 ~~~ SGC3 ~~~ SGSTANDALONE
```

Measured cost: zero. Identical ink and detour, aspect 0.36 to 2.98.

## One chart per what?

Let the data decide. Measured on a real account, a flat account-wide email map was one
unreadable 51 KB chart of 313 nodes; one chart per email-sending workflow (16 of them) brought
the tallest to 1620px. When a chart is dominated by many disconnected components, split by
component rather than fighting the layout engine.

For an account overview, prefer a **summary**: one node per workflow labelled with counts of
what it touches, plus the workflow-to-workflow edges. The everything-linked version measured
1687 x 35861 and was unusable.
