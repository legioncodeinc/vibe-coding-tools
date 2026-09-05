# Guide: `Display` (06)

> **Applies to:** non-interactive UI: badges, avatars, icon-labels, tags, skeletons, dividers, progress bars, empty states. Shows information; does not capture intent.

## 1. Purpose

Display primitives round out the UI-primitive trio (Surface = container, Control = action, Display = information). The catalog lets the theme builder and layout engine compose pages from the three primitive classes.

## 2. DB table

| Model | Role |
|---|---|
| `Display` | Platform-owned catalog of non-interactive UI primitives |

Key fields:

| Field | Type | Class | Required | Notes |
|---|---|---|---|---|
| `key` | `String @unique` | human | yes | e.g., `badge-standard`, `progress-bar-default`, `avatar-round` |
| `kind` | `enum(badge/avatar/icon_label/tag/skeleton/divider/progress/empty_state)` | human | yes | |
| `variants` | `String[]` | human | no | e.g., `["thin","default","hero"]` for progress |
| `tokensConsumed` | `String[]` | generator | yes | |
| `featureKey` | `String?` | human | no | |
| `uxuiBriefRef` | `String` | human | yes | |
| `codePath` | `String` | generator | yes | |
| `exportName` | `String` | generator | yes | |
| `fileHash` | `String` | generator | yes | |

## 3. Code location and detection

- **Scan path:** `app/src/components/**/*.tsx`
- **Detection:** `@display <key>`.

## 4. Registration fields

### Human fields
`kind`, `variants`, `uxuiBriefRef`, plus Shared Metadata.

### Generator fields
`tokensConsumed`, `codePath`, `exportName`, `fileHash`.

## 5. Lifecycle

Standard.

## 6. Relationships

**Display references:** `DesignTokenDefinition[]`, `Feature`.

**Referenced by:** `Page.displaysUsed`, `Layout.displays`.

## 7. Hand-offs

- **ux-ui-svelte-worker-bee**: owns the brief. Key brief areas: `badges-and-pills.md`, `progress-bars.md`, `cards-and-surfaces.md` (for dividers).

## 8. Pitfalls

- Registering a progress bar with a fourth height. Brief specifies three (thin/default/hero). Flag.
- Badges that don't use `var(--radius-badge)` (4px) are drift: the brief's §3 rule.
- Confusing `icon_label` (text + icon paired) with a standalone `Icon` (see guide 10).

## 9. Example

```ts
await prisma.display.create({
  data: {
    key: "progress-bar-default",
    kind: "progress",
    variants: ["thin", "default", "hero"],
    tokensConsumed: ["color.gold", "color.gold-ink", "radius.pill", "dur.default"],
    featureKey: "generic-ui",
    uxuiBriefRef: "library/knowledge/private/ux-ui/03-components/progress-bars.md",
    codePath: "app/src/components/progress/ProgressBar.tsx",
    exportName: "ProgressBar",
    fileHash: "12abc...",
    status: "draft",
    ownerTeam: "ux",
    prdRef: "FEA-132",
    environments: ["dev", "staging", "prod"],
    createdBy: "sync-generator@ci",
  },
});
```

## 10. Checklist

- [ ] Component has `@display` annotation
- [ ] `kind` is correct (not confused with Control or Surface)
- [ ] `variants` matches the brief's allowed set
- [ ] `tokensConsumed`: no hex literals
- [ ] `uxuiBriefRef` resolves