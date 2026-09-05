# Radix Dialog + AlertDialog: External Source Note

**Source:** https://www.radix-ui.com/primitives/docs/components/dialog
**Source type:** external/primary
**Authority:** authoritative
**Relevance:** high
**Topic:** Radix Dialog and AlertDialog API, 2025-2026

## Key findings

### Dialog vs AlertDialog
- `Dialog` is for general content overlays (forms, detail panels, confirmations with low consequence).
- `AlertDialog` is for destructive or irreversible actions: it forces the user to acknowledge by only providing action buttons (no backdrop dismiss, no Escape close by default).
- Both use the same portal + focus trap infrastructure.

### API surface (2026 stable)
```tsx
// Dialog
<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog.Trigger asChild><Button>Open</Button></Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="..." />
    <Dialog.Content aria-describedby={descId}>
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.Description id={descId}>...</Dialog.Description>
      <Dialog.Close asChild><Button>Close</Button></Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

### Focus trap
- Radix handles focus trap internally via `@radix-ui/react-focus-scope`.
- Focus is trapped within `Dialog.Content` on open.
- Focus returns to the trigger (last focused element before open) on close.
- `initialFocus` prop allows redirecting initial focus.

### Scroll lock
- Radix Dialog applies `overflow: hidden` to `<body>` via `@radix-ui/react-scroll-area` on open.
- Does NOT prevent scroll on iOS without additional CSS (`position: fixed; width: 100%` on `<body>`).

### Portal
- `Dialog.Portal` mounts content in `document.body` by default.
- Custom portal target via `container` prop.

### `asChild`
- Passes all props to the child element, merging event handlers. Essential for custom trigger elements.
