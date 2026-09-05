# Example: `NavEntry` rows

Two `NavEntry` rows demonstrating the parent/child hierarchy and the visibility-rule shapes.

## Context

- Parent: `nav.left.billing`: appears in the left sidebar, gated on `platform_admin` role.
- Child: `nav.left.billing.addons`: sub-item under Billing, gated on the `billing.addons.enabled` feature flag being in `enabled` state.

## Code

```ts
// app/src/nav/entries.ts

export const navEntries: NavEntryDefinition[] = [
  {
    key: "nav.left.billing",
    section: "left_sidebar",
    labelContentKey: "nav.left.billing.label",
    iconKey: "billing",
    routeKey: "page.admin-billing",
    sortOrder: 40,
    visibilityRule: { role: "platform_admin" },
    featureKey: "billing",
    customizable: false,
    placement: ["desktop_sidebar"],
  },
  {
    key: "nav.left.billing.addons",
    section: "left_sidebar",
    labelContentKey: "nav.left.billing.addons.label",
    iconKey: "package",
    routeKey: "page.admin-billing-addons",
    parentKey: "nav.left.billing",
    sortOrder: 10,
    visibilityRule: { flag: "billing.addons.enabled", state: "enabled" },
    featureKey: "billing.addons",
    customizable: false,
    placement: ["desktop_sidebar"],
  },
];
```

## Registry rows

### Parent

```ts
{
  id: "clxnavbill",
  key: "nav.left.billing",
  section: "left_sidebar",
  labelContentKey: "nav.left.billing.label",
  iconKey: "billing",
  routeKey: "page.admin-billing",
  externalHref: null,
  parentKey: null,
  sortOrder: 40,
  visibilityRule: { role: "platform_admin" },
  permissionKey: null,
  featureKey: "billing",
  customizable: false,
  placement: ["desktop_sidebar"],
  status: "active",
  environments: ["dev", "staging", "prod"],
  ownerTeam: "billing",
  prdRef: "BILL-001",
  deprecatedAt: null,
  sunsetAt: null,
  notes: null,
  createdBy: "sync-generator@ci",
  createdAt: "2026-03-01T10:00:00.000Z",
  updatedAt: "2026-04-23T02:00:00.000Z",

  codePath: "app/src/nav/entries.ts",
  fileHash: "nav-file-hash-parent",
  detectedAt: "2026-03-01T10:00:00.000Z",
  lastSeenAt: "2026-04-23T02:00:00.000Z",
}
```

### Child

```ts
{
  id: "clxnavbilladdons",
  key: "nav.left.billing.addons",
  section: "left_sidebar",
  labelContentKey: "nav.left.billing.addons.label",
  iconKey: "package",
  routeKey: "page.admin-billing-addons",
  externalHref: null,
  parentKey: "nav.left.billing",
  sortOrder: 10,
  visibilityRule: { flag: "billing.addons.enabled", state: "enabled" },
  permissionKey: null,
  featureKey: "billing.addons",
  customizable: false,
  placement: ["desktop_sidebar"],
  status: "active",
  environments: ["dev", "staging", "prod"],
  ownerTeam: "billing",
  prdRef: "BILL-007",
  deprecatedAt: null,
  sunsetAt: null,
  notes: null,
  createdBy: "sync-generator@ci",
  createdAt: "2026-04-01T12:00:00.000Z",
  updatedAt: "2026-04-23T02:00:00.000Z",

  codePath: "app/src/nav/entries.ts",
  fileHash: "nav-file-hash-parent",
  detectedAt: "2026-04-01T12:00:00.000Z",
  lastSeenAt: "2026-04-23T02:00:00.000Z",
}
```

## Tenant override relationship

A tenant can hide `nav.left.billing.addons` for their own community via a `CustomMenuItem` row with a "hidden" flag or via a per-user preference, but cannot modify the catalog entry itself. Catalog = platform-owned.

## Drift check notes

- The `routeKey` on both rows must resolve to a real `Route`.
- The `iconKey` must resolve to a real `Icon`.
- The `labelContentKey` must resolve to a real `ContentEntry`.
- The child's `visibilityRule.flag` (`billing.addons.enabled`) must resolve to a real `FeatureFlag.slug`.
- If the child's `parentKey` points at a deprecated parent, flag in drift audit.

## Checklist (filled, for the child)

- [x] `key` follows `nav.<section>.<slug>` convention
- [x] `labelContentKey`, `iconKey`, `routeKey` all resolve
- [x] Exactly one of `routeKey` / `externalHref` set (routeKey)
- [x] `visibilityRule` JSON valid
- [x] `parentKey` resolves to an `active` parent
- [x] `placement` has at least one surface
