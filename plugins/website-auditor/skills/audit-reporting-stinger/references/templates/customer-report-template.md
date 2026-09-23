{# ============================================================================
   CUSTOMER REPORT TEMPLATE (Markdown)
   audit-reporting-stinger / prd-021-audit-reporting

   TEMPLATE SYNTAX (documented once here, identical across all four templates):
     {{ path.to.value }}            variable substitution, dot-notation lookup
                                     into the data dict passed to the renderer.
     {% for item in list_path %}    repeats the block once per item in the
       ...                          list at list_path, exposing `item` inside
     {% endfor %}                   the block body.
     {% if flag_path %}             includes the block only when the value at
       ...                          flag_path is truthy.
     {% endif %}
     a hash-brace comment marker        stripped entirely, never rendered
     (open with curly-brace-hash, close with hash-curly-brace).
   This is a Jinja2-style convention, rendered here by the small hand-rolled
   engine in references/scripts/render-report.py (no external templating
   dependency required). Nothing below the syntax note reflects real findings
   until a rendering pass substitutes real data from
   scoring/findings-register.csv, scoring/audit-scorecard.xlsx, and
   _shared/evidence-index.md.

   STRUCTURE RATIONALE: executive-summary-first, per the IIA toolkit's
   Standard-2420-derived content requirements (distilled-audit-reporting.md
   section 3) - self-contained, no technical jargon, states critical findings
   by title and the single most important required action. The AI-authorship
   and de-anonymization disclosure is its own section per prd-021 AC-2: it
   must be stated plainly, never omitted or vagued out, even in the
   plain-language customer register.
============================================================================ #}

# {{ report.client_name }} - Website Audit: Executive Summary

**Prepared for:** {{ report.client_name }}
**Domain audited:** {{ report.domain }}
**Audit date:** {{ report.audit_date }}
**Prepared by:** {{ report.auditor_name }}, Legion Code Inc.

---

## Executive Summary

{{ report.executive_summary_paragraph }}

**Overall site health: {{ scorecard.overall_grade }} ({{ scorecard.overall_percent }}%)**
*Methodology: weighted rollup across eight audit categories, zero-to-six scale per checkpoint. See "How this score is calculated" below.*

The three most urgent items, in priority order:

{% for item in top_priorities %}
{{ item.rank }}. **{{ item.title }}** - {{ item.one_line_reason }} ([full detail](#{{ item.anchor }}))
{% endfor %}

**Most important action right now:** {{ report.single_most_important_action }}

{% if scorecard.trend_available %}
**Trend since the last audit ({{ scorecard.previous_audit_date }}):** {{ scorecard.trend_summary }}
{% endif %}

---

## How this score is calculated

Every checkpoint is scored 0 (not applicable, excluded from the score) through 6 (no findings, meets or exceeds the current published standard). Scores roll up through eight weighted categories - security carries the largest single weight, followed by the revenue-driving pages, the site's core function, analytics, technical deployment, foundational completeness, search presence, and content. A single Critical security finding caps the overall grade at C regardless of every other category's arithmetic, on the reasoning that a serious security gap outweighs strength elsewhere. Full weighting is in the auditor report's Scope & Methodology section.

| Category | Grade | Score |
|---|---|---|
{% for category in scorecard.categories %}
| {{ category.name }} | {{ category.grade }} | {{ category.percent }}% |
{% endfor %}

---

## Key findings, in plain terms

Findings below are grouped by the part of your business they affect, not by technical category, and translated out of technical language. Full technical detail, evidence, and file/URL-level pointers are in the companion auditor report; this section is intentionally free of raw technical dumps.

{% for finding in customer_findings %}
### {{ finding.anchor_heading }}

**What we found:** {{ finding.plain_language_summary }}

**Why it matters:** {{ finding.business_impact }}

**What it would take to fix:** {{ finding.remediation_summary }} ({{ finding.effort_band }})

{% endfor %}

---

## AI-authorship and de-anonymization disclosure

{% if report.ai_authorship_finding_present %}
**AI-generated content likelihood:** {{ report.ai_authorship_probability_band }} probability, based on {{ report.ai_authorship_method }} (stated error rate: {{ report.ai_authorship_error_rate }}). This is a probability band from an imperfect detection method, not a verdict - see the auditor report for the full method writeup.
{% else %}
No AI-authorship signal was flagged at a reportable confidence level for this engagement.
{% endif %}

{% if report.deanonymization_finding_present %}
**De-anonymization tooling:** {{ report.deanonymization_category }} tooling was detected on the site ({{ report.deanonymization_summary }}). This is disclosed here plainly per this engagement's conduct rules, regardless of whether it is favorable or unfavorable to report.
{% else %}
No de-anonymization tooling was detected during this engagement.
{% endif %}

---

## Prioritized recommendations

| Priority | Recommendation | Estimated effort | Estimated timeline |
|---|---|---|---|
{% for rec in recommendations %}
| {{ rec.priority_tier }} | {{ rec.title }} | {{ rec.effort_band }} | {{ rec.timeline }} |
{% endfor %}

Quick wins ({{ recommendations_summary.quick_win_count }} items, low effort) are listed first and can typically ship within {{ recommendations_summary.quick_win_window }}. Larger initiatives are sequenced after, with owners and target dates to be agreed at the readout meeting.

---

## Next steps

{{ report.next_steps_paragraph }}

Questions about any finding in this report: contact {{ report.auditor_name }} at {{ brand.email }}.

---

*{{ brand.footer.credit_line }} - {{ brand.web }}*
