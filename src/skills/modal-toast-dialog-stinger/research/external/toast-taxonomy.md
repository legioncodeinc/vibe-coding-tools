# Toast vs Notification Semantics: External Source Note

**Source:** Community synthesis (Nielsen Norman Group, Smashing Magazine, ARIA APG), 2025-2026
**Source type:** external/secondary
**Authority:** community
**Relevance:** high
**Topic:** Toast vs notification taxonomy; when to use which pattern

## Key findings

### The four-tier overlay taxonomy

| Tier | Pattern | Primitive | Duration | User action required? | Example |
|---|---|---|---|---|---|
| Ephemeral feedback | Toast | Sonner `toast()` | Auto-dismiss (3-5s) | No | "Changes saved" |
| Confirmation / destructive | Alert dialog | Radix `AlertDialog` | Persistent until action | Yes (confirm/cancel) | "Delete this item?" |
| Contextual side panel | Drawer / sheet | Vaul `Drawer` | Persistent until close | No (can stay open) | Filter panel, detail view |
| Ambient persistent status | Notification center | Custom tray | Persistent, manual clear | No | Inbox, activity feed |

### Critical anti-patterns

1. **Toast for destructive confirmations**: using a toast with an "Undo" button for irreversible actions (e.g., permanent deletion) is a critical UX failure. The user may not see the toast in time, or the undo window may expire. Use `AlertDialog` instead.
2. **Dialog for ephemeral feedback**: showing a modal dialog that says "Changes saved" forces an unnecessary user interaction. Use `toast.success()` instead.
3. **Stacking multiple modals**: never open a Dialog on top of another Dialog without explicit nested-dialog support (Radix handles this, but the UX is almost always wrong).
4. **Auto-dismissing error toasts**: errors should persist until the user dismisses them (use `toast.error()` with `duration: Infinity` or a very long duration).

### ARIA live region roles
- `role="status"`: polite announcement (success, info). Screen reader waits for user to finish current task.
- `role="alert"`: assertive announcement (error). Screen reader interrupts current task immediately.
- Sonner maps these correctly: `toast()` and `toast.success()` use `status`; `toast.error()` uses `alert`.

### Notification center pattern (persistent tray)
- Not a single component: typically a popover containing a scrollable list of notification items.
- Each item has its own dismiss action.
- Unread count is a badge on the notification bell icon.
- This pattern is out of scope for `modal-toast-dialog-worker-bee`'s primitives but the taxonomy guide should name it so users know where it falls.
