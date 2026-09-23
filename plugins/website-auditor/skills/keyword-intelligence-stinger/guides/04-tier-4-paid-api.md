# 04. Tier 4: paid keyword API (last resort)

Grounded in `references/research/distilled-keyword-intelligence.md` section 4
(`raw/dataforseo-com-apis-dataforseo-labs-api-keyword-research.md`,
`raw/docs-ahrefs-com-api-reference-keywords-explorer-get-matching-terms.md`).

## This tier is cost-gated, not opportunistic

Per the distillation's own implementation implication: "this tier should be gated behind an
explicit cost/budget check rather than called opportunistically the way Tier 1-3 can be." Both
vendors researched here require a paid account and per-call cost tracking. This Drone never calls a
paid keyword API without an explicit budget-approval signal (see
`references/scripts/fallback-chain-decision.py`'s `--paid-api-budget-approved` flag and
`guides/05-fallback-chain-and-provenance.md`'s escalation logic). "Last resort" is not just an
ordering position in the chain, it is a spend-authorization gate.

## Two vendors researched, not directly cost-comparable

| Vendor | Endpoint shape | Pricing | What's richer |
|---|---|---|---|
| **DataForSEO Labs API** | `Keywords For Site`, `Keyword Suggestions`, `Related Keywords`, `Keyword Ideas`, `Search Intent`, `Bulk Keyword Difficulty`, `Keyword Overview`, `Historical Keyword Data` (back to August 2021). 4B+ indexed keywords, 500M+ SERPs, sub-2s responses. | Pay-as-you-go, no monthly commitment. Live Mode Search Intent: $0.0012/task + $0.00012/keyword ($121.20 per 1M keywords). Other keyword-research endpoints: $0.012/task + $0.00012/item ($132 per 1M keywords/domains). Free trial and sandbox available before paid usage. | Firm, quoted flat-rate pricing; explicitly resale-friendly ToS framing for exactly this use case (embedding vendor data inside a customer-facing report). |
| **Ahrefs Keywords Explorer API** | `GET /v3/keywords-explorer/matching-terms`, requires `country` + `select`; optional `keywords`, `keyword_list_id`, `terms` (all vs. questions-only, useful directly for `content-targets/questions.md`), `match_mode`, `where`, `order_by`, `limit` (default 1,000, max 150,000). | Per-field unit billing (fields individually annotated "(10 units)" in Ahrefs' own docs); no dollar-per-unit conversion was present in the archived source, so a firm per-keyword cost cannot be computed from this archive alone. Also ships an MCP surface, labeled "API + MCP" in its own docs. | Richer per-keyword fields: search-intent breakdown (informational/navigational/commercial/transactional/branded/local), SERP features array, parent topic, traffic potential, desktop/mobile volume split, `first_seen`/`serp_last_update`. |

**Cost-comparison gap, stated plainly:** DataForSEO's cost is a firm, quoted number; Ahrefs'
requires its price-per-unit, which is not in this archive. Do not claim one vendor is cheaper than
the other in a customer-facing report without pulling Ahrefs' own pricing page first. If a
concrete choice must be made without that pricing pulled fresh, DataForSEO is the more directly
costable option from this archive alone, not necessarily the better one.

## Field-selection discipline (cost-conscious integration)

For Ahrefs specifically, the per-field unit billing means requesting only the fields actually
needed (e.g. `volume` and `difficulty` alone, rather than the full response shape) directly
controls cost. For DataForSEO, cost is per-task-plus-per-item regardless of which fields are
returned, so field selection does not change cost the same way; batching keyword count per call is
the more relevant lever there.

## What to record when this tier is used

Every Tier-4 entry is tagged `paid-api` in `content-targets/keywords.md`/`questions.md`, with the
vendor named in the Notes column (per `references/templates/keywords-template.md`) and the real
volume figure the vendor API returned, never marked `volume-unknown` (Tier 4 data is real
search-volume data by definition, same as Tier 1). When Tier 4 is used to supplement a
below-minimum Tier 3 result rather than replace it wholesale, tag the overall run `mixed` in the
provenance summary and keep each individual entry's own tier tag intact; see
`guides/05-fallback-chain-and-provenance.md`.
