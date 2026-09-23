# Examples

Two worked examples are included to demonstrate the skill's range.

## 1. `example-case-a/` — Canonical happy-path example

The Example Booking Co. matter (Sarah Bennett / Example Booking Co. LLC) is the calibration anchor for this Stinger. It demonstrates every phase running end-to-end:

- **Engagement period:** Aug 11, 2021 — May 1, 2026 (57 months)
- **Defendants:** ADA (Robert Hartwell / Northstar Holdings) AND DevPipe / Offshore Build Group (Sameer Khan)
- **Documented + extrapolated spend:** $202,334.29 (within the client-reported range of $160,000–$224,000)
- **Materials available:** email archive (323 unique emails), 33 ADA invoices + 15 DevPipe invoices, complete git repo (534 commits across 29 months), WordPress audit log export, Avada theme changelog, ADA quarterly Account Reports, signed ADA contract, Offshore Build MSA
- **Aggregate damages range:** $183,340 — $381,150 (V3, before punitive)

Files in this example:
- `defendant-profiles/defendant-profile-ada.md` — fully filled-in ADA profile
- `defendant-profiles/defendant-profile-devpipe.md` — fully filled-in DevPipe profile
- `defendant-profiles/defendant-relationship.md` — how the two defendants interact (the ADA → Initial Build Vendor → Offshore Build subcontract pivot)

Use this example as the model for:
- How to fill in a defendant profile
- What "complete" looks like across all nine phases
- The first-and-last-observed extrapolation rule applied to multiple recurring services
- How to handle a Initial Build Vendor-style mid-engagement vendor handoff

## 2. `edge-case-no-git/` — How to handle a case without git evidence

Some cases don't have git access — the client wasn't given the repository, or the developer refused to hand it over. The skill's methodology still works; you skip Phase 3 and lean harder on the invoice analysis, audit-log analysis, and CVE timeline.

In a no-git case:
- Phase 3 is documented as "git evidence not available — repository access was not provided by the developer."
- The damages calculation in Phase 7 omits the "Billed vs Delivered" variance table.
- The attorney memo Section II.F (git evidence) is replaced with a section explaining why git access should be a subpoena target.
- The Plain Language Report Part 3 (paying for nothing) lacks the visceral "ZERO commits" framing — substitute with the dependency lockfile evidence and the audit-log evidence.

The case is weaker without git but still actionable. Document the gap in the master report, list git access as the #1 subpoena target, and proceed.

## What each example demonstrates

| Aspect | example-case-a/ | edge-case-no-git/ |
|---|---|---|
| Full 9-phase run | YES | Phase 3 skipped |
| Multi-defendant handling | YES | (single defendant common in this scenario) |
| Defendant profile fill-in | YES | YES |
| Recurring invoice extrapolation | YES (21 UNK invoices) | YES |
| Git "Billed vs Delivered" table | YES (the smoking gun) | N/A — strategy shift |
| Initial Build Vendor-style mid-engagement pivot | YES | (case-dependent) |
| Marketing performance analysis | YES | YES |
| WordPress audit log analysis | YES | YES |
| Pre-Aug-2021 historical reconstruction | YES (V3 added this) | YES |

## Adding a new example

When a sibling case completes, add a new example folder named `{project-slug}/`. Include:
- A short `README.md` summarizing the case's distinguishing features
- The completed `defendant-profile-*.md` files
- A `case-facts.json` showing the final values
- Notable case-specific lessons learned in a `case-notes.md`

Future iterations of this Stinger will be calibrated against the growing example library.
