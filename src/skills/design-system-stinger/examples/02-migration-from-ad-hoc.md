# Example 2: Migrating a Product with Ad-Hoc CSS (Edge Case)

A worked example of `design-system-worker-bee` bootstrapping a design system
for a product that already ships with messy, unsystematic CSS. The Bee
must **both** produce the canonical seven-artifact folder AND write the
"Replaces (in current code)" sections that tell `ux-ui-svelte-worker-bee` exactly
what to refactor after handoff.

Hypothetical product: **PulseCheck**, a health-metrics dashboard that
grew organically over 18 months. 340 inline `style={{...}}` occurrences.
17 button variants across 12 files. Three different card shadow recipes.

Demonstrates: `guides/01-interview-procedure.md` (with extraction from
existing code as a secondary anchor), `guides/05-authoring-components.md`
("Replaces" sections), and `guides/08-companion-agent-handoff.md` (hand
the migration plan to `ux-ui-svelte-worker-bee`).

---

## Interview divergence

The usual interview happens, but with an additional step: **aesthetic
archaeology**. Before asking "what do you admire?", ask:

> "Open a screen that you think LOOKS right today. Which one feels most
> 'on brand'? Now open one that feels wrong. Which is which?"

The user's picks tell you what to PRESERVE and what to PURGE during the
bootstrap. In the PulseCheck interview:

- **Preserve:** the Dashboard hero card (warm blue gradient, works) and
  the profile avatars (tiered pills, readable).
- **Purge:** the Settings screen (12pt grey-on-grey labels, unreadable),
  the three different Button components, every inline `style={{}}` prop.

Record this in a one-page "migration map" before scaffolding:

```
PRESERVE (lift into the design system):
  - Dashboard hero card           → 03-components/cards-and-surfaces.md §hero
  - Avatar tier pills             → 03-components/badges-and-pills.md §tier
  - DM row hover state            → 03-components/nav-left.md §row-hover

PURGE (flag for ux-ui-svelte-worker-bee to refactor):
  - 17 button variants            → collapse into 4 (primary/secondary/outline/ghost)
  - 3 different card shadows      → unify into --shadow-card
  - 340 inline `style={{}}`       → eliminate via utility layer
  - 5 hex values repeated > 6x    → promote to tokens

EXTEND (new territory):
  - Dark mode                     → design into tokens now, not later
  - RTL                           → out of scope (interview confirmed)
```

## Master brief takes on a new section

`00-design-brief.md` adds a §12 **"Migration Ledger"** that a clean-slate
brief wouldn't have:

```markdown
## 12. Migration Ledger

This system supersedes the ad-hoc CSS in the PulseCheck codebase as of
2026-04-24. The following migrations are in scope for `ux-ui-svelte-worker-bee`
to execute after this bootstrap:

### 12.1 Button consolidation

Replaces:
- `app/components/Button.tsx` (variant="primary" | "gold" | "danger")
- `app/components/CTAButton.tsx`
- `app/components/IconButton.tsx`
- `app/components/ui/btn.tsx`

Target: a single `<Button variant={primary|secondary|outline|ghost}>`
per `03-components/buttons-and-ctas.md`.

### 12.2 Inline-style elimination

340 instances of `style={{...}}` identified via AST scan. Migration
plan:
- Background colors → utility classes from `02-glass-and-depth.css`.
- Spacing → Tailwind utilities consuming `--space-*` tokens.
- Radii → `--radius-*` token references.

See the ledger file at `library/refactor/pulsecheck-inline-style-ledger.md`
(authored by `ux-ui-svelte-worker-bee` post-handoff).

### 12.3 Color token extraction

Hex values appearing more than 6x in the codebase (promoted to tokens):
- `#2B7BD1` (used 47x) → `--color-primary`
- `#E8F4FD` (used 31x) → `--color-primary-bg`
- `#FF6B6B` (used 22x) → `--color-red`
- `#F8FAFC` (used 19x) → `--color-background`
- `#E2E8F0` (used 12x) → `--color-border`
```

## Component briefs fully exercise "Replaces"

Every brief in `03-components/*.md` names the files it supersedes. Sample
from `buttons-and-ctas.md`:

```markdown
## Replaces (in current code)

| Existing usage | Migration |
|----------------|-----------|
| `<Button variant="primary">` in 38 files | Keep `variant="primary"`. |
| `<Button variant="gold">` in 4 files | Rename to `variant="primary"`. |
| `<Button variant="danger">` in 2 files | Keep, add docs note. |
| `<CTAButton>` in 6 files | Replace with `<Button variant="primary" size="lg">`. |
| `<IconButton>` in 19 files | Keep as separate component (icon-only is distinct). |
| Inline `style={{ background: "#2B7BD1" }}` on 11 `<button>` | Replace with `className="btn btn--primary"`. |

Total: ~80 call sites to refactor. Priority: high-traffic Dashboard
and Onboarding first; low-traffic Settings last.
```

The table IS the migration plan. `ux-ui-svelte-worker-bee` opens it, and
knows what to do.

## HTML examples include "before vs after"

One additional HTML file under `05-html-examples/`:

- `migration-before-after.html`, a side-by-side render showing the
  Settings screen as it ships today (left column) vs. as specified by
  the new system (right column). This is the visual receipt the user
  approves at handoff.

## Handoff

`README.md` for PulseCheck adds a section `ux-ui-svelte-worker-bee` wouldn't
otherwise need:

```markdown
## Migration status

This design system bootstrap supersedes 18 months of ad-hoc CSS. The
refactor is tracked separately by `ux-ui-svelte-worker-bee` in the host repo's
`library/requirements/reports/ux-ui/<date>-pulsecheck-migration.md`. Expected duration:
3–4 weeks of incremental PRs.
```

`design-system-worker-bee` is done. The system is designed; the code
still needs to be made to match, but that is `ux-ui-svelte-worker-bee`'s job.

## Lessons from this edge case

1. **Aesthetic archaeology replaces aesthetic anchors.** When code
   exists, the user's lived-in screens are more authoritative than
   their stated references.
2. **Every component brief earns its "Replaces" table.** This is the
   migration receipt.
3. **The master brief adds a Migration Ledger section.** Clean-slate
   products skip it; legacy migrations require it.
4. **A before/after HTML is non-optional.** Shows the user the target
   in a way a written brief cannot.
5. **The handoff to `ux-ui-svelte-worker-bee` carries a migration backlog**, not
   just a system. The enforcing Bee starts with work queued up.

## Cross-references

- `../guides/05-authoring-components.md`, the "Replaces (in current code)"
  discipline.
- `../guides/08-companion-agent-handoff.md`, how the migration backlog
  passes to `ux-ui-svelte-worker-bee`.
- `01-glass-on-beige-bootstrap.md`, the happy-path counterpart (green-
  field, no migration ledger).
