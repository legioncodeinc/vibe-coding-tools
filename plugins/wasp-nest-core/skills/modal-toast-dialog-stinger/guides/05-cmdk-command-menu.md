# Guide 05: cmdk Command Menu

Complete implementation guide for the cmdk command palette in Next.js with shadcn/ui.

*Derives from: `research/external/cmdk-command.md`.*

---

## Setup

```bash
# Standalone
npm install cmdk

# Or via shadcn/ui
npx shadcn@latest add command
```

cmdk v1 does NOT require Radix as a peer dependency when used standalone. The shadcn `CommandDialog` wrapper adds Radix Dialog on top.

---

## Inline command list (embedded in page)

```tsx
import { Command } from 'cmdk'

export function CommandMenu() {
  return (
    <Command className="rounded-lg border shadow-md">
      <Command.Input placeholder="Search..." />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        <Command.Group heading="Actions">
          <Command.Item onSelect={() => console.log('new')}>
            New File
          </Command.Item>
          <Command.Item onSelect={() => console.log('open')}>
            Open File
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command>
  )
}
```

---

## Modal command palette (⌘K pattern)

```tsx
'use client'
import { useEffect, useState } from 'react'
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'

export function CommandPalette() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(prev => !prev)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => { router.push('/dashboard'); setOpen(false) }}>
            Go to Dashboard
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
```

Mount `<CommandPalette />` once in `layout.tsx` (Server Component safe wrapper around the `'use client'` component).

---

## Loading state

```tsx
const [loading, setLoading] = useState(false)
const [results, setResults] = useState([])

async function onValueChange(search: string) {
  setLoading(true)
  const res = await fetchResults(search)
  setResults(res)
  setLoading(false)
}

<Command onValueChange={onValueChange}>
  <Command.Input />
  <Command.List>
    {loading && <Command.Loading>Searching…</Command.Loading>}
    {!loading && results.map(r => (
      <Command.Item key={r.id}>{r.name}</Command.Item>
    ))}
    {!loading && results.length === 0 && <Command.Empty>No results.</Command.Empty>}
  </Command.List>
</Command>
```

---

## Keyboard navigation

Built-in keyboard behavior (no additional code required):

| Key | Action |
|---|---|
| Arrow Up/Down | Navigate items |
| Enter | Select focused item (calls `onSelect`) |
| Escape | Close (when wrapped in `CommandDialog`) |
| Type any key | Filter items (cmdk's built-in fuzzy search) |

---

## Accessibility

- `role="combobox"` on `Command.Input`
- `role="listbox"` on `Command.List`
- `role="option"` on each `Command.Item`
- `aria-selected="true"` on the focused item
- `aria-expanded` toggled by `CommandDialog`
- Inherits Dialog accessibility contract when wrapped in `CommandDialog`

---

## Custom filter

```tsx
<Command filter={(value, search) => {
  if (value.includes(search)) return 1
  return 0
}}>
```
