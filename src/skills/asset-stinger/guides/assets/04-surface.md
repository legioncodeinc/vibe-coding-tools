# Guide: `Surface` (04)

> **Applies to:** visual containers: cards, modals, sheets, nav bars, popovers, drawers, toasts, panels. Any UI primitive whose primary job is "hold other UI."

## 1. Purpose

The `Surface` catalog enumerates every containment primitive the app ships. The theme builder, layout engine, and ux-ui audit tools all read from this catalog.

Surfaces consume `DesignTokenDefinition`s and are composed by `Page`s and `Layout`s.

## 2. DB table

| Model | Role |
|---|---|
| `Surface` | Platform-owned catalog of container primitives |

Key fields:

| Field | Type | Class | Required | Notes |
|---|---|---|---|---|
| `key` | `String @unique` | human | yes | kebab-case, e.g., `card-glass`, `modal-standard`, `bottom-sheet` |
| `kind` | `enum(card/modal/sheet/nav/popover/toast/panel/drawer)` | human | yes | |
| `depthLevel` | `enum(flat/raised/floating/glass)` | human | yes | aligned with ux-ui brief |
| `statesSupported` | `String[]` | human | yes | e.g., `default`, `hover`, `elevated`, `dragging` |
| `tokensConsumed` | `String[]` | generator | yes | keys into `DesignTokenDefinition.key` |
| `featureKey` | `String?` | human | no | usually `generic-ui` or a specific feature |
| `uxuiBriefRef` | `String` | human | yes | path into `library/knowledge/private/ux-ui/03-components/*.md` |
| `codePath` | `String` | generator | yes | |
| `exportName` | `String` | generator | yes | |
| `fileHash` | `String` | generator | yes | |
| `propsSchemaDigest` | `String` | generator | yes | SHA of the component's TS prop types |

## 3. Code location and detection

- **Scan path:** `app/src/components/**/*.tsx`
- **Detection:** JSDoc `@surface <key>` on the default export.
- **Required annotations:**
  - `@surface <key>`
  - `@kind <kind>`
  - `@ownerTeam <slug>`
  - `@feature <key>` (optional)

`tokensConsumed` is derived from a CSS-var extraction pass (the generator grep-walks the component's imported stylesheet for `var(--…)` references).

## 4. Registration fields

### Human fields
`kind`, `depthLevel`, `statesSupported`, `featureKey`, `uxuiBriefRef`, plus Shared Metadata.

### Generator fields
`tokensConsumed`, `codePath`, `exportName`, `fileHash`, `propsSchemaDigest`.

## 5. Lifecycle

Standard. Because surfaces are heavily consumed, deprecating a surface triggers a drift scan for every `Page.surfacesUsed` entry.

Sunset window: 90 days, but `ux-ui-svelte-worker-bee` can extend to 180 if the visual system is in mid-refactor.

## 6. Relationships

**Surface references:** `DesignTokenDefinition[]` (via `tokensConsumed`), `Feature`.

**Referenced by:** `Page.surfacesUsed`, `Layout.surfaces`, theme-builder presets.

## 7. Hand-offs

- **ux-ui-svelte-worker-bee**: owns the semantic brief (`uxuiBriefRef`). You catalog; they define meaning.
- On any surface PR: you verify the row exists; they verify the code matches the brief.

## 8. Pitfalls

- Registering a component as both `Surface` and `Control` because it visually looks like either. Pick one; a surface *contains*, a control *acts*.
- Missing `uxuiBriefRef`: the surface becomes uncatalogued visually. Always link to a brief doc.
- `tokensConsumed` listing tokens that the brief forbids (e.g., a surface that uses a `--color-gold` literal where `--color-gold-ink` is required). Flag in drift audit.
- Bolting new state values into `statesSupported` without ux-ui review (e.g., `shimmering` is not a brief state).

## 9. Example

```ts
await prisma.surface.create({
  data: {
    key: "card-glass",
    kind: "card",
    depthLevel: "glass",
    statesSupported: ["default", "hover", "elevated"],
    tokensConsumed: [
      "color.surface-glass-bg",
      "blur.md",
      "radius.lg",
      "shadow.glass",
      "space.4"
    ],
    featureKey: "generic-ui",
    uxuiBriefRef: "library/knowledge/private/ux-ui/03-components/cards-and-surfaces.md#glass-card",
    codePath: "app/src/components/cards/CardGlass.tsx",
    exportName: "CardGlass",
    fileHash: "f1e2d3...",
    propsSchemaDigest: "a4b5c6...",
    status: "draft",
    ownerTeam: "ux",
    prdRef: "FEA-132",
    environments: ["dev", "staging", "prod"],
    createdBy: "sync-generator@ci",
  },
});
```

See `examples/surface-example.md`.

## 10. Checklist

- [ ] Component file exists with `@surface` annotation
- [ ] `kind` matches the component's actual role (card vs modal vs sheet etc.)
- [ ] `depthLevel` aligns with ux-ui brief §2 (glass/depth)
- [ ] Every `tokensConsumed` entry resolves to a real `DesignTokenDefinition`
- [ ] `uxuiBriefRef` points at a real section in the ux-ui kb
- [ ] `statesSupported` matches what the component actually implements
- [ ] No re-implementation of `.glass-surface` or shadow stacks inline (flag with ux-ui-svelte-worker-bee)
