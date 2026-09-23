# 04. Write target-profile.json and the recon report

The last step: turning a completed classification into the two artifacts this pair's shared-
workspace contract promises.

## Two files, one source of truth

Per the PRD-003 shared-workspace contract:

- `_shared/target-profile.json`, machine-readable, every later Drone reads this instead of
  re-detecting anything itself (PRD-003 AC-3).
- `01-recon/stack-fingerprint.md`, human-readable narrative of the same run.

Write both from the same `fingerprint.py` invocation's output. Never hand-edit one without updating
the other; a mismatch between the two is worse than either file being briefly stale.

## `_shared/target-profile.json`

Hydrate `references/templates/target-profile.template.json` (or take `fingerprint.py --out`'s
output directly, it already matches the template's shape) with the run's real values. Required
non-null fields per PRD-003 AC-1: `stack`, `rendering`, `confidence`. Do not write the file with any
of these three as `null` or omitted, even for a low-confidence or unknown result, they still get a
real value (`unknown`, `unknown-requires-headless-load`, `{"stack": "low", "rendering": "low"}`
respectively).

## `01-recon/stack-fingerprint.md`

Hydrate `references/templates/stack-fingerprint-report-template.md`. Fill every section, including
the blind-spots section, even on a clean, high-confidence run: a clean run still names what was and
was not checked, per the plugin-wide conduct rule against silent passes
(`plan/website-auditor-build-plan.md` section 7, rule 1, "no silent-pass").

## `site-crawler-wasp-drone` handoff

`platform_guide` in `target-profile.json` is the exact repo-relative path to the build-plan-section-6
platform guide `site-crawler-wasp-drone` should load next (see
`references/fingerprint-signature-table.md`'s stack-id-to-guide mapping, mirrored in
`shared/scripts/fingerprint.py`'s `PLATFORM_GUIDE_MAP`). This satisfies PRD-003 AC-3 directly: the
crawler selects its strategy from this one field, it never re-detects the stack itself. When `stack`
is `unknown`, `platform_guide` is `null`, on purpose, so the crawler falls back to a generic
traversal rather than loading a mismatched platform guide.

## Re-fingerprinting mid-engagement

If a site migration is suspected mid-engagement (one of this Stinger's stated "when to use"
triggers), re-run this entire procedure and overwrite both files. Do not append a second profile
inside the same JSON file, downstream Drones expect exactly one `target-profile.json` shaped like the
template, not a history of runs. If a run history matters for this engagement, note it in
`_shared/evidence-index.md` (owned by the shared-workspace convention, not this Stinger) instead.
