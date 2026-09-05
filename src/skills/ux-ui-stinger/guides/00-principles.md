# 00 — Principles

The five rules that come before the 12-step procedure.

## 1. Open the design-system folder first

Every question. No exceptions. The folder is at whichever path the invoking user gave (commonly `library/knowledge-base/ux-ui/` or `library/knowledge-base/<product>-ux-ui/`). Before you answer, you have already opened the governing doc and read the governing section.

If the folder doesn't cover the question, you update the folder *before* answering. "It's not in the brief" is never a valid answer for this Angel — extend the brief.

*Why:* a design system is an asset that compounds. Every off-the-cuff ruling is an opportunity cost — that wisdom should have become part of the asset.

## 2. Never invent tokens or utilities

No color, radius, shadow, spacing, duration, or easing curve may be introduced inline. If the value doesn't exist in the token layer (`01-master-tokens.css` or the product's equivalent), you add it to the token layer first and then reference it.

Same for utilities: a `.glass-surface` or `.depth-2` style re-created inline is a bug. If a utility doesn't exist, you add it to the utility CSS file first.

*Why:* tokens are the contract between design and code. Bypassing the contract makes the design system unenforceable — and a design system nobody enforces is a design system nobody reads.

See `guides/02-token-and-utility-enforcement.md`.

## 3. Library primitives are wrapped, not consumed directly

Feature code (`src/app/**/*`) imports the product's wrapper, not the raw library primitive. `import { Button } from '@/components/button'`, never `import * as Dialog from '@radix-ui/react-dialog'`.

The wrapper is the enforcement seam — it's where product variants, product tokens, and product motion get applied. If feature code consumes primitives directly, the design system is bypassable by one-line PRs.

*Why:* libraries are other people's aesthetic decisions. The wrapper is where you reconcile their decisions with your product's decisions.

See `guides/08-wrapper-authoring.md`.

## 4. The WAI-ARIA APG is the floor, not the ceiling

Whenever a product component carries a widget role (menu, combobox, dialog, tabs, listbox, tree, grid), it owes the keyboard + focus contract defined in the WAI-ARIA APG (https://www.w3.org/WAI/ARIA/apg/). Radix Primitives and Mantine provide most of this for free — when a wrapper strips the library's `onKeyDown` or `onFocus`, it is a bug.

Focus indicators are a shared token (`--focus-ring`) and utility class, not bespoke per component.

*Why:* accessibility is not an enhancement. A design system that ships inaccessible components ships bugs.

See `research/2026-04-24-wai-aria-apg.md`.

## 5. System-level changes escalate

You are the enforcer, not the founder. A new aesthetic, a switch from shadcn to Mantine (or either to Tamagui), a restructure of the token layer, a major migration — these are out of scope. You draft a handoff note and route to `design-system-worker-bee`.

Escalation triggers:

- The change requires editing `00-design-brief.md`'s core aesthetic sections (not adding a section).
- The change requires adopting a different component-library philosophy across the product.
- The change removes or renames a foundational token (not adds one).
- The change crosses multiple `03-components/` files in a way that can't be expressed as per-component deltas.

See `guides/09-system-level-escalation.md`.

---

*Every guide in this Stinger traces back to these five principles. If a rule seems arbitrary, re-read the principle it enforces.*

*Worked example referencing this guide:* `examples/review-output-example.md`.
