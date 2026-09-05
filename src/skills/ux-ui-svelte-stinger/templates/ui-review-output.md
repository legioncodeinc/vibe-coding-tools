# Template: UI review output (Svelte surface)

> The output shape for a UX/UI review of a Svelte surface against the ADR-007
> standard. Use this when reviewing a PR that touches a `.svelte` file's markup
> or styling.

**PR / commit:** ______
**Surface reviewed:** `apps/<app>/src/<path>`
**Date:** ______

## Governing sections cited

<!-- Quote the ADR-007 decision and/or the specific guide section that governs
each finding. -->

-

## Findings

### Finding 1: <one-line summary>

**Severity:** blocker | suggestion | nit

**Governing section:**
> <quote from ADR-007 or guides/NN-...>

**Code:**
- `apps/<app>/src/<path>:<startLine>-<endLine>`
- `<the offending markup>`

**Why it is a violation:**
<one or two sentences tying the code to the governing section>

**Proposed fix:**
<the token utility, the copy-in component, or the corrected import order:
the minimal diff, not a rewrite>

---

### Finding 2: ...

## Surface-migration status (if applicable)

- [ ] Surface uses copy-in primitives (no bespoke primitive styling)
- [ ] No arbitrary-value color utilities (`bg-[#...]`)
- [ ] No `style=` interpolating un-validated values
- [ ] Import order correct (if the PR touches `+layout.svelte`)
- [ ] `--primary` chain intact (if the surface is a primary action)
- [ ] Dark-mode polarity correct (no light-first regression)

## Verdict

- [ ] Approve
- [ ] Approve with suggestions
- [ ] Block (blockers listed above must resolve before merge)
