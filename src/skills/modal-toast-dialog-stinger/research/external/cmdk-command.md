# cmdk Command Menu: External Source Note

**Source:** https://cmdk.paco.me/ + https://github.com/pacocoursey/cmdk
**Source type:** external/primary
**Authority:** authoritative
**Relevance:** medium
**Topic:** cmdk command menu API, 2026

## Key findings

### What cmdk is
cmdk is a headless, accessible command menu (palette) component for React. It is framework-agnostic within React and is the underlying primitive for shadcn/ui's `<Command>` component.

### Standalone vs Radix
- cmdk v1 is standalone; it does NOT require Radix as a peer dependency.
- However, shadcn/ui wraps cmdk in a Radix Dialog via `<Command.Dialog>` for the modal command palette pattern.

### Core API
```tsx
<Command>
  <Command.Input placeholder="Search..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>
    <Command.Group heading="Suggestions">
      <Command.Item onSelect={() => runAction()}>Action Name</Command.Item>
    </Command.Group>
  </Command.List>
</Command>
```

### Dialog variant (modal command palette)
```tsx
// shadcn/ui pattern
<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandInput placeholder="Type a command or search..." />
  <CommandList>...</CommandList>
</CommandDialog>
```
`CommandDialog` wraps cmdk in a Radix Dialog with the keyboard shortcut listener typically wired outside:
```tsx
useEffect(() => {
  const down = (e: KeyboardEvent) => {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      setOpen(o => !o)
    }
  }
  document.addEventListener('keydown', down)
  return () => document.removeEventListener('keydown', down)
}, [])
```

### Loading state
```tsx
<Command.Loading>Loading results…</Command.Loading>
```

### Accessibility
- `role="combobox"` on the input, `role="listbox"` on the list, `role="option"` on items.
- Keyboard: Arrow up/down navigates, Enter selects, Escape closes.
- Screen-reader: `aria-selected` on the active item.
