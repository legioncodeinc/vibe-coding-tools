# Guide: `Feature` (01)

> **Applies to:** the first-class "feature" concept: a coherent unit of product capability that can be flagged, metered, plan-gated, priced, rolled out, deprecated, and owned by a team.

## 1. Purpose

`Feature` is the **spine** of the Universal Asset Registry (Principle 5). Every asset that participates in billing, flagging, metering, or rollout references a `Feature`. Without this table, `FeatureFlag` is an orphan catalog and `Meter` cannot cleanly answer "what is this meter measuring?"

A `Feature` is NOT the same as:

- `FeatureFlag`: the rollout toggle. One feature may have zero, one, or many flags (parent + children via `parentSlug`).
- `CustomFeature`: a billing line-item (an admin-authored "thing we charge for"). A CustomFeature may reference a Feature; it is not itself the feature.

## 2. DB table and key fields

| Model | Role |
|---|---|
| `Feature` | Platform-owned catalog of code-features |

Key fields:

| Field | Type | Class | Required | Notes |
|---|---|---|---|---|
| `key` | `String @unique` | human | yes | kebab-case, e.g., `billing.addons` |
| `displayName` | `String` | human | yes | marketing-facing label |
| `phase` | `enum(proposed/in_dev/shipped/deprecated)` | human | yes | |
| `meterable` | `Boolean @default(false)` | human | yes | can this feature be metered? |
| `defaultFlagSlug` | `String?` | human | no | FK-ish into `FeatureFlag.slug` |
| `ownerTeam` | `String` | human | yes | slug |
| `prdRef` | `String?` | human | yes for new | the deploying product's feature PRD ID, e.g., `FEA-XXX` |
| `codePath` | `String` | generator | yes | directory root of the feature |
| `featureFilesHash` | `String` | generator | yes | SHA-256 of the feature's manifest |
| `detectedAt` | `DateTime` | generator | yes | |
| `lastSeenAt` | `DateTime` | generator | yes | |
| `planTiers` | `String[]` | human | no | convenience denormalization; authoritative answer lives in `FeatureEntitlement` |
| `environments` | `enum[]` | human | yes | `dev` / `staging` / `prod` |

Shared Metadata Block (from `guides/01-registration-workflow.md`) applies on top.

## 3. Code location and detection

- **Scan path:** `app/src/features/**/index.ts` and `api/src/features/**/index.ts`
- **Detection:** exported const of shape `{ feature: FeatureDefinition }` with a `@feature <key>` JSDoc on the module.
- **Required annotations:**
  - `@feature <key>` on the module
  - `@ownerTeam <slug>`
  - `@prd <ref>` for any new feature (cite the deploying product's feature PRD ID)

The canonical shape a feature's `index.ts` must export:

```ts
/**
 * @feature billing.addons
 * @ownerTeam billing
 * @prd BILL-007
 */
export const feature: FeatureDefinition = {
  key: "billing.addons",
  displayName: "Add-ons",
  phase: "shipped",
  meterable: false,
  defaultFlagSlug: "billing.addons.enabled",
};
```

## 4. Registration fields

### Human fields (asset-specific)

| Field | Required | Example |
|---|---|---|
| `displayName` | yes | `"Add-ons"` |
| `phase` | yes | `"shipped"` |
| `meterable` | yes | `false` |
| `defaultFlagSlug` | no | `"billing.addons.enabled"` |
| `planTiers` | no | `["pro", "enterprise"]` |

### Generator fields

| Field | Source | Example |
|---|---|---|
| `codePath` | JSDoc module path | `"app/src/features/billing-addons/"` |
| `featureFilesHash` | SHA-256 of module manifest | `"a1b2..."` |

## 5. Lifecycle

Standard, with one addition: deprecating a `Feature` cascades warnings to every linked asset (`Page`, `Route`, `Surface`, `Control`, `NavEntry`, `ContentEntry`). See `guides/04-deprecation-and-sunset.md` for the cascade rules.

Default sunset window: **90 days** after deprecation.

## 6. Relationships

**Feature references:**
- `FeatureFlag` via `defaultFlagSlug` (soft link, the flag can exist before the feature)

**Referenced by (Feature is the spine):**
- `Page.featureKey`
- `Route.featureKey`
- `Surface.featureKey`
- `Control.featureKey`
- `Display.featureKey`
- `Layout.featureKey`
- `NavEntry.featureKey`
- `ContentEntry.featureKey`
- `FeatureFlag.featureKey` (when elevated from soft link via the feature-flag-binding feature PRD)
- `Meter.featureKey`
- `FeatureEntitlement.featureKey`
- `CustomFeature.featureKey` (optional; a billing line-item may or may not map to a code feature)

```
                         ┌──────────────┐
                         │   Feature    │
                         └──────┬───────┘
         ┌───────────────┬──────┼──────┬───────────────┐
         │               │      │      │               │
     ┌───▼──┐        ┌───▼──┐ ┌─▼──┐ ┌─▼───┐       ┌───▼────┐
     │ Flag │        │Meter │ │Page│ │Route│  ...  │Content │
     └──────┘        └──────┘ └────┘ └─────┘       └────────┘
```

## 7. Hand-offs

- **library-worker-bee**: feature PRDs are numbered + placed at `library/requirements/<lifecycle>/prd-<###>-<title>/` + cross-linked by them.
- **ux-ui-svelte-worker-bee**: every feature that renders UI must reference a surface/control/display catalogued by you, but *visually specified* by ux-ui.
- **security-worker-bee**: any feature that touches auth, PII, or external integrations must route through a security review before `phase: shipped`.
- **quality-worker-bee**: verifies the feature's PRD vs implementation; does NOT verify registry linkage (that's your drift audit).

Note: example `prdRef` values throughout this Stinger (e.g., `FEA-XXX`, `BILL-007`) are illustrative placeholders. The deploying product substitutes its own feature PRD IDs.

## 8. Pitfalls

- Confusing `Feature` with `CustomFeature`. `CustomFeature` is an admin-editable billing line-item and may or may not reference a `Feature`. Don't merge them.
- Creating a `Feature` with no `defaultFlagSlug` and then writing code that calls `isFeatureEnabled("…")` against a flag that doesn't exist. The registration workflow requires you to verify the flag is reachable (Step 5 in `guides/01-registration-workflow.md`).
- Treating `planTiers` as authoritative. It's a denormalization for fast reads; the ground truth is `FeatureEntitlement`.
- Letting `phase: in_dev` features leak into production's plan matrix. The plan-matrix query filters `phase IN (shipped)` only.
- Renaming `key` mid-feature. Never. Use a `key_alias` or introduce a successor.

## 9. Example

```ts
// Creation (by the sync generator on first detection)
await prisma.feature.create({
  data: {
    key: "billing.addons",
    displayName: "Add-ons",
    description: "",
    status: "draft",
    phase: "in_dev",
    meterable: false,
    defaultFlagSlug: "billing.addons.enabled",
    ownerTeam: "billing",
    prdRef: "BILL-007",
    codePath: "app/src/features/billing-addons/",
    featureFilesHash: "a1b2c3...",
    environments: ["dev", "staging", "prod"],
    createdBy: "sync-generator@ci",
  },
});
```

See `examples/feature-example.md` for a full-lifecycle exemplar.

## 10. Checklist

- [ ] Code exists at `app/src/features/<slug>/index.ts` with `@feature` annotation
- [ ] `key` is namespaced (`domain.sub-feature`), kebab-case, stable
- [ ] `displayName` matches the marketing copy
- [ ] `phase` reflects current state
- [ ] `meterable` is set honestly (if true, a `Meter` row must exist)
- [ ] `defaultFlagSlug` resolves to a real `FeatureFlag`
- [ ] `ownerTeam` is a real team slug
- [ ] `prdRef` cites an existing PRD
- [ ] Registered before the feature ships (no retroactive spine building outside backfill)
