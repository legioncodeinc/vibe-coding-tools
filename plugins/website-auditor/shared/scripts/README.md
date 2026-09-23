Deterministic, harness-portable scripts shared across multiple Stingers, per the build plan's "shared where the use case is genuinely shared" instruction. No absolute paths. Each Stinger's `references/scripts/README.md` points here rather than duplicating a copy.

| Script | Used by |
|---|---|
| `fingerprint.py` | stack-fingerprint-stinger |
| `crawl-extract.py` | site-crawler-stinger |
| `vendor-census.py` | vendor-inventory-stinger |
| `seo-technical.py` | technical-seo-stinger |
| `aeo-technical.py` | aeo-audit-stinger |
| `a11y-scan.py` | accessibility-audit-stinger |
| `security-headers.py` | web-security-posture-stinger |
| `cwv-collect.py` | performance-cwv-stinger |
| `visual-capture.py` | visual-funnel-stinger |
| `score-rollup.py` | audit-scoring-stinger |
| `xlsx-populate.py` | audit-scoring-stinger |
