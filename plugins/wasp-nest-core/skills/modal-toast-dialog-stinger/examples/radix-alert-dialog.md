# Example: Radix AlertDialog (Destructive Confirmation)

*Demonstrates: `guides/00-primitive-selection-matrix.md` (pick AlertDialog), `guides/01-accessible-modal-contract.md` (six-point contract).*

---

## Scenario

The user clicks "Delete account". This is irreversible. We need explicit confirmation before proceeding.

## Code

```tsx
'use client'
import * as AlertDialog from '@radix-ui/react-alert-dialog'

interface DeleteAccountDialogProps {
  onConfirm: () => void
}

export function DeleteAccountDialog({ onConfirm }: DeleteAccountDialogProps) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button className="text-red-600 hover:text-red-700">
          Delete account
        </button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <AlertDialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg bg-white rounded-lg p-6 shadow-xl focus:outline-none">
          <AlertDialog.Title className="text-lg font-semibold text-gray-900">
            Delete your account?
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm text-gray-600">
            This action is permanent and cannot be undone. All your data,
            projects, and settings will be removed immediately.
          </AlertDialog.Description>

          <div className="mt-6 flex justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Cancel
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                onClick={onConfirm}
              >
                Yes, delete my account
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
```

## Accessibility contract verification

- [x] `aria-modal="true"`: added by Radix `AlertDialog.Content` automatically
- [x] `role="alertdialog"`: set by Radix automatically
- [x] Focus trap: Radix built-in; Tab cycles between Cancel and Action buttons only
- [x] Escape: Radix closes the dialog and calls Cancel (correct for this scenario)
- [x] Scroll lock: applied by Radix to `<body>`
- [x] Focus return: Radix returns focus to the trigger button on close
- [x] `aria-labelledby`: `AlertDialog.Title` wires this automatically
- [x] `aria-describedby`: `AlertDialog.Description` wires this automatically

## Why not a toast with "Undo"?

Deleting an account is irreversible. The undo window in a toast (3-5 seconds) is insufficient for an action with permanent consequences. `AlertDialog` forces the user to read the description and make an explicit choice. See `guides/02-toast-notification-taxonomy.md` Anti-pattern #1.
