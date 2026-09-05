# WAI-ARIA Authoring Practices Guide — the accessibility floor

**Sources:**
- https://www.w3.org/WAI/ARIA/apg/
- https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/
- https://w3c.github.io/aria/

**Retrieved:** 2026-04-24
**Queries used:** "WAI-ARIA Authoring Practices Guide button focus keyboard 2026"

## Summary

The WAI-ARIA APG is the authoritative reference for how to implement accessible versions of common UI widgets — menus, combobox, tabs, dialog, listbox, tree, grid. For a design-system enforcer, the APG is the floor: any product component that claims a widget role (e.g., `role="menu"`) owes the APG's keyboard and focus contract. When shadcn/Mantine primitives are used, most of this contract is provided for free — but when they're wrapped or replaced with custom code, the Angel checks the APG section for the relevant pattern.

## Key quotations

> "When operating with a keyboard, two essentials of a good experience are the abilities to easily discern the location of the keyboard focus and to discover where focus landed after a navigation key has been pressed."

> "Users need to be able to easily distinguish the keyboard focus indicator from other features of the visual design, and if visual changes in response to focus movement are subtle, many users will lose track of focus and be unable to operate."

> "Browsers do not provide keyboard support for graphical user interface (GUI) components that are made accessible with ARIA; authors have to provide the keyboard support in their code."

## Integration pattern for this Stinger

- Every product component that is a "widget" (menu, combobox, dialog, tabs, listbox, tree, grid) cites the matching APG pattern in its component doc.
- Focus indicators are a token (`--focus-ring`) and a shared utility class, never bespoke per component.
- When a wrapper strips a Radix/Mantine part's `onKeyDown`, it's a bug — Radix owns the APG keyboard contract for its parts.

## Relevance to this Stinger

- `guides/00-principles.md` — "APG is the floor, not the ceiling" principle.
- `guides/10-common-violations.md` — missing focus ring, custom `onKeyDown` that overrides the library's.
