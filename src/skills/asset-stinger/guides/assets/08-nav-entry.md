# Guide: `NavEntry` (08)

> **Applies to:** every static (code-registered) menu item in the app: left-sidebar rows, top-nav tabs, bottom-nav icons, admin-menu entries, user-menu items, footer links.

## 1. Purpose

This catalog replaces the today-hardcoded "static code-registry id" referenced by string-keyed legacy bindings (e.g., a `MenuItemLabelBinding.targetKey: String` column in the deploying product's existing schema). Elevating nav entries to a real table is the centerpiece of the deploying product's nav-binding feature PRD.

## 2. DB table

| Model | Role |
|---|---|
| `NavEntry` | Platform-owned catalog of static navigation entries |

Key fields:

| Field | Type | Class | Required | Notes |
|---|---|---|---|---|
| `key` | `String @unique` | human | yes | e.g., `nav.left.dashboard`, `nav.bottom.ai-coach` |
| `section` | `String` | human | yes | e.g., `left_sidebar`, `top_nav`, `bottom_nav`, `admin_menu`, `user_menu`, `footer` |
| `labelContentKey` | `String` | human | yes | FK into `ContentEntry.key` |
| `iconKey` | `String` | human | yes | FK into `Icon.key` |
| `routeKey` | `String?` | human | yes if internal | FK into `Route.key` |
| `externalHref` | `String?` | human | yes if external | mutually exclusive with `routeKey` |
| `parentKey` | `String?` | human | no | self-referential for nested menus |
| `sortOrder` | `Int` | human | yes | default 0 |
| `visibilityRule` | `Json` | human | yes | e.g., `{"auth":"authed"}`, `{"flag":"billing.addons.enabled","state":"enabled"}`, `{"role":"admin"}` |
| `permissionKey` | `String?` | human | no | FK into `Permission.key` |
| `featureKey` | `String?` | human | yes if feature-owned | |
| `customizable` | `Boolean @default(true)` | human | yes | whether tenants can hide/reorder |
| `placement` | `String[]` | human | yes | e.g., `["desktop_sidebar","mobile_menu"]` |

## 3. Code location and detection

- **Scan path:** `app/src/nav/entries.ts`
- **Detection:** exported `navEntries` array.
- **Required annotations on each entry:** all of the human fields above, plus `@prd <ref>` for new entries.

## 4. Registration fields

### Human fields
All listed above plus Shared Metadata.

### Generator fields
`fileHash`, `codePath`, `lastSeenAt`.

## 5. Lifecycle

Standard. Deprecating a nav entry hides it from new tenants but preserves visibility for tenants who explicitly kept it via `CustomMenuItem` overrides.

## 6. Relationships

**NavEntry references:** `ContentEntry` (label), `Icon`, `Route`, `Permission`, `Feature`, `NavEntry` (self-ref for `parentKey`).

**Referenced by:** legacy string-keyed binding columns (e.g., `MenuItemLabelBinding.targetKey`) after FK elevation, plus tenant-navigation override payloads (via key strings).

## 7. Hand-offs

- **ux-ui-svelte-worker-bee**: nav visuals are owned by them (`nav-top-bottom-left.md`, `nav-icon-customizer.md`).
- **library-worker-bee**: nav-related feature PRDs (e.g., a custom-menu-items feature) cross-link here.

## 8. Pitfalls

- A nav entry both has `routeKey` and `externalHref`. Only one. The sync generator flags this.
- `labelContentKey` pointing at a `ContentEntry` with no translations for supported locales. Drift.
- `visibilityRule` copying `{"flag": "…"}` but the flag doesn't exist. Drift.
- Forgetting `placement`: defaults to empty array and the entry never renders anywhere.
- Making everything `customizable: false`. Tenants need *some* freedom. Coordinate with product.

## 9. Example

```ts
await prisma.navEntry.create({
  data: {
    key: "nav.left.dashboard",
    section: "left_sidebar",
    labelContentKey: "nav.left.dashboard.label",
    iconKey: "dashboard-home",
    routeKey: "page.dashboard",
    sortOrder: 10,
    visibilityRule: { auth: "authed" },
    permissionKey: null,
    featureKey: "dashboard",
    customizable: true,
    placement: ["desktop_sidebar", "mobile_menu"],
    status: "draft",
    ownerTeam: "product",
    prdRef: "FEA-132",
    environments: ["dev", "staging", "prod"],
    createdBy: "sync-generator@ci",
  },
});
```

See `examples/nav-entry-example.md`.

## 10. Checklist

- [ ] `key` is namespaced (`nav.<section>.<slug>`)
- [ ] `labelContentKey` resolves to a real `ContentEntry`
- [ ] `iconKey` resolves to a real `Icon`
- [ ] Exactly one of `routeKey` or `externalHref` is set
- [ ] `visibilityRule` JSON is valid against the schema
- [ ] `placement` has at least one surface
- [ ] Not a duplicate of an existing custom-menu-item override (static entries come first; custom overrides follow)
