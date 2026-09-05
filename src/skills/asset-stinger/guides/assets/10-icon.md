# Guide: `Icon` (10)

> **Applies to:** every SVG icon shipped in the app's icon registry.

## 1. Purpose

Today `CustomMenuItem.iconId: String` points at a "code-only icon registry." Elevating icons to a catalog enables the menu icon customizer, tenant iconography overrides, and license auditing.

## 2. DB table

| Field | Type | Class | Required | Notes |
|---|---|---|---|---|
| `key` | `String @unique` | human | yes | kebab-case, e.g., `chevron-right`, `dashboard-home` |
| `pack` | `String` | human | yes | e.g., `lucide`, `phosphor`, `custom` |
| `svgPath` | `String` | generator | yes | path to the SVG asset |
| `svgContentHash` | `String` | generator | yes | |
| `tags` | `String[]` | human | no | searchable metadata |
| `license` | `String` | human | yes | e.g., `MIT`, `custom` |
| `featureKey` | `String?` | human | no | usually null |

## 3. Code location and detection

- **Scan path:** `app/src/icons/**/*.svg` + `app/src/icons/index.ts`
- **Detection:** exported registry object with `{ [key]: importedSvg }` entries.

## 4. Registration fields

### Human fields
`pack`, `tags`, `license`, plus Shared Metadata.

### Generator fields
`svgPath`, `svgContentHash`.

## 5. Lifecycle

Standard. Deprecating an icon used by many `NavEntry` / `CustomMenuItem` / `Cta` rows triggers the drift audit.

## 6. Relationships

**Referenced by:** `NavEntry.iconKey`, `CustomMenuItem.iconId` (after FK elevation), `Cta.icon`, icon-customizer UI.

## 7. Hand-offs

- **ux-ui-svelte-worker-bee**: icon weight/style consistency (muted-stroke left nav, navy-stroke top nav, etc.) is their concern. You catalog; they audit visual consistency.
- **security-worker-bee**: SVG content from third-party packs gets license + XSS review.

## 8. Pitfalls

- Ingesting an SVG with embedded scripts: security risk. The generator strips `<script>` on import, but flag the drift anyway.
- Two icons with the same key across different packs. Keys are flat; namespace if needed (`lucide.chevron-right`).
- Missing `license`: legal risk.

## 9. Example

```ts
await prisma.icon.create({
  data: {
    key: "dashboard-home",
    pack: "lucide",
    svgPath: "app/src/icons/lucide/home.svg",
    svgContentHash: "1a2b3c...",
    tags: ["nav", "home", "dashboard"],
    license: "ISC",
    status: "draft",
    ownerTeam: "ux",
    prdRef: "FEA-132",
    environments: ["dev", "staging", "prod"],
    createdBy: "sync-generator@ci",
  },
});
```

## 10. Checklist

- [ ] SVG file exists
- [ ] `pack` named consistently across the codebase
- [ ] `license` set
- [ ] No inline `<script>` in the SVG
- [ ] `key` is unique and searchable (has reasonable `tags`)
