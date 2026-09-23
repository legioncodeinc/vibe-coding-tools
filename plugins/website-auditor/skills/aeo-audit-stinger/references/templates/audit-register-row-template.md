# Audit register row template (AEO)

Matches the plugin-wide `Findings Register` sheet columns exactly (build plan section 4.4: `scoring/findings-register.csv`, columns ID, severity, category, page, evidence, remediation, effort), so audit-scoring-stinger can ingest this Stinger's output without a translation step.

```markdown
| ID | Severity | Category | Sub-audit | Page | Evidence | Remediation | Effort |
|---|---|---|---|---|---|---|---|
| AEO-001 | Critical | Search presence | Technical AEO | site-wide | llms.txt returns 404 (`04-aeo/evidence/llms-txt-check.json`) | Publish an llms.txt at site root with site name, description, and primary section links | S |
| AEO-002 | High | Search presence | Technical AEO | site-wide | GPTBot disallowed site-wide; CCBot allowed (`04-aeo/evidence/robots-access-check.json`) | Confirm intent with the customer; if unintentional, allow GPTBot or block CCBot to match actual policy | S |
| AEO-003 | Review | Search presence | Subjective copy read [subjective] | /faq | No FAQPage schema found on a page that is structurally an FAQ (`site-data/faq.html`) | Add FAQPage JSON-LD with 5-8 real Q/A pairs | M |
```

Column conventions:
- **ID**: `AEO-###`, sequential within this Stinger's run, never reused across runs.
- **Severity**: use the plugin's named bands (Critical/High/Medium/Low/Review/Informational). Technical checkpoints (llms.txt, AI-crawler access) can carry any band; subjective-section rows should generally cap at Review/Low unless the underlying schema absence is itself objectively verifiable (e.g. "no FAQPage schema present" is objective; "this page reads well for AI citation" is not a severity-worthy claim on its own).
- **Category / Sub-audit**: `Search presence` / `Technical AEO` for objective llms.txt and AI-crawler-access findings; `Search presence` / `Subjective copy read [subjective]` for anything sourced from `subjective-alignment-worksheet.md`, so the two never collapse into one bucket downstream.
- **Evidence**: a file path or artifact reference into `04-aeo/evidence/` or `site-data/`, never a description reconstructed from memory (conduct rule 2).
- **Remediation**: one line, specific enough for the customer report to use directly.
- **Effort**: S/M/L, this Stinger's own estimate.
