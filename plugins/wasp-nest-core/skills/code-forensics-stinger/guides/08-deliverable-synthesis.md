# Phase 7 — Synthesis Into Deliverables

## Goal
Produce the final document deliverables by reading `case-facts.json` and the intermediate outputs from Phases 1–6, then filling the templates in `assets/templates/reports/`.

## Deliverable list

1. `{ProjectName}_Forensic_Report.docx/.pdf` — master 7-part report (~40 pages)
2. `{ProjectName}_ADA_Forensic_Report.docx/.pdf` — agency-services subreport (~25 pages)
3. `{ProjectName}_Attorney_Legal_Memo.docx/.pdf` — privileged work product (~25 pages)
4. `{ProjectName}_Plain_Language_Report.docx/.pdf` — 8th-grade-level client report (~25 pages)
5. `{ProjectName}_Invoice_Forensics.xlsx` — already built in Phase 2
6. `pre-litigation-pack/` — built in Phase 8

## Methodology

### Step 1: Load `case-facts.json`

The Node docx builders read this file to substitute placeholders. Ensure it contains all the keys listed in `references/phase-0-intake.md`. If any are missing, fill them in (or set to null and the templates will note "(pending)").

### Step 2: Run the docx builders

```bash
cd /path/to/case-workspace
node /path/to/skill/scripts/build_master_report.js
node /path/to/skill/scripts/build_ada_report.js
node /path/to/skill/scripts/build_attorney_memo.js
node /path/to/skill/scripts/build_plain_language.js
```

Each script:
1. Reads `case-facts.json` from the current working directory
2. Reads the template skeleton from `assets/templates/reports/`
3. Substitutes placeholders
4. Writes the .docx file to `forensic-output/`

### Step 3: Convert to PDF

```bash
cd forensic-output
for f in *.docx; do
    soffice --headless --convert-to pdf "$f"
done
```

### Step 4: Build the README and Sources documents

```bash
python /path/to/skill/scripts/build_readme.py
python /path/to/skill/scripts/build_sources.py
```

The `build_sources.py` script writes a `Sources_and_References.md` file with all the external sources used. It pulls from the WebSearch citations captured during Phase 4 (CVE research) plus the static industry-pricing benchmarks.

### Step 5: Build the master zip

```bash
python /path/to/skill/scripts/build_master_zip.py \
    --project-name "{ProjectName}" \
    --output-dir /path/to/parent
```

The zip is named `{ProjectName}_Forensic_Packet_{YYYYMMDD}.zip` and contains the entire `forensic-output/` folder.

## Template placeholders

All four report templates use the same set of placeholders, which are substituted from `case-facts.json`:

| Placeholder | Source | Example |
|---|---|---|
| `{PROJECT_NAME}` | intake | "Pioneer AMS" |
| `{CLIENT_LEGAL_NAME}` | intake | "Pioneer AMS LLC" |
| `{CLIENT_PRINCIPAL}` | intake | "Jane Doe" |
| `{CLIENT_ADDRESS}` | intake | "..." |
| `{ENGAGEMENT_START_DATE}` | intake | "Nov 21, 2021" |
| `{ENGAGEMENT_END_DATE}` | intake | "May 1, 2026" |
| `{ENGAGEMENT_MONTHS}` | computed | 53 |
| `{ORIGINAL_CONTRACT_VALUE}` | intake | "$32,329" |
| `{DOCUMENTED_INVOICE_TOTAL}` | Phase 2 | "$80,985.51" |
| `{EXTRAPOLATED_INVOICE_TOTAL}` | Phase 2 | "$51,235.96" |
| `{DOCUMENTED_PLUS_EXTRAPOLATED}` | Phase 2 | "$132,221.47" |
| `{CLIENT_SPEND_LOW}`, `{CLIENT_SPEND_HIGH}` | intake | "$160,000", "$224,000" |
| `{GIT_TOTAL_COMMITS}` | Phase 3 | 534 |
| `{GIT_HOURS_DELIVERED}` | Phase 3 | 648 |
| `{GIT_HOURS_DELIVERED_AT_100}` | Phase 3 | "$64,784" |
| `{GIT_IDLE_MONTHS}` | Phase 3 | 4 |
| `{GIT_LOW_MONTHS}` | Phase 3 | 6 |
| `{MAINTENANCE_OVERPAYMENT}` | computed | "$150,600" |
| `{DEMAND_AMOUNT_ADA_LOW}`, `{DEMAND_AMOUNT_ADA_HIGH}` | computed | "$71,840", "$88,340" |
| `{DEMAND_AMOUNT_DEVPIPE}` | computed | "$200,600" |

## Style conventions

All four reports follow these style rules (consistent across the suite):

- **Font:** Arial, 11pt body, 14pt H1, 12pt H2, 11pt H3
- **Page:** US Letter (12240 x 15840 DXA), 0.75" margins
- **Color palette:**
  - Primary headings: #1F4E78 (deep blue)
  - Accent: #2E75B6 (medium blue)
  - Red highlights for damaging findings: #C00000
  - Green highlights for positive: #548235
  - Amber for cautions: #BF9000
- **Tables:** WidthType.DXA always (not percentage), 1px CCCCCC borders, header row shaded #1F4E78 with white bold text
- **Headers:** Each section has a confidentiality header like "Example Booking Co. Forensic Investigation — CONFIDENTIAL — Version 2 (May 15, 2026)"
- **Footers:** "Page N of TOTAL" centered, gray

## Report-specific notes

### Master Forensic Report
- 7 parts (Phases 1–7 of the investigation mapped to Parts 1–7 of the report)
- Heavy on tables. Each phase produces at least one summary table.
- Plus Appendix A (Forensic Packet Contents) and Appendix B (Methodology Notes for Counsel)

### ADA Forensic Report
- 7 sections covering ONLY the agency-services side
- Section 3 is the CVE timeline. Section 4 is the marketing analysis. Section 5 is the Virtual Assistant fraud.
- Standalone — readable without the master report

### Attorney Legal Memo
- ATTORNEY-CLIENT PRIVILEGED & CONFIDENTIAL header at the top of every page
- Section structure: I. Purpose, II. Statement of Facts, III. Causes of Action, IV. Damages Summary, V. Strategic Recommendations, VI. Evidence Index, VII. Closing Observation
- Causes of action are A. Fraud, B. Breach of Contract, C. Gross Negligence, D. Ohio CSPA, E. Unjust Enrichment
- Specific Ohio statutory citations: ORC § 1345.01 et seq. (CSPA)

### Plain Language Report
- 8th-grade reading level (target ~70 on Flesch-Kincaid Reading Ease)
- Heavy use of the "house construction" analogy throughout
- Color callouts for "what this means for you" sections
- No legal jargon without immediate explanation
- Friendly, supportive tone toward the client
- Ends with an explicit "what to do NOT do" list and a "bright side" section

## Quality checks

Before declaring Phase 7 complete:
- [ ] All four .docx files open cleanly in Microsoft Word AND LibreOffice
- [ ] All four .pdf files render correctly
- [ ] No placeholders remain in the output (search for `{` to verify)
- [ ] All dollar amounts are consistent across the four reports
- [ ] All dates are consistent across the four reports
- [ ] Footnote/citation count matches what was claimed in the reports
- [ ] The master README enumerates all top-level files
- [ ] The master zip includes everything in `forensic-output/`

## Common pitfalls

- **Placeholders not substituted.** Double-check the build scripts process `{PLACEHOLDER}` syntax. If you see `{PROJECT_NAME}` in the output, the template substitution failed.
- **Numbers inconsistent across reports.** The plain-language report rounds aggressively ("about $130,000") while the attorney memo uses exact figures ("$132,221.47"). This is intentional. But make sure the same fact is consistently reported (not "$80,000" in one and "$80,985" in another for the same line).
- **LibreOffice doesn't render some Word styles.** Test the .docx in both LibreOffice (for the soffice PDF conversion path) AND a Word/Google Docs preview.
