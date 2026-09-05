# Guide: `Font` (12)

> **Applies to:** font families shipped or loaded by the app, with their allowed weights and fallbacks. Used by the deploying product's theme/font-picker feature for live-preview allow-listing.

## 1. Purpose

Cataloging fonts lets the theme validator reject unknown fonts, the theme builder UI render a font picker, and tenant licensing reviews know which fonts flow to which tenants.

## 2. DB table

| Field | Type | Class | Required | Notes |
|---|---|---|---|---|
| `key` | `String @unique` | human | yes | kebab-case; e.g., `dm-sans`, `playfair-display` |
| `family` | `String` | human | yes | exact CSS `font-family` value, e.g., `"DM Sans"` |
| `source` | `enum(google/self_hosted/system)` | human | yes | |
| `weights` | `Int[]` | human | yes | e.g., `[400, 500, 600, 700]` |
| `fallbacks` | `String[]` | human | yes | e.g., `["system-ui", "sans-serif"]` |
| `license` | `String` | human | yes | e.g., `OFL-1.1`, `commercial` |
| `allowedForTenants` | `Boolean @default(true)` | human | yes | whether tenant themes can pick this font |

## 3. Code location and detection

- **Scan path:** `app/src/fonts/**/*.ts`
- **Detection:** exported font declarations.

## 4. Registration fields

All human except `codePath`/`fileHash`.

## 5. Lifecycle

Standard. Sunset window: 180 days (like tokens: removing a font changes visual output across every tenant using it).

## 6. Relationships

**Font referenced by:** `DesignTokenDefinition` (for `--font-*` tokens), theme-builder validator.

## 7. Hand-offs

- **ux-ui-svelte-worker-bee**: owns the curated font set.
- **security-worker-bee**: third-party font CDN review.

## 8. Pitfalls

- Loading a font at runtime that isn't catalogued: theme-validator may reject, or worse, silently allow.
- Missing `fallbacks`: FOUC and layout shifts.
- `allowedForTenants: true` without license permitting redistribution.

## 9. Example

```ts
await prisma.font.create({
  data: {
    key: "dm-sans",
    family: "DM Sans",
    source: "google",
    weights: [400, 500, 600, 700],
    fallbacks: ["system-ui", "sans-serif"],
    license: "OFL-1.1",
    allowedForTenants: true,
    status: "draft",
    ownerTeam: "ux",
    prdRef: "FEA-163c",
    environments: ["dev", "staging", "prod"],
    createdBy: "sync-generator@ci",
  },
});
```

## 10. Checklist

- [ ] `family` matches CSS exactly (quotes, case)
- [ ] `weights` subset that's actually loaded (don't overclaim)
- [ ] `fallbacks` are reasonable for `family`'s type (serif vs sans)
- [ ] `license` set
- [ ] `allowedForTenants` aligned with licensing
