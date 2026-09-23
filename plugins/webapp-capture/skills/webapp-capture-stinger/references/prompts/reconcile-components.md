<!-- Template. prepare-merge.mjs fills {{APP_NAME}}, {{APP_CONTEXT}}, {{RAW_DIR}}, {{SHARD_FILES}}, {{TOTAL_GROUPS}} and saves it as <RAW_DIR>/ai/RECONCILE-INSTRUCTIONS.md. -->

# Component reconcile task

You are reconciling a sharded UI component merge for {{APP_NAME}}, {{APP_CONTEXT}}. A UX/UI AI will build the brand token guide and design system from your result, so names, assignments, and relationships must be consistent app-wide.

## Inputs (read all in full)

- Shard outputs: {{SHARD_FILES}}. Each is `{ components[], unassigned[], inconsistencies[] }` in the schema described in `{{RAW_DIR}}/ai/MERGE-INSTRUCTIONS.md`.
- Full input for reference: `{{RAW_DIR}}/ai/merge-input.json` ({{TOTAL_GROUPS}} entries with gid, name, kind, purpose, visual, sheet path).

## Process

1. Combine all shard components into one list.
2. Unify naming. The same real component under different names across shards gets one kebab-case name. Different components sharing a name get distinct names. Prefer `<role>-<modifier>`.
3. Merge cross-shard duplicates when shard `notes`, purpose, anatomy, and visual treatment clearly indicate the same component (for example a card whose parts landed in another shard). When unsure, open the `sheet` images with the Read tool and compare. Do not merge things that differ in role or visual treatment.
4. Fix every `related[]` entry so it names a component that exists in the final list.
5. Every one of the {{TOTAL_GROUPS}} input gids must appear exactly once across `components[].gids` and `unassigned[].gid`. Verify with a python3 or node script and fix gaps and duplicates before finishing.
6. Combine `inconsistencies[]` from all shards, deduplicate, and add cross-shard observations (for example several treatments for destructive actions, several card surfaces, heading scale drift).

## Output

Write ONE file: `{{RAW_DIR}}/ai/components.json` with `{ components[], unassigned[], inconsistencies[] }` using the same component schema. Validate it with `python3 -m json.tool`.

## Rules

- Ground every claim in the shard outputs, the merge input, or the images. Do not invent components, variants, or states.
- Do not create or modify any other file. Do not read files outside `{{RAW_DIR}}/`.
- Never use em dashes or en dashes.

Final reply: component count, unassigned count, number of cross-shard merges, number of renames, and the 8 most important inconsistencies, one line each.
