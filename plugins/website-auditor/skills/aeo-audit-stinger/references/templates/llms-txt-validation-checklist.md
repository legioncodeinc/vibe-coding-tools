# llms.txt validation checklist

Grounded in `references/research/distilled-aeo-audit.md` Section 2. Run `shared/scripts/aeo-technical.py llms-txt` first; this checklist covers what the script reports plus the judgment calls it deliberately leaves to a human.

> **Archive honesty note.** Neither source in this archive is an official standard, spec, or engine-vendor primary document for llms.txt itself - both are vendor/practitioner blogs describing their own testing (see distillation Section 1 and Section 7). Score against this checklist as this audit's own reasonable reading of the practitioner consensus, not as an official pass/fail against a published spec that does not exist yet.

```markdown
## llms.txt - <domain>

| Check | Result | Evidence | Source |
|---|---|---|---|
| Location: present at site root (`https://<domain>/llms.txt`, not a subdirectory or meta tag) | | script output | [raw/theaeoreport-com-answer-engine-optimization-checklist.md] |
| HTTP status | | script output | |
| Minimum content: site name / one-line description | | manual read | [raw/theaeoreport-com-answer-engine-optimization-checklist.md] |
| Minimum content: primary content sections with URLs | | manual read + script's link-shape heuristic | [raw/theaeoreport-com-answer-engine-optimization-checklist.md] |
| Optional: agent-specific directives (block/allow certain crawlers) | | manual read | [raw/theaeoreport-com-answer-engine-optimization-checklist.md] |
| Length vs. ~2,000-character practical-truncation heuristic (front-loaded critical lines?) | | script output | [raw/theaeoreport-com-answer-engine-optimization-checklist.md] - practitioner heuristic, not a disclosed spec limit |

**Weighting note (disclosed disagreement, not a factual conflict):** The AEO Report frames llms.txt as "the non-negotiable starting point" of its entire checklist (Pillar 1: Foundation). Ranki.io ranks it 4th of 15 signals, behind two schema signals and one content-shape signal, in its "crawl tier" (third of four impact tiers). Both are single-vendor heuristics; present the finding itself (present/absent, well-formed/not) as fact, and note the weighting disagreement rather than picking a side. [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] [raw/theaeoreport-com-answer-engine-optimization-checklist.md]
```
