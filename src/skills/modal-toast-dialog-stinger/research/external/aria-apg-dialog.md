# WAI-ARIA APG Dialog (Modal) Pattern: External Source Note

**Source:** https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
**Source type:** external/primary
**Authority:** normative (W3C)
**Relevance:** high
**Topic:** Accessible modal contract: focus, ARIA, keyboard, scroll, 2026

## Key findings

### The six-point accessible modal contract

1. **`aria-modal="true"`**: signals to assistive technology that content behind the modal is inert. Required on the dialog container element.
2. **`role="dialog"` or `role="alertdialog"`**: `dialog` for general content; `alertdialog` when the dialog requires an immediate response and nothing else should be interactable until the user responds.
3. **Focus trap**: when a dialog opens, focus must move to an element inside the dialog. Tab and Shift+Tab must cycle within the dialog only. No focus may escape to the background page.
4. **Escape key**: pressing Escape must close the dialog (except AlertDialog where Escape should either close or be disabled, depending on the consequence).
5. **Scroll lock**: background page scroll must be disabled while a modal is open.
6. **Focus return**: when the dialog closes, focus must return to the element that triggered the dialog open.

### `aria-labelledby` and `aria-describedby`
- `aria-labelledby` should point to the dialog's heading (`<h2>` or equivalent).
- `aria-describedby` should point to the dialog's descriptive paragraph (optional but strongly recommended).

### AlertDialog specifics
- `role="alertdialog"` is announced more urgently by screen readers.
- Should NOT be dismissable by clicking the backdrop.
- Escape behavior: recommended to disable Escape on truly destructive confirmations, or to make Escape equivalent to "Cancel".

### WCAG 2.2 additions relevant to modals (2023, still current in 2026)
- **2.4.11 Focus Appearance (AA):** focus indicators must have a minimum area and contrast ratio. Custom focus styles inside modals must pass this criterion.
- **2.4.12 Focus Appearance (AAA):** stricter version.
- **3.2.6 Consistent Help (A):** help mechanisms must appear in consistent locations; modals that surface help content must not break the position contract.

### Focus trap implementation
- Radix UI implements this via `@radix-ui/react-focus-scope`: includes roving tabindex and Shadow DOM awareness.
- `focus-trap-react` is an acceptable alternative for non-Radix stacks.
- Hand-rolling focus traps is strongly discouraged; ARIA APG documents the edge cases that all known hand-rolled traps miss.
