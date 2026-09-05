# Guide: `Route` (03)

> **Applies to:** every addressable handler: page routes, API routes, webhooks (inbound/outbound), server actions, cron jobs, RPC handlers, middleware, and redirects. A single table with a `type` discriminator.

## 1. Purpose

The `Route` catalog answers: "what endpoints exist, who can reach them, what do they do, and what feature owns them?" It is the single source of truth for API surface area, auth requirements, and rate limits.

## 2. DB table

| Model | Role |
|---|---|
| `Route` | Platform-owned catalog of every routed handler |

Key fields:

| Field | Type | Class | Required | Notes |
|---|---|---|---|---|
| `key` | `String @unique` | human | yes | e.g., `api.v1.users.get`, `page.dashboard`, `webhook.stripe.inbound` |
| `type` | `enum(page/api/webhook_inbound/webhook_outbound/server_action/middleware/redirect/cron/rpc)` | human | yes | |
| `path` | `String` | human | yes | URL path; e.g., `/api/users/:id` |
| `method` | `enum(GET/POST/PUT/PATCH/DELETE/WS/NA)` | human | yes | `NA` for type=cron, middleware, redirect |
| `featureKey` | `String?` | human | yes if feature-owned | FK to `Feature.key` |
| `renderedPageKey` | `String?` | human | yes if type=page | FK to `Page.key` |
| `auth` | `enum(public/authed/admin/platform_admin/service)` | human | yes | |
| `rateLimit` | `String?` | human | no | e.g., `60/min` |
| `permissionsRequired` | `String[]` | human | no | keys into `Permission.key` |
| `version` | `String?` | human | no | e.g., `v1`, `v2` |
| `deprecatedAt` | `DateTime?` | human | no | |
| `sunsetAt` | `DateTime?` | human | no | |
| `externalContract` | `Boolean @default(false)` | human | yes if partner-facing | |
| `handlerFilePath` | `String` | generator | yes | e.g., `api/src/routes/users.ts` |
| `handlerExport` | `String` | generator | yes | |
| `fileHash` | `String` | generator | yes | |
| `openapiRef` | `String?` | generator | no | URL to generated docs |

## 3. Code location and detection

Detection varies by `type`:

| Type | Scan path | Detection |
|---|---|---|
| `api` | `api/src/routes/**/*.ts` | Fastify plugin + method + url |
| `page` | `app/src/app/**/page.tsx` | file path to URL path |
| `server_action` | `app/src/**/actions.ts` + `'use server'` | exported async function |
| `cron` | `api/src/cron/**/*.ts` | exported schedule + handler |
| `webhook_inbound` | `api/src/routes/webhooks/**/*.ts` | route prefix `/webhooks/` |
| `webhook_outbound` | `api/src/webhooks/emitters/**/*.ts` | exported emitter |
| `middleware` | `api/src/middleware/**/*.ts` | registered in route chain |
| `redirect` | `app/next.config.js` + `app/src/middleware.ts` | config parse |
| `rpc` | `api/src/rpc/**/*.ts` | exported handler |

**Required annotations:**
- `@route <key>` (optional, generator can derive)
- `@feature <key>` (if feature-bearing)
- `@auth <value>`
- `@rateLimit <value>` (optional)
- `@externalContract true` (only if partner-facing)

## 4. Registration fields

### Human fields
`type`, `path`, `method`, `auth`, `rateLimit`, `permissionsRequired`, `version`, `externalContract`, plus Shared Metadata.

### Generator fields
`handlerFilePath`, `handlerExport`, `fileHash`, `openapiRef`.

## 5. Lifecycle

Standard. **External-contract routes** (`externalContract: true`) have a mandatory 180-day sunset window instead of 90; partners need time.

Versioned routes (v1, v2 living side-by-side) each get their own row. Deprecating v1 doesn't deprecate v2.

## 6. Relationships

**Route references:** `Feature`, `Page` (via `renderedPageKey`), `Permission[]`.

**Referenced by:** `Page.routeId`, `NavEntry.routeKey`, `Cta.route` (existing), `MenuItemLabelBinding` targets.

## 7. Hand-offs

- **security-worker-bee**: every route with `externalContract: true` or `auth: public` gets a review.
- **library-worker-bee**: route catalog feature PRDs get cross-linked.
- **ux-ui-svelte-worker-bee**: not usually involved unless type=page.

## 8. Pitfalls

- Treating one registered route as "covering" all its variants: `:id` parameterized routes register once, but authz differences between `GET /users/:id/public` vs `GET /users/:id/private` require separate registrations.
- Missing `externalContract` flag on partner webhook endpoints: skips the longer sunset protection.
- Registering middleware as type=api: middleware is its own type with no `method`.
- `method: NA` for non-HTTP handlers (cron, server actions): don't leave blank.

## 9. Example

```ts
await prisma.route.create({
  data: {
    key: "api.v1.users.get",
    type: "api",
    path: "/api/v1/users/:id",
    method: "GET",
    featureKey: "users",
    auth: "authed",
    rateLimit: "60/min",
    permissionsRequired: ["user.read"],
    version: "v1",
    externalContract: false,
    handlerFilePath: "api/src/routes/users.ts",
    handlerExport: "getUserHandler",
    fileHash: "e7f8a9...",
    status: "draft",
    ownerTeam: "platform",
    prdRef: "FEA-050",
    environments: ["dev", "staging", "prod"],
    createdBy: "sync-generator@ci",
  },
});
```

See `examples/route-api-example.md` and `examples/route-page-example.md`.

## 10. Checklist

- [ ] File exists at detected `handlerFilePath`
- [ ] `type` matches the handler's actual shape
- [ ] `path` + `method` together are unique (enforced by `@@unique([path, method, version])`)
- [ ] `auth` is explicit (never default to `authed` silently for internal routes)
- [ ] `permissionsRequired` entries resolve to real `Permission` rows
- [ ] `externalContract: true` if any partner consumes this route
- [ ] `renderedPageKey` set if `type: page`
- [ ] Deprecated routes have `deprecatedAt` + `sunsetAt` set
