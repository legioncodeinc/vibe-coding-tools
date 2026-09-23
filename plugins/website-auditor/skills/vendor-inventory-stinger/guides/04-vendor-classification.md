# 04. Vendor classification

How every captured evidence item becomes a classified row.

## Run the classifier

```
python3 shared/scripts/vendor-census.py \
  --network-log-file requests.json --dom-scripts-file scripts.json --html-file rendered.html \
  --out vendor-census.json
```

The script applies `references/vendor-lookup-table.md`'s table (embedded as `VENDOR_SIGNATURES` in
the script itself; the markdown file is the human-readable copy, kept in sync manually). Do not
hand-roll a second matching pass; if a vendor is missing, add it to both the script and the
reference table, cite its grounding (researched or judgment-call), and re-run.

## The fixed function taxonomy

Classify every vendor into exactly one of PRD-004's categories: `analytics`, `tag-manager`, `chat`,
`payments`, `cro-testing`, `seo-injection`, `ads`, `consent-cmp`, `other`. Do not invent a new
category. A vendor that plausibly fits two (e.g. a CDP that is also technically an analytics tool)
goes into whichever category its primary observed function on this page is; note the ambiguity in
the evidence field rather than double-counting it in two rows.

## Confidence and grounding, kept separate

Every row carries two independent labels, do not conflate them:

- `confidence`: how strong the match evidence is for the specific site (channel-family count).
- `grounded`: whether the *signature itself* traces to this Stinger's research archive at all.

A judgment-call row is capped at `low` confidence regardless of how many channels matched, because
the underlying signature was never independently corroborated by research, only by common public
knowledge. State this distinction plainly in `01-recon/vendor-inventory.md`'s Grounding column, per
this build's honesty rule: ground every substantive claim in the archive or the PRD/build plan, or
flag it as an explicit judgment call.

## Evidence, always

Every row needs the request URL, script src, or DOM node that produced the match, per PRD-004 goals
("with the evidence"). A vendor name without an evidence pointer is not auditable and should not
appear in the final report; if you strongly suspect a vendor is present but have no evidence pointer
(e.g. a behavior you observed but could not trace to a specific request), log it in the "Rejected
candidates / verification log" section instead, with the reason it did not clear the bar, per the
plugin-wide conduct rule that rejected findings are recorded, not silently dropped.

## First-party false positives

A script served from the audited domain's own origin (or a subdomain of it) is not a third-party
vendor, even if its filename happens to contain a vendor-sounding string. Filter to third-party
origins before matching, per `guides/01-headless-capture-procedure.md` step 3. If a match's "matched"
evidence string turns out on inspection to be first-party, move it to the rejected-candidates log
with that reason, do not include it in the vendor table.
