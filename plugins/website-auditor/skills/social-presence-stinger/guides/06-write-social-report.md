# Guide 06: Write the social presence report

## What this guide covers

Final assembly and handoff, once discovery (guide 01), public-data collection (guide 02), the opt-in authentication flow (guide 03), the content sweep (guide 04), and scoring (guide 05) are all complete.

## Procedure

1. Assemble `10-social/social-report.md` from `references/templates/social-report-template.md`: the platforms-found table (with status and authentication outcome per platform), public-data findings, authenticated-data findings (only for opted-in platforms), the declined-or-unavailable section, subjective findings, and the verification log.
2. Make the platforms-found table the report's opening section, not an appendix. A reader needs to see immediately which of the three platforms were found, which were dormant, which were authenticated, and which were declined, before reading any score.
3. State the declined-or-unavailable section in neutral, factual terms. Per PRD-017's binding conduct rule, this Drone must never frame a decline or an unavailable-auth state as a negative finding about the site itself, restate that framing here at the point it's most likely to leak into report language.
4. Append this Drone's completion to `_shared/run-ledger.json` and add every captured artifact (screenshots, exported page text) to `_shared/evidence-index.md`, per build plan section 3.
5. Hand off to `audit-scoring-wasp-drone`: this Drone's job ends at a scored, evidenced `10-social/social-report.md`; it does not populate the XLSX scorecard itself.

## Report is not optional output

Per the paired Drone's Reporting expectations, this report is the record of what this Drone found and did, including which platforms it never touched by design (declined or unavailable auth) and why that is not a gap in the audit.
