# Reporting — findings ledger, tier mapping, report skeleton

How audit output is shaped. The tier taxonomy below is the operator's standing taxonomy; every finding must land on exactly one tier or be reported as informational/unknown.

## 1. Findings ledger schema

| Field | Requirement |
|---|---|
| `id` | `F<n>` sequential, stable across report revisions |
| `claim` | one sentence, assertive, scoped to what was observed |
| `evidence` | raw-archive anchor(s) — transcript file or forensics excerpt; never a bare assertion |
| `tier` | Tier 1/2/3, or `informational`, or `unknown` |
| `disposition` | `control-effective` \| `open` \| `availability` \| `informational` \| `unknown` |
| `reproduction` | the probe shape (method + path + role) that re-derives the observation |

Anchored instance: the loungeatswift.com ledger F1–F15 in `research/distillation.md` §8, each row already carrying evidence anchors and dispositions (`probes.json`, `probe6.json`, `probe7.json`, `probe9.json`, `sweep.json`, forensics excerpt).

**Ledger rules** (violations = report defects):
1. No finding without an evidence anchor. Claims that can't be re-derived from the archive are dropped to known-unknowns, not deleted silently.
2. `{"success":true}` is never cited as evidence of effect — only as evidence of an ack; persistence is a separate observation (`probe9.json`, F4).
3. Availability failures (`503 BOOT_ERROR`) are never folded into configuration findings (`probe9.json`, F5).
4. Unknowns are stated with the question they leave open, not smoothed over (distillation §9).

## 2. Tier mapping (operator taxonomy)

| Tier | Covers | Audit signals that map here |
|---|---|---|
| **Tier 1** | RLS gaps / anon over-permission; service-role key exposure; client-side-only enforcement | anon read returning live rows (`menu_items` in `probes.json`); anon-callable RPC with real data (`get_events_reserved_counts`, `probes.json`); write-path gated only in client code; anon JWT reaching `/functions/v1/ai-*` with anon role as sole authorization (`lovable--bundle--key-and-endpoint-excerpts.txt`, `probes.json` 401s) |
| **Tier 2** | unauthenticated Edge Functions; auth reset/inbox takeover; session-token theft; storage misconfig | function answering `200` to anon without gating (`probes.json` contrasts); reset-flow enumeration (none observed — non-enumerating per `[S-PW]`); bucket-listing anomalies (`sweep.json`, `probe9.json` both `[]`) |
| **Tier 3** | secrets/supply chain; realtime cross-tenant; webhooks; agent-prompt-injection; PII-seed; backups | third-party endpoints in bundle (`payroll.toasttab.com`, `oauth.lovable.app`, `bit.ly` — `sweep.json`); realtime failure/semantics open (`probe7.json`, distillation §9-5); embedded-key duplication across chunks (forensics excerpt) |
| **informational** | schema-cache enumeration (`PGRST204`/`PGRST202`); dev-string residue (`localhost:3000`) | `probes.json`, `probe9.json`, `sweep.json` |
| **unknown** | `authStatus:"forbidden"` semantics; `documents` policy intent; F4 root cause | `probe9.json`, distillation §9 |

## 3. Report skeleton

```
1. Scope & authority     — target, Supabase project ref, authority basis, date window
2. Method               — probe classes used (differential visibility, write-denial
                          discrimination, surface enumeration, bundle forensics), spacing,
                          write-labeling, account disclosure
3. Findings ledger       — §1 schema; each row tiered per §2; open/unknown rows explicit
4. Control-effectiveness — what was proven present (denials, gating, rate limits) —
                          stated as verified controls, each with its anchor
5. Known-unknowns        — the questions the evidence does not resolve; required follow-up
6. Hygiene & disclosure  — synthetic accounts (deletable), labeled writes + cleanup
                          statuses (204), byte-exact credential handling, probe spacing
7. Thin spots            — where no archived primary source covers the claim area
```

Section-6 minimum content (hygiene is report-grade, not optional): account fixture reference (`empirical--loungeatswift--test-account.md`), the `pentest probe - safe to delete` labeling on every mutating probe, cleanup `204` attestations (`probe9.json`), and the never-retyped-credentials rule (`lovable--bundle--key-and-endpoint-excerpts.txt` offsets).

## 4. Grounding line (mandatory footer)

Every factual claim in the report must trace to: (a) a raw-archive anchor named inline, (b) the operator taxonomy for tiering, or (c) be labeled unknown. A report sentence that ends without one of the three is a draft artifact, not a report line.
