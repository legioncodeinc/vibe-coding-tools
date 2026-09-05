# Example: Sonner Toast with Undo

*Demonstrates: `guides/02-toast-notification-taxonomy.md` (Tier 1 ephemeral feedback), `guides/00-primitive-selection-matrix.md` (when Sonner is correct).*

---

## Scenario

The user archives an item. This action is reversible within a short window. We want to show a toast with an "Undo" option.

## Setup (once, in layout.tsx)

```tsx
// app/layout.tsx
import { Toaster } from 'sonner'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  )
}
```

## Component code

```tsx
'use client'
import { toast } from 'sonner'

interface ArchiveButtonProps {
  itemId: string
  itemName: string
  onArchive: (id: string) => void
  onRestore: (id: string) => void
}

export function ArchiveButton({ itemId, itemName, onArchive, onRestore }: ArchiveButtonProps) {
  function handleArchive() {
    onArchive(itemId)

    toast(`"${itemName}" archived`, {
      description: 'You can restore it from the archive.',
      action: {
        label: 'Undo',
        onClick: () => onRestore(itemId),
      },
      duration: 5000, // 5 second window
    })
  }

  return (
    <button onClick={handleArchive}>
      Archive
    </button>
  )
}
```

## When this IS correct (vs AlertDialog)

| Factor | Archive (toast OK) | Delete account (AlertDialog required) |
|---|---|---|
| Reversible? | Yes (restore from archive) | No |
| Undo window sufficient? | Yes (5s is enough) | N/A, irreversible |
| Consequence of missing toast? | Item archived unexpectedly, recoverable | Account destroyed, unrecoverable |

## Error variant: persistent error toast

```tsx
async function handleSave() {
  try {
    await saveChanges()
    toast.success('Changes saved')
  } catch (err) {
    toast.error('Failed to save changes. Please try again.', {
      duration: Infinity, // persist until user dismisses
      action: {
        label: 'Retry',
        onClick: handleSave,
      },
    })
  }
}
```

Errors use `duration: Infinity` so the user cannot miss them. See `guides/02-toast-notification-taxonomy.md` Anti-pattern #3.
