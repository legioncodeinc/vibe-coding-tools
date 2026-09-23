{# ============================================================================
   AUDITOR REPORT TEMPLATE (Markdown)
   audit-reporting-stinger / prd-021-audit-reporting

   Template syntax: identical convention documented in full at the top of
   customer-report-template.md - double-brace variables, percent-brace
   for/endfor and if/endif blocks, and hash-brace comment markers. Not
   repeated here in full to avoid duplication; read that file's header once.

   STRUCTURE RATIONALE: adapted from ForensicSpot's security-audit-report
   shape (distilled-audit-reporting.md section 2), the most granular
   structure found in this Stinger's research - Scope & Methodology,
   Executive Summary, Summary of Findings, Detailed Findings, Management
   Responses, Appendices - six sections, extended here with a seventh:
   Verification Log, required by this plugin's conduct rule 4 ("Verification
   log is a deliverable," build plan section 7) and prd-021's Goals section
   ("the verification log of rejected/reframed candidates"). The per-finding
   format below (issue statement, evidence, risk rating + justification,
   impact, recommendation) follows ForensicSpot's five-part finding format,
   and the finding-vs-observation distinction is ForensicSpot's vocabulary,
   both cited in distilled-audit-reporting.md section 4.
============================================================================ #}

# {{ report.client_name }} - Website Audit: Auditor Report

**Domain audited:** {{ report.domain }}
**Audit date:** {{ report.audit_date }}
**Auditor:** {{ report.auditor_name }}, Legion Code Inc.
**Engagement reference:** {{ report.engagement_ref }}
**Companion document:** `reports/customer-report.md` / `.html` (executive-summary register, same underlying findings)

---

## 1. Scope & methodology

{{ report.scope_paragraph }}

- **Audit workspace:** `{{ report.workspace_root }}`
- **Categories audited:** {{ report.categories_audited_list }}
- **Scoring scale:** 0 (not applicable, excluded from numerator and denominator) through 6 (no findings, meets or exceeds the current published standard). Boolean checkpoints resolve only to 1 or 6, never a value between.
- **Category weights:** Security 20%, Revenue drivers 18%, Mission critical 14%, Analytics and insight 12%, Technical deployment 11%, Foundational completeness 10%, Search presence 9%, Content score 6%.
- **Critical-security override:** any Security-category leaf scoring 1 caps the final letter grade at C regardless of the arithmetic rollup.
- **Conduct posture:** read-only/passive by default; every finding's evidence was captured at the moment of observation (artifact path, URL, header, or screenshot), never reconstructed from memory; subjective judgements are labelled `[subjective]` and kept separate from quantified findings.
- **Source of record:** every finding below is rendered from `scoring/findings-register.csv` and `scoring/audit-scorecard.xlsx`; this report generation step does not add, remove, or reweight a finding.

---

## 2. Executive summary

{{ report.executive_summary_paragraph }}

Overall grade: **{{ scorecard.overall_grade }} ({{ scorecard.overall_percent }}%)**{% if scorecard.override_triggered %} - capped by the critical-security override, triggered by: {{ scorecard.override_triggering_finding }}{% endif %}

---

## 3. Summary of findings

| ID | Title | Category | Type | Severity | Status |
|---|---|---|---|---|---|
{% for finding in findings %}
| {{ finding.id }} | {{ finding.title }} | {{ finding.category }} | {{ finding.type }} | {{ finding.severity_label }} | {{ finding.status }} |
{% endfor %}

---

## 4. Detailed findings

{% for finding in findings %}
### {{ finding.id }} - {{ finding.title }}

- **Category / sub-audit:** {{ finding.category }} / {{ finding.sub_audit }}
- **Type:** {{ finding.type }} {% if finding.subjective %}`[subjective]`{% endif %}
- **Severity:** {{ finding.severity_label }} (score {{ finding.severity_score }}/6)
- **Issue statement:** {{ finding.issue_statement }}
- **Evidence pointer:** `{{ finding.evidence_pointer }}`
- **Justification:** {{ finding.justification }}
- **Impact:** {{ finding.impact }}
- **Recommendation:** {{ finding.recommendation }}
- **Owner / target date:** {{ finding.owner }} / {{ finding.target_date }}

{% endfor %}

---

## 5. Management responses

| ID | Owner response | Accepted | Remediation date |
|---|---|---|---|
{% for response in management_responses %}
| {{ response.finding_id }} | {{ response.response_text }} | {{ response.accepted }} | {{ response.remediation_date }} |
{% endfor %}

---

## 6. Verification log

Every candidate finding that did not survive verification is recorded here with the reason, per this engagement's conduct rules (rejected/reframed candidates are logged, never silently dropped). This section exists in the auditor report by default; see `guides/04-verification-log-procedure.md` for what gets logged and why it is not optional.

| Candidate ID | Original claim | Disposition | Reason |
|---|---|---|---|
{% for entry in verification_log %}
| {{ entry.candidate_id }} | {{ entry.original_claim }} | {{ entry.disposition }} | {{ entry.reason }} |
{% endfor %}

{% if verification_log_empty %}
No candidate findings were rejected or reframed during this engagement.
{% endif %}

---

## 7. Appendices

- **Evidence index:** `{{ report.evidence_index_path }}` - every artifact referenced above, what produced it, and when.
- **Full scorecard:** `{{ report.scorecard_path }}`
- **Findings register (machine-readable):** `{{ report.findings_register_path }}`
- **Workspace root:** `{{ report.workspace_root }}`

---

*{{ brand.footer.credit_line }} - {{ brand.web }} - {{ brand.footer.note }}*
