# 01 — The 12-Step Enforcement Procedure

The sequence for any UI ruling. Do these in order.

## 1. Open the design-system folder

Identify the governing doc. Candidates:

- `00-design-brief.md` — the master brief (aesthetic, tokens-philosophy, motion buckets, spacing).
- `03-components/<component>.md` — if the question is about a specific component.
- `04-screens/<screen>.md` — if the question is about a specific screen.
- `05-html-examples/*.html` — visual reference if ambiguity remains.

Read the section end-to-end before you answer anything.

## 2. Quote the governing subsection

Your answer opens with a direct quote from the brief, with section number. Example:

> Per `00-design-brief.md` §6.3 "Surfaces":
> "Every interactive card is `.glass-surface` with the three-cue shadow stack."

## 3. Cite current code with exact line ranges

Use `Grep` or `Read` to find the code under review. Cite `path:startLine-endLine`. Never guess line numbers.

```
src/app/dashboard/ProjectCard.tsx:42-58
```

## 4. Specify the delta in token-named terms

"Fix the background" is not a delta. "Change line 43 from `className="bg-[#f5f0e6]"` to `className="glass-surface depth-1"` so it matches §6.3" is a delta.

Deltas always name tokens, utilities, or brief sections — never raw values.

## 5. Check tokens

Search the diff for hex literals (`#[0-9a-fA-F]{3,8}`), inline rgb/hsl/oklch calls, or pixel values for things the token layer covers (radii, shadows, durations).

- If a matching token exists, flag and cite the token.
- If no matching token exists and the value is justified, flag as a missing token. Open `01-master-tokens.css`, add the token, then reference it in the fix.
- Never accept a hex literal sitting next to a `var(--color-...)` unless the hex literal is *itself* the token's source of truth.

See `guides/02-token-and-utility-enforcement.md`.

## 6. Check utilities

Search the diff for inline re-implementations of utility classes. Common tells:

- `box-shadow: 0 1px 2px ...` stacks that re-implement `.depth-1`.
- `backdrop-filter: blur(...)` plus `background: rgba(...)` that re-implements `.glass-surface`.
- `transform: scale(0.97)` on press that re-implements `.press-scale`.

If a utility exists, use it. If a new utility is needed, add it to the utility layer first.

## 7. Check motion

Every interactive surface uses a **named motion bucket** from the design brief's motion section. Reject:

- Bespoke durations (`duration: 237ms`).
- Bespoke easing (`cubic-bezier(0.07, 0.91, 0.29, 0.99)`).
- Missing `prefers-reduced-motion` handling on transform / layout animations.

See `guides/03-motion-rules.md`.

## 8. Check the three-cue shadow stack

On every interactive surface (card, button, chip, input — anything that reads as "a surface"):

- **Edge highlight** (usually `inset 0 1px 0 rgba(255,255,255,...)` or a token like `--shadow-edge`).
- **Direct shadow** (the cast shadow under the surface, short and tight).
- **Ambient shadow** (the softer, larger shadow that roots the surface in the space).

Missing any cue = fail. Cite the relevant component doc or `02-glass-and-depth.css`.

## 9. Route library decisions through the per-library guide

If the change introduces or modifies a shadcn / Mantine / Lucide / Framer Motion component, jump to the matching guide before ruling:

- shadcn → `guides/04-shadcn-ui-integration.md`
- Mantine → `guides/05-mantine-integration.md`
- Lucide → `guides/06-lucide-react-icons.md`
- Framer Motion → `guides/07-framer-motion.md`

Every guide has a decision tree: when to use the library, when to wrap, when to reject in favor of system-native.

## 10. Enforce wrapping

Feature code must import the product wrapper, never the raw primitive:

```tsx
// ❌ Bug
import { Button } from '@/components/ui/button'
import * as DialogPrimitive from '@radix-ui/react-dialog'

// ✅ Correct
import { Button } from '@/components/<product>/Button'
import { Dialog } from '@/components/<product>/Dialog'
```

Exception: inside `components/ui/*` (shadcn CLI-generated) and inside the product-wrapper file itself, raw-primitive imports are expected.

See `guides/08-wrapper-authoring.md`.

## 11. If the folder doesn't cover it, extend the folder

The brief not covering a case is not a license to rule off-the-cuff. In order:

1. Write a new section or component doc in the design-system folder.
2. Cite *that* new section in your answer.
3. Commit the doc with the appropriate commit message (`ux-ui-worker-bee: <section>: <change>`, or whatever convention the deploying product's knowledge-base specifies).

## 12. If the change is system-level, escalate

Escalation triggers and handoff shape live in `guides/09-system-level-escalation.md`. Don't rebuild from inside — hand off cleanly.

---

*Worked examples using this procedure:*

- `examples/review-output-example.md` — a review that runs steps 1–10 against a fictional PR.
- `examples/component-spec-example.md` — step 11 in action (extending the folder with a new component).
- `examples/wrapper-spec-example.md` — step 10 + `guides/08` in action.
