# Guide: `Motion` (13)

> **Applies to:** named durations, easings, and composite motion buckets declared in `01-master-tokens.css`. Examples: `--dur-fast`, `--ease-out-subtle`, `--ease-spring-soft`.

## 1. Purpose

The ux-ui brief §14 forbids bespoke durations and curves. This catalog enforces that: a CSS variable prefixed `--dur-` or `--ease-` must have a row. Anything else in code using `transition: 320ms cubic-bezier(...)` is drift.

## 2. DB table

| Field | Type | Class | Required | Notes |
|---|---|---|---|---|
| `key` | `String @unique` | human | yes | dotted form; e.g., `dur.fast`, `ease.out-subtle`, `ease.spring-soft` |
| `cssVarName` | `String @unique` | generator | yes | e.g., `--dur-fast` |
| `kind` | `enum(duration/easing/composite)` | human | yes | |
| `valueLight` | `String` | human | yes | e.g., `150ms`, `cubic-bezier(0.2, 0, 0, 1)` |
| `respectsReducedMotion` | `Boolean @default(true)` | human | yes | |
| `semanticRole` | `String` | human | yes | e.g., "hover/press feedback" |
| `uxuiBriefRef` | `String` | human | yes | e.g., `library/knowledge/private/ux-ui/00-design-brief.md#14-motion` |

## 3. Code location and detection

Same as `DesignTokenDefinition`: scan `01-master-tokens.css` for `--dur-*` and `--ease-*` prefixes. Motion lives under the design-token umbrella but gets its own table for clarity in the theme builder.

## 4. Registration fields

All human. Generator provides `cssVarName` and `codePath`/`fileHash`.

## 5. Lifecycle

Standard. 180-day sunset (animations are cross-cutting).

## 6. Relationships

**Referenced by:** every `Surface`, `Control`, `Display` via `tokensConsumed` (motion is part of the token consumption set).

## 7. Hand-offs

- **ux-ui-svelte-worker-bee** owns every named motion bucket. You catalog them; you don't invent.

## 8. Pitfalls

- Accepting a bespoke animation in a component PR that doesn't use a catalogued bucket. Flag.
- Forgetting `respectsReducedMotion`: a11y failure.

## 9. Example

```ts
await prisma.motion.create({
  data: {
    key: "dur.fast",
    cssVarName: "--dur-fast",
    kind: "duration",
    valueLight: "150ms",
    respectsReducedMotion: true,
    semanticRole: "Hover and press feedback",
    uxuiBriefRef: "library/knowledge/private/ux-ui/00-design-brief.md#14-motion",
    codePath: "library/knowledge/private/ux-ui/01-master-tokens.css",
    fileHash: "8a9b0c...",
    status: "draft",
    ownerTeam: "ux",
    prdRef: "FEA-167d",
    environments: ["dev", "staging", "prod"],
    createdBy: "sync-generator@ci",
  },
});
```

## 10. Checklist

- [ ] CSS var exists with `--dur-*` or `--ease-*` prefix
- [ ] `kind` matches prefix (`duration` for `--dur-`, `easing` for `--ease-`)
- [ ] `semanticRole` from ux-ui-svelte-worker-bee
- [ ] `respectsReducedMotion` defaults true unless explicitly opted out
