# Guide 02: Toast vs Notification Taxonomy

Before selecting a primitive, classify the feedback event. The wrong classification produces UX failures that are invisible in development but damaging in production.

*Derives from: `research/external/toast-taxonomy.md`, `research/external/sonner-toast.md`, `research/external/aria-apg-dialog.md`.*

---

## The four-tier taxonomy

### Tier 1: Ephemeral feedback (toast)

**What:** Auto-dismissing, non-blocking feedback for completed actions.
**Primitive:** Sonner `toast()`, `toast.success()`, `toast.info()`
**Duration:** 3-5 seconds, auto-dismiss
**User action required:** No
**Examples:** "Changes saved", "Link copied", "File uploaded"

Toasts are `role="status"` by default in Sonner: a polite live region that waits for the user to finish their current task before announcing.

### Tier 2: Confirmational / destructive (alert dialog)

**What:** An overlay that requires an explicit user decision before an action proceeds.
**Primitive:** Radix `AlertDialog`
**Duration:** Persistent until user responds
**User action required:** Yes (confirm or cancel)
**Examples:** "Delete this item? This cannot be undone.", "Overwrite the existing file?"

AlertDialog is `role="alertdialog"`: an assertive live region that interrupts the screen reader immediately.

### Tier 3: Contextual side panel (drawer)

**What:** Supplemental content that appears alongside the main view without blocking it completely.
**Primitive:** Vaul `Drawer`
**Duration:** Persistent until dismissed
**User action required:** No (but can stay open indefinitely)
**Examples:** Filter panel, detail view, shopping cart, navigation drawer

### Tier 4: Ambient persistent status (notification center)

**What:** A persistent tray of past events the user can review at their leisure.
**Primitive:** Custom (popover + list), out of scope for this stinger's primitives
**Duration:** Persists across sessions until cleared
**User action required:** No
**Examples:** Activity feed, inbox, system alerts

---

## Decision tree

```
Is the event a completed action?
├── Yes → Does it require user confirmation?
│   ├── Yes, and it's destructive → AlertDialog (Tier 2)
│   └── No → Toast (Tier 1)
│       └── Is the error persistent and action-blocking?
│           ├── Yes → toast.error() with duration: Infinity
│           └── No → toast.error() with default duration
└── No → Is it supplemental content alongside the current view?
    ├── Yes → Vaul Drawer (Tier 3)
    └── No (persistent history) → Notification center (Tier 4, out of scope)
```

---

## Critical anti-patterns

### 1. Toast for destructive confirmations (CRITICAL)

```tsx
// WRONG — the user may not see the toast in time
toast('File deleted', {
  action: { label: 'Undo', onClick: () => restoreFile() },
})
```

```tsx
// CORRECT — force acknowledgment
<AlertDialog>
  <AlertDialog.Trigger>Delete file</AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Title>Delete file?</AlertDialog.Title>
    <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>
    <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
    <AlertDialog.Action onClick={deleteFile}>Delete</AlertDialog.Action>
  </AlertDialog.Content>
</AlertDialog>
```

### 2. Modal dialog for ephemeral feedback

```tsx
// WRONG — forces unnecessary interaction
<Dialog>
  <Dialog.Content>
    <p>Changes saved successfully.</p>
    <Dialog.Close>OK</Dialog.Close>
  </Dialog.Content>
</Dialog>
```

```tsx
// CORRECT
toast.success('Changes saved')
```

### 3. Auto-dismissing error toasts

```tsx
// WRONG — user may miss the error
toast.error('Upload failed')

// CORRECT — errors persist until the user dismisses
toast.error('Upload failed. Check your connection and try again.', {
  duration: Infinity,
})
```

---

## ARIA live region roles in practice

| Sonner call | role | Screen reader behavior |
|---|---|---|
| `toast()` | `status` | Polite: waits for current task |
| `toast.success()` | `status` | Polite |
| `toast.info()` | `status` | Polite |
| `toast.warning()` | `status` | Polite |
| `toast.error()` | `alert` | Assertive: interrupts immediately |

---

*Example: `examples/sonner-with-undo.md`*
