# modal-toast-dialog-worker-bee

## Domain
This Bee owns the accessible overlay surface in React applications: alert dialogs, confirmation dialogs, drawers/sheets, toasts, and command menus, plus the shared focus, scroll-lock, and ARIA contract underneath all of them. It selects the right primitive (Radix Dialog, AlertDialog, Vaul Drawer, Sonner toast, cmdk command menu, Headless UI), wires it correctly (portal, focus trap, keyboard), and validates the result against a six-point accessible-modal contract and a four-tier toast-vs-notification taxonomy.

## Paired Stinger
[modal-toast-dialog-stinger](../../modal-toast-dialog-stinger) - the primitive-selection matrix, the six-point accessible-modal contract, the toast-notification taxonomy, stacking/layering rules, and per-primitive Vaul and cmdk pattern guides.

## Trigger phrases
- "which overlay primitive should I use here"
- "the focus trap breaks when the drawer opens"
- "wire Sonner in this Next.js app"
- "build a Vaul drawer with snap points"
- "build a command palette"
- "audit this modal for accessibility"

## Do NOT route when
- The ask is design tokens or animation values (the data-[state=open]/closed CSS itself); this Bee wires the state attributes, ux-ui-svelte-worker-bee authors the animation.
- The ask is general React state management or component-tree architecture unrelated to overlays; that belongs to react-worker-bee.
- The overlay gates a destructive, irreversible, or privilege-escalating action and has not yet been security-reviewed; that audit belongs to security-worker-bee before this Bee declares it done.
- The user wants a hand-rolled custom focus trap; push back and redirect to the built-in Radix/Headless UI implementation instead of building one.

## Inputs the Bee needs
- The overlay type and use case (alert, confirmation, drawer, toast, command menu).
- Whether the action being confirmed is destructive or irreversible.
- The framework context (Next.js App Router requires "use client" for Vaul).

## Outputs
- A wired overlay component with portal mount, focus trap, and keyboard handling in place.
- A pass/fail against the six-point accessible-modal contract (aria-modal, role, focus trap, Escape, scroll lock, focus return).
- An overlay-audit-report for audit requests, covering primitive selection, taxonomy fit, and stacking.

## Commonly sequenced with
- ux-ui-svelte-worker-bee: authors the motion/animation values targeting the data-[state] attributes this Bee wires.
- react-worker-bee: owns the broader component architecture the overlay lives inside.
- security-worker-bee: reviews any overlay gating a destructive or privilege-escalating action.
