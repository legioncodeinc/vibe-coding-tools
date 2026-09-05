# Introduction - OWASP Top 10:2025

- URL: https://owasp.org/Top10/2025/0x00_2025-Introduction/
- Fetched: 2026-08-14
- Source type: official standard (OWASP)
- Component: cross-cutting vulnerability taxonomy

## Content

The 2025 edition is the 8th installment of the OWASP Top 10. Full list:

1. A01:2025 - Broken Access Control - maintains #1. On average 3.73% of applications tested had one or more of the 40 CWEs in this category. Server-Side Request Forgery (SSRF) has been rolled into this category for 2025 (it was A10:2021 previously).
2. A02:2025 - Security Misconfiguration - moved up from #5 (2021) to #2 (2025). 3.00% of applications tested had one or more of the 16 CWEs in this category.
3. A03:2025 - Software Supply Chain Failures - new category name/emphasis for 2025, covering dependency and build-pipeline compromise.
4. A04:2025 - Cryptographic Failures
5. A05:2025 - Injection - falls two spots from #3 (2021) to #5 (2025), still one of the most tested categories with the greatest number of CVEs associated with its CWEs.
6. A06:2025 - Insecure Design - slides from #4 to #6 as Security Misconfiguration and Software Supply Chain Failures overtook it; introduced in 2021, industry has improved on threat modeling since.
7. A07:2025 - Authentication Failures - maintains #7, renamed from "Identification and Authentication Failures" to reflect its 36 CWEs. Increased use of standardized auth frameworks appears to be reducing incidence.
8. A08:2025 - Software or Data Integrity Failures - continues at #8, focused on failing to maintain trust boundaries and verify integrity of software/code/data artifacts (distinct from and lower-level than Software Supply Chain Failures).
9. A09:2025 - Security Logging & Alerting Failures - retains #9, renamed from "Security Logging and Monitoring Failures" to emphasize alerting specifically. Great logging with no alerting has minimal value for incident detection. Chronically underrepresented in raw data, voted into the list by community survey.
10. A10:2025 - Mishandling of Exceptional Conditions - new category for 2025. Contains 24 CWEs focused on improper error handling, logical errors, failing open, and related scenarios stemming from abnormal/unexpected conditions.

Two new categories in 2025 versus 2021: Software Supply Chain Failures (A03) and Mishandling of Exceptional Conditions (A10). One consolidation: SSRF folded into Broken Access Control (A01).

Categories can have multiple applicable CWEs because different organizations/testers may use different CWEs for a conceptually similar finding (e.g. multiple CWEs for general Injection), which is why the Top 10 groups by category rather than single CWE.
