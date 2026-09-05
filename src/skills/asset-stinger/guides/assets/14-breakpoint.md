# Guide: `Breakpoint` (14)

> **Applies to:** responsive threshold tokens declared in `01-master-tokens.css` (e.g., `--bp-sm`, `--bp-md`, `--bp-lg`).

## 1. Purpose

Breakpoints are special design tokens: they gate layout, not paint. Cataloging them ensures the responsive variants referenced in `Layout.responsiveVariants` resolve to real thresholds.

## 2. DB table

| Field | Type | Class | Required | Notes |
|---|---|---|---|---|
| `key` | `String @unique` | human | yes | e.g., `bp.sm`, `bp.md`, `bp.lg`, `bp.xl`, `bp.2xl` |
| `cssVarName` | `String @unique` | generator | yes | e.g., `--bp-sm` |
| `minWidthPx` | `Int` | human | yes | e.g., `640` |
| `semanticRole` | `String` | human | yes | e.g., "mobile to tablet threshold" |
| `uxuiBriefRef` | `String` | human | yes | |

## 3. Code location and detection

Same as `DesignTokenDefinition`. Scan for `--bp-*` prefix.

## 4. Registration fields

All human except `cssVarName`, `codePath`, `fileHash`.

## 5. Lifecycle

Rarely deprecated; breakpoints are usually set once and rarely change. Sunset window: 180 days.

## 6. Relationships

**Referenced by:** `Layout.responsiveVariants`, media queries in every stylesheet.

## 7. Hand-offs

- **ux-ui-svelte-worker-bee** owns the responsive system.

## 8. Pitfalls

- Inconsistent thresholds across CSS and JS (JS using `window.innerWidth < 640` while the token says `641`). Flag.

## 9. Example

```ts
await prisma.breakpoint.create({
  data: {
    key: "bp.md",
    cssVarName: "--bp-md",
    minWidthPx: 768,
    semanticRole: "Tablet to desktop threshold",
    uxuiBriefRef: "library/knowledge/private/ux-ui/00-design-brief.md#breakpoints",
    codePath: "library/knowledge/private/ux-ui/01-master-tokens.css",
    fileHash: "5a6b7c...",
    status: "draft",
    ownerTeam: "ux",
    prdRef: "FEA-167d",
    environments: ["dev", "staging", "prod"],
    createdBy: "sync-generator@ci",
  },
});
```

## 10. Checklist

- [ ] `minWidthPx` set and sensible
- [ ] `cssVarName` resolves in code
- [ ] JS usages of the threshold match the token
