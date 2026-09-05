# Research archive: money-leak-auditor

## What is here

- `raw/` holds one file per archived source, each headed with title, URL, fetch date,
  source type, and publication date, followed by extracted figures and a note on how the
  source is usable or where it fails.
- `distilled-saas-spend-leakage.md` is the cited synthesis. Every claim in it ends in a
  bracketed citation to a file in `raw/`.

## Sweep parameters

- Swept: 2026-08-17 with WebSearch and WebFetch.
- Window: publications from 2026-01-21 through 2026-07-21, plus one 2025 court decision
  reported in a 2026 legal alert. All inside twelve months, the majority inside six.
- Sources archived: 12.
- Domain covered: SaaS and vendor spend leakage, shelfware and underutilization,
  duplicate tooling, shadow IT and shadow AI, failed-payment and involuntary-churn
  mechanics, auto-renewal contract norms, cancellation and downgrade negotiation, and the
  current US legal status of subscription cancellation rules.

## Source ranking applied

The house rule is official docs outrank vendor blogs outrank community posts. This domain
has almost no official docs, because nobody official measures SaaS waste. The ranking
actually applied:

1. Law firm client alert reporting on FTC rulemaking, for legal status only.
2. Vendor reports drawing on the vendor's own processed transaction data, where the
   vendor states its sample (Zylo, Vertice, Cledara).
3. Vendor blogs aggregating third-party figures without a stated sample.
4. Practitioner and community guides, used for tactics rather than for statistics.

Section 9 of the distillation records that ten of twelve sources are commercially
interested in a large waste number. That bias is stated, not corrected for.

## What is deliberately not here

Littlebird MCP mechanics. That research is already done and lives in
`references/littlebird-mcp-reference.md`, copied verbatim from the forge foundation. It
was not re-run.

## Rule for anyone extending this

Do not add a claim to the distillation without first adding its source to `raw/`. If it
is not in the archive, it is not a fact yet.
