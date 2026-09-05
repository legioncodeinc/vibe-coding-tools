# Example: `Route` row (type=page)

A page-type route. Demonstrates the `renderedPageKey` link back to the `Page` catalog.

## Code

```tsx
// app/src/app/dashboard/page.tsx

/**
 * @feature dashboard
 * @authRequirement authed
 * @prd FEA-099
 */
export default function DashboardPage() {
  // ...
}
```

## Registry row (Route)

```ts
{
  id: "clxdash001",
  key: "page.dashboard",
  type: "page",
  path: "/dashboard",
  method: "GET",
  featureKey: "dashboard",
  renderedPageKey: "dashboard",
  auth: "authed",
  rateLimit: null,
  permissionsRequired: [],
  version: null,
  externalContract: false,
  status: "active",
  environments: ["dev", "staging", "prod"],
  ownerTeam: "product",
  prdRef: "FEA-099",
  deprecatedAt: null,
  sunsetAt: null,
  notes: null,
  createdBy: "sync-generator@ci",
  createdAt: "2026-02-01T08:00:00.000Z",
  updatedAt: "2026-04-23T02:00:00.000Z",

  handlerFilePath: "app/src/app/dashboard/page.tsx",
  handlerExport: "default",
  fileHash: "d4e5f6a7b8c9d4e5f6a7b8c9d4e5f6a7b8c9d4e5f6a7b8c9d4e5f6a7b8c9d4e5",
  openapiRef: null,
  detectedAt: "2026-02-01T08:00:00.000Z",
  lastSeenAt: "2026-04-23T02:00:00.000Z",
}
```

## Registry row (Page): linked

```ts
{
  id: "clxdashpg01",
  key: "dashboard",
  routeId: "clxdash001",
  layoutId: "clxshlldash",
  featureKey: "dashboard",
  authRequirement: "authed",
  flagGate: null,
  planGate: [],
  fileType: "tsx",
  surfacesUsed: ["engagement-block", "mission-card", "pinned-chats-grid"],
  controlsUsed: ["primary-cta"],
  displaysUsed: ["progress-bar-hero"],
  contentKeysUsed: [
    "dashboard.heading.welcome",
    "dashboard.mission-card.title",
    "dashboard.cta.label"
  ],
  status: "active",
  environments: ["dev", "staging", "prod"],
  ownerTeam: "product",
  prdRef: "FEA-099",
  deprecatedAt: null,
  sunsetAt: null,
  notes: null,
  createdBy: "sync-generator@ci",
  createdAt: "2026-02-01T08:00:00.000Z",
  updatedAt: "2026-04-23T02:00:00.000Z",

  codePath: "app/src/app/dashboard/page.tsx",
  fileHash: "d4e5f6a7b8c9d4e5f6a7b8c9d4e5f6a7b8c9d4e5f6a7b8c9d4e5f6a7b8c9d4e5",
  detectedAt: "2026-02-01T08:00:00.000Z",
  lastSeenAt: "2026-04-23T02:00:00.000Z",
}
```

## Checklist (filled)

- [x] `Route.type = page`
- [x] `Route.renderedPageKey = Page.key`
- [x] `Page.routeId = Route.id`
- [x] `Page.surfacesUsed / controlsUsed / displaysUsed` all resolve
- [x] `Page.contentKeysUsed` all resolve to `ContentEntry` rows
- [x] Both rows share `featureKey`
