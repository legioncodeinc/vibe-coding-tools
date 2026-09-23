# GHL location export: field reference

Derived from a real SuperSnapshot AI export. Full derivation and counts in
`research/raw/supersnapshot--location-export-schema--observed.md`. Single-sample: treat
optional fields as optional.

## Where the useful structure lives

| Key | Use it for |
|---|---|
| `_workflowSteps.steps` | The flow graph. Flat list, `next[]` pointers |
| `_graph.nodes` / `_graph.edges` | Pre-resolved asset linkage. `from` is always `workflow:<id>` |
| `workflow_triggers` | Triggers, each carrying `workflowId` |
| `workflow` | Per-workflow metadata and enrichment counts |
| `email_actions` | Per-step email config. **Carries `html` and `bodyPreview`** |
| `email_templates` | Reusable templates. No subject, no sender |

## Step record

```jsonc
{
  "workflowId": "...", "workflowName": "...",
  "stepId": "...",                       // join key for _graph edges via "workflow_step:<stepId>"
  "order": 0,                            // branch-scoped, NOT a workflow sequence
  "type": "email",                       // see table below
  "name": "Email 1", "category": null,
  "next": ["<stepId>", ...],             // the real sequence
  "references": [ {"type","value","relationship"} ],
  "branches":   [ {"id","name","conditionCount"} ],   // id is also in next[]
  "waitDuration": {"type":"minutes","value":1,"when":"after"},
  "subject": "...",                      // email steps only
  "hasSecrets": false
}
```

## Step types observed, and their diagram shape

| `type` | Shape | Class |
|---|---|---|
| `email`, `sms` | `["..."]` rect | comms |
| `internal_notification`, `task-notification` | `["..."]` rect | notify |
| `wait`, `drip` | `[/"..."/]` parallelogram | wait |
| `if_else` | `{"..."}` rhombus | logic |
| `goto` | `>"..."]` asymmetric | logic |
| `transition` | `("...")` round | logic |
| `workflow_goal` | `(("..."))` circle | goal |
| `add_contact_tag`, `remove_contact_tag`, `dnd_contact`, `update_custom_value`, `create_opportunity`, `copy_contact_to_subaccount` | `["..."]` rect | crm |
| `add_to_workflow`, `remove_from_workflow` | `[["..."]]` subroutine | flow |
| `google_sheets`, `webhook` | `["..."]` rect | ext |

## Graph edge types

| `type` | Target node types |
|---|---|
| `sends email` | `email_templates`, `email_actions` |
| `removes from workflow`, `starts workflow` | `workflow` |
| `adds tag`, `removes tag`, `uses tag` | `tags` |

`via` is `"workflow_step:<stepId>"` for step-derived edges, or a synthetic marker such as
`"workflowsUsingTag"` for account-level associations.

## Traversal rules (verified, not assumed)

1. Build the "targeted" set **per workflow**, never pooled across workflows. Pooling falsely
   reports rootless workflows.
2. Every workflow has exactly one root; no `next[]` target leaves its workflow.
3. Ignore `order` for sequencing. Traverse `next[]`.
4. Guard the traversal against revisits anyway; do not assume acyclicity.
5. A `branches[]` entry names an edge AND points at a real sibling step. A branch child with
   one exit can be collapsed into the edge label.

## Known export gaps to report, never paper over

| Gap | Behavior |
|---|---|
| `goto` steps carry an empty `next[]` | Jump destination absent. Those paths dead-end |
| Some workflows have no trigger record | Emit an explicit "no active trigger" placeholder |
| `email_templates` have no subject or sender | Label with `templateType` and `folderPath` instead |

## Fields that must never be emitted

`html`, `bodyPreview`, `body`, `content`, `textBody` on email assets. Keep this as an explicit
blocklist in code so it survives refactors.
