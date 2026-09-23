# 05. Write the vendor inventory report

The last step: turning a completed census into the one artifact this pair's shared-workspace
contract promises.

## One file, per the contract

Per PRD-004's shared-workspace contract, this pair writes exactly one artifact:
`01-recon/vendor-inventory.md`. Unlike stack-fingerprint, there is no shared machine-readable JSON
this pair is required to write into `_shared/`; `vendor-census.json` (the raw
`vendor-census.py` output) is a working intermediate, not a promised workspace artifact. Keep it in
scratch space if useful for your own session, but the markdown report is the deliverable other Drones
and the human auditor read.

## Hydrate the template

Fill `references/templates/vendor-inventory-report-template.md` from the census output. Every
section gets filled, including "None detected this run" for the content-injection section when
nothing fired, per the plugin-wide no-silent-pass rule. Do not omit a section because it came back
empty, an empty section with an explicit "none detected" is itself a finding worth recording.

## Order of sections matters

Lead with GTM detection and the content-injection flagged category before the full vendor table.
Both are PRD-004's named goals ahead of the general census, and both are what `analytics-stack`,
`web-security-posture`, `technical-seo`, and `aeo-audit` will scan for first when they read this
report later in the run.

## Cross-referencing for downstream SEO/AEO Drones

PRD-004 AC-2 is explicit: any content-injection/metadata-manipulation finding must be
"cross-referenced in `01-recon/vendor-inventory.md` for prd-008/prd-009 to account for when
interpreting on-page metadata." Concretely, put the flagged vendor's name and evidence in a
clearly-headed section near the top of the report (not buried in the full vendor table), so a Drone
that only skims the file's headings still catches it.

## Do not judge, only inventory

PRD-004's non-goal is explicit: this Drone does not judge whether a vendor is good or bad, that
interpretation belongs to `analytics-stack-wasp-drone` and `web-security-posture-wasp-drone`
downstream. Keep the report to what was observed and how confidently, resist the pull to add
"this is a red flag" commentary even when a finding (e.g. an autonomous content-injection tool)
looks concerning, name the fact, not the verdict.

## Re-running mid-engagement

If the audited page's vendor stack is suspected to have changed (a new campaign launched mid-audit,
a consent-banner change altering what fires), re-run the full procedure and overwrite
`01-recon/vendor-inventory.md`. Note the re-run date in the report header rather than appending a
second report inside the same file.
