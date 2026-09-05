# Vaul Drawer: External Source Note

**Source:** https://vaul.emilkowal.ski/ + https://github.com/emilkowalski/vaul
**Source type:** external/primary
**Authority:** authoritative
**Relevance:** high
**Topic:** Vaul drawer/sheet patterns, 2026

## Key findings

### What Vaul is
Vaul is a drawer component for React built on top of Radix Dialog. It provides bottom drawer (mobile-native feel), side sheet, and snap-point behavior that vanilla Radix Dialog does not.

### Requires `"use client"`
Vaul uses browser APIs (scroll, touch events, ResizeObserver). The `<Drawer.Root>` and any Vaul component must be in a `"use client"` module in Next.js App Router.

### API (v1.x, 2026)
```tsx
<Drawer.Root shouldScaleBackground>
  <Drawer.Trigger asChild><Button>Open</Button></Drawer.Trigger>
  <Drawer.Portal>
    <Drawer.Overlay />
    <Drawer.Content>
      <Drawer.Title>Title</Drawer.Title>
      <Drawer.Description>...</Drawer.Description>
      {/* content */}
    </Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>
```

### Snap points
```tsx
<Drawer.Root snapPoints={[0.5, 1]} activeSnapPoint={snap} setActiveSnapPoint={setSnap}>
```
- Array of fractions (0-1) relative to viewport height.
- `fadeFromIndex` controls at which snap point the overlay fades in.

### shouldScaleBackground
- Scales and rounds the background app content when drawer opens (iOS-native look).
- Requires `[vaul-drawer-wrapper]` attribute on the app root element.

### Nested drawers
- Supported via `<Drawer.NestedRoot>` (or `nested` prop on v1.1+).
- Avoid more than two levels of nesting; behavior becomes unpredictable.

### Scroll inside drawer
- Add `overflow-y: auto` to the scrollable child; Vaul handles the scroll lock on the body.

### Accessibility
- Inherits Radix Dialog's focus trap, `aria-modal`, and keyboard handling.
- `Drawer.Title` and `Drawer.Description` map to `aria-labelledby` / `aria-describedby`.
