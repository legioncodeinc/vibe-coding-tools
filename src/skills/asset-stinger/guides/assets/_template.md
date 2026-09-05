# Per-Asset Guide Template

Every guide under `guides/assets/NN-<asset>.md` follows this exact shape. Deviations require a comment at the top explaining why.

Copy this file, rename, fill the sections. Keep it under ~200 lines; link out to other guides for shared concerns (principles, workflow, deprecation).

---

# Guide: `<AssetType>` (NN-<asset>.md)

> **Applies to:** <short description of what this asset is>

## 1. Purpose

One paragraph. Why does this asset exist as a registry entity? What role does it play in the app? What problem does having it in the DB solve?

## 2. DB table(s) and key fields

Name the Prisma model(s) that back this asset.

| Model | Role |
|---|---|
| `<Model>` | Primary catalog |
| `<OtherModel>` | (optional) linked table |

Key fields (beyond the Shared Metadata Block from `guides/01-registration-workflow.md`):

| Field | Type | Class | Required | Notes |
|---|---|---|---|---|
| `<field>` | `<type>` | human / generator | yes / no | ... |

## 3. Code location(s) and detection

Where does the asset live in the repo? How does the sync generator detect it?

- **Scan path(s):** `<path glob>`
- **Detection method:** <annotation, filename convention, export pattern>
- **Required annotations:** `@xyz <value>`. See `guides/03-sync-generator-spec.md` for the full annotation reference.

## 4. Registration fields

Reference the Shared Metadata Block from `guides/01-registration-workflow.md`. List only the asset-specific additions here.

### Human fields

| Field | Required | Example |
|---|---|---|
| ... | ... | ... |

### Generator fields

| Field | Source | Example |
|---|---|---|
| ... | ... | ... |

## 5. Lifecycle

Deviations from the standard `draft / active / deprecated / archived / deleted` flow (from `guides/04-deprecation-and-sunset.md`). If none, write "standard."

- **draft to active:** <asset-specific preconditions>
- **active to deprecated:** <asset-specific triggers>
- **sunset window:** <default or override>

## 6. Relationships

What does this asset link to? What links to it?

- **This asset references:** <list of FKs>
- **Referenced by:** <list of tables that FK into this>

Include a mermaid or ASCII diagram if helpful.

## 7. Hand-offs

Which other worker-bee cares about this asset type? What's the boundary?

See `guides/05-hand-offs.md` for the master boundary rules. Restate the asset-specific ones here.

## 8. Pitfalls

Bullet list of known mistakes and how to avoid them.

- ...

## 9. Example

A minimal, well-formed row (SQL / JSON / Prisma create):

```ts
await prisma.<Model>.create({
  data: {
    key: "example-key",
    // ...
  },
});
```

See `examples/<asset>-example.md` for a fully-populated exemplar.

## 10. Checklist (when registering this asset)

- [ ] Matches principle 1 (code exists first)
- [ ] `key` is kebab-case, stable, <=64 chars
- [ ] `owner` assigned
- [ ] `feature_key` assigned (if feature-bearing)
- [ ] `prd_ref` cited (if feature-PRD-driven)
- [ ] Generator fields populated by the generator, not by hand
- [ ] Downstream linkages verified (see `guides/01-registration-workflow.md` Step 5)
- [ ] Sync generator `--check` passes
- [ ] `draft` flipped to `active` only after all of the above
