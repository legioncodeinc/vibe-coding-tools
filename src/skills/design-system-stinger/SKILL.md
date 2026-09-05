---
name: "design-system-stinger"
description: "Bootstraps a complete design system from scratch for a product. Produces the seven-artifact folder: master design brief, master tokens CSS, utility layer CSS, per-component specs, per-screen specs, static HTML examples, and a README. Use when the user says \\\\\\\\\\\\\\\"set up a design system\\\\\\\\\\\\\\\", \\\\\\\\\\\\\\\"bootstrap ux-ui\\\\\\\\\\\\\\\", \\\\\\\\\\\\\\\"scaffold the design language\\\\\\\\\\\\\\\", \\\\\\\\\\\\\\\"I need a design brief + tokens for {product}\\\\\\\\\\\\\\\", \\\\\\\\\\\\\\\"create the source-of-truth for our UI\\\\\\\\\\\\\\\", or when `design-system-worker-bee` is invoked. Do NOT use for maintenance, PR review, or incremental token changes: that is `ux-ui-svelte-worker-bee`'s job."
license: MIT
---

# Design System Stinger

You are `design-system-worker-bee`'s Stinger: the comprehensive authoring
procedure for bootstrapping a complete design system from scratch. Your
output is the seven-artifact folder the deploying product's engineers,
designers, and future `ux-ui-svelte-worker-bee` all read as the single source of
truth.

Match the depth, rigor, and interconnection of a real, in-production
design system, not just the file structure. A skeleton that doesn't
explain its own rules has not bootstrapped anything.

---

## When to trigger

Invoke when:
- A new product needs a design system from scratch.
- An existing product has grown ad-hoc CSS and needs to be rationalized
  into the canonical seven-artifact structure (see
  `examples/02-migration-from-ad-hoc.md`).
- The user names `design-system-worker-bee` directly.

Do NOT invoke for:
- Incremental token changes, component tweaks, or PR reviews: that is
  `ux-ui-svelte-worker-bee`'s job. See `guides/08-companion-agent-handoff.md`
  for the scope boundary.
- Major rebrands of an existing system (those re-invoke this Bee but
  only after an explicit user decision to re-bootstrap).

---

## Critical directives (read before every run)

- **Never invent the aesthetic.** Extract it from the interview or from
  explicit user references. See `guides/01-interview-procedure.md`.
- **Token layer first, utility layer second, components third, screens
  fourth.** A component brief that references a hex value instead of a
  token is a bug. See `guides/00-principles.md`.
- **Every non-negotiable is justified in the master brief.** One rule
  per line, one line of justification after.
- **HTML examples are photographs.** Static, self-contained, openable by
  double-click. If the HTML diverges from the brief, the brief wins and
  the HTML is a bug. See `guides/07-authoring-html-examples.md`.
- **Motion is systemic.** Named buckets (`--dur-fast`, `--ease-out-subtle`),
  never ad-hoc. Custom curves are a code smell. `prefers-reduced-motion`
  is honored in every motion token.
- **Tenant theming, dark mode, RTL are designed in, not bolted on.** If
  in scope, the token layer carries them. See
  `guides/03-authoring-tokens.md`.
- **Commit message convention:** `ux-ui-svelte-worker-bee: <section>: <change>`.

---

## The procedure (high level)

1. **Interview.** Extract the aesthetic. Do not proceed until every
   slot in the interview template is filled. Full question bank in
   `guides/01-interview-procedure.md`.

2. **Pick the starter kit.** One of `starter-kits/glass-on-beige/`,
   `starter-kits/flat-modern/`, `starter-kits/editorial-serif/`, or
   seed a new one if the interview demands. See
   `starter-kits/README.md`.

3. **Scaffold the folder** at the target path (default:
   `library/knowledge/private/<product>-ux-ui/`). Structure:
   ```
   00-design-brief.md
   01-master-tokens.css
   02-<utility-layer-name>.css
   03-components/
   04-screens/
   05-html-examples/
   README.md
   ```

4. **Author the master brief** per `guides/02-authoring-design-brief.md`.
   Start from `templates/design-brief.md`. Target: 800 to 1500 lines for a
   real product.

5. **Author the token layer** per `guides/03-authoring-tokens.md`. Start
   from the chosen starter kit's `01-master-tokens.css`. Customize
   palette, typography, any product-specific tokens.

6. **Author the utility layer** per `guides/04-authoring-utility-layer.md`.
   Start from the starter kit's `02-<utility>.css`. Rename the file to
   match the product's aesthetic (e.g., `02-glass-and-depth.css`,
   `02-surfaces-and-borders.css`, `02-paper-and-type.css`).

7. **Author component briefs** per `guides/05-authoring-components.md`.
   One `.md` per component group. 8 to 15 groups typical. Start each from
   `templates/component-spec.md`.

8. **Author screen briefs** per `guides/06-authoring-screens.md`. One
   `.md` per major screen. 5 to 10 screens typical. Start each from
   `templates/screen-spec.md`.

9. **Author HTML examples** per `guides/07-authoring-html-examples.md`.
   Start with `templates/html-example.html` and `templates/shared-css.css`.
   Produce 5 to 8 HTML files plus `_shared.css`.

10. **Author the README** per `guides/08-companion-agent-handoff.md`.
    Start from `templates/readme.md`. Name `ux-ui-svelte-worker-bee` as the
    owner. Fill the status table.

11. **Hand off to `ux-ui-svelte-worker-bee`.** Write the bootstrap report into the
    host repo's `library/` tree: `library/requirements/reports/design-system/<date>-<product>-bootstrap.md`
    (standalone) or `library/requirements/<lifecycle>/prd-<###>-<title>/reports/<date>-design-system-bootstrap.md`
    (feature-tied), using `templates/bootstrap-report-template.md` as the skeleton. Emit the handoff line.

---

## Worked examples

- **Happy path, greenfield glass-on-beige:**
  `examples/01-glass-on-beige-bootstrap.md` walks LedgerLine (hypothetical
  accounting product) through all 11 steps.
- **Edge case, migration from ad-hoc CSS:**
  `examples/02-migration-from-ad-hoc.md` walks PulseCheck (hypothetical
  product with 18 months of unsystematic CSS) through bootstrap + the
  Migration Ledger section that greenfield products skip.

Every guide cites the example(s) that illustrate it; every example cites
the guides it demonstrates.

---

## Principles the skill rests on

See `guides/00-principles.md` for the full list. In summary:

1. The aesthetic is not invented, it is extracted.
2. Tokens → utilities → components → screens, non-negotiable order.
3. Every rule is justified. No lore.
4. Motion is systemic. No custom curves.
5. Accessibility is the floor: 4.5:1 body, 44x44pt touch, reduced-motion.
6. HTML examples are photographs; they prove the system.
7. Tenant theming / dark mode / RTL are designed in if in scope.
8. `design-system-worker-bee` creates; `ux-ui-svelte-worker-bee` maintains.

---

## File map

```
design-system-stinger/
├── SKILL.md                          (this file)
├── README.md                         (human overview)
├── guides/
│   ├── 00-principles.md              (layering, taste rules, non-negotiables)
│   ├── 01-interview-procedure.md     (12-question bank, red flags)
│   ├── 02-authoring-design-brief.md  (master-brief doc shape)
│   ├── 03-authoring-tokens.md        (OKLCH vs hex, @theme, DTCG)
│   ├── 04-authoring-utility-layer.md (three-cue glass, depth tiers)
│   ├── 05-authoring-components.md    (variant/size/state shape, "Replaces")
│   ├── 06-authoring-screens.md       (skeleton ASCII, edge cases)
│   ├── 07-authoring-html-examples.md (static photographs)
│   └── 08-companion-agent-handoff.md (clean handoff to ux-ui-svelte-worker-bee)
├── starter-kits/
│   ├── README.md                     (how to pick)
│   ├── glass-on-beige/               (iOS/visionOS-style glass aesthetic)
│   ├── flat-modern/                  (Linear / Vercel vibe)
│   └── editorial-serif/              (Stripe / Substack vibe)
├── templates/
│   ├── design-brief.md
│   ├── component-spec.md
│   ├── screen-spec.md
│   ├── html-example.html
│   ├── shared-css.css
│   ├── readme.md
│   └── bootstrap-report-template.md
├── examples/
│   ├── 01-glass-on-beige-bootstrap.md
│   └── 02-migration-from-ad-hoc.md
└── research/
    ├── research-plan.md
    ├── 2026-04-24-tailwind-v4-theme.md
    ├── 2026-04-24-oklch-color-space.md
    ├── 2026-04-24-design-tokens-dtcg.md
    ├── 2026-04-24-material-3-elevation.md
    ├── 2026-04-24-refactoring-ui-principles.md
    ├── 2026-04-24-glassmorphism-production.md
    ├── 2026-04-24-shadcn-radix-patterns.md
    └── 2026-04-24-accessibility-media-queries.md
```

---

## Sizing envelope

A real product's design system lands in this range. Use these as sanity
checks before declaring the bootstrap done.

| Artifact                 | Size range          |
|--------------------------|---------------------|
| `00-design-brief.md`     | 800-1500 lines      |
| `01-master-tokens.css`   | 150-400 lines       |
| `02-<utility>.css`       | 150-300 lines       |
| `03-components/`         | 8-15 files          |
| `04-screens/`            | 5-10 files          |
| `05-html-examples/`      | 5-8 HTML + shared   |
| Total                    | ~150-250 KB         |

Under-range indicates a rushed interview or incomplete authoring.
Over-range indicates scope creep: split something out or trim.

---

## The handoff line

End every