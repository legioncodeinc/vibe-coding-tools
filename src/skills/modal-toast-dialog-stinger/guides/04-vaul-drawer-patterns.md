# Guide 04: Vaul Drawer Patterns

Complete implementation guide for Vaul drawers in Next.js App Router with Tailwind CSS.

*Derives from: `research/external/vaul-drawer.md`.*

---

## Setup

```bash
npm install vaul
```

Vaul requires `"use client"`: wrap all Vaul components in a client component.

---

## Basic drawer

```tsx
'use client'
import { Drawer } from 'vaul'

export function ExampleDrawer() {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <button>Open Drawer</button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-full mt-24 max-h-[96%] fixed bottom-0 left-0 right-0">
          <div className="p-4 bg-white rounded-t-[10px] flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
            <Drawer.Title className="font-medium mb-4">Drawer Title</Drawer.Title>
            {/* content */}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
```

---

## Snap points

```tsx
'use client'
import { useState } from 'react'
import { Drawer } from 'vaul'

const snapPoints = [0.4, 0.8, 1]

export function SnappingDrawer() {
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0])

  return (
    <Drawer.Root
      snapPoints={snapPoints}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
    >
      <Drawer.Trigger asChild><button>Open</button></Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed flex flex-col bg-white border border-zinc-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px]">
          <div className="flex flex-col max-w-md mx-auto w-full p-4 pt-5">
            <Drawer.Title>Snap Points Demo</Drawer.Title>
            {/* content scrolls when snap is 1 (full height) */}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
```

---

## shouldScaleBackground

Scales the app behind the drawer for an iOS-native feel. Requires a wrapper attribute on the app root.

```tsx
// layout.tsx
export default function Layout({ children }) {
  return (
    <html>
      <body>
        <div vaul-drawer-wrapper="" className="bg-white">
          {children}
        </div>
      </body>
    </html>
  )
}
```

```tsx
<Drawer.Root shouldScaleBackground>
  ...
</Drawer.Root>
```

---

## Scroll inside a drawer

Add `overflow-y: auto` to the scrollable child element. Vaul manages the body scroll lock.

```tsx
<Drawer.Content className="fixed bottom-0 left-0 right-0 max-h-[80vh] flex flex-col">
  <div className="overflow-y-auto flex-1 p-4">
    {/* long content */}
  </div>
</Drawer.Content>
```

---

## Controlled close

```tsx
const [open, setOpen] = useState(false)

<Drawer.Root open={open} onOpenChange={setOpen}>
  <Drawer.Trigger onClick={() => setOpen(true)}>Open</Drawer.Trigger>
  <Drawer.Portal>
    <Drawer.Content>
      <button onClick={() => setOpen(false)}>Close</button>
    </Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>
```

---

## Nested drawers

```tsx
<Drawer.Root>
  <Drawer.Trigger>Open outer</Drawer.Trigger>
  <Drawer.Portal>
    <Drawer.Content>
      <Drawer.NestedRoot>
        <Drawer.Trigger>Open inner</Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Content>Inner content</Drawer.Content>
        </Drawer.Portal>
      </Drawer.NestedRoot>
    </Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>
```

Limit to two nesting levels. Deeper nesting produces unpredictable dismiss behavior.

---

## Accessibility notes

- Vaul inherits Radix Dialog's focus trap, `aria-modal="true"`, and keyboard handling automatically.
- Always provide `<Drawer.Title>` even if visually hidden (`sr-only`).
- Provide `<Drawer.Description>` when the drawer contains non-trivial content.
