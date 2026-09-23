#!/usr/bin/env python3
"""a11y-scan.py - automated-heuristic WCAG scan over a crawled site-data/ set.

Used by: accessibility-audit-stinger (see shared/scripts/README.md).

WHAT THIS SCRIPT IS. A deterministic, standard-library-only pass over the raw
HTML already saved in site-data/ by site-crawler-wasp-drone. It never fetches
the network itself (read-only, no re-crawl, no write contention with the
Wave-5 crawl-consumers, per the build plan section 3 shared-workspace rule).

WHAT THIS SCRIPT IS NOT. It is not a substitute for a full manual accessibility
audit (PRD-013 non-goal, stated explicitly). Automated scanning can only ever
catch a narrow, structural slice of WCAG success criteria: missing alt text,
missing form labels, missing page language, missing/duplicate titles, skipped
heading levels, and empty/generic link text. Every other success criterion in
this Stinger's checklist template (references/templates/wcag-2.1-aa-checklist-
scoring-table.md) requires a human-or-agent heuristic read of the rendered
page, not this script. Report this script's output at "automated-heuristic"
confidence, per conduct rule 5 (confidence stated, not implied).

SCORING. Each check below maps to one or more WCAG 2.1 success criteria and
is scored 1-6 on the build plan's zero-to-six scale (plan/website-auditor-
build-plan.md section 4.1): 6 when zero offending elements are found across
the whole crawled set, 3 when fewer than 10 percent of applicable pages are
affected, 1 when 10 percent or more are affected. This graduated mapping is
this script's own heuristic, not itself a claim sourced from the research
archive - no source in references/research/raw/ documents an automated-scan
severity-banding methodology (distilled-accessibility-audit.md section 6
names WCAG testing methodology as an explicit, unfilled research gap). A
check with zero applicable elements across the whole set (e.g. no <form>
elements found anywhere) is marked N/A (0), per section 4.1: N/A is excluded
from both numerator and denominator, never counted as a failure.

The overall sub_audit_pct this script prints reuses the exact N/A-aware
formula from build plan section 4.3:

    sub_audit_pct = SUMPRODUCT(scores, weights, --(scores>0))
                  / (6 * SUMPRODUCT(weights, --(scores>0)))

with every check weighted equally (weight=1), since this script has no
research-backed basis for differential weighting among its own six checks.
This is a genuinely useful, N/A-aware 0-100% number, but it is only the
automated-check subset of the accessibility-audit-wasp-drone's full 0-100%
score; the Drone's real headline score also folds in every heuristic/manual
finding this script cannot make.

USAGE
    python3 a11y-scan.py --site-data path/to/www.example.com-audit/site-data --out path/to/06-accessibility/a11y-scan-findings.json

No absolute paths are hard-coded; pass real paths on the command line. Runs
on Python 3.8+, standard library only, no third-party dependencies, so it
runs unmodified across every target harness (Claude Code, Cursor, ChatGPT
Codex, Claude Cowork).
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass, field
from html.parser import HTMLParser
from pathlib import Path


VOID_ELEMENTS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
}

GENERIC_LINK_TEXT = {
    "click here", "here", "read more", "more", "link", "learn more",
}


@dataclass
class PageScan:
    slug: str
    has_lang: bool = False
    title_text: str = ""
    images_missing_alt: int = 0
    images_total: int = 0
    inputs_missing_label: int = 0
    inputs_total: int = 0
    generic_or_empty_links: int = 0
    links_total: int = 0
    heading_levels: list = field(default_factory=list)
    duplicate_ids: list = field(default_factory=list)
    _seen_ids: set = field(default_factory=set)


class A11yHTMLParser(HTMLParser):
    """Single-pass structural scan. Heuristic only, see module docstring."""

    def __init__(self, page: PageScan, label_ids_for: set):
        super().__init__(convert_charrefs=True)
        self.page = page
        self._in_title = False
        self._title_buf = []
        self._in_label = False
        # Pre-scanned across the whole document (see scan_page), since a <label for="x">
        # may appear before or after the <input id="x"> it labels in source order, and a
        # single forward streaming pass would otherwise miss labels declared afterward.
        self._label_ids_for = label_ids_for
        self._link_text_buf = []
        self._in_link = False
        self._link_has_aria_label = False

    def handle_starttag(self, tag, attrs):
        attrs_d = dict(attrs)
        self._track_id(attrs_d)

        if tag == "html":
            if "lang" in attrs_d and attrs_d["lang"].strip():
                self.page.has_lang = True
        elif tag == "title":
            self._in_title = True
        elif tag == "img":
            self.page.images_total += 1
            alt = attrs_d.get("alt")
            role = attrs_d.get("role", "")
            if alt is None and role != "presentation":
                self.page.images_missing_alt += 1
        elif tag == "label":
            self._in_label = True
            if "for" in attrs_d:
                self._label_ids_for.add(attrs_d["for"])
        elif tag in ("input", "select", "textarea"):
            input_type = attrs_d.get("type", "text")
            if input_type in ("hidden", "submit", "button", "reset", "image"):
                pass
            else:
                self.page.inputs_total += 1
                has_aria = "aria-label" in attrs_d or "aria-labelledby" in attrs_d
                has_id_labelled = attrs_d.get("id") in self._label_ids_for
                if not (has_aria or has_id_labelled):
                    self.page.inputs_missing_label += 1
        elif tag == "a":
            self._in_link = True
            self._link_text_buf = []
            self._link_has_aria_label = "aria-label" in attrs_d and attrs_d["aria-label"].strip() != ""
            if "href" in attrs_d:
                self.page.links_total += 1
        elif re.fullmatch(r"h[1-6]", tag):
            self.page.heading_levels.append(int(tag[1]))

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
            self.page.title_text = "".join(self._title_buf).strip()
        elif tag == "label":
            self._in_label = False
        elif tag == "a":
            text = "".join(self._link_text_buf).strip().lower()
            if self._in_link:
                if not self._link_has_aria_label and (text == "" or text in GENERIC_LINK_TEXT):
                    self.page.generic_or_empty_links += 1
            self._in_link = False

    def handle_data(self, data):
        if self._in_title:
            self._title_buf.append(data)
        if self._in_link:
            self._link_text_buf.append(data)

    def _track_id(self, attrs_d):
        el_id = attrs_d.get("id")
        if el_id:
            if el_id in self.page._seen_ids:
                self.page.duplicate_ids.append(el_id)
            else:
                self.page._seen_ids.add(el_id)


LABEL_FOR_RE = re.compile(r"<label\b[^>]*\bfor\s*=\s*[\"']([^\"']+)[\"']", re.IGNORECASE)


def scan_page(html_path: Path) -> PageScan:
    page = PageScan(slug=html_path.stem)
    text = html_path.read_text(encoding="utf-8", errors="replace")
    label_ids_for = set(LABEL_FOR_RE.findall(text))
    parser = A11yHTMLParser(page, label_ids_for)
    try:
        parser.feed(text)
    except Exception as exc:  # noqa: BLE001 - a malformed page is itself evidence, not a crash
        print(f"warning: {html_path} failed to parse cleanly ({exc}); partial results kept", file=sys.stderr)
    return page


def has_skipped_heading_level(levels: list) -> bool:
    """True if the sequence ever jumps more than one level down (h1 -> h3)."""
    seen_max = 0
    for lvl in levels:
        if lvl > seen_max + 1 and seen_max != 0:
            return True
        seen_max = max(seen_max, lvl)
    return False


def band_score(offending: int, applicable: int) -> int:
    """Build plan section 4.1 zero-to-six scale, this script's own graduated mapping."""
    if applicable == 0:
        return 0  # N/A: excluded from both numerator and denominator
    if offending == 0:
        return 6
    ratio = offending / applicable
    if ratio < 0.10:
        return 3
    return 1


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--site-data", required=True, help="Path to the engagement's site-data/ folder")
    ap.add_argument("--out", required=True, help="Path to write the JSON findings file")
    args = ap.parse_args()

    site_data = Path(args.site_data)
    if not site_data.is_dir():
        print(f"error: {site_data} is not a directory", file=sys.stderr)
        return 2

    html_files = sorted(site_data.glob("*.html"))
    if not html_files:
        print(f"error: no .html files found under {site_data}", file=sys.stderr)
        return 2

    pages = [scan_page(p) for p in html_files]
    total_pages = len(pages)

    pages_missing_lang = sum(1 for p in pages if not p.has_lang)
    pages_missing_title = sum(1 for p in pages if not p.title_text)
    images_missing_alt_total = sum(p.images_missing_alt for p in pages)
    images_total = sum(p.images_total for p in pages)
    inputs_missing_label_total = sum(p.inputs_missing_label for p in pages)
    inputs_total = sum(p.inputs_total for p in pages)
    generic_links_total = sum(p.generic_or_empty_links for p in pages)
    links_total = sum(p.links_total for p in pages)
    pages_with_skipped_headings = sum(1 for p in pages if has_skipped_heading_level(p.heading_levels))
    pages_with_dupe_ids = sum(1 for p in pages if p.duplicate_ids)

    checks = [
        {
            "checkpoint": "page-language",
            "wcag_ref": "3.1.1 Language of Page",
            "level": "A",
            "score": band_score(pages_missing_lang, total_pages),
            "evidence": f"{pages_missing_lang}/{total_pages} crawled pages have no non-empty html[lang] attribute",
            "justification": "Automated-heuristic check of the html element's lang attribute on every crawled page.",
            "confidence": "automated-heuristic",
        },
        {
            "checkpoint": "page-title",
            "wcag_ref": "2.4.2 Page Titled",
            "level": "A",
            "score": band_score(pages_missing_title, total_pages),
            "evidence": f"{pages_missing_title}/{total_pages} crawled pages have an empty or missing <title>",
            "justification": "Automated-heuristic check for a non-empty <title> element on every crawled page.",
            "confidence": "automated-heuristic",
        },
        {
            "checkpoint": "image-alt-text",
            "wcag_ref": "1.1.1 Non-text Content",
            "level": "A",
            "score": band_score(images_missing_alt_total, images_total),
            "evidence": f"{images_missing_alt_total}/{images_total} <img> elements across the crawled set have no alt attribute and no role=\"presentation\"",
            "justification": "Automated-heuristic check; does not evaluate whether present alt text is meaningfully descriptive, only whether it exists.",
            "confidence": "automated-heuristic",
        },
        {
            "checkpoint": "form-input-labels",
            "wcag_ref": "1.3.1 Info and Relationships / 3.3.2 Labels or Instructions",
            "level": "A",
            "score": band_score(inputs_missing_label_total, inputs_total),
            "evidence": f"{inputs_missing_label_total}/{inputs_total} form controls have no associated <label for>, aria-label, or aria-labelledby",
            "justification": "Automated-heuristic check for a programmatic label association; does not evaluate label wording quality.",
            "confidence": "automated-heuristic",
        },
        {
            "checkpoint": "link-purpose-in-context",
            "wcag_ref": "2.4.4 Link Purpose (In Context)",
            "level": "A",
            "score": band_score(generic_links_total, links_total),
            "evidence": f"{generic_links_total}/{links_total} <a> elements have empty text or generic text (e.g. \"click here\") with no aria-label",
            "justification": "Automated-heuristic check against a fixed generic-text list; does not evaluate surrounding-context sufficiency.",
            "confidence": "automated-heuristic",
        },
        {
            "checkpoint": "heading-order",
            "wcag_ref": "1.3.1 Info and Relationships",
            "level": "A",
            "score": band_score(pages_with_skipped_headings, total_pages),
            "evidence": f"{pages_with_skipped_headings}/{total_pages} crawled pages skip a heading level (e.g. h1 directly to h3)",
            "justification": "Automated-heuristic check of the raw heading-tag sequence; does not evaluate whether headings are visually styled as such.",
            "confidence": "automated-heuristic",
        },
    ]

    # Informational only, not scored: duplicate id attributes break aria-labelledby/aria-describedby
    # and <label for> association (WCAG 4.1.1-adjacent robust-parsing concern). Reported as a
    # candidate finding for the Drone to verify, not auto-scored, since this script has no basis in
    # the research archive for a severity band on this specific check.
    duplicate_id_note = {
        "checkpoint": "duplicate-id-attributes",
        "note": f"{pages_with_dupe_ids}/{total_pages} crawled pages contain at least one duplicate id attribute",
        "why_unscored": "No source in references/research/raw/ documents a severity mapping for this check; report as a candidate finding for manual verification, per conduct rule 5 (confidence stated, not implied).",
    }

    weights = [1 for _ in checks]
    scores = [c["score"] for c in checks]
    applicable = [s > 0 for s in scores]
    numerator = sum(s * w * (1 if a else 0) for s, w, a in zip(scores, weights, applicable))
    denominator = 6 * sum(w * (1 if a else 0) for w, a in zip(weights, applicable))
    sub_audit_pct = round(100 * numerator / denominator, 1) if denominator else None

    result = {
        "script": "a11y-scan.py",
        "confidence": "automated-heuristic, not a substitute for a full manual accessibility audit (PRD-013 non-goal)",
        "pages_scanned": total_pages,
        "checks": checks,
        "unscored_notes": [duplicate_id_note],
        "automated_subset_sub_audit_pct": sub_audit_pct,
        "formula": "build plan section 4.3 sub_audit_pct, N/A-aware, equal weight=1 per check",
    }

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(f"wrote {out_path} ({total_pages} pages scanned, automated-subset score: {sub_audit_pct})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
