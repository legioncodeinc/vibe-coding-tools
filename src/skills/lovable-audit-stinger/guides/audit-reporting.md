# Guide — audit reporting

**Verb**: `audit-reporting` · paired knowledge: `references/reporting.md` (full), `research/distillation.md` §8–§9 (the validated instance).

## Purpose
Shape raw transcripts and probe outcomes into a report that survives review: every claim anchored, every tier assigned, every unknown stated.

## Preconditions
- Completed transcripts archived with source headers (origin, date, source type) — an unheaded transcript is not report-eligible evidence.
- The distillation's findings ledger for the target (claim/evidence/tier/disposition already separated).

## Procedure
1. **Ledger hygiene pass**: for each candidate finding verify the row has (a) a single-sentence scoped claim, (b) ≥1 raw-archive anchor, (c) exactly one tier or `informational`/`unknown`, (d) a disposition. Rows failing any check are fixed or demoted to known-unknowns — never silently deleted [reporting.md §1].
2. **Ack-persistence separation**: any finding citing `{"success":true}` must carry its paired persistence observation (post-call read) or be marked `open` — acks are never effect evidence [probe9.json F4].
3. **Availability separation**: `503 BOOT_ERROR`-class rows stay `availability` disposition, isolated from configuration findings [probe9.json F5].
4. **Tier assignment** per the operator taxonomy mapping [reporting.md §2]: anon-readable live data ⇒ Tier-1 candidate; anon-ungated write paths ⇒ Tier-1; anon-ungated functions ⇒ Tier-2; third-party/bundle/realtime-surface signals ⇒ Tier-3-adjacent; schema-cache and dev-string residue ⇒ informational.
5. **Unknowns section**: state each unresolved question with the specific observation that left it open (`authStatus:"forbidden"`; `documents` policy intent; F4 root cause; realtime `ws_error` semantics) and the follow-up that would resolve it [distillation §9].
6. **Hygiene & disclosure section** (minimum): authority basis; synthetic accounts named via fixture reference and marked deletable; every mutating probe's label text, write status, cleanup status (`204`), and post-cleanup read; credential-handling attestations (byte-exact key with documented offsets; password fixture-only) [reporting.md §3].
7. **Thin-spots section**: name where no archived primary source covers the claim area (Lovable scan-engine internals beyond its "not a full audit" disclaimer; realtime failure semantics) [distillation thin-spot statement].
8. **Grounding footer**: apply the grounding line — every factual sentence traces to (a) an inline anchor, (b) the taxonomy, or (c) an explicit unknown label; anything else is rewritten or cut [reporting.md §4].

## Anti-patterns
- Findings stated as conclusions with method omitted — reproducibility (probe shape + role) is a mandatory ledger field.
- Smoothing: merging availability into configuration, acks into persistence, or unknowns into verdicts. Each merge is a report defect, not a style choice.
- Reporting without the hygiene section — an undisclosed write or unattested cleanup invalidates the engagement record.
