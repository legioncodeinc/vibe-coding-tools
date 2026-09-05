# Alert Dialog - Bits UI (accessibility deep dive)

- URL: https://www.bits-ui.com/docs/components/alert-dialog
- Fetched: 2026-08-14
- Source type: official docs
- Component: accessibility

A modal window presenting content or seeking user input without navigating away from the current context.

## Key features

- Compound Component Structure: build flexible, customizable alert dialogs using sub-components.
- Accessibility: ARIA-compliant with full keyboard navigation support.
- Portal Support: render content outside the normal DOM hierarchy for proper stacking.
- Managed Focus: automatically traps focus with customization options.
- Flexible State: supports both controlled and uncontrolled open states.

## Structure

Root (manages state, provides context), Trigger, Portal, Overlay, Content, Title, Description, Cancel, Action.

```svelte
<script lang="ts">
  import { AlertDialog } from "bits-ui";
</script>

<AlertDialog.Root>
  <AlertDialog.Trigger>Open Dialog</AlertDialog.Trigger>
  <AlertDialog.Portal>
    <AlertDialog.Overlay />
    <AlertDialog.Content>
      <AlertDialog.Title>Confirm Action</AlertDialog.Title>
      <AlertDialog.Description>Are you sure?</AlertDialog.Description>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action>Confirm</AlertDialog.Action>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
```

## Focus management

### Focus trap

Focus is trapped within the dialog by default (`trapFocus={true}`). Disabling it (`trapFocus={false}`) may reduce accessibility; use with caution.

### Open focus

By default, when a dialog opens, focus moves to `AlertDialog.Content`. This lets screen readers properly read the content and ensures keyboard users land somewhere interactive. Override via `onOpenAutoFocus` on `Content`; call `event.preventDefault()` to cancel the default and focus something else instead:

```svelte
<script lang="ts">
  import { AlertDialog } from "bits-ui";
  let nameInput = $state<HTMLInputElement>();
</script>

<AlertDialog.Root>
  <AlertDialog.Trigger>Open AlertDialog</AlertDialog.Trigger>
  <AlertDialog.Content
    onOpenAutoFocus={(e) => {
      e.preventDefault();
      nameInput?.focus();
    }}
  >
    <input type="text" bind:this={nameInput} />
  </AlertDialog.Content>
</AlertDialog.Root>
```

### Close focus

By default, focus returns to the trigger element when the dialog closes. Override via `onCloseAutoFocus`, cancelling the default and focusing something else.

## Advanced behaviors

### Scroll lock

Body scroll is disabled by default while the dialog is open (`preventScroll={true}` on `Content`). Set `preventScroll={false}` to allow body scrolling; this may affect focus and accessibility, so use judiciously.

### Escape key handling

Two methods:

1. `escapeKeydownBehavior` prop on `Content`: `'close'` (default, closes immediately), `'ignore'` (prevents close), `'defer-otherwise-close'`, `'defer-otherwise-ignore'` (defer to an ancestor Bits UI component that also implements this prop, otherwise close/ignore respectively).
2. `onEscapeKeydown` callback for fully custom handling; call `event.preventDefault()` to cancel default behavior.

### Interaction outside

Two methods:

1. `interactOutsideBehavior` prop on `Content`: default is `'ignore'` (does NOT close on alert dialogs, unlike a full Dialog which typically closes); other values `'close'`, `'defer-otherwise-close'`, `'defer-otherwise-ignore'` behave as with escape handling.
2. `onInteractOutside` callback for custom handling.

### Best practices (per docs)

- Consider scroll-lock implications carefully for scrollable dialog content.
- Overriding escape-key behavior should be done thoughtfully; users expect Escape to close modals.
- Ignoring outside interactions is useful for important/multi-step dialogs but risks trapping users unintentionally.
- Always ensure customizations maintain or enhance accessibility.
- Balance custom behavior against common UX expectations.

## Nested dialogs

Alert Dialogs can nest within each other or with regular Dialogs. Data attributes `data-nested-open` (present when nested dialogs are open) and `data-nested` (present when the dialog itself is nested, useful for hiding overlap) plus CSS variables `--bits-dialog-depth` and `--bits-dialog-nested-count` support styling nested stacks.

## Working with forms

For async actions on `Action` click, wait for the async action to complete then programmatically close the dialog (`bind:open`). If an `AlertDialog` is used within a `<form>`, the `Portal` must be disabled/omitted, since Portal renders dialog content outside the form, which would break form submission.

## API reference highlights (props)

`AlertDialog.Root`: `open` (bindable boolean, default false), `onOpenChange`, `onOpenChangeComplete`, `children`.

`AlertDialog.Content` props relevant to accessibility: `onInteractOutside`, `onFocusOutside`, `interactOutsideBehavior` (default `'close'` per API table, though the descriptive text above states ignore-by-default behavior for Alert Dialog specifically -- see "Conflict" note below), `onEscapeKeydown`, `escapeKeydownBehavior` (default `'close'`), `onOpenAutoFocus`, `onCloseAutoFocus`, `trapFocus` (default `true`), `forceMount` (default `false`, for custom Svelte transitions), `preventOverflowTextSelection` (default `true`), `preventScroll` (default `true`), `restoreScrollDelay` (default `0`, only applies with `child` snippet + `forceMount` + `preventScroll`).

Conflict flag: the narrative "Interaction Outside" section states the default `interactOutsideBehavior` is `'ignore'` for `AlertDialog.Content`, but the API reference table for the same prop lists `Default: 'close'`. The fetched page did not resolve this discrepancy; flagged as a documentation inconsistency in the archive rather than smoothed over. Downstream guides should note both readings and test actual behavior before asserting a default.

## Bits UI general accessibility claims (cross-reference)

Per raw/03-bits-ui-foundation.md: "Production-Ready Accessibility: WAI-ARIA compliance, Keyboard navigation by default, Focus management handled for you, Screen reader support built-in." This Alert Dialog page is the concrete implementation evidence for those claims (focus trap, auto-focus hooks, escape handling, ARIA roles implied by title/description association).

---

# Focus scope fix (evidence of ongoing accessibility maintenance)

- URL: https://github.com/huntabyte/bits-ui/pull/1933
- Fetched: 2026-08-14
- Source type: release notes
- Component: accessibility

`fix(FocusScope): improve focus management for single tabbable item`, merged 2026-01-28, huntabyte. Evidence that focus-scope/focus-trap internals receive active bug fixes as part of ongoing Bits UI maintenance.

# Tab/Shift-Tab handling in dropdown menus (WAI-ARIA APG conformance)

- URL: https://github.com/huntabyte/bits-ui/pull/1106
- Fetched: 2026-08-14
- Source type: release notes
- Component: accessibility

`Handle Tab and Shift-Tab in dropdown menus`, referencing issue #1105 "dropdown menu does not follow the WAI APG Menu pattern." Evidence Bits UI actively tracks conformance against the WAI-ARIA Authoring Practices Guide (APG) menu pattern, not just general ARIA attribute presence.
