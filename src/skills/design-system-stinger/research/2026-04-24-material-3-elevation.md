# Material Design 3 Elevation + Tone-Based Surfaces

**Sources:**
- https://m3.material.io/styles/elevation/applying-elevation
- https://m3.material.io/blog/tone-based-surface-color-m3
- https://developer.android.com/develop/ui/compose/designsystems/material3

**Retrieved:** 2026-04-24

## Summary

Material Design 3 uses **tonal elevation** (color overlays tinted with the
primary color) in addition to shadows to differentiate containers. This is a
shift from M2, where elevation was purely shadow-based.

Key principles:

- Elevation has two components: `tonalElevation` (surface tint) and
  `shadowElevation` (drop shadow).
- Dark mode relies on tonal overlays more heavily since shadows are less
  visible on dark backgrounds.
- Overlay color comes from the primary color slot: so the whole surface
  stack inherits tenant/brand tint.
- Five canonical elevation levels (0, 1, 2, 3, 4, 5) mapped to specific
  dp/tone values.

## How it compares to the glass-on-beige starter

The glass-on-beige starter kit uses a different depth model:

- **Three-cue glass** (top-edge highlight + direct shadow + ambient shadow)
  rather than tonal overlays.
- Shadows tinted with navy (primary) via `color-mix()`: conceptually similar
  to M3's tonal tint but applied through the shadow channel, not the surface
  fill.
- Four tiers (`depth-0..3`) rather than six.

Both approaches are valid. The Bee's job is to pick ONE consistent model
per product and stick to it. The glass-on-beige starter uses glass/depth;
M3 uses tonal elevation; a flat-modern product uses no elevation at all.

## Relevance to this stinger

- `guides/00-principles.md` notes that depth systems are design-system-local:
  glass, tonal, and flat are all valid, but a product picks one.
- `guides/04-authoring-utility-layer.md` teaches the three-cue glass recipe
  and cites M3 as the "elevation + tint" alternative if the aesthetic calls
  for it.
- The `flat-modern` starter kit intentionally omits shadows and depth tiers
  to contrast with glass-on-beige.
- The Bee should NEVER mix elevation paradigms within one product (e.g.,
  M3 tonal surfaces on top of three-cue glass shadows).
