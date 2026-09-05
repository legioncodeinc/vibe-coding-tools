# 07: Violations and guardrails

> The standardization goal of ADR-007 is silently defeated if Tailwind escape
> hatches and bespoke styles re-accumulate. This guide is the violation
> catalog (what to flag in review) and the guardrails (what to enforce).

**Research:** `../research/tailwind-v4-upgrade-guide.md` (renamed utilities,
the arbitrary-value syntax), `../research/shadcn-svelte-theming.md` (tokens
are the source of truth).

## The six violation classes

Every PR touching a `.svelte` file's markup or styling should be checked
against these. A violation is a blocker, not a nit.

### Violation 1: Arbitrary-value utility bypassing the token bridge

The token bridge (`02-token-bridge.md`) maps OSPRY tokens into Tailwind's color
namespace so `bg-background`, `text-primary`, etc. resolve to PRD-071 tokens.
An arbitrary-value utility like `bg-[#1c1f26]` bypasses the bridge and
hard-codes a color: the exact drift ADR-007 exists to end.

**Flag:**
```svelte
<!-- BAD -->
<div class="bg-[#1C1F26]">...</div>
<div class="text-[#A1A8B3]">...</div>
<div class="border-[#2A2E37]">...</div>
```

**Fix:**
```svelte
<!-- GOOD -->
<div class="bg-card">...</div>          <!-- resolves to --bg-surface -->
<div class="text-muted-foreground">...</div>  <!-- resolves to --text-secondary -->
<div class="border-border">...</div>    <!-- resolves to --border-default -->
```

If the needed color is not in the bridge, the fix is to ADD it to the bridge
(`02-token-bridge.md`) and the underlying `tokens.css`, not to bypass.

**Exception:** `--destructive` is the one place a literal is acceptable (OSPRY
has no destructive token; the bridge uses Tailwind's red-600 oklch). Document
it.

### Violation 2: A copy-in component with a hard-coded color

Per `03-component-anatomy.md` Pattern 1, every color in a variant factory is a
token. A literal is a bug.

**Flag:**
```ts
// BAD — in a copy-in component's tv() factory
variant: {
  custom: "bg-blue-500 text-white",
}
```

**Fix:**
```ts
// GOOD — use the token (or add one)
variant: {
  custom: "bg-primary text-primary-foreground",
}
```

### Violation 3: A new bespoke `<style>` block for something a primitive covers

From Phase 0 forward, new screens use copy-in primitives. A new `<style>` block
that re-implements button/input/dialog styling is drift re-accumulating.

**Flag:** any new `<style>` block in a `.svelte` file added after Phase 0 that
defines `.btn`, `.input`, `.modal`, `.card`, or similar primitive styling.

**Fix:** replace with the copy-in primitive. If the primitive genuinely cannot
cover the need, escalate; do not hand-roll.

**Exception:** a `<style>` block for a truly one-off layout (a specific grid
arrangement, a unique decorative element) is fine. The violation is
re-implementing PRIMITIVE behavior, not writing any CSS at all.

### Violation 4: A `style=` attribute interpolating an un-validated value

Per `05-white-label-preservation.md` Rule 1, no new raw-CSS surface for
theming. A `style={...}` that interpolates an agency value (or any un-validated
string) into CSS is a security regression: it re-opens the XSS vector
`render-guard.ts` exists to close.

**Flag:**
```svelte
<!-- BAD -->
<div style="background: {agencyColor}">...</div>
<div style="--brand-accent: {userInput}">...</div>
```

**Fix:** the agency color flows through `--brand-accent` via the server gate,
not through inline `style=`. Use the token:
```svelte
<div class="bg-primary">...</div>
```

### Violation 5: Wrong dark-mode polarity or a FOWT

Per `04-dark-mode-inversion.md`, OSPRY is dark-first. A PR that:

- Bridges `:root` to LIGHT tokens (because "shadcn does it that way").
- Adds `mode-watcher` with no light theme to toggle to.
- Moves brand resolution client-side (creating a flash of wrong brand).

…is a regression. Flag and fix per the inversion guide.

### Violation 6: Reintroducing the retired "glass" design system

The `feature/flat-ui-retirement` branch retired glassmorphism (`backdrop-
filter`, translucent `--glass-*` fills), ambient/accent glow shadows
(`--aurora`, `--shadow-glow-*`), and the bespoke `.btn`/`.panel`/`.stat`/
`.intg` class families in favor of the shadcn-svelte primitives
(`<Button>`/`<CardBlock>`/`<Card>`/`<StatTile>`, all in `$lib/components/ui/`).
None of these should ever reappear in `apps/portal`.

**Flag:**
```svelte
<!-- BAD -->
<div class="panel">
  <button class="btn btn-primary">Save</button>
</div>
<style>
  .thing { backdrop-filter: blur(10px); background: var(--glass-bg); }
</style>
```

**Fix:**
```svelte
<!-- GOOD -->
<CardBlock>
  <Button variant="default">Save</Button>
</CardBlock>
```

**Exceptions (both narrow, both documented at the call site):**
- The `.modal-scrim` blur (shell.css): blurring the page BEHIND a modal is a
  distinct pattern from a translucent card surface, and is the only place
  `backdrop-filter` may be a non-`none` value.
- `stat-label`/`stat-value`/`stat-foot`/`stat-grid` and `intg-logo`/
  `intg-name`/`intg-desc`/`intg-grid` are real, separately-defined flat
  typography/layout utilities kept after the `.stat`/`.intg` card wrappers
  were deleted; they are not aliases of the retired classes.

## The renamed-utilities gotcha (Tailwind v4)

From `../research/tailwind-v4-upgrade-guide.md`, several v3 utilities were
renamed. OSPRY adopts v4 natively, so use the v4 names from day one. Flag the
v3 names in review (they may appear in copy-pasted code from older tutorials):

| v3 (flag) | v4 (correct) |
|---|---|
| `shadow-sm` | `shadow-xs` |
| `shadow` | `shadow-sm` |
| `rounded-sm` | `rounded-xs` |
| `rounded` | `rounded-sm` |
| `outline-none` | `outline-hidden` |
| `ring` | `ring-3` |
| `bg-gradient-to-r` | `bg-linear-to-r` |
| `bg-[--token]` | `bg-(--token)` |

## Guardrails to enforce (the standing rules, enforcement = lint rule)

These are the rules every PR touching UI must satisfy. **Enforcement mechanism
(resolved 2026-06-30): a lint rule in CI**, not just a code-review checklist.
The lint rule (implemented in the ADR-007 follow-up PRD) blocks PRs that
violate the bright-line rules below; the rest stay as reviewer guidance.

### Lint-enforced (CI blocker)

1. **No arbitrary-value color utilities.** `bg-[#...]`, `text-[#...]`,
   `border-[#...]` are blockers. Use the bridged token utilities. The lint rule
   regex-matches the `[#<hex>]` and `[(--<non-bridged-token>)]` patterns.
2. **No literals in copy-in component variant factories.** Every color is a
   token. The lint rule scans `$lib/components/ui/**/*.svelte` `tv({ ... })`
   blocks for hex / rgb / hsl literals.
3. **No `style=` attribute interpolating a non-token value.** The lint rule
   flags `style={`...${...}...`}` patterns in `.svelte` files under
   `apps/{portal,web,wl}/src` (the XSS-vector surface from
   `05-white-label-preservation.md`).
4. **No reintroducing the retired glass system.** `apps/portal/scripts/
   check-flat-ui-discipline.ts` (run via `pnpm run lint:flat-ui-discipline`,
   wired into `pnpm test`) blocks `backdrop-filter` (outside the `.modal-
   scrim` exception), any `--glass-*`/`--aurora`/`--shadow-glow-*` token, and
   any `.panel`/`.stat`/`.intg`/`.btn`/`.btn-*` class token in `apps/portal`.

### Reviewer-enforced (checklist)

5. **No new bespoke primitive styling after Phase 0.** Use the copy-in component.
6. **Import order in `+layout.svelte` is tokens → brand → legacy → app.css.**
   A change to this order is a blocker pending an explained reason.
7. **`@theme inline` stays `inline`.** Never "simplify" by removing the
   keyword.
8. **`--primary` bridges to `--interactive`, not `--brand-primary`.**
   Green-scarce is load-bearing.
9. **`dark:` / `light:` variants are for one-off overrides only.** Theme swaps
   happen via the `:root` / `[data-theme="..."]` token blocks (Option A).
10. **No ghost buttons.** A button-shaped element must be a visible surface
    at rest (`variant="outline"`/`"secondary"`/`"default"`), never
    transparent-until-hover. `<Button>` has no `ghost` variant on purpose.

## How to flag a violation in review

Per the sibling `ux-ui-svelte-stinger`'s review discipline, a violation callout:

1. **Quote the governing section.** Cite the ADR-007 decision or the specific
   guide (`02-token-bridge.md` §"The green-scarce rule").
2. **Cite the code** with `path:startLine-endLine`.
3. **Propose the minimal fix**: the token utility, the copy-in component, the
   corrected import order. Do not rewrite the other author's work unless asked.

A violation is a blocker. The standardization goal is the whole point of
ADR-007; letting drift re-accumulate defeats the migration.
