# Guide: `Page` (02)

> **Applies to:** any file that resolves to a user-facing URL and renders a UI screen. In this repo: Next.js App Router `page.tsx` files.

## 1. Purpose

Every URL that renders UI needs a registry row so the platform can answer:

- "What pages ship with this feature?"
- "What permissions does this page require?"
- "What surfaces, controls, and content does this page reference?"
- "Is this page gated by a feature flag, a plan, or both?"

## 2. DB table

| Model | Role |
|---|---|
| `Page` | Platform-owned catalog of renderable screens |

Key fields:

| Field | Type | Class | Required | Notes |
|---|---|---|---|---|
| `key` | `String @unique` | human | yes | kebab-case, usually the route path with slashes to hyphens, e.g., `dashboard` or `settings-profile` |
| `routeId` | `String?` | generator | yes if `type=page` route exists | FK to `Route.id` |
| `layoutId` | `String?` | generator | no | FK to `Layout.id` |
| `featureKey` | `String?` | human | yes if the page is feature-owned | FK to `Feature.key` |
| `authRequirement` | `enum(public/authed/admin/platform_admin)` | human | yes | |
| `flagGate` | `String?` | human | no | `FeatureFlag.slug` that gates the whole page |
| `planGate` | `String[]` | human | no | plan keys that unlock the page (denormalization) |
| `surfacesUsed` | `String[]` | generator | yes | keys into `Surface.key` |
| `controlsUsed` | `String[]` | generator | yes | keys into `Control.key` |
| `displaysUsed` | `String[]` | generator | yes | keys into `Display.key` |
| `contentKeysUsed` | `String[]` | generator | yes | keys into `ContentEntry.key` |
| `fileType` | `enum(tsx/svelte/html/other)` | generator | yes | |
| `codePath` | `String` | generator | yes | e.g., `app/src/app/dashboard/page.tsx` |
| `fileHash` | `String` | generator | yes | |

## 3. Code location and detection

- **Scan path:** `app/src/app/**/page.tsx`
- **Detection:** Next.js convention: a `page.tsx` inside `app/` resolves to a URL.
- **Required annotations (JSDoc on default export):**
  - `@feature <key>` (if feature-owned)
  - `@prd <ref>` for new pages
  - `@authRequirement <value>`: one of `public`, `authed`, `admin`, `platform_admin`
  - `@flagGate <slug>` (optional)

The generator derives `surfacesUsed`, `controlsUsed`, `displaysUsed`, `contentKeysUsed` by walking the component tree rooted at the default export and collecting `@surface`/`@control`/`@display`/`@content` annotations.

## 4. Registration fields

### Human fields
`authRequirement`, `flagGate`, `planGate`, plus the Shared Metadata Block.

### Generator fields
`routeId`, `layoutId`, `surfacesUsed`, `controlsUsed`, `displaysUsed`, `contentKeysUsed`, `fileType`, `codePath`, `fileHash`.

## 5. Lifecycle

Standard. A deprecated `Page` shows a banner to platform-admins in the admin UI; the page still renders until `sunset_at`.

## 6. Relationships

**Page references:** `Route`, `Layout`, `Feature`, `FeatureFlag` (via `flagGate`), `Plan` (via `planGate`), `Surface[]`, `Control[]`, `Display[]`, `ContentEntry[]`, `Permission[]` (via `authRequirement`).

**Referenced by:** `NavEntry.routeId` transitively via `Route`.

## 7. Hand-offs

- **ux-ui-svelte-worker-bee** owns whether the page's visual composition matches the brief. You catalog; they review.
- **security-worker-bee** reviews `authRequirement` for every page that exposes sensitive data.
- **library-worker-bee** cross-links the page to its owning feature PRD.

## 8. Pitfalls

- Missing `@authRequirement`: the generator defaults to `authed`, which can silently expose internal-only pages. Always set explicitly.
- Using `flagGate` and `planGate` simultaneously without verifying they don't lock each other out.
- Stale `surfacesUsed`: refactors that remove a component leave the array pointing at a deleted `Surface` key. The drift audit catches this.
- Deep dynamic routes (`[...slug]`) registered as a single key that hides per-segment authz. Split into multiple `Page` rows if authz differs.

## 9. Example

```ts
await prisma.page.create({
  data: {
    key: "dashboard",
    featureKey: "dashboard",
    authRequirement: "authed",
    fileType: "tsx",
    codePath: "app/src/app/dashboard/page.tsx",
    fileHash: "c4d5e6...",
    surfacesUsed: ["engagement-block", "mission-card"],
    controlsUsed: ["primary-cta"],
    displaysUsed: ["progress-bar-hero"],
    contentKeysUsed: ["dashboard.heading", "dashboard.cta.label"],
    status: "draft",
    ownerTeam: "product",
    prdRef: "FEA-099",
    environments: ["dev", "staging", "prod"],
    createdBy: "sync-generator@ci",
  },
});
```

## 10. Checklist

- [ ] File exists at `app/src/app/<route>/page.tsx`
- [ ] `@authRequirement` set explicitly
- [ ] `featureKey` points at a real `Feature`
- [ ] `flagGate` resolves to a real `FeatureFlag.slug` (if set)
- [ ] `planGate` plans exist in the `Plan` table (if set)
- [ ] Every `surfacesUsed`, `controlsUsed`, `displaysUsed`, `contentKeysUsed` entry resolves to a real catalog row
- [ ] Generator `--check` passes
