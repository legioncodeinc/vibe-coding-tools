# Command Brief: Internal Source Note

**Source type:** internal
**Authority:** high
**Relevance:** high
**Topic:** modal-toast-dialog-worker-bee purpose, directives, and scope

## Key extracts

### Identity
`modal-toast-dialog-worker-bee` owns the accessible overlay surface: alert dialogs, confirmation dialogs, drawers, sheets, toasts, snackbars, command menus, and the focus + scroll + ARIA contract they all share.

### Critical directives
1. Always mount overlays in a portal outside the app root.
2. Never re-implement the focus trap.
3. Apply the toast-vs-dialog taxonomy before recommending a primitive.
4. Validate keyboard navigation and focus return before declaring done.
5. Defer motion/animation decisions to ux-ui-svelte-worker-bee.

### Overlap boundaries
- `ux-ui-svelte-worker-bee`: owns design tokens and motion values.
- `react-worker-bee`: owns component-tree architecture.
- `security-worker-bee`: owns overlays that gate destructive/sensitive actions.
