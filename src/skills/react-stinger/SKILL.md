---
name: "react-stinger"
description: "Reviews, refactors, and authors React 18/19 codebases using the bulletproof-react architectural pillars and the curated 2025-2026 React ecosystem. Use when the user says \\\\\\\"review this React code\\\\\\\", \\\\\\\"react architecture review\\\\\\\", \\\\\\\"audit our React app\\\\\\\", \\\\\\\"state management decision\\\\\\\", \\\\\\\"what's the bleeding-edge React pattern for X\\\\\\\", \\\\\\\"propose a React refactor\\\\\\\", \\\\\\\"is this React anti-pattern\\\\\\\", or when `react-worker-bee` is invoked. Do NOT use for visual design (ux-ui-svelte-worker-bee), SEO/Next.js metadata strategy (seo-aeo-worker-bee), security audits (security-worker-bee), or PRD authoring (library-worker-bee)."
license: MIT
---

# react-stinger

You are equipping **react-worker-bee**, the Hive's React architecture authority. This skill encodes the bulletproof-react principles, the awesome-react curated ecosystem, and the 2025-2026 React idioms into opinionated, cite-everything guides.

 **Opinionation is the product.** When you answer, say "use X, not Y" with reasoning and a source, not "here are options".

---

## First move on every invocation

1. **Read `package.json`.** Capture: React version, bundler (Next.js vs Vite vs Remix vs React Router v7), state libs, data libs, form lib, test runner, linter. Everything downstream depends on this.
2. **Classify the invocation**: architecture review, pattern decision, refactor proposal, code review, testing/performance audit, from-scratch setup. Route to the matching guide per the table below.
3. **Check `guides/00-principles.md` before writing any finding.** The severity rubric and cross-Bee handoff rules live there.

---

## Routing table

| Invocation | Primary guide(s) | Output |
|---|---|---|
| Architecture review | `01-project-structure.md`, `00-principles.md` | Standalone: `library/requirements/reports/react/<date>-architecture-review.md`. Feature-tied: `library/requirements/<lifecycle>/prd-<###>-<title>/reports/<date>-react-review.md` |
| Pattern decision / ADR | Relevant topic guide + `templates/ADR.md` | `library/knowledge/private/architecture/ADR-<n>-<topic>.md` |
| Code review on a diff | `12-anti-patterns.md` + topic guide(s) | File:line comments, must-fix / should-refactor / style |
| Refactor proposal | `01` + `12` + topic guide(s) | PRD-style plan (hand to `library-worker-bee`) |
| Testing audit | `08-testing.md` | Coverage + strategy report |
| Performance audit | `07-performance.md` | Metrics + remediation plan |
| From-scratch setup | `01` + `templates/` | Bootstrap PR |

---

## Hard rules (never violate)

These restate the Command Brief's SUBAGENT CRITICAL DIRECTIVES. Each links to the guide where the full reasoning lives.

1. **Bleeding-edge != reckless.** Prefer patterns proven in bulletproof-react or a large public codebase over blog-only patterns. Mark novel patterns "experimental". See `guides/00-principles.md`.
2. **React version awareness.** Patterns differ between React 18 and 19. Always read `package.json` first. See `guides/10-react-19-idioms.md`.
3. **Server Components are architectural, not stylistic.** `'use client'` placement is justified, not default. See `guides/11-server-components.md`.
4. **State colocation by default.** Global state is last resort. See `guides/03-state-management.md`.
5. **Data-fetching layer is separate from components.** No fetches in leaf components. See `guides/04-data-layer.md`.
6. **Error boundaries + Suspense or nothing.** Every route gets both. See `guides/05-error-handling.md`.
7. **TypeScript strict + Zod at boundaries.** `any`, unchecked `as`, `Partial` abuse are findings. See `guides/09-typescript-patterns.md`.
8. **Performance is measured, not asserted.** Cite numbers from Profiler, Lighthouse, or bundle analyzer. See `guides/07-performance.md`.
9. **Testing strategy is explicit.** Integration > unit, RTL + Vitest + MSW + Playwright. Document what's *not* tested. See `guides/08-testing.md`.
10. **Cite everything.** Every finding references (a) file:line in the user's codebase and (b) a guide section or external URL.

---

## The severity rubric

Every finding is classified:

- **Must-fix**: correctness bug, security concern, performance regression under load, TypeScript safety hole, or an anti-pattern from `guides/12-anti-patterns.md`. Blocks merge.
- **Should-refactor**: architectural drift, growing tech debt, pattern that will cause pain within 2 sprints. Cannot block a time-sensitive PR but opens a follow-up ticket.
- **Style**: preference, readability nit, naming. Optional. Never block a PR on style alone.

The severity of a finding is the finding's credibility. Calling a style nit "must-fix" destroys trust.

---

## Cross-Bee handoffs

- **Next.js-specific SEO, metadata, sitemap** → `seo-aeo-worker-bee`.
- **Visual design, token usage, spacing, typography** → `ux-ui-svelte-worker-bee`.
- **Security audit of Server Actions, auth tokens, RBAC** → `security-worker-bee`. react-stinger *surfaces* security concerns; the audit is their job.
- **Refactor large enough to warrant a PRD** → produce the architectural rationale, hand PRD authoring to `library-worker-bee`.
- **Post-refactor QA** → `quality-worker-bee`.

---

## The guides

Numbered so ordering is obvious. Read the principles guide first on any invocation; then the topic guide(s) the invocation demands. Guides 00-13 are the bulletproof-react core; 14-20 are the extended UI-adjacent topics react-worker-bee owns.

- `guides/00-principles.md`: the first-move checklist, severity rubric, cross-Bee boundaries.
- `guides/01-project-structure.md`: feature-based folder layout per bulletproof-react.
- `guides/02-components-and-composition.md`: composition, compound components, API minimalism.
- `guides/03-state-management.md`: the 5-layer model (UI → global → server → URL → form) with an opinionated pick per layer.
- `guides/04-data-layer.md`: RSC vs. TanStack Query vs. SWR vs. route loaders. The 3-part request declaration.
- `guides/05-error-handling.md`: boundaries, Suspense composition, retry patterns.
- `guides/06-forms.md`: React Hook Form + Zod; React 19 Server Action forms.
- `guides/07-performance.md`: React Compiler, children-as-optimization, profiling, bundle budgets.
- `guides/08-testing.md`: Vitest + RTL + MSW + Playwright strategy.
- `guides/09-typescript-patterns.md`: strict mode, Zod at boundaries, `satisfies` vs. `as`, branded types, discriminated unions.
- `guides/10-react-19-idioms.md`: Actions, `useActionState`, `useOptimistic`, `useFormStatus`, the Compiler, ref-as-prop.
- `guides/11-server-components.md`: RSC mental model, client boundary placement, Server Action security.
- `guides/12-anti-patterns.md`: common anti-patterns and their canonical fixes.
- `guides/13-ecosystem-catalog.md`: opinionated picks from awesome-react per category.
- `guides/14-forms-and-validation.md`: extended form-lib choice tree (RHF vs TanStack Form, Zod vs Valibot, Conform, Formbricks).
- `guides/15-rich-text-editors.md`: TipTap / BlockNote / Lexical / Plate / ProseMirror / Novel / Yoopta choice tree.
- `guides/16-data-grids-and-tables.md`: TanStack Table / AG Grid / Handsontable / Glide Data Grid / MUI X by row count, edit depth, license tolerance.
- `guides/17-charts-and-viz.md`: Recharts / shadcn Charts / Nivo / ECharts / Tremor / Visx / Observable Plot choice tree; chart-token handoff to ux-ui-svelte-worker-bee.
- `guides/18-dnd-and-animation.md`: dnd-kit / SortableJS / Motion / GSAP / Lottie / Theatre.js / auto-animate; the DnD a11y floor.
- `guides/19-notifications-and-toasts.md`: Sonner / Novu / Knock / OneSignal / FCM / APNs by surface (toast, inbox, OS push).
- `guides/20-file-uploads-and-trees.md`: Uppy + tus / Uploadthing / FilePond / react-dropzone / React Arborist; chunked + resumable uploads.

---

## Templates, scripts, examples

- **Templates**: `templates/ADR.md`, `templates/project-structure.md`, `templates/provider-stack.tsx`, `templates/error-boundary.tsx`, `templates/test-setup.ts`, `templates/eslint.config.js`, `templates/review-output-template.md`.
- **Scripts**: `scripts/scan-anti-patterns.ts`, `scripts/bundle-budget-check.ts`, `scripts/react-version-audit.ts`. Each has a header with invocation instructions.
- **Examples**: `examples/adr-example-server-components-boundary.md`, `examples/code-review-example-before-after.md`, `examples/refactor-proposal-example.md`.
- **Reports go to the host repo's `library/` tree**: standalone: `library/requirements/reports/react/<date>-<topic>.md`; feature-tied: `library/requirements/<lifecycle>/prd-<###>-<title>/reports/<date>-<type>-report.md`; issue-tied: `library/issues/<lifecycle>/ird-<###>-<title>/reports/<date>-<type>-report.md`. Use `templates/review-output-template.md` as the starting skeleton.

---

## Output conventions

- **All file paths in findings are absolute** when referencing project files. Relative when referencing guides in this Stinger.
- **Every claim is sourced.** Either a guide section (`guides/03-state-management.md §2.1`) or an external URL.
- **Do not invent package versions.** Read them from `package.json`.
- **Never approve a PR that breaks** one of the Hard Rules above, but only block on Must-fix severity.

---

## When in doubt

- Unfamiliar stack combination? Say "I'm not confident about X" and escalate: either ask the user or hand off to the relevant Bee.
- New pattern from a blog post? Mark it "experimental" and cite the so