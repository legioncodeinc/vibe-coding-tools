# Research archive: renewal-sentinel

## What is here

- `raw/` holds one file per archived source, each headed with title, URL, fetch date,
  source type, and publication date, followed by the extracted figures and an honest note
  on where the source is usable and where it fails.
- `distilled-renewal-and-expiry-practice.md` is the cited synthesis. Every claim in it ends
  in a bracketed citation to a file in `raw/`.

## Sweep parameters

- Swept 2026-08-17 with WebSearch and WebFetch.
- Sources archived: 15.
- Window: the majority of sources publish between 2025-11 and 2026-07, inside the contract's
  six-month default. Four sit outside it deliberately and each says why in its own file:
  the Eighth Circuit decision (2025-07) because it is the controlling event, the ICANN
  consensus policy (2024 page date) because a standing policy has no fresher version, the
  New York statute because a codified statute is not a dated publication, and the Red Sift
  outage roundup (2023, updated 2024) because it is retained only for its named-incident
  list.
- Domain covered: US auto-renewal and negative-option law and its current litigation status,
  state automatic renewal statutes and their consumer versus business scope, SaaS annual
  contract auto-renewal and notice-period benchmarks, renewal negotiation timing, the domain
  expiry lifecycle, the TLS certificate validity reduction schedule and expiry consequences,
  and hosting promotional-to-renewal price behavior.

## Source ranking applied

House rule: official docs outrank vendor blogs outrank community posts. Applied here as:

1. Primary law and binding policy. The New York statute as published by the legislature, and
   the ICANN Expired Registration Recovery Policy. These are the two genuinely official
   sources in the archive.
2. Law firm client alerts reporting federal and state regulatory action. Used for legal
   status only. Three independent firms cover the FTC question so the status is triangulated
   rather than taken from one alert.
3. Vendor sources with a stated dataset. Common Paper states 10,000-plus contracts.
4. Vendor blogs aggregating figures without a stated sample. CloudNuro, Lapsewise, Sectigo,
   Bisup. Used for structure and practice, discounted for statistics.

## The legal-accuracy discipline this archive exists to enforce

The FTC click-to-cancel question is the highest-risk claim in this domain, because the rule
was widely reported as taking effect and then was vacated days before its compliance date.
Three separate law firm sources are archived on it, and section 1 of the distillation states
the status in one paragraph with all three cited. Do not restate the federal position from
memory. Read section 1.

## Commercial interest disclosure

Nine of the fifteen sources are published by companies selling something adjacent to the
problem: renewal tracking, SaaS management, certificate lifecycle automation, contract
tooling, or hosting. Each of those files says so in its source-type line and its reliability
note. Their figures are quoted as vendor estimates, never as measurements.

## What is deliberately not here

Littlebird MCP mechanics. That research is already done and lives in
`references/littlebird-mcp-reference.md`, copied verbatim from the forge foundation. It was
not re-run.

## Rule for anyone extending this

Do not add a claim to the distillation without first adding its source to `raw/`. If it is
not in the archive, it is not a fact yet.
