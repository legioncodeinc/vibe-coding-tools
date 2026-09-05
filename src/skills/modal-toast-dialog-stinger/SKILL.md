---
name: "modal-toast-dialog-stinger"
description: "Accessible overlay specialist for React: primitive selection (Radix Dialog, AlertDialog, Vaul Drawer, Sonner toast, cmdk command menu, Headless UI), the six-point accessible-modal contract (focus trap, escape, scroll lock, aria-modal, aria-labelledby, focus return), and the four-tier toast-vs-notification taxonomy. Use when choosing an overlay primitive, debugging focus trap regressions, implementing a drawer/sheet, wiring Sonner toasts into a React app, building a command palette, or auditing overlay stacking behavior. Paired with `modal-toast-dialog-worker-bee`."
---

# modal-toast-dialog Stinger

Procedural arsenal for `modal-toast-dialog-worker-bee`. Encodes the canonical primitive selection matrix, the six-point accessible-modal contract, the four-tier toast-vs-notification taxonomy, and per-primitive implementation patterns for the 2026 React ecosystem.

---

## When this stinger applies

Load when `modal-toast-dialog-worker-bee` is invoked. Typical triggers:

- "Which primitive should I use for this dialog?"
- "My focus trap isn't working"
- "Should this be a toast or a dialog?"
- "How do I set up Sonner in Next.js App Router?"
- "The drawer isn't scrolling inside"
- "Build me a command palette"
- "Audit our overlay accessibility"

Do NOT load for:
- Design token or animation decisions (ux-ui-svelte-worker-bee owns those)
- General React component architecture (react-worker-bee)
- Overlays that gate auth flows (auth-worker-bee)
- Security audit of overlays protecting sensitive actions (security-worker-bee)

---

## First action when this stinger is loaded

1. Read `guides/00-primitive-selection-matrix.md`: pick the right primitive first.
2. Read `guides/01-accessible-modal-contract.md`: every overlay must pass the six-point contract.
3. Read the per-primitive guide relevant to the request (02 through 05).
4. Use `templates/overlay-audit-report.md` to structure any output report.

---

## Primitive selection matrix (summary)

| Need | Canonical primitive |
|---|---|
| General content modal | Radix `Dialog` |
| Destructive confirmation | Radix `AlertDialog` |
| Bottom / side sheet, snap points | `Vaul` Drawer |
| Ephemeral feedback (success, error, info) | `Sonner` `toast()` |
| Command palette / search menu | `cmdk` `Command` (or `CommandDialog`) |
| Non-Radix React projects | Headless UI `Dialog` |

See `guides/00-primitive-selection-matrix.md` for the full decision table with edge cases.

---

## The six-point accessible-modal contract

Every overlay produced by this stinger must satisfy:

1. `aria-modal="true"` on the dialog container.
2. Correct `role`: `"dialog"` for content overlays, `"alertdialog"` for destructive confirmations.
3. **Focus trap**: Tab/Shift+Tab cycles within the overlay only. Never hand-roll; use the primitive's built-in trap.
4. **Escape key**: closes the dialog (AlertDialog may disable Escape for truly irreversible actions).
5. **Scroll lock**: `overflow: hidden` on `<body>` while the overlay is open.
6. **Focus return**: focus returns to the trigger element when the overlay closes.

See `guides/01-accessible-modal-contract.md` for implementation details and WCAG 2.2 additions.

---

## Toast-vs-notification taxonomy (summary)

| Scenario | Pattern | Primitive |
|---|---|---|
| Ephemeral feedback (save, delete, copy) | Toast, auto-dismiss | Sonner `toast()` |
| Destructive confirmation | Alert dialog | Radix `AlertDialog` |
| Error that requires user attention | Persistent toast | `toast.error()` with `duration: Infinity` |
| Side panel / filter tray | Drawer | Vaul |
| Ambient activity feed | Notification center | Custom tray (out of scope) |

See `guides/02-toast-notification-taxonomy.md` for the full decision tree and anti-patterns.

---

## Critical directives

- **Mount overlays in a portal outside the app root.** Overlays inside scroll containers or stacking contexts produce z-index and scroll-lock failures. See `guides/03-stacking-and-layering.md`.
- **Never re-implement the focus trap.** All known hand-rolled traps fail on Shadow DOM, iframes, or dynamically rendered content. Use the primitive's built-in implementation.
- **Apply the taxonomy before recommending a primitive.** Ephemeral toasts masking destructive confirmations are a critical UX failure.
- **Validate focus return on close.** The most common overlay accessibility regression.
- **Vaul requires `"use client"`.** In Next.js App Router, all Vaul components must be in a client module.

---

## Folder layout

```
modal-toast-dialog-stinger/
├── SKILL.md                                  (this file)
├── README.md
├── guides/
│   ├── 00-primitive-selection-matrix.md
│   ├── 01-accessible-modal-contract.md
│   ├── 02-toast-notification-taxonomy.md
│   ├── 03-stacking-and-layering.md
│   ├── 04-vaul-drawer-patterns.md
│   └── 05-cmdk-command-menu.md
├── examples/
│   ├── radix-alert-dialog.md
│   └── sonner-with-undo.md
├── templates/
│   └── overlay-audit-report.md
├── reports/
│   └── README.md
└── research/
    ├── research-plan.md
    ├── research-summary.md
    ├── index.md
    ├── internal/
    │   └── command-brief.md
    └── external/
        ├── radix-dialog.md
        ├── vaul-drawer.md
        ├── sonner-toast.md
        ├── aria-apg-dialog.md
        ├── cmdk-command.md
        └── toast-taxonomy.md
```

---

*Forged by stinger-forge from `modal-toast-dialog-worker-bee-command-brief.md` and `research/`. Part of The Hive by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
