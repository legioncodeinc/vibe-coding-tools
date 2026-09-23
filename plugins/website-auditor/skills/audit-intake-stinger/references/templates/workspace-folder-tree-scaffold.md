# Workspace folder-tree scaffold spec

The exact folder tree `audit-intake-wasp-drone` must create for every new engagement, reproduced verbatim from the build plan's section 3 ("Shared audit workspace"). Source: `plan/website-auditor-build-plan.md` section 3. This is a product-decision mechanic from the build plan, not a research question, so it is cited to the build plan rather than to `references/research/raw/`.

Root folder name: `www.<domain>-audit/`, where `<domain>` is derived from the website URL recorded at Question 4 (strip scheme, strip `www.` prefix if present, strip any path/query/fragment). This exact derivation rule is not spelled out character-by-character in the build plan; treat the build plan's own worked example (`www.example.com-audit/` for `example.com`) as the pattern and flag any edge case (a URL with a port, a subdomain that isn't `www`, an IP-address host) to the user rather than guessing silently, since no source addresses domain-to-folder-name derivation for edge cases.

```
www.<domain>-audit/
├── README.md                    run manifest, dependency state, completion ledger
├── _shared/
│   ├── run-ledger.json          per-Drone status, timestamps, artifact paths
│   ├── target-profile.json      platform, rendering, stack, confidence
│   └── evidence-index.md        every artifact, what produced it, when
├── 00-intake/                   the four recorded answers, engagement reference
├── 01-recon/
│   ├── stack-fingerprint.md
│   └── vendor-inventory.md      plus injection-detection findings
├── 02-positioning/              niche, ICP, conversion actions, buyer stages
├── content-targets/             keywords.md, questions.md, trends-raw/
├── site-data/                   <slug>.html and <slug>.md per crawled page
├── visual/
│   ├── desktop/                 1440x900 captures
│   └── mobile/                  390x844 captures
├── 03-seo/    04-aeo/    05-funnel/    06-accessibility/
├── 07-security/    08-analytics/    09-performance/    10-social/
├── 11-blog/                     conditional
├── 12-ecommerce/                conditional
├── scoring/
│   ├── audit-scorecard.xlsx     populated from the template
│   └── findings-register.csv
└── reports/
    ├── customer-report.md and .html
    └── auditor-report.md and .html
```

## Scaffolding rules (PRD-002 AC-2)

- Every subfolder in the tree above must exist after scaffolding completes, including subfolders later Drones will write into (`01-recon/`, `02-positioning/`, `content-targets/`, `site-data/`, `visual/desktop/`, `visual/mobile/`, `03-seo/` through `12-ecommerce/`, `scoring/`, `reports/`). Empty is fine. Missing is not (AC-2 exact wording).
- Only `audit-intake-wasp-drone` populates content in `00-intake/` and `_shared/`. Every other subfolder is created empty; the Drone that owns it writes its own content later.
- `11-blog/` and `12-ecommerce/` are created even though they are conditional per the build plan's W6a/W6b wave; conditionality affects whether a later Drone runs, not whether the folder exists at scaffold time. This reading follows directly from AC-2's "even the ones later Drones will write into" wording; it is an application of the stated acceptance criterion, not a separate judgment call.

## What this Drone does NOT touch

Once scaffolding completes, `audit-intake-wasp-drone` does not write into any subfolder other than `00-intake/` and `_shared/`. Per the shared-workspace contract in `prd-002-audit-intake-index.md`, its writes are: `README.md`, `_shared/run-ledger.json`, `_shared/target-profile.json` (stub), `_shared/evidence-index.md` (stub), `00-intake/` (the four recorded answers, engagement reference).
