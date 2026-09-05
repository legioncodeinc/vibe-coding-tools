# Guide 00: Primitive Selection Matrix

Use this guide to select the correct overlay primitive before writing any code. The wrong primitive at the start costs a full rewrite; the right one costs nothing.

*Derives from: `research/external/radix-dialog.md`, `research/external/vaul-drawer.md`, `research/external/sonner-toast.md`, `research/external/cmdk-command.md`.*

---

## Decision table

| Overlay type | Primitive | Package | When to use |
|---|---|---|---|
| General content dialog (form, detail) | `Dialog` | `@radix-ui/react-dialog` | Non-destructive content modal. Backdrop click and Escape close it. |
| Destructive confirmation | `AlertDialog` | `@radix-ui/react-alert-dialog` | "Delete account?", "Overwrite file?". No backdrop dismiss. |
| Bottom/side drawer, snap points | `Drawer` | `vaul` | Mobile-style sheet. Snap points, gesture dismiss. |
| Success / info / error feedback | `toast()` | `sonner` | Ephemeral, auto-dismiss. Never for confirmations. |
| Command palette / search | `Command` | `cmdk` | Keyboard-first search menu (`⌘K`). |
| Non-Radix project | `Dialog` | `@headlessui/react` | When Radix is not installed and the project already uses Headless UI. |

---

## Edge cases

### "I need a dialog that slides in from the side"
Use Vaul with `direction="right"` (v1.1+). Do NOT use a Dialog with CSS transitions for a side panel; it will fight the focus trap.

### "I need a small popover, not a full modal"
Use `@radix-ui/react-popover` or `@radix-ui/react-hover-card`. These do NOT trap focus; they are not modals.

### "I need a toast with an Undo action"
Use `toast()` with a custom `action` prop. The undo action MUST execute within the toast's duration window. If the action is irreversible when the window expires, use `AlertDialog` instead.

### "I need to show a dialog on top of a drawer"
Use a Radix `Dialog` inside a Vaul Drawer. Both use portals in `document.body`; they stack correctly via z-index. Ensure the Dialog's z-index is higher than the Drawer's.

### "I need a command palette that opens as a modal"
Use `cmdk`'s `Command.Dialog` (shadcn: `CommandDialog`), which wraps the command menu in a Radix Dialog automatically.

---

## Package install reference

```bash
# Radix primitives (install individually)
npm install @radix-ui/react-dialog @radix-ui/react-alert-dialog

# Vaul
npm install vaul

# Sonner
npm install sonner

# cmdk
npm install cmdk

# shadcn/ui wrappers (add to existing shadcn project)
npx shadcn@latest add dialog alert-dialog drawer sonner command
```

---

*Example: `examples/radix-alert-dialog.md`*
