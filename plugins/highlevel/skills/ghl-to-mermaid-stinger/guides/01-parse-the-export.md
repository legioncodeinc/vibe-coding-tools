# Guide 01: Parse the export

Grounded in `references/research/raw/supersnapshot--location-export-schema--observed.md`.

## Before anything, confirm what you have

```bash
python3 -c "
import json,sys
d=json.load(open(sys.argv[1]))
print(d['_exportMetadata']['locationId'], d['_exportMetadata']['exportDate'])
for k in ('_graph','_workflowSteps'):
    print(k, 'present' if k in d else 'MISSING')
print('workflows', len(d.get('workflow',[])), 'steps', len(d.get('_workflowSteps',{}).get('steps',[])))
" "$EXPORT"
```

If `_graph` or `_workflowSteps` is missing, stop. This stinger's whole approach depends on
those pre-resolved structures. An export without them is a different problem; say so rather
than writing a bespoke parser on the spot.

## The three joins

1. **Steps to workflow:** `step.workflowId`.
2. **Steps to assets:** `_graph.edges` where `via == "workflow_step:<stepId>"`. This is how you
   learn which email or tag a step touches, and it is already resolved.
3. **Triggers to workflow:** `trigger.workflowId`.

## Ordering steps

Do not sort by `order`. It is branch-scoped; one observed workflow has 77 steps at `order: 0`.

```python
def order_steps(steps):
    by_id   = {s["stepId"]: s for s in steps}
    # scope per workflow; pooling across workflows falsely reports rootless workflows
    targeted = {n for s in steps for n in (s.get("next") or [])}
    roots    = [s["stepId"] for s in steps if s["stepId"] not in targeted]
    ordered, seen, stack = [], set(), list(reversed(roots))
    while stack:
        sid = stack.pop()
        if sid in seen or sid not in by_id:
            continue
        seen.add(sid); ordered.append(by_id[sid])
        for nxt in reversed(by_id[sid].get("next") or []):
            if nxt not in seen:
                stack.append(nxt)
    for s in steps:                       # unreachable steps still get emitted
        if s["stepId"] not in seen:
            ordered.append(s)
    return ordered, roots
```

Keep the visit guard even though the observed data is acyclic. It costs nothing and a
`goto`-heavy account could differ.

## Slimming the output

The export repeats itself. Two arrays encode the same relation — the step's own
`references[]` and the `_graph`-derived asset list keyed by `via`. Collapse them into one
deduped `touches[]` on `(kind, name, relationship)`.

Swap 36-character UUIDs for short local ids (`s0`, `s1`, …) and keep a `stepIdMap` so the join
back to the raw export stays lossless. On a measured 186-step workflow this took the JSON from
128,649 to 66,177 bytes with no information lost.

## Report the gaps, never smooth them

Emit per workflow:

```jsonc
"integrity": {
  "rootSteps": 1,
  "containsCycle": false,
  "gotoStepsWithUnresolvedTarget": 3
}
```

`goto` steps carry an empty `next[]` in the observed export, so those paths genuinely
dead-end. Say so in the output and in your summary. A chart that silently drops them is
lying about the automation.
