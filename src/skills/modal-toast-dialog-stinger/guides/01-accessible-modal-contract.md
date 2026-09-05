# Guide 01: Accessible Modal Contract

The six-point contract that every overlay produced by `modal-toast-dialog-worker-bee` must satisfy. Check each point before declaring an overlay done.

*Derives from: `research/external/aria-apg-dialog.md` (normative W3C source).*

---

## The six points

### 1. `aria-modal="true"`

Apply to the dialog container element (the `div` that visually represents the modal). This tells assistive technology to treat all content behind the overlay as inert.

Radix Dialog adds `aria-modal="true"` to `Dialog.Content` automatically. Verify with browser DevTools if unsure.

### 2. Correct `role`

- `role="dialog"`: general content overlays (forms, detail panels, confirmations with low consequence).
- `role="alertdialog"`: destructive or urgent confirmations that require an immediate response. Screen readers announce `alertdialog` more urgently.

Radix: `Dialog.Content` gets `role="dialog"`; `AlertDialog.Content` gets `role="alertdialog"` automatically.

### 3. Focus trap

When the dialog opens, focus must move into the dialog. Tab and Shift+Tab must cycle only within the dialog. Focus must never escape to background content.

**Do NOT hand-roll the focus trap.** Use the primitive's built-in implementation:

- Radix: built-in via `@radix-ui/react-focus-scope`.
- Vaul: inherits Radix's trap (Vaul is built on Radix Dialog).
- Headless UI: built-in `FocusTrap` component.
- Custom: use `focus-trap-react` (npm).

Common focus trap failures:
- Focus escaping to `position: fixed` elements outside the portal.
- Focus escaping into an `<iframe>`.
- Dynamically rendered buttons inside the dialog that are not in the DOM when the trap initializes.

### 4. Escape key

Pressing Escape must close the dialog.

Exception: `AlertDialog` for truly irreversible actions may disable Escape. If Escape IS allowed on an AlertDialog, it must be equivalent to clicking "Cancel".

Radix handles Escape automatically. Do not override `onKeyDown` to consume Escape unless you have a specific reason, and document it.

### 5. Scroll lock

Background page scroll must be disabled while a modal overlay is open.

Radix Dialog applies `overflow: hidden` to `<body>`. **iOS caveat:** this alone does not prevent scroll on iOS Safari. Apply:
```css
body[data-scroll-locked] {
  position: fixed;
  width: 100%;
  overflow-y: scroll; /* preserve scrollbar width */
}
```

Or use the `body-scroll-lock` package for cross-browser reliability.

### 6. Focus return

When the dialog closes, focus must return to the element that opened it (the trigger button or link).

Radix Dialog returns focus to the last focused element automatically. Verify this in every overlay: open the dialog, navigate inside it, close it, and confirm focus returns to the trigger.

---

## `aria-labelledby` and `aria-describedby`

Required for screen readers to announce the dialog's purpose:

```tsx
<Dialog.Content aria-labelledby="dialog-title" aria-describedby="dialog-desc">
  <Dialog.Title id="dialog-title">Confirm deletion</Dialog.Title>
  <Dialog.Description id="dialog-desc">
    This action cannot be undone.
  </Dialog.Description>
</Dialog.Content>
```

Radix's `Dialog.Title` and `Dialog.Description` wire `aria-labelledby` and `aria-describedby` automatically when they are direct children of `Dialog.Content`.

---

## WCAG 2.2 additions (current in 2026)

- **2.4.11 Focus Appearance (AA):** Focus indicators inside modals must have minimum area (at least the perimeter of the focused element × 2 CSS pixels) and a contrast ratio of at least 3:1. Custom focus styles must pass this criterion.
- **2.4.12 Focus Appearance (AAA):** Stricter version (4.5:1 contrast).

---

## Checklist (copy into the audit report)

- [ ] `aria-modal="true"` on dialog container
- [ ] Correct `role`: `dialog` or `alertdialog`
- [ ] Focus moves into dialog on open
- [ ] Tab/Shift+Tab cycle stays inside dialog
- [ ] Escape closes dialog (or is intentionally disabled with documentation)
- [ ] Background scroll locked on open
- [ ] Focus returns to trigger on close
- [ ] `aria-labelledby` and `aria-describedby` wired
- [ ] Focus visible indicators pass WCAG 2.4.11

---

*Template: `templates/overlay-audit-report.md` includes this checklist pre-filled.*
