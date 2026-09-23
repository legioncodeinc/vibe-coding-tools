**L E G I O N**  ·  CODE INC.

# Website Auditor by Legion Code Inc.
## Build plan, forge stage 1 (Topic)

| | |
|---|---|
| **Component** | Plugin: `website-auditor-by-legion-code-inc` |
| **Forged with** | `queen-wasp-stinger`, seven-stage forge pipeline |
| **Target harnesses** | Claude Code, Cursor, ChatGPT Codex, Claude Cowork |
| **Build location** | `C:\Users\mario\OneDrive\Documents\website-audit-toolset` (currently empty) |
| **Status** | **Stage 1 of 7. Awaiting answers before Stage 2 (Research).** |
| **Prepared** | 18 August 2026 |

---

## 0. What this is, and what it is not

This plan turns the AC Direct engagement from a one-off into a repeatable, harness-portable product. That engagement produced three assessments by hand. This tool reproduces that depth for **any** website, on demand, with scoring, evidence capture, and two audiences of report.

**One scoping point that shapes everything below.** The Wasp Nest roster already carries `seo-aeo-wasp-drone`, `security-wasp-drone`, `lighthouse-pagespeed-wasp-drone`, and others. Those Drones are built to **improve a repository you own**: they read source, propose diffs, and run the Ship Gate. This toolset does something different. It **assesses a live third-party website from the outside**, with no source access, no deploy rights, and a hard read-only constraint. Same subject matter, different posture, different guardrails.

So these are **new pairs**, not re-registrations. Where the existing Stingers hold transferable knowledge (the `seo-aeo-stinger` audit checklist, the `security-stinger` vulnerability catalog, the `lighthouse-pagespeed-stinger` measurement discipline) the new Stingers will cite them as related skills and reuse their research archives rather than duplicating them. Question 3 asks you to confirm that reading.

---

## 1. Component inventory

### 1.1 Distribution and entry points

| Component | Type | Name |
|---|---|---|
| Plugin | Plugin | `website-auditor-by-legion-code-inc` |
| Pest Controller Tool | Command | `perform-website-audit` |
| Orchestrator skill | Skill | `master-website-auditor` |
| Rules | Rules | `website-audit-conduct.md` (read-only posture, evidence discipline, no-exploitation law) |

`master-website-auditor` is the fallback path. Per the harness matrix, Cowork has a known slash-invocation gap for plugin `skills/` (bug #46079), and Codex has deprecated prompts in favour of skills. So the command and the master skill carry the **same orchestration logic**, and the plugin ships both. Whichever the harness supports, the run is identical.

### 1.2 Drone and Stinger pairs

Twenty pairs, forty components, grouped by phase. Every Drone loads its Stinger before any work, per the pairing law.

| # | Drone | Stinger | Owns |
|---|---|---|---|
| **Phase 0: Intake** ||||
| 1 | `audit-intake-wasp-drone` | `audit-intake-stinger` | The four questions, folder scaffolding, template hydration, run ledger |
| **Phase 1: Recon, landing page only** ||||
| 2 | `stack-fingerprint-wasp-drone` | `stack-fingerprint-stinger` | Platform and framework identification, rendering mode, confidence scoring |
| 3 | `vendor-inventory-wasp-drone` | `vendor-inventory-stinger` | Third-party script census, tag-manager hydration, content-injection detection |
| **Phase 2: Positioning** ||||
| 4 | `icp-positioning-wasp-drone` | `icp-positioning-stinger` | Niche, focus, goal, ICP, conversion actions, buyer-stage analysis |
| 5 | `keyword-intelligence-wasp-drone` | `keyword-intelligence-stinger` | Trends research, 75 to 100 keywords, 25 to 50 questions, `content-targets/` |
| **Phase 3: Extraction** ||||
| 6 | `site-crawler-wasp-drone` | `site-crawler-stinger` | 100-page crawl, raw HTML and markdown to `site-data/`, sitemap and route discovery |
| **Phase 4: Parallel assessment wave** ||||
| 7 | `technical-seo-wasp-drone` | `technical-seo-stinger` | Structure, metadata, indexation, canonicals, structured data |
| 8 | `aeo-audit-wasp-drone` | `aeo-audit-stinger` | Answer-engine readiness, crawler access, extractable structure, citation signals |
| 9 | `content-semantics-wasp-drone` | `content-semantics-stinger` | Keyword frequency, long-tail semantics, reading level, relevancy to ICP |
| 10 | `internal-linking-wasp-drone` | `internal-linking-stinger` | Link graph, orphan detection, pillar-cluster integrity, anchor quality |
| 11 | `visual-funnel-wasp-drone` | `visual-funnel-stinger` | 25-page journey, desktop and mobile capture, fold analysis, CTA presence |
| 12 | `accessibility-audit-wasp-drone` | `accessibility-audit-stinger` | WCAG conformance, score out of 100, AA and AAA rating |
| 13 | `web-security-posture-wasp-drone` | `web-security-posture-stinger` | Headers, cookies, CSP, TLS, platform exposure, client-side injection sweep |
| 14 | `analytics-stack-wasp-drone` | `analytics-stack-stinger` | Foundational, industry-specific, and de-anonymisation tooling, with jurisdiction flags |
| 15 | `performance-cwv-wasp-drone` | `performance-cwv-stinger` | CDN, caching strategy, Core Web Vitals against field data |
| 16 | `social-presence-wasp-drone` | `social-presence-stinger` | Profile discovery, 7-day content sweep, voice consistency, cadence |
| **Phase 5: Conditional** ||||
| 17 | `blog-content-wasp-drone` | `blog-content-stinger` | 10 recent posts, length, semantics, AI-authorship probability |
| 18 | `ecommerce-catalog-wasp-drone` | `ecommerce-catalog-stinger` | 25 products, metadata, on-page copy, conversion factors |
| **Phase 6: Synthesis** ||||
| 19 | `audit-scoring-wasp-drone` | `audit-scoring-stinger` | Rubric application, XLSX population, formula integrity, grade derivation |
| 20 | `audit-reporting-wasp-drone` | `audit-reporting-stinger` | Customer and auditor reports, Markdown and HTML, Legion branding |

---

## 2. Dependency graph and execution waves

Analysed for genuine data dependency, not conceptual grouping. A task is parallelisable when it needs neither another task's memory nor its source material.

```
                          +-------------------------+
                          | W0  audit-intake        |  SYNC, blocking
                          | 4 questions, scaffold   |
                          +------------+------------+
                                       | landing page fetched once, shared
                    +------------------+------------------+
                    v                                     v
        +-----------------------+          +------------------------+
        | W1a stack-fingerprint |          | W1b vendor-inventory   |  PARALLEL
        +-----------+-----------+          +-----------+------------+
                    +------------------+------------------+
                                       v
                          +-------------------------+
                          | W2  icp-positioning     |  SYNC
                          | * HARD GATE             |  focus undeterminable
                          |                         |  -> STOP, query user
                          +------------+------------+
                                       v
                          +-------------------------+
                          | W3  keyword-intelligence|  SYNC, needs ICP
                          | -> content-targets/     |
                          +------------+------------+
                                       v
                          +-------------------------+
                          | W4  site-crawler        |  SYNC, needs stack type
                          | -> site-data/ (100 pp)  |  for crawl strategy
                          +------------+------------+
                                       v
    +--------+--------+--------+-------+--+--------+--------+--------+--------+
    v        v        v        v          v        v        v        v        v
  tech-    aeo-    content-  internal-  a11y    security  analytics  perf-   visual-
   seo    audit   semantics  linking                                  cwv    funnel
    |        |        |        |          |        |        |        |        |
    +--------+--------+--------+----------+--------+--------+--------+--------+
                          W5, PARALLEL WAVE (9 Drones)
                          all read site-data/, none read each other
                          social-presence also runs here, independent of site-data
                                       |
                                       v
                     +-----------------+-----------------+
                     v                                   v
           +------------------+            +----------------------+
           | W6a blog-content |            | W6b ecommerce-catalog|  CONDITIONAL
           | if blog detected |            | if commerce detected |  PARALLEL
           +--------+---------+            +----------+-----------+
                    +-----------------+-----------------+
                                      v
                          +-------------------------+
                          | W7  audit-scoring       |  SYNC, needs all findings
                          +------------+------------+
                                       v
                          +-------------------------+
                          | W8  audit-reporting     |  SYNC, needs scores
                          +-------------------------+
```

**Critical path:** intake, fingerprint, ICP, keywords, crawl, parallel wave, scoring, reporting. Eight sequential hops with the widest wave nine deep.

**Why these specific serialisations:**

- `keyword-intelligence` after `icp-positioning` because keyword relevance is meaningless without knowing who the customer is.
- `site-crawler` after `stack-fingerprint` because crawl strategy differs by platform. A Shopify store needs `/collections/` and `/products/` traversal; a SvelteKit app needs route-manifest discovery; a WordPress site needs `/wp-json/` and category pagination.
- Everything in W5 reads `site-data/` and writes to its own subfolder, so nine Drones run concurrently with no write contention.
- `visual-funnel` and `social-presence` sit in W5 for wall-clock reasons but depend on neither `site-data/` nor each other.

---

## 3. Shared audit workspace

Named for the domain, per your instruction.

```
www.example.com-audit/
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

Shared artifacts (`site-data/`, `visual/`, `content-targets/`) are written once and read by many. The run ledger is the only file multiple Drones append to, and it is append-only with a per-Drone key to avoid contention.

---

## 4. Scoring rubric

### 4.1 The zero-to-six scale

| Value | Grade | Band | Definition |
|---|---|---|---|
| **0** | N/A | no-op | Audit point not relevant to this site type. **Excluded from both numerator and denominator.** Never counts as a failure. |
| **1** | F | Critical | Absent entirely, or present and critically failing. Blocks revenue, exposes risk, or breaks the function it exists to serve. |
| **2** | D | High | Present but materially broken. Works in some cases and fails in common ones. |
| **3** | C | Medium | Present and meets baseline. Low-severity findings only. Does the job without doing it well. |
| **4** | B minus | Low | Solid implementation. Minor findings a specialist would notice and a customer would not. |
| **5** | B | Cosmetic | Strong. Only cosmetic or preference-level findings remain. |
| **6** | **A** | **None** | **Complete. Zero findings low through critical. Meets or exceeds the current published standard for this checkpoint, verified against the standard cited in the Stinger's research archive.** |

**Boolean checkpoints resolve only to 6 or 1.** Nothing between. A `Strict-Transport-Security` header is present or it is not.

**Every score carries three mandatory fields:** the numeric value, the evidence pointer (file path, URL, header, screenshot), and a one-line justification. Scores without evidence are rejected by the scoring Drone and returned to the originating Drone.

### 4.2 Category weights

Ordered exactly as you specified, descending. Percentages are my proposal, and Question 8 asks you to adjust them.

| Rank | Category | Proposed weight | Contains |
|---|---|---:|---|
| 1 | **Security** | 20% | Headers, TLS, cookies, CSP, platform exposure, client-side injection, payment-path integrity |
| 2 | **Revenue drivers** | 18% | Visual UX and UI (7%), navigation and user journey (6%), on-page copy (5%) |
| 3 | **Mission critical** | 14% | Sub-audit rollup: does the site do the one job it exists to do |
| 4 | **Analytics and insight** | 12% | Foundational (5%), industry-specific (4%), de-anonymisation where lawful (3%) |
| 5 | **Technical deployment** | 11% | CDN (3%), caching strategy (4%), Core Web Vitals (4%) |
| 6 | **Foundational completeness** | 10% | Sub-audit rollup: the table stakes |
| 7 | **Search presence** | 9% | Technical SEO (3.5%), technical AEO (3.5%), subjective copy read (2%) |
| 8 | **Content score** | 6% | Sub-audit rollup: depth, freshness, coverage |
| | **Total** | **100%** | |

**A tension worth naming.** Search presence and content together are 15%, yet they carry the largest number of individual checkpoints and are what most clients think they are buying. Your stated order puts them last, which I have honoured. Question 8 offers three alternatives if you want them to carry more.

### 4.3 Formulas

**Leaf to sub-audit**, N/A-aware:

```
sub_audit_pct = SUMPRODUCT(scores, weights, --(scores>0))
              / (6 * SUMPRODUCT(weights, --(scores>0)))
```

**Sub-audit to category:**
```
category_pct = SUMPRODUCT(sub_audit_pcts, sub_weights) / SUM(sub_weights)
```

**Category to final:**
```
final_pct = SUMPRODUCT(category_pcts, category_weights)
```

**Letter grade:** lookup table. A at 93 and above, A minus at 90, B plus at 87, B at 83, B minus at 80, C plus at 77, C at 73, C minus at 70, D at 60, F below 60.

**Proposed override, Question 9.** Any leaf scoring **1** inside the Security category caps the final grade at **C** regardless of arithmetic. A site with an active critical security finding should not be able to present an A because everything else is tidy.

### 4.4 XLSX template structure

| Sheet | Purpose |
|---|---|
| `Cover` | Branded. Auditor, audited party, business, domain, date, engagement reference |
| `Executive Scorecard` | Final grade, eight category bars, critical-findings count, override banner |
| `Rubric` | The scale table and the weight table. **Editable, drives every formula by named range** |
| `Audit Tree` | Full hierarchy, every leaf, score, weight, evidence pointer, justification |
| `Security` through `Content` | One sheet per category, leaves grouped by sub-audit |
| `Findings Register` | Every finding: ID, severity, category, page, evidence, remediation, effort |
| `Evidence Index` | Artifact map back to the audit workspace |
| `Config` | Named ranges, lookup tables, conditional-format rules, version stamp |

Weights live in named ranges on `Rubric` so you can retune an engagement without touching a formula. Footer on every sheet: *Audit tool created by Legion Code Inc.* with mark and link.

---

## 5. Research plan, forge stage 2

Time-bounded to **June, July, August 2026** as instructed, via EXA and Firecrawl. Raw markdown archived unprocessed into each Stinger's `references/research/raw/`, one file per source, headed with URL, fetch date, and source type.

To avoid twenty redundant sweeps, research is gathered in **nine shared topic clusters** and cross-linked into the Stingers that need it. Each Stinger's archive contains the raw files relevant to it, so every Stinger remains self-contained and portable.

| Cluster | Feeds pairs | Primary sources to sweep |
|---|---|---|
| Platform fingerprinting | 2, 6 | Framework release notes, build-artifact signatures, header conventions |
| Third-party and injection | 3, 13, 14 | Tag-manager behaviour, SEO-injection vendors (Search Atlas and peers), consent tooling |
| SEO standards | 7, 9, 10 | Search Central changelog, structured-data updates, indexing guidance |
| AEO and answer engines | 8, 9 | Citation research, crawler documentation, `llms.txt` status, per-engine behaviour |
| Core Web Vitals and delivery | 15 | web.dev thresholds, CrUX changes, CDN and caching guidance |
| Accessibility | 12 | WCAG version status, EAA enforcement, ARIA practices, testing methodology |
| Web security posture | 13 | OWASP, header guidance, PCI DSS client-side requirements, platform advisories |
| Analytics and de-anonymisation | 14 | Vendor landscape, jurisdictional legality, consent-mode behaviour |
| AI-content detection | 17 | Detection research **and its documented false-positive rates** |

**One honesty note carried into the build.** AI-authorship detection is not reliable enough to state as fact. The `blog-content-stinger` will report it as a **probability band with stated method and error rate**, never as a verdict, and the customer-facing report will not assert that a human-written post was machine-written. Question 14 covers this.

---

## 6. Platform guides and scripts

Per your instruction, one guide and script set per website category, shared where the use case is genuinely shared.

| Guide | Applies to |
|---|---|
| `platform-vibe-react-vite.md` | React, Vite, Postgres |
| `platform-vibe-nextjs.md` | React, Next.js, Postgres |
| `platform-vibe-sveltekit.md` | Svelte, SvelteKit, Postgres |
| `platform-cms-wordpress.md` | WordPress, PHP, MySQL |
| `platform-ecom-shopify.md` | Shopify |
| `platform-ecom-magento.md` | Magento, PHP, MySQL |
| `shared-spa-hydration.md` | All client-rendered stacks |
| `shared-server-rendered.md` | All server-rendered stacks |
| `shared-headless-commerce.md` | Any commerce on a decoupled front end |

Deterministic scripts, harness-portable, no absolute paths:

`fingerprint.py` · `crawl-extract.py` · `vendor-census.py` · `seo-technical.py` · `aeo-technical.py` · `a11y-scan.py` · `security-headers.py` · `cwv-collect.py` · `visual-capture.py` · `score-rollup.py` · `xlsx-populate.py`

**Browser posture.** Desktop Chrome at 1440x900 and mobile Chrome at 390x844 with a real mobile user agent, representing an actual customer session. Screenshots captured at instructed checkpoints and written at the moment of observation, never reconstructed from memory.

---

## 7. Conduct rules, baked into every component

Carried forward from what worked on the AC Direct engagement:

1. **Read-only by default.** No exploitation, no payload, no authentication bypass, no file-upload testing, no order placement. Any step that would create state on the target requires explicit per-run consent.
2. **Evidence at the moment of finding.** Every score and every finding is written when observed, with its artifact path. Nothing is reconstructed later.
3. **Quantified unless labelled subjective.** Subjective judgements are labelled as such and separated in both the rubric and the reports.
4. **Verification log is a deliverable.** Candidates that fail verification are recorded as rejected, with the reason. On AC Direct that log caught two findings that would have been material errors.
5. **Confidence stated, not implied.** Anything that cannot be determined externally is reported as requiring internal verification, never as a confirmed defect.
6. **The hard gate holds.** If the site's focus and subject cannot be determined, the run stops and asks. That is a critical failure, not a low-confidence guess.

---

## 8. Build sequence and effort

Following the seven-stage forge pipeline, no skipping.

| Stage | Work | Rough effort |
|---|---|---|
| 1 · Topic | **This document. Awaiting your answers.** | done |
| 2 · Research | Nine clusters, EXA and Firecrawl, raw archive per Stinger | large |
| 3 · Distillation | Cited distillation per cluster, conflicts flagged | large |
| 4 · References | Rubric tables, XLSX template, report templates, scripts | large |
| 5 · Guides | Platform guides, per-verb procedural guides | large |
| 6 · Component files | 20 Drones, 20 Stingers, command, master skill, rules, plugin manifest, then validation for all four harnesses | very large |
| 7 · Register | Pair registration in `pest-controller-suit`, deploy, sync references | medium |

**This is a multi-session build.** I would rather say so now than discover it at hour six. Question 20 asks how you want to sequence it: everything at once, or a walking skeleton first (intake, fingerprint, SEO, scoring, report) that runs end to end on a real site, with the remaining pairs added in waves. My recommendation is the skeleton, because it surfaces integration problems while they are still cheap.

---

## 9. Questions

Answer in any format. Numbered so you can reply against them selectively, and anything you skip I will proceed on with the stated default.

### Scope and ownership

**Q1.** The build target is `C:\Users\mario\OneDrive\Documents\website-audit-toolset`, currently empty. Should the plugin be developed there and later synced into the `vibe-coding-tools` plugin tree, or authored directly inside `vibe-coding-tools` from the start?
*Default: build in the toolset folder, sync on completion.*

**Q2.** Is this plugin for Legion Code Inc. internal use only, or will it be distributed to clients or published to a marketplace? This changes how much Legion branding is baked in versus configurable.
*Default: internal, with branding configurable via plugin settings.*

**Q3.** Do you agree these are new Drone and Stinger pairs rather than extensions of the existing `seo-aeo-wasp-drone` and `security-wasp-drone`, on the reasoning in section 0?
*Default: new pairs, cross-linked to the existing ones as related skills.*

**Q4.** Twenty pairs is my read of "each audit type and step." Is that the right granularity, or would you prefer fewer, larger Drones (say eight, one per audit domain)?
*Default: twenty.*

### The audit itself

**Q5.** Crawl depth is specified at 100 pages for SEO and AEO, 25 for the visual funnel, 25 products, 10 blog posts. Should these be **hard limits** or **configurable defaults** the auditor can raise per engagement?
*Default: configurable, with those as defaults.*

**Q6.** Google Trends has no stable public API and blocks automated access aggressively. Acceptable fallbacks, in order of preference: EXA and Firecrawl over ranking and question sources, the target's own search data if the client provides Search Console access, or a paid keyword API. Which do you want as primary, and do you have credentials for any paid source?
*Default: EXA plus Firecrawl, clearly labelled as inferred rather than Trends-sourced.*

**Q7.** For the social audit, private or login-walled profiles cannot be read. You specified marking those as no-op and excluding from score. Confirm that also applies when a profile **exists but is empty**, versus **cannot be found at all**? I would score those differently: found-but-dormant is a finding, not-found is a no-op.
*Default: found-but-dormant scores, not-found is no-op.*

### Scoring

**Q8.** The weights in section 4.2. Take one:
- **(a)** Accept as proposed.
- **(b)** Compress the spread so nothing dominates: 16, 15, 14, 12, 12, 11, 11, 9.
- **(c)** Raise search and content to reflect checkpoint count: Security 20, Revenue 17, Search 13, Mission 12, Analytics 10, Technical 10, Foundational 9, Content 9.
- **(d)** Give me your own numbers.

*Default: (a).*

**Q9.** The critical-security override in 4.3: any Security leaf scoring 1 caps the final grade at C. Adopt, adjust the cap, or drop?
*Default: adopt.*

**Q10.** Should the XLSX include **trend columns** so a re-audit of the same domain can be dropped alongside the prior run and show movement per checkpoint?
*Default: yes, add a comparison sheet keyed on checkpoint ID.*

**Q11.** Do you want a **monetary or effort estimate** column on the findings register (hours or cost to remediate), or is severity plus priority enough?
*Default: effort in hours, three bands.*

### Reports

**Q12.** The customer-facing report: how technical is the reader? On AC Direct I wrote for a dev team. A small-business owner needs a different register.
*Default: two registers, selectable at run time, defaulting to technical.*

**Q13.** Should the customer report include the **verification log** of discarded candidates? It builds trust but adds length and can read as hedging to a non-technical reader.
*Default: auditor report always, customer report only in technical register.*

**Q14.** Confirm the AI-content detection posture in section 5: probability band with stated method and error rate, never a verdict, and absent from the customer report unless the band is high-confidence?
*Default: as stated.*

**Q15.** Reports currently follow the Legion light theme, since these are signed client deliverables. Keep light for both audiences, or dark for the auditor report and light for the customer?
*Default: light for both.*

### Conduct and legal

**Q16.** The read-only law in section 7 forbids anything that creates state on the target. But the AC Direct engagement needed a cart to reach checkout. Should the tool support an **opt-in interactive mode** with explicit per-run consent for funnel testing, or stay strictly passive?
*Default: opt-in, consent recorded in the intake record, defaulting to off.*

**Q17.** Should the tool require **written authorisation from the audited party** to be recorded at intake before a security-posture audit runs? Assessing a site you do not own has a legal dimension.
*Default: yes, a recorded authorisation field, with an unauthenticated-passive-only mode when absent.*

**Q18.** De-anonymisation tooling is legally restricted in several jurisdictions. Should the analytics Drone **score its absence as a gap** everywhere, or only where lawful, treating it as N/A elsewhere?
*Default: N/A where restricted, and flag the jurisdiction question in the report.*

### Build sequencing

**Q19.** Which harnesses must pass validation for v1? All four costs meaningfully more than Claude Code plus Cowork.
*Default: all four, per the portability rule.*

**Q20.** Build order. Take one:
- **(a)** **Walking skeleton first.** Intake, fingerprint, technical SEO, scoring, reporting: five pairs that run end to end on a real site. Then add the remaining fifteen in waves. **Recommended.**
- **(b)** Research everything first, then build all twenty.
- **(c)** Build by phase, validating each wave before the next.

*Default: (a).*

**Q21.** Do you want a live test target for the skeleton? `acdirect.com` is the obvious candidate, since we can check the tool's output against the hand-built assessment and see where it disagrees.
*Default: yes, `acdirect.com` as the regression fixture.*

**Q22.** Does this build run the Ship Gate (`security-stinger`, then `quality-stinger`, then `github-repo-health-stinger`) before anything is committed? It is a development-focused component, so by the architecture it should.
*Default: yes, full Ship Gate, with your approval before any commit or push.*

---

**L E G I O N**  ·  CODE INC.

**Legion Code Inc.** · Build plan · 18 August 2026
*Forge stage 1 of 7. No component authored until these answers land.*
