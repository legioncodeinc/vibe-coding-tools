# Guide: `Layout` (07)

> **Applies to:** reusable page shells: auth shells, two-column dashboards, admin chrome, mobile shells. The outer frame inside which `Page`-rendered content lives.

## 1. Purpose

A `Layout` is *not* a `Surface`. A surface is an individual container; a layout is a composition of named slots + wrapping surfaces that multiple pages share.

Cataloging layouts lets the layout builder + theme builder reason about "what shells are available?" and lets the platform-admin page-builder slot user-authored content into a named slot.

## 2. DB table

| Model | Role |
|---|---|
| `Layout` | Platform-owned catalog of page shells |

Key fields:

| Field | Type | Class | Required | Notes |
|---|---|---|---|---|
| `key` | `String @unique` | human | yes | e.g., `shell-auth`, `shell-dashboard`, `shell-admin` |
| `surfaces` | `String[]` | generator | yes | ordered list of `Surface.key` the layout wraps with |
| `slots` | `Json` | human | yes | named slots + slot constraints (e.g., `{ header: { kind: "Surface" }, main: { kind: "Page" } }`) |
| `responsiveVariants` | `String[]` | human | no | e.g., `["mobile", "desktop"]` |
| `featureKey` | `String?` | human | no | |
| `uxuiBriefRef` | `String` | human | yes | |
| `codePath` | `String` | generator | yes | |
| `exportName` | `String` | generator | yes | |
| `fileHash` | `String` | generator | yes | |

## 3. Code location and detection

- **Scan path:** `app/src/components/layouts/*.tsx`
- **Detection:** directory convention + `@layout <key>`.

## 4. Registration fields

### Human fields
`slots`, `responsiveVariants`, `uxuiBriefRef`, plus Shared Metadata.

### Generator fields
`surfaces`, `codePath`, `exportName`, `fileHash`.

## 5. Lifecycle

Standard. Layout deprecation cascades: every `Page.layoutId` pointing at the deprecated layout is flagged by the drift audit.

## 6. Relationships

**Layout references:** `Surface[]`, `Feature`.

**Referenced by:** `Page.layoutId`, layout-builder presets.

## 7. Hand-offs

- **ux-ui-svelte-worker-bee**: owns the shell briefs (`left-sidebar-and-admin-toggle.md`, `dashboard.md`).

## 8. Pitfalls

- Registering layouts per-page instead of per-shell. A layout should be reused; if only one page uses a "layout," it's probably just part of that page.
- `slots` JSON without constraints: leads to page-builder putting arbitrary things in named slots. Always specify `kind` and allowed keys.

## 9. Example

```ts
await prisma.layout.create({
  data: {
    key: "shell-dashboard",
    surfaces: ["nav-top", "nav-left", "bottom-nav-mobile"],
    slots: {
      header: { kind: "Surface", allowed: ["nav-top"] },
      sidebar: { kind: "Surface", allowed: ["nav-left"] },
      main: { kind: "Page", allowed: "*" },
      mobileNav: { kind: "Surface", allowed: ["bottom-nav-mobile"] }
    },
    responsiveVariants: ["mobile", "desktop"],
    featureKey: "generic-ui",
    uxuiBriefRef: "library/knowledge/private/ux-ui/04-screens/dashboard.md",
    codePath: "app/src/components/layouts/ShellDashboard.tsx",
    exportName: "ShellDashboard",
    fileHash: "34def...",
    status: "draft",
    ownerTeam: "ux",
    prdRef: "FEA-132",
    environments: ["dev", "staging", "prod"],
    createdBy: "sync-generator@ci",
  },
});
```

## 10. Checklist

- [ ] `@layout` annotation present
- [ ] `slots` JSON has constraint shapes
- [ ] Every `surfaces` entry resolves
- [ ] `responsiveVariants` matches the code's actual breakpoints
- [ ] `uxuiBriefRef` resolves to a screen-level doc
