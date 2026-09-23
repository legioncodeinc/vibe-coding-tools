# Analytics stack findings, copy-ready output template

Write the populated version of this file to `08-analytics/analytics-findings.md` in the shared audit workspace (per `plan/website-auditor-build-plan.md` section 3). Fill every bracketed field. Do not leave a score without its evidence pointer and justification, `audit-scoring-wasp-drone` rejects scores that arrive without both, per the build plan's scoring rules.

Scoring scale is the plugin-wide zero-to-six scale (0 = N/A/no-op, 1 = F/critical, 2 = D/high, 3 = C/medium, 4 = B minus/low, 5 = B/cosmetic, 6 = A/none). Boolean checkpoints resolve only to 6 or 1, nothing between.

---

## Analytics stack findings

**Domain:** `[domain]`
**Run date:** `[YYYY-MM-DD]`
**Inputs read:** `01-recon/vendor-inventory.md` (as of `[timestamp/commit-equivalent]`), `02-positioning/` (niche: `[niche]`, ICP: `[icp summary]`)

### 1. Foundational analytics coverage (leaf weight 5% of the Analytics and insight category)

| Field | Value |
|---|---|
| Vendor(s) detected | `[vendor name(s), or "none detected"]` |
| Classification tier | `[Tier A / Tier B / Tier C, per references/templates/vendor-classification-table.md]` |
| Score (0-6) | `[score]` |
| Evidence pointer | `[file path in vendor-inventory.md, script src, or raw HTTP response captured this run]` |
| Justification (one line) | `[why this score]` |
| Correctness notes | `[cross-domain tracking wired? duplicate/conflicting tags? stale FID-era or deprecated snippet still present? label as [subjective] if this is a judgment call rather than a fingerprint-confirmed fact]` |

### 2. Industry-specific analytics (leaf weight 4% of the Analytics and insight category)

| Field | Value |
|---|---|
| Site niche (from `02-positioning/`) | `[niche]` |
| Industry-appropriate tooling expected | `[what this niche typically runs, labelled [subjective] per guides/03-industry-specific-analytics.md, this Stinger's archive has no per-industry tooling catalog]` |
| Vendor(s) detected matching that expectation | `[vendor name(s), or "none detected"]` |
| Score (0-6) | `[score]` |
| Evidence pointer | `[file path / script src]` |
| Justification (one line) | `[why this score]` |

### 3. De-anonymization / visitor-identification tooling (leaf weight 3% of the Analytics and insight category)

Per this pair's PRD non-goal: this Stinger does not render a compliance verdict. It flags presence, tier (company-level vs contact-level, deterministic vs probabilistic where determinable), and the jurisdiction question, and leaves the legal read to the customer's own counsel.

| Field | Value |
|---|---|
| Vendor(s) detected | `[vendor name(s), or "none detected"]` |
| Classification tier | `[Tier A / Tier B / Tier C, per references/templates/vendor-classification-table.md; Tier C = unconfirmed candidate, say so explicitly]` |
| Identification depth | `[company-level (reverse-IP) / contact-level (named individual) / cannot determine]` |
| Matching method (if determinable) | `[deterministic / probabilistic / cannot determine]` |
| Apparent jurisdiction of the audited site | `[EU/UK / US / other / cannot determine, per guides/04-deanonymization-and-jurisdiction.md]` |
| Score (0-6) or N/A | `[score, or 0/N/A if de-anonymization tooling is restricted in the apparent jurisdiction, per Q18's default]` |
| Evidence pointer | `[file path / script src / domain sighting]` |
| Justification (one line) | `[why this score]` |
| **Legal-gray-area flag** | `[YES/NO]`, `[if YES: state the specific gray area, e.g. "contact-level identification with no visible consent mechanism on a site that appears EU-facing" -- flag it, do not assert it is or is not compliant]` |

### 4. Cross-reference: content-injection-capable vendors (flag only, scored by vendor-inventory)

| Field | Value |
|---|---|
| Vendor(s) with write-back/content-manipulation capability (e.g. Search Atlas OTTO Pixel-class) | `[vendor name(s), or "none detected"]` |
| Cross-reference to `01-recon/vendor-inventory.md` finding | `[pointer]` |
| Note | This Stinger does not score this class, `vendor-inventory-wasp-drone` owns it. Noted here only if it overlaps with a vendor already classified as analytics above. |

### 5. Rejected/reframed candidates (verification log, conduct rule 4)

| Candidate | Why it was rejected or reframed | Reasoning |
|---|---|---|
| `[candidate vendor or finding]` | `[rejected / reframed to Tier C candidate / downgraded confidence]` | `[one line]` |

### 6. Summary

- Foundational analytics: `[score]`/6
- Industry-specific analytics: `[score]`/6
- De-anonymization tooling: `[score]`/6 or N/A
- Legal-gray-area flags raised this run: `[count]`
- Open items requiring internal verification (per conduct rule 5): `[list, or "none"]`
