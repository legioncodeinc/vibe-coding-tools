# Example: `Feature` row (exemplar)

A fully-populated, `active`-status `Feature` row demonstrating every field correctly filled. Use this as the template when registering a new feature.

## Context

- Feature: Billing add-ons (one-time purchases of usage bundles).
- Shipped as part of BILL-007 (Platform Catalog).
- Meterable: **no** (pure unit purchases, no usage tracking).
- Flagged: **yes**: `billing.addons.enabled` controls tenant-level rollout.
- Plan tiers: Pro, Enterprise.

## Code

```ts
// app/src/features/billing-addons/index.ts

/**
 * @feature billing.addons
 * @ownerTeam billing
 * @prd BILL-007
 */
export const feature = {
  key: "billing.addons",
  displayName: "Add-ons",
  phase: "shipped",
  meterable: false,
  defaultFlagSlug: "billing.addons.enabled",
} as const;
```

## Registry row

```ts
{
  id: "clx1a2b3c4d5",
  key: "billing.addons",
  displayName: "Add-ons",
  description: "Admin-authored, tenant-purchasable one-time bundles layered on top of a Plan. Supports gift cards, feature unlocks, and time-limited access grants.",
  phase: "shipped",
  meterable: false,
  defaultFlagSlug: "billing.addons.enabled",
  ownerTeam: "billing",
  prdRef: "BILL-007",
  planTiers: ["pro", "enterprise"],
  status: "active",
  environments: ["dev", "staging", "prod"],
  deprecatedAt: null,
  sunsetAt: null,
  replacementKey: null,
  deprecationReason: null,
  notes: "CustomFeature-driven. See also FEA-095 (UserAddOnAssignment) for the assignment model.",
  createdBy: "sync-generator@ci",
  createdAt: "2026-04-10T09:30:00.000Z",
  updatedAt: "2026-04-23T14:20:00.000Z",

  // Generator-owned
  codePath: "app/src/features/billing-addons/",
  featureFilesHash: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
  detectedAt: "2026-04-10T09:30:00.000Z",
  lastSeenAt: "2026-04-23T02:15:00.000Z",
}
```

## Linked assets (what other rows should exist)

| Linked row | Key | Why |
|---|---|---|
| `FeatureFlag` | `billing.addons.enabled` (with `featureKey: billing.addons`) | the default rollout flag |
| `FeatureFlag` | `billing.addons.self-serve` (parent = `billing.addons.enabled`) | child flag for self-serve purchases |
| `Page` | `admin-billing-addons` (with `featureKey: billing.addons`) | the admin page for managing add-ons |
| `Route` | `api.v1.admin.addons.list` (with `featureKey: billing.addons`) | supporting API route |
| `Route` | `api.v1.admin.addons.create` (with `featureKey: billing.addons`) | |
| `CustomFeature` | (existing table, with new `featureKey: billing.addons`) | billing line-item mapping |
| `FeatureEntitlement` | `(billing.addons, plan_pro)` | grants Pro plan access to add-ons UI |
| `FeatureEntitlement` | `(billing.addons, plan_enterprise)` | |
| `ContentEntry` | `admin.billing.addons.heading` | |
| `ContentEntry` | `admin.billing.addons.cta.create` | |
| `NavEntry` | `nav.admin.billing.addons` | admin-nav sidebar entry |

## Drift audit sample

A clean drift audit for this feature should return zero items under every class. If you see anything other than clean, follow the resolution playbook in `guides/02-drift-audit.md`.

## Checklist (filled)

- [x] Code exists at `app/src/features/billing-addons/index.ts` with `@feature` annotation
- [x] `key` is namespaced (`billing.addons`), kebab-case, stable
- [x] `displayName` matches marketing copy ("Add-ons")
- [x] `phase` reflects current state (`shipped`)
- [x] `meterable` set honestly (false; no meter exists)
- [x] `defaultFlagSlug` resolves to real `FeatureFlag` (`billing.addons.enabled`)
- [x] `ownerTeam` is real slug (`billing`)
- [x] `prdRef` cites existing PRD (`BILL-007`)
- [x] All linked assets registered
