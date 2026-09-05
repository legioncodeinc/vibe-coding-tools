# Guide: `MediaAsset` (11)

> **Applies to:** images, logos, illustrations, lottie files, video clips shipped with the app. Not user-uploaded content; only platform-curated media.

## 1. Purpose

Catalog every platform-owned media file so the theme builder, hero cards, illustration slots, and email templates can resolve them by key instead of by hardcoded path.

## 2. DB table

| Field | Type | Class | Required | Notes |
|---|---|---|---|---|
| `key` | `String @unique` | human | yes | e.g., `hero.onboarding`, `logo.wordmark-navy` |
| `kind` | `enum(image/logo/illustration/lottie/video)` | human | yes | |
| `filePath` | `String` | generator | yes | |
| `fileHash` | `String` | generator | yes | |
| `width` | `Int?` | generator | no | |
| `height` | `Int?` | generator | no | |
| `fileSize` | `Int` | generator | yes | bytes |
| `altContentKey` | `String?` | human | yes for images | FK into `ContentEntry.key` for a11y alt text |
| `usageRights` | `String` | human | yes | e.g., `original`, `licensed:unsplash`, `custom-commission` |
| `featureKey` | `String?` | human | no | |

## 3. Code location and detection

- **Scan path:** `public/media/**/*` + `app/src/media/manifest.ts`
- **Detection:** manifest entries with `kind` + `key`.

## 4. Registration fields

### Human fields
`kind`, `altContentKey` (for images), `usageRights`, plus Shared Metadata.

### Generator fields
`filePath`, `fileHash`, `width`, `height`, `fileSize`.

## 5. Lifecycle

Standard. Large media files that are deprecated should trigger a deploy-size alarm; deprecated media is eligible for faster purge than the 180-day default to save bandwidth.

## 6. Relationships

**MediaAsset referenced by:** theme-builder, dashboard blocks, email templates, `ContentEntry` (via `rich` JSON).

## 7. Hand-offs

- **ux-ui-svelte-worker-bee**: brief governs which hero images / illustrations are canonical.
- **security-worker-bee**: reviews `usageRights` for licensing exposure.

## 8. Pitfalls

- Missing `altContentKey` on `kind: image`: breaks a11y.
- Media files >2MB shipped in the app bundle: flag to deploy pipeline.
- Videos without poster images.

## 9. Example

```ts
await prisma.mediaAsset.create({
  data: {
    key: "hero.onboarding",
    kind: "illustration",
    filePath: "public/media/illustrations/onboarding-hero.svg",
    fileHash: "2b3c4d...",
    width: 1200,
    height: 600,
    fileSize: 45832,
    altContentKey: "hero.onboarding.alt",
    usageRights: "custom-commission",
    status: "draft",
    ownerTeam: "ux",
    prdRef: "FEA-123",
    environments: ["dev", "staging", "prod"],
    createdBy: "sync-generator@ci",
  },
});
```

## 10. Checklist

- [ ] File exists at `filePath`
- [ ] `altContentKey` set for images
- [ ] `usageRights` declared
- [ ] `fileSize` reasonable (flag >2MB)
- [ ] `width`/`height` present for raster images (needed for layout reservation)
