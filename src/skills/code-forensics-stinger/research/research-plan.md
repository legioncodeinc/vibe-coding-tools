# Research Plan — code-forensics-stinger

## Context

This stinger is the generic descendant of `ada-devpipe-forensics`, which was forged on the Example Booking Co. matter (May 2026). The original investigation produced V2 and V3 master forensic packets; the calibration anchors for this Stinger's methodology come from that work.

Because the methodology has already been refined twice in production, most "research" was performed during the Example Booking Co. matter and is preserved in `research/` as topic-named files. This document is the audit trail explaining what was researched, why, and where it lives.

## Original Research Already Conducted (Example Booking Co. V2/V3)

### CVE / WordPress Security Research
**Searches executed:**
- "Post SMTP WordPress plugin CVE vulnerabilities 2023 2024 2025 unauthenticated RCE"
- "WPCode Lite WordPress plugin CVE vulnerabilities critical 2023 2024 2025"
- "Avada theme WordPress CVE security vulnerability 2024 critical authenticated SQL injection"
- "WordPress core security release CVE 2023 2024 2025 versions 6.2 6.3 6.4 6.5 6.6 6.7"
- "Avada theme 7.12 7.13 7.14 7.15 security vulnerability CVE 2025"
- "Fusion Builder OR Avada Core CVE WordPress 2024 2025 vulnerability disclosed"
- "WordPress 6.2 6.3 6.4 6.5 release date security CVE patch July 2023 May 2024"

**Authoritative sources consulted:**
- WPScan (https://wpscan.com/plugins/, https://wpscan.com/theme/)
- Patchstack (https://patchstack.com/database/wordpress/)
- Wordfence Intelligence (https://www.wordfence.com/threat-intel/vulnerabilities/)
- NIST NVD (https://nvd.nist.gov)
- CVE Details (https://www.cvedetails.com)
- WordPress.org release announcements (https://wordpress.org/news/category/releases/)
- Vendor changelogs (Avada theme changelog 7.3 → 7.15 archived in this folder)

**Output:** `cve-database-snapshot.md` — covers Critical (9.0+) and High (7.0–8.9) CVEs across the typical ADA-era WordPress + Avada + Post SMTP + WPCode Lite installation, dated to the engagement window.

### Industry Pricing Research
**Searches executed:**
- "WordPress hosting industry pricing standards $10 $30 monthly Bluehost SiteGround Avada theme small business"
- "small business social media management cost per month industry benchmark engagement rate Facebook Instagram LinkedIn 2025"
- Various rate surveys for offshore developer pricing (Pakistan / India / Mexico / LATAM)

**Authoritative sources consulted:**
- Sprout Social 2025–2026 Social Media Management Pricing Report
- Rival IQ 2025 Social Media Industry Benchmark Report
- Hootsuite Average Engagement Rate Survey (Jan 2025)
- Bluehost / SiteGround / Kinsta hosting pricing pages
- UpStack Studio offshore developer rate survey (compiled from 28 sources)
- UX Continuum custom SaaS build cost case studies (healthcare scheduling reference)

**Output:** `industry-pricing.md` — hosting tiers, social media management pricing tiers, engagement-rate benchmarks per platform, offshore developer rate tables, and custom SaaS build cost ranges.

### Legal / Statutory Research
**Authoritative sources consulted (Ohio default):**
- Ohio Rev. Code § 1345.01 et seq. (Consumer Sales Practices Act)
- Ohio Rev. Code § 2315.21 (punitive damages cap)
- Ohio Rev. Code § 2905.11 (extortion — what NOT to do in demand letters)
- Ohio Rule of Evidence 408 (settlement-communication privilege)
- Ohio common-law fraud and gross-negligence doctrine

**Output:** `jurisdiction-ohio.md` — statutory authority for fraud / breach / gross negligence / CSPA claims, with veil-piercing factors and spoliation sanction framework.

### Effort Calibration Research
- Steve McConnell, *Code Complete* — software development throughput data
- COCOMO II model — function-point and LOC-based effort estimation
- Industry surveys of greenfield development throughput (10–20 LOC/hour midpoint)

**Output:** Embedded in `guides/04-git-log-forensics.md` — calibrated at 30 LOC/hour with category multipliers (deliberately generous to give defendants the benefit of the doubt).

## Open Questions Resolved During Example Booking Co. V3

- **Q:** Should the first-and-last-observed extrapolation rule fill gaps across price changes? **A:** No, by default. If a recurring service appears at price X for some months and price Y for others, do not extrapolate across the price-change boundary unless the user explicitly directs. The Example Booking Co. V2 case did NOT extrapolate the $6,000 → $4,000 Platinum Maintenance era because no $6,000 invoice was observed.

- **Q:** When a defendant signed off on completion before being replaced by another defendant, how should that affect the maintenance-fraud claim? **A:** Strengthen it. The Example Booking Co. V3 evidence (Initial Build Vendor formally signing off across three phases before Offshore Build's MSA) showed that the codebase Offshore Build inherited was substantially complete, making the $4,000–$6,000/month maintenance retainer harder to defend.

- **Q:** Should the 30 LOC/hour base rate be adjusted for the kind of codebase involved? **A:** Stay generous. Use 30 LOC/hr as the base — industry studies place sustained throughput at 10–20 LOC/hr — and apply category multipliers downward (tests 0.7×, config 0.8×, etc.) rather than upward. The 30 LOC/hr base means defendants get the benefit of the doubt; the gap that emerges between billed and delivered hours is still damning.

## Open Questions for Future Iterations

- **Q:** Should the Stinger support non-WordPress marketing-site cases? **A:** Yes — the WordPress-specific CVE database and audit-log parser should be parameterized by CMS. Webflow, Shopify, Squarespace, custom-CMS cases follow the same maintenance-negligence pattern but require different evidence sources.

- **Q:** Should the Stinger include a state-court venue picker beyond Ohio? **A:** Yes — `jurisdiction-{state}.md` files for the top 10 US commercial litigation venues (Delaware, New York, California, Texas, Florida, etc.). For Example Booking Co., only Ohio was needed.

- **Q:** Should the Plain Language Report support analogies beyond house-construction? **A:** Yes — clients in non-construction industries may relate better to "car repair," "kitchen remodel," "tax filing," or other analogies. Parameterize via a `plain-language-analogy: house | car | tax | ...` option in case-facts.

## Sources to Re-research Annually

The CVE database snapshot ages. Refresh annually:
- WPScan / Patchstack / Wordfence for new disclosures
- WordPress.org release notes for new core security releases
- Vendor changelogs for theme/plugin updates

The industry pricing benchmarks age. Refresh every 12–18 months:
- Sprout Social and Rival IQ publish updated benchmark reports
- Hosting prices drift (typically upward)
- Offshore developer rates drift (typically upward by 5–10% per year)

## Audit Trail Summary

Every claim in the guides traces back to:
- A specific CVE entry in `cve-database-snapshot.md` with at least one authoritative source URL
- A specific pricing data point in `industry-pricing.md` with named source
- A specific statutory provision in `jurisdiction-ohio.md` with code citation
- A specific calibration constant in `guides/04-git-log-forensics.md` with rationale

If a guide contains a factual claim that does NOT trace to one of these files, the guide is wrong — fix the guide or add the missing research.
