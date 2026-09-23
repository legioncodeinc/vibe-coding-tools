# 05. Fallback chain and provenance

The end-to-end decision procedure tying together guides 01-04, and the honesty note on what is
genuinely researched versus what is this Stinger's own architectural judgment call.

## Honesty note

`references/research/distilled-keyword-intelligence.md` section 6 states this plainly: "No source
in this archive... discusses how this plugin should decide, in code, whether Tier 1's 'has data'
check has failed cleanly enough to fall through to Tier 2, or how Tier 2's manual customer-export
ingestion should be validated before falling through to Tier 3; the tier-transition logic itself
remains an implementation decision not directly grounded in any raw source here." Everything in
this guide's procedure section is therefore this Stinger's own designed decision logic, built to
satisfy PRD-006's binding acceptance criteria, not a researched fact. `guides/01` through `guides/
04` each ground their own tier's mechanics in real sources; this guide grounds only the ordering
and escalation logic between them, in the PRD text itself.

## The procedure

1. **Check Tier 1.** Is a Search Console MCP connected, and does it return query data for this
   domain? If yes: use it, tag every entry `search-console`, done, skip to step 5.
2. **Check Tier 2.** Is a customer-supplied Google Trends export present (see
   `guides/02-tier-2-customer-trends-export.md`)? If yes: use it, tag every entry
   `customer-trends`, archive the raw file(s) per PRD-006 AC-4, done, skip to step 5.
3. **Fall through to Tier 3.** Independently fetch the site's own key pages (see
   `guides/03-tier-3-ai-inference.md`'s sequencing note: `site-data/` does not exist yet at this
   wave) and infer candidates via NLP cascade or TF-IDF-style extraction. Tag every entry
   `ai-inference`, Volume always `volume-unknown`.
4. **Check the count against PRD-006's required range** (75-100 keywords, 25-50 questions). If the
   Tier 3 count is below the minimum:
   - If a paid-API budget is approved: escalate to Tier 4 (`guides/04-tier-4-paid-api.md`) to fill
     the gap only, keeping every already-sourced candidate's own tier tag intact. Tag the overall
     run `mixed` in the provenance summary.
   - If no budget is approved: STOP. Do not fabricate candidates. Report the gap in the run ledger
     and to the orchestrating agent/user, and either accept a below-range output with the gap
     explicitly disclosed, or wait for a budget decision.
5. **Write the provenance summary.** Every run of `content-targets/keywords.md` and
   `content-targets/questions.md` ends with the provenance summary block from
   `references/templates/keywords-template.md` / `references/templates/questions-template.md`,
   recording which tiers were tried, in order, which one(s) actually produced output, and the
   final count against the required range. This is what makes PRD-006 AC-1/AC-2 auditable after
   the fact, not just true in the moment.
6. **Record tier skips in the run ledger, never as a user-visible error.** Per PRD-006 AC-2: "with
   no user-visible error, only a note in the run ledger that tiers 1-2 were unavailable." A skipped
   tier is expected, normal operation for most engagements (most sites will not have a connected
   Search Console MCP on a first-time audit); do not surface it as a failure to the customer-facing
   report.

## Using `fallback-chain-decision.py` to make this auditable

`references/scripts/fallback-chain-decision.py` implements steps 1-4 above as one deterministic,
re-runnable decision. Run it with the actual outcomes of checking each tier (connection status,
export presence, running candidate count, budget-approval flag) and it returns the same decision
this guide describes, as JSON, ready to drop into the run ledger or the provenance summary block
verbatim. Prefer running the script over re-deriving the decision by hand; it exists specifically
so the decision logic lives in one place, testable and consistent across engagements, rather than
re-reasoned fresh (and potentially inconsistently) every run.
