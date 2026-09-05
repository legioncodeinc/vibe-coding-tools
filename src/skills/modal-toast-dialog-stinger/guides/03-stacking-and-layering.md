# Guide 03: Stacking and Layering

Overlays from different primitives coexist in the same DOM. This guide covers the z-index strategy, portal coexistence, and nested overlay patterns.

*Derives from: `research/external/radix-dialog.md`, `research/external/vaul-drawer.md`, `research/external/sonner-toast.md`.*

---

## Portal targets

All three primitives mount to `document.body` by default:

| Primitive | Portal target | Default z-index |
|---|---|---|
| Radix Dialog | `document.body` | ~50 (controlled by CSS variables) |
| Vaul Drawer | `document.body` | ~50 |
| Sonner `<Toaster>` | `document.body` | 9999 |
| cmdk `CommandDialog` | `document.body` (via Radix Dialog) | ~50 |

Sonner deliberately uses a high z-index so toasts appear above all modals. This is intentional; do not lower it unless a full-screen overlay (lightbox, video player) should cover toasts.

---

## Z-index strategy for a stacked UI

Use a layered z-index scale:

```css
:root {
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 300;
  --z-drawer: 300;
  --z-toast: 400;
  --z-tooltip: 500;
}
```

Apply via Tailwind JIT or CSS variables on the primitive's overlay/content element.

Radix provides CSS custom properties (`--radix-dialog-content-z-index`) that can be overridden per-instance.

---

## Dialog on top of a Drawer

The correct pattern: mount the Radix Dialog's portal with a higher z-index than the Vaul Drawer.

```tsx
// Vaul Drawer (z-index: 300 via CSS)
<Drawer.Root>
  <Drawer.Portal>
    <Drawer.Content className="z-[300]">
      {/* Trigger a Dialog from inside the Drawer */}
      <ConfirmDeleteDialog />
    </Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>

// ConfirmDeleteDialog (z-index: 350 to sit above the Drawer)
<AlertDialog.Root>
  <AlertDialog.Portal>
    <AlertDialog.Overlay className="z-[340]" />
    <AlertDialog.Content className="z-[350]">
      ...
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
```

Both portals mount to `document.body`, so z-index comparison works correctly between them.

---

## Scroll lock coexistence

When a Dialog opens inside a Vaul Drawer:
1. Vaul has already applied scroll lock to `<body>`.
2. Radix Dialog applies its own scroll lock on top.
3. When the Dialog closes, Radix removes its lock, but Vaul's lock should persist until the Drawer closes.

In practice, both Radix and Vaul use the same underlying `@radix-ui/react-remove-scroll` mechanism, which reference-counts the lock. This means the lock is correctly maintained until both are closed.

**Verify:** open a Dialog inside a Drawer, close the Dialog, confirm the body is still scroll-locked (Drawer is still open), close the Drawer, confirm body scroll is restored.

---

## Sonner + Radix coexistence

No special configuration needed. Sonner's `<Toaster>` and Radix Dialog portals are independent. Sonner's default `z-index: 9999` ensures toasts appear above Radix modals.

One gotcha: if you add `pointer-events: none` to a full-screen overlay, ensure the `<Toaster>` is outside that overlay's stacking context, or add `pointer-events: auto` specifically to the `<Toaster>`.

---

## Background content inert

When a modal opens, background content should be non-interactive. Radix achieves this via `aria-hidden="true"` on the app root when a Dialog is open. Verify:

```tsx
// app root should receive aria-hidden="true" when dialog opens
document.getElementById('__next') // or '#root', '#app'
// should have aria-hidden="true" in DevTools when Dialog is open
```

Vaul does the same. Sonner does NOT inert background content (toasts are supplemental, not modal).
