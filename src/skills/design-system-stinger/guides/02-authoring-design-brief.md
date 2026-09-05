# 02: Authoring the Master Design Brief

The master brief (`00-design-brief.md`) is the comprehensive source of
truth. Every other file in the folder either codifies or renders a part
of it. Target: 800 to 1500 lines for a real product.

> Template: `../templates/design-brief.md`
> Worked example: `../examples/01-glass-on-beige-bootstrap.md` §3.

## Sizing envelope

| Artifact                       | Expected size |
|--------------------------------|---------------|
| `00-design-brief.md`           | 800-1500 lines (40-80 KB) |
| `01-master-tokens.css`         | 150-400 lines |
| `02-<utility-layer>.css`       | 150-300 lines |
| `03-components/`               | 8-15 files, 80-300 lines each |
| `04-screens/`                  | 5-10 files, 60-200 lines each |
| `05-html-examples/`            | 5-10 HTML + 1 `_shared.css` |
| `README.md`                    | 40-80 lines |

If the brief is under 400 lines, the interview was too shallow. If over
2000 lines, decompose: move detailed per-component material out into
`03-components/*.md`.

## Section-by-section outline

### Header

```markdown
# <Product> UX/UI — Core Design Brief

> **<Product Name> · Source of Truth for every UI decision**
> **Status:** Authoritative — supersedes <prior doc, if any>
> **Owner:** `ux-ui-svelte-worker-bee` agent + skill
> **Companion assets:** [`01-master-tokens.css`] · [`02-<utility>.css`] · [`03-components/`] · [`04-screens/`] · [`05-html-examples/`]
```

### §0 Reading order

A short ordered list that tells a future reader what to read first.

### §1 Core Principles (non-negotiable)

8 to 10 numbered rules. **Verbatim-able**: short enough to quote in a PR
review. Each rule is one sentence plus one sentence of justification.

Examples from the reference:

> 1. **Beige stage, white stars.** The page background is always cream
>    (`--color-background`). Every interactive surface is a white "glass"
>    surface floating above the cream with a two-stop shadow.

> 4. **Motion earns its keep.** Every transition has a reason: entry,
>    press, state change, reorder. No decorative animation.

The Bee's version: write product-specific rules the user pinned down
in the interview (Question 12), plus universal rules from
`00-principles.md` that apply.

### §2 Token System

For each token group, explain the semantics. The mechanical spec lives
in `01-master-tokens.css`; this section says *why* the token exists.

Subsections to always include:

- §2.1 Surfaces (the stage)
- §2.2 Brand (the accents)
- §2.3 Text hierarchy (5 stops minimum)
- §2.4 Spacing (one ladder)
- §2.5 Radii (one vocabulary)
- §2.6 Motion (curves + durations)
- §2.7 Typography scale (9 sizes)

Each subsection is a table with columns: Token name · Value · Use.
The "Use" column is where the semantics live. Don't say "gold accent
color"; say "Progress fill start, active-icon stroke, primary-CTA fill."

### §3 Surface / Depth Language

Depends on the aesthetic. For `glass-on-beige`, this is "three-cue
glass" (top-edge highlight + direct shadow + ambient shadow). For
`flat-modern`, this section is much shorter ("no depth, 1px borders,
no shadows") and that terseness is the product's identity.

Include:
- The recipe (the exact CSS for the default surface).
- The tiers (`depth-0..3` or equivalent).
- Any special cases (pinned nav, hero cards, modals).

### §4 Typography

- Display face + body face.
- Type scale (9 sizes with line-heights).
- Usage rules: when to use each size.
- Line length (55-75ch body, 45ch for editorial).
- Paragraph spacing token.

### §5 Color Usage Rules

NOT the palette (that's §2.2) but the *rules* for using color:

- What color text goes on what background.
- What the primary CTA looks like.
- What colors are forbidden for body copy.
- Dark-mode inversions (if in scope).
- Tenant overrides (if in scope).

### §6 Components

High-level summary of each component group. Link to the detailed brief
in `03-components/<name>.md`. One short subsection per component.

### §7 Screens

High-level summary of each screen. Link to `04-screens/<name>.md`.

### §8 Motion

- The motion buckets (durations + curves).
- Canonical transitions: entry, press, state change, reorder.
- Reduced-motion behavior.

### §9 Iconography

- Icon set (heroicons, lucide, custom).
- Line weight, fill rules, sizing.
- Active/inactive treatment.

### §10 Accessibility

- WCAG 2.2 AA floor (4.5:1 body, 3:1 large text).
- Hit-target sizes (44x44pt touch).
- Focus-visible style (2px gold/brand outline at 2px offset).
- `prefers-reduced-motion`, `prefers-color-scheme`, `prefers-contrast`.

### §11+ Product-specific sections

Any feature that needs its own contract (icon customizer, admin toggle,
AI chat surface, pinned tiles, etc.) gets a dedicated section. Number
them §11, §12, §13… in the order the product needs them.

## Writing style

- **Prescriptive voice.** "The page background is always cream," not
  "pages tend to be cream".
- **Short sentences.** Most rules fit in one line.
- **Justify non-obvious rules.** One sentence of why after the rule.
- **Link to tokens, not values.** Say `--color-gold-ink`, not `#7A5F1F`.
- **Cite the companion file.** "Full recipe in `02-glass-and-depth.css`".

## What NOT to include

- Implementation code (React/Vue/Svelte specifics): that goes in
  `03-components/` or in the product repo.
- Rationale essays longer than two sentences: the rule and its
  justification, not the history.
- Placeholder sections. If you don't have a rule yet, the interview was
  incomplete: go back.
