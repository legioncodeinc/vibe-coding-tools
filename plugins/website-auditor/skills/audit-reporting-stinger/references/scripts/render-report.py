#!/usr/bin/env python3
"""
render-report.py - minimal, dependency-free demonstration of the
Markdown-to-branded-HTML rendering approach for audit-reporting-stinger
(prd-021-audit-reporting).

This is a working example, not a production renderer. It exists to prove the
templating approach described in
skills/audit-reporting-stinger/guides/02-markdown-to-html-rendering.md
actually runs, using a small sample data dict standing in for real content
that would come from scoring/findings-register.csv, scoring/audit-scorecard.xlsx,
and _shared/evidence-index.md in a real engagement's audit workspace.

Pipeline, per template pair:
  1. Render the .md template (Jinja2-style {{ }}/{% %} placeholders, see the
     header comment in customer-report-template.md for the full syntax) with
     the data dict -> final Markdown text.
  2. Convert that Markdown text to an HTML fragment (a small hand-rolled
     converter below - headers, bold/italic, inline code, links, unordered
     lists, tables, blockquotes, horizontal rules, paragraphs; enough for
     these four templates, not a general-purpose Markdown implementation).
  3. Render the matching .html shell template with the same data dict plus
     `content` set to that HTML fragment -> final self-contained HTML page.

No external dependencies (no jinja2, no markdown package) so this runs
anywhere Python 3 runs. Run directly:

    python3 render-report.py

It renders both the customer and auditor pairs from a sample data dict,
writes the four output files into a temp directory, prints their paths and a
short preview, and exits 0. Nothing is written back into this repo.
"""

from __future__ import annotations

import html
import json
import re
import sys
import tempfile
from pathlib import Path

TEMPLATES_DIR = Path(__file__).resolve().parent.parent / "templates"


# ---------------------------------------------------------------------------
# 1. Tiny Jinja2-style template engine ({{ var }}, {% for %}, {% if %}, {# #})
# ---------------------------------------------------------------------------

_COMMENT_RE = re.compile(r"\{#.*?#\}", re.DOTALL)
_FOR_RE = re.compile(
    r"\{%\s*for\s+(\w+)\s+in\s+([\w\.]+)\s*%\}(.*?)\{%\s*endfor\s*%\}", re.DOTALL
)
_IF_RE = re.compile(r"\{%\s*if\s+([\w\.]+)\s*%\}(.*?)\{%\s*endif\s*%\}", re.DOTALL)
_VAR_RE = re.compile(r"\{\{\s*([\w\.]+)\s*\}\}")


def _lookup(path: str, context: dict):
    """Dot-notation lookup, e.g. 'finding.evidence_pointer' into a dict tree."""
    current = context
    for part in path.split("."):
        if isinstance(current, dict):
            current = current.get(part)
        else:
            return None
        if current is None:
            return None
    return current


def render_template(template_text: str, context: dict) -> str:
    """Render a Jinja2-style template string against a data dict."""
    text = _COMMENT_RE.sub("", template_text)

    def _render_for(match: "re.Match[str]") -> str:
        var_name, list_path, body = match.groups()
        items = _lookup(list_path, context) or []
        rendered_items = []
        for item in items:
            local_context = dict(context)
            local_context[var_name] = item
            rendered_items.append(render_template(body, local_context))
        return "".join(rendered_items)

    text = _FOR_RE.sub(_render_for, text)

    def _render_if(match: "re.Match[str]") -> str:
        cond_path, body = match.groups()
        value = _lookup(cond_path, context)
        return render_template(body, context) if value else ""

    text = _IF_RE.sub(_render_if, text)

    def _render_var(match: "re.Match[str]") -> str:
        value = _lookup(match.group(1), context)
        return "" if value is None else str(value)

    text = _VAR_RE.sub(_render_var, text)
    return text


# ---------------------------------------------------------------------------
# 2. Tiny Markdown -> HTML converter (just enough for these four templates)
# ---------------------------------------------------------------------------


def _inline_markdown(text: str) -> str:
    text = html.escape(text, quote=False)
    text = re.sub(r"`([^`]+)`", r"<code>\1</code>", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"\*([^*]+)\*", r"<em>\1</em>", text)
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', text)
    return text


def markdown_to_html(markdown_text: str) -> str:
    lines = markdown_text.replace("\r\n", "\n").split("\n")
    out: list[str] = []
    i = 0
    n = len(lines)
    in_list = False

    def close_list():
        nonlocal in_list
        if in_list:
            out.append("</ul>")
            in_list = False

    while i < n:
        line = lines[i]
        stripped = line.strip()

        if not stripped:
            close_list()
            i += 1
            continue

        heading_match = re.match(r"^(#{1,6})\s+(.*)$", stripped)
        if heading_match:
            close_list()
            level = len(heading_match.group(1))
            body = _inline_markdown(heading_match.group(2))
            anchor = re.sub(r"[^a-z0-9]+", "-", heading_match.group(2).lower()).strip("-")
            out.append(f'<h{level} id="{anchor}">{body}</h{level}>')
            i += 1
            continue

        if stripped in ("---", "***", "___"):
            close_list()
            out.append("<hr>")
            i += 1
            continue

        if stripped.startswith("> "):
            close_list()
            out.append(f"<blockquote>{_inline_markdown(stripped[2:])}</blockquote>")
            i += 1
            continue

        if stripped.startswith("- "):
            if not in_list:
                out.append("<ul>")
                in_list = True
            out.append(f"<li>{_inline_markdown(stripped[2:])}</li>")
            i += 1
            continue

        if stripped.startswith("|") and i + 1 < n and re.match(r"^\|[\s:|-]+\|$", lines[i + 1].strip()):
            close_list()
            header_cells = [c.strip() for c in stripped.strip("|").split("|")]
            out.append("<table><thead><tr>")
            out.extend(f"<th>{_inline_markdown(c)}</th>" for c in header_cells)
            out.append("</tr></thead><tbody>")
            i += 2
            while i < n and lines[i].strip().startswith("|"):
                row_cells = [c.strip() for c in lines[i].strip().strip("|").split("|")]
                out.append("<tr>")
                out.extend(f"<td>{_inline_markdown(c)}</td>" for c in row_cells)
                out.append("</tr>")
                i += 1
            out.append("</tbody></table>")
            continue

        close_list()
        out.append(f"<p>{_inline_markdown(stripped)}</p>")
        i += 1

    close_list()
    return "\n".join(out)


# ---------------------------------------------------------------------------
# 3. Rendering pipeline: .md template -> Markdown -> HTML fragment -> shell
# ---------------------------------------------------------------------------


def _strip_trailing_footer_credit(markdown_text: str, credit_line: str) -> str:
    """
    Drop the trailing '*<credit line>*' paragraph (and its preceding '---'
    separator) from a rendered Markdown document before converting it to an
    HTML content fragment.

    The Markdown templates end with their own plain-text footer credit line,
    since Markdown has no separate "document footer" region - that line is
    correct and required in the standalone .md deliverable. The HTML shell
    template supplies the same information through its own styled <footer>
    element (with the small mark and a real link), so leaving the Markdown
    footer paragraph in the injected body content would print the Legion
    Code Inc. credit line twice in one HTML document, violating prd-021
    AC-3's "exactly once per document, not repeated per section" rule.
    """
    idx = markdown_text.rfind(credit_line)
    if idx == -1:
        return markdown_text
    head = markdown_text[:idx]
    head = re.sub(r"(\n-{3,}\s*)+\Z", "", head.rstrip())
    return head.rstrip() + "\n"


def render_report_pair(template_stem: str, context: dict) -> tuple[str, str]:
    """Returns (rendered_markdown, rendered_html) for one report variant."""
    md_template = (TEMPLATES_DIR / f"{template_stem}-template.md").read_text(encoding="utf-8")
    html_template = (TEMPLATES_DIR / f"{template_stem}-template.html").read_text(encoding="utf-8")

    rendered_markdown = render_template(md_template, context)

    credit_line = context["brand"]["footer"]["credit_line"]
    body_for_html = _strip_trailing_footer_credit(rendered_markdown, credit_line)
    content_fragment = markdown_to_html(body_for_html)

    html_context = dict(context)
    html_context["content"] = content_fragment
    rendered_html = render_template(html_template, html_context)

    return rendered_markdown, rendered_html


# ---------------------------------------------------------------------------
# 4. Sample data dict, standing in for a real audit workspace's findings
# ---------------------------------------------------------------------------


def build_sample_context() -> dict:
    brand_path = TEMPLATES_DIR / "brand.json"
    brand = json.loads(brand_path.read_text(encoding="utf-8"))

    findings = [
        {
            "id": "SEC-003",
            "title": "Strict-Transport-Security header absent on production domain",
            "category": "Security",
            "sub_audit": "Headers and transport",
            "type": "Finding",
            "subjective": False,
            "severity_label": "Critical",
            "severity_score": 1,
            "anchor_heading": "Missing transport security header",
            "issue_statement": "Strict-Transport-Security is not present on any response from the production domain.",
            "evidence_pointer": "07-security/headers-scan.md#hsts",
            "justification": "Header absent on 12/12 sampled responses across desktop and mobile captures.",
            "impact": "Visitors on a compromised network can be downgraded to plain HTTP and have traffic intercepted.",
            "recommendation": "Add Strict-Transport-Security with a minimum one-year max-age and submit the domain for HSTS preload.",
            "plain_language_summary": "Your site does not force browsers to stay on the secure, encrypted connection.",
            "business_impact": "A visitor on public wifi could have their connection quietly downgraded to an unencrypted one, exposing anything they type.",
            "remediation_summary": "Add one security header at the server or CDN level.",
            "effort_band": "quick win",
            "owner": "TBD",
            "target_date": "TBD",
        },
        {
            "id": "PERF-011",
            "title": "Largest Contentful Paint exceeds 4.2s on mobile homepage",
            "category": "Technical deployment",
            "sub_audit": "Core Web Vitals",
            "type": "Finding",
            "subjective": False,
            "severity_label": "Medium",
            "severity_score": 3,
            "anchor_heading": "Slow homepage load on mobile",
            "issue_statement": "Mobile LCP on the homepage measured 4.2s against a 2.5s good-experience threshold.",
            "evidence_pointer": "visual/mobile/homepage-cwv-trace.json",
            "justification": "Median of 5 throttled mobile runs, 4.2s LCP, hero image identified as the LCP element.",
            "impact": "Visitors on mobile networks wait noticeably longer before the page feels usable, which measurably increases bounce rate.",
            "recommendation": "Compress and correctly size the hero image, and preload it instead of lazy-loading it.",
            "plain_language_summary": "Your homepage feels slow to load on a phone.",
            "business_impact": "Slow-loading pages lose visitors before they ever see your offer, like a shop with a revolving door that takes eight seconds to open.",
            "remediation_summary": "Resize and preload the homepage's main image.",
            "effort_band": "quick win",
            "owner": "TBD",
            "target_date": "TBD",
        },
        {
            "id": "OBS-002",
            "title": "Blog publishing cadence appears inconsistent",
            "category": "Content score",
            "sub_audit": "Freshness",
            "type": "Observation",
            "subjective": True,
            "severity_label": "Low",
            "severity_score": 4,
            "anchor_heading": "Inconsistent publishing cadence",
            "issue_statement": "Post dates suggest an irregular publishing cadence over the trailing 12 months.",
            "evidence_pointer": "11-blog/publish-date-sample.md",
            "justification": "Sampled 10 post dates; gaps ranged from 4 to 97 days between posts. No stated cadence requirement was violated, so this is recorded as an observation rather than a finding.",
            "impact": "Irregular cadence is a mild, not severe, signal to both readers and search engines.",
            "recommendation": "Set and hold a fixed publishing cadence, even if lower-frequency, over an irregular one.",
            "plain_language_summary": "Your blog does not publish on a predictable schedule.",
            "business_impact": "A predictable schedule builds a returning-reader habit; an unpredictable one does not.",
            "remediation_summary": "Agree an internal cadence and hold to it.",
            "effort_band": "process change, no engineering effort",
            "owner": "TBD",
            "target_date": "TBD",
        },
    ]

    context = {
        "brand": brand,
        "report": {
            "client_name": "Example Retail Co.",
            "domain": "www.example-retail.example",
            "audit_date": "2026-08-18",
            "auditor_name": "Legion Code Inc. Website Auditor",
            "engagement_ref": "ENG-2026-0818-EXRETAIL",
            "workspace_root": "www.example-retail.example-audit/",
            "scope_paragraph": (
                "This engagement audited the production domain listed above across all "
                "applicable categories in the standard rubric: security, revenue-driving pages, "
                "mission-critical function, analytics, technical deployment, foundational "
                "completeness, search presence, and content. Testing was read-only and passive; "
                "no exploitation, order placement, or authentication bypass was attempted."
            ),
            "categories_audited_list": "Security, Revenue drivers, Technical deployment, Content score (subset shown in this sample)",
            "executive_summary_paragraph": (
                "Example Retail Co.'s site is functionally sound with one urgent security gap and "
                "one mobile performance issue that together warrant near-term attention; content "
                "cadence is a minor, non-urgent observation."
            ),
            "single_most_important_action": "Add the missing Strict-Transport-Security header before the next deploy window.",
            "next_steps_paragraph": (
                "We recommend a 30-minute readout call to walk the two quick-win items above, "
                "then a follow-up re-audit once both are shipped to confirm closure."
            ),
            "ai_authorship_finding_present": True,
            "ai_authorship_probability_band": "Low (10-25%)",
            "ai_authorship_method": "stylometric pattern comparison against the site's own historical archive",
            "ai_authorship_error_rate": "approximately 15% at this band, per the method's stated confidence interval",
            "deanonymization_finding_present": False,
            "deanonymization_category": "",
            "deanonymization_summary": "",
            "evidence_index_path": "_shared/evidence-index.md",
            "scorecard_path": "scoring/audit-scorecard.xlsx",
            "findings_register_path": "scoring/findings-register.csv",
        },
        "scorecard": {
            "overall_grade": "C",
            "overall_percent": 71,
            "override_triggered": True,
            "override_triggering_finding": "SEC-003 (Strict-Transport-Security header absent)",
            "trend_available": False,
            "previous_audit_date": "",
            "trend_summary": "",
            "categories": [
                {"name": "Security", "grade": "C (override)", "percent": 55},
                {"name": "Revenue drivers", "grade": "B", "percent": 84},
                {"name": "Technical deployment", "grade": "C", "percent": 68},
                {"name": "Content score", "grade": "B minus", "percent": 74},
            ],
        },
        "findings": findings,
        "customer_findings": [f for f in findings if f["type"] == "Finding" or not f["subjective"]],
        "top_priorities": [
            {"rank": 1, "title": "Add the missing HSTS header", "one_line_reason": "Closes an active encryption-downgrade exposure.", "anchor": "missing-transport-security-header"},
            {"rank": 2, "title": "Fix mobile homepage load speed", "one_line_reason": "Cuts the time before the page feels usable on a phone.", "anchor": "slow-homepage-load-on-mobile"},
            {"rank": 3, "title": "Set a fixed blog publishing cadence", "one_line_reason": "Builds a returning-reader habit.", "anchor": "inconsistent-publishing-cadence"},
        ],
        "recommendations": [
            {"priority_tier": "P1", "title": "Add Strict-Transport-Security header", "effort_band": "quick win", "timeline": "This week"},
            {"priority_tier": "P1", "title": "Resize and preload homepage hero image", "effort_band": "quick win", "timeline": "This week"},
            {"priority_tier": "P3", "title": "Set fixed blog publishing cadence", "effort_band": "process only", "timeline": "Next quarter"},
        ],
        "recommendations_summary": {
            "quick_win_count": 2,
            "quick_win_window": "one sprint",
        },
        "management_responses": [
            {"finding_id": "SEC-003", "response_text": "Accepted, scheduling with infra team.", "accepted": "Yes", "remediation_date": "2026-08-25"},
            {"finding_id": "PERF-011", "response_text": "Accepted.", "accepted": "Yes", "remediation_date": "2026-09-01"},
        ],
        "verification_log": [
            {
                "candidate_id": "CAND-014",
                "original_claim": "Checkout page missing a payment-icon trust badge.",
                "disposition": "Rejected",
                "reason": "Badge was present but rendered below the fold on the captured viewport; re-verified with a taller capture and confirmed present. Not a real finding.",
            },
        ],
        "verification_log_empty": False,
    }
    return context


# ---------------------------------------------------------------------------
# 5. Entry point
# ---------------------------------------------------------------------------


def main() -> int:
    context = build_sample_context()
    out_dir = Path(tempfile.mkdtemp(prefix="audit-reporting-render-demo-"))

    pairs = [
        ("customer-report", "customer-report"),
        ("auditor-report", "auditor-report"),
    ]

    print(f"Rendering into: {out_dir}\n")
    for output_name, template_stem in pairs:
        markdown_out, html_out = render_report_pair(template_stem, context)

        md_path = out_dir / f"{output_name}.md"
        html_path = out_dir / f"{output_name}.html"
        md_path.write_text(markdown_out, encoding="utf-8")
        html_path.write_text(html_out, encoding="utf-8")

        preview = "\n".join(markdown_out.strip().splitlines()[:6])
        print(f"--- {output_name} ---")
        print(f"  markdown -> {md_path} ({len(markdown_out)} chars)")
        print(f"  html     -> {html_path} ({len(html_out)} chars)")
        print("  preview:")
        for line in preview.splitlines():
            print(f"    {line}")
        print()

        assert "{{" not in markdown_out, f"unrendered placeholder left in {output_name}.md"
        assert "{{" not in html_out, f"unrendered placeholder left in {output_name}.html"
        assert count_brand_credit(html_out) == 1, (
            f"footer credit line must appear exactly once in {output_name}.html "
            f"(prd-021 AC-3), found {count_brand_credit(html_out)}"
        )

    print("All templates rendered with no unresolved placeholders. Demo complete.")
    return 0


def count_brand_credit(html_text: str) -> int:
    return html_text.count("Audit tool created by Legion Code Inc.")


if __name__ == "__main__":
    sys.exit(main())
