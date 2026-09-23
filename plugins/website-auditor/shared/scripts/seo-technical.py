#!/usr/bin/env python3
"""seo-technical.py - deterministic technical-SEO validator for technical-seo-stinger.

Grounded in skills/technical-seo-stinger/references/research/distilled-technical-seo.md
sections 3-6 (crawlability/indexability, XML sitemap mechanics, robots.txt/noindex
mechanics, canonicalization failure modes). Every check below maps to a named row in
that distillation; see the docstring on each function for the exact section it
implements. This script does not invent thresholds beyond what the distillation
documents as vendor/practitioner heuristics (see distillation Section 12, "Remaining
research gaps") - where a number is a heuristic rather than a disclosed standard, the
finding text says so.

Two input modes, matched to the PRD-008 read-only contract:

1. Canonical-tag / meta-robots scan runs ONLY against local files already present in
   site-data/ (the crawl output written once by site-crawler-wasp-drone). This never
   re-fetches a crawled page, per PRD-008's "does not re-crawl" non-goal.
2. robots.txt and sitemap.xml are singleton site-root metadata files, not part of the
   100-page crawl budget. If site-crawler-wasp-drone already archived them into
   site-data/ under a predictable name, pass that file with --robots-file/--sitemap-file.
   If not, this script can fetch them directly with --robots-url/--sitemap-url - this is
   a live network read of exactly two well-known URLs, not a re-crawl of the page set,
   and is the intended, judgment-call reading of PRD-008's read-only-from-site-data
   contract for this Stinger. See guides/04-robots-txt-and-noindex.md for the reasoning.

No absolute paths. No third-party dependencies (stdlib only: urllib, xml.etree,
html.parser, re, json, argparse) so this script is portable across Claude Code, Cursor,
Codex, and Cowork's sandboxes alike, per the build plan's harness-portability rule.

Usage examples:
    python3 seo-technical.py robots --robots-url https://example.com/robots.txt
    python3 seo-technical.py robots --robots-file ./site-data/robots.txt
    python3 seo-technical.py sitemap --sitemap-url https://example.com/sitemap.xml \\
        --verify-urls --max-verify 50
    python3 seo-technical.py canonicals --site-data-dir ./site-data \\
        --site-host example.com
    python3 seo-technical.py all --robots-url https://example.com/robots.txt \\
        --sitemap-url https://example.com/sitemap.xml --site-data-dir ./site-data \\
        --site-host example.com --out ./03-seo/seo-technical-findings.json

Exit code is always 0 on a completed run (findings, not process failure, carry the
signal); non-zero only on a genuine operational error (bad args, unreachable target
with no local fallback).
"""

import argparse
import json
import re
import sys
import urllib.error
import urllib.request
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse
from xml.etree import ElementTree

USER_AGENT = "WebsiteAuditorLegionCode/1.0 (+technical-seo-stinger; read-only audit tool)"
REQUEST_TIMEOUT = 15

AI_AND_SEARCH_AGENTS_TRACKED_ELSEWHERE = None  # see aeo-technical.py; not duplicated here

# --------------------------------------------------------------------------------------
# Shared fetch helper
# --------------------------------------------------------------------------------------


def fetch(url, timeout=REQUEST_TIMEOUT):
    """GET a URL with a declared, honest User-Agent. Returns (status, text, headers, error)."""
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            status = resp.status
            headers = dict(resp.headers.items())
            body = resp.read()
            try:
                text = body.decode(resp.headers.get_content_charset() or "utf-8", errors="replace")
            except LookupError:
                text = body.decode("utf-8", errors="replace")
            return status, text, headers, None
    except urllib.error.HTTPError as e:
        return e.code, "", dict(e.headers.items()) if e.headers else {}, str(e)
    except urllib.error.URLError as e:
        return None, "", {}, str(e.reason)
    except Exception as e:  # noqa: BLE001 - deterministic tool, report and move on
        return None, "", {}, str(e)


def head(url, timeout=REQUEST_TIMEOUT):
    """HEAD a URL for a cheap status-only check (used for canonical-target verification)."""
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT}, method="HEAD")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status, None
    except urllib.error.HTTPError as e:
        return e.code, str(e)
    except urllib.error.URLError as e:
        return None, str(e.reason)
    except Exception as e:  # noqa: BLE001
        return None, str(e)


# --------------------------------------------------------------------------------------
# robots.txt - distillation Section 3 ("Crawlability and indexability mechanics") and
# Section 5 ("Robots.txt and noindex mechanics")
# --------------------------------------------------------------------------------------


def parse_robots_txt(text):
    """Parse robots.txt into per-user-agent groups plus any Sitemap: directives.

    Standard robots.txt grouping: one or more consecutive User-agent lines form a single
    group that shares whatever Allow/Disallow lines follow. A rule line closes that
    group, so the next User-agent line starts a NEW group rather than extending the
    running agent list - getting this wrong cross-contaminates rules between unrelated
    agent blocks (e.g. a later group's "Allow: /" leaking onto an earlier, unrelated
    "Disallow: /" agent).

    [raw/seoxpert-io-complete-technical-seo-audit.md] [raw/ecosire-com-technical-seo-audit-checklist-2026.md]
    """
    groups = {}
    sitemaps = []
    current_agents = []
    group_open = False
    for raw_line in text.splitlines():
        line = raw_line.split("#", 1)[0].strip()
        if not line:
            continue
        if ":" not in line:
            continue
        key, _, value = line.partition(":")
        key = key.strip().lower()
        value = value.strip()
        if key == "user-agent":
            if not group_open:
                current_agents = [value]
                group_open = True
            else:
                current_agents.append(value)
            groups.setdefault(value, {"rules": []})
        elif key in ("disallow", "allow"):
            group_open = False
            for agent in current_agents or ["*"]:
                groups.setdefault(agent, {"rules": []})
                groups[agent]["rules"].append((key, value))
        elif key == "sitemap":
            sitemaps.append(value)
        elif key == "crawl-delay":
            group_open = False
            for agent in current_agents or ["*"]:
                groups.setdefault(agent, {"rules": []})
                groups[agent].setdefault("crawl_delay", value)
    return {"groups": groups, "sitemaps": sitemaps}


def check_robots_txt(status, text, headers, error, source_label):
    findings = []
    if error and status is None:
        findings.append({
            "checkpoint": "robots.txt reachability",
            "severity_hint": "critical",
            "evidence": source_label,
            "detail": (
                f"robots.txt could not be reached ({error}). A 500/timeout is treated by Googlebot as "
                "pausing crawl entirely, distinct from a clean 404 (no rules, full crawl allowed)."
            ),
            "source": "[raw/seoxpert-io-complete-technical-seo-audit.md] [raw/ecosire-com-technical-seo-audit-checklist-2026.md]",
        })
        return findings, {"groups": {}, "sitemaps": []}
    if status is not None and status == 404:
        findings.append({
            "checkpoint": "robots.txt reachability",
            "severity_hint": "informational",
            "evidence": f"{source_label} -> HTTP 404",
            "detail": "404 on robots.txt is a clean, acceptable state: no rules, full crawl allowed.",
            "source": "[raw/seoxpert-io-complete-technical-seo-audit.md]",
        })
        return findings, {"groups": {}, "sitemaps": []}
    if status is not None and status >= 500:
        findings.append({
            "checkpoint": "robots.txt reachability",
            "severity_hint": "critical",
            "evidence": f"{source_label} -> HTTP {status}",
            "detail": "A 5xx on robots.txt is described as pausing Googlebot crawling entirely until it clears.",
            "source": "[raw/seoxpert-io-complete-technical-seo-audit.md]",
        })
        return findings, {"groups": {}, "sitemaps": []}
    if status is not None and status != 200:
        findings.append({
            "checkpoint": "robots.txt reachability",
            "severity_hint": "high",
            "evidence": f"{source_label} -> HTTP {status}",
            "detail": "Unexpected non-200/non-404 status on robots.txt; verify manually.",
            "source": "[raw/seoxpert-io-complete-technical-seo-audit.md]",
        })

    parsed = parse_robots_txt(text)
    star = parsed["groups"].get("*", {"rules": []})
    disallow_all = any(rule == ("disallow", "/") for rule in star.get("rules", []))
    if disallow_all:
        findings.append({
            "checkpoint": "robots.txt blanket disallow",
            "severity_hint": "critical",
            "evidence": f"{source_label}: User-agent: * / Disallow: /",
            "detail": (
                "A blanket 'Disallow: /' for the default user-agent group blocks the entire site from "
                "crawling. Cited real-world causes: a staging export or dev-only middleware deployed to "
                "production. Confirm this is intentional before treating it as a false positive."
            ),
            "source": "[raw/seoxpert-io-complete-technical-seo-audit.md] [raw/ecosire-com-technical-seo-audit-checklist-2026.md]",
        })

    undocumented_disallow_count = sum(
        1 for agent, group in parsed["groups"].items() for rule in group.get("rules", []) if rule[0] == "disallow"
    )
    if undocumented_disallow_count:
        findings.append({
            "checkpoint": "robots.txt intentionality",
            "severity_hint": "review",
            "evidence": f"{source_label}: {undocumented_disallow_count} Disallow line(s) across {len(parsed['groups'])} user-agent group(s)",
            "detail": (
                "Every Disallow line should have a known, documented reason. This script cannot determine "
                "intent from the file alone; hand this list to the auditor for a diff-against-last-known-"
                "version review, since undocumented robots.txt changes are described as a leading cause of "
                "traffic-loss incidents in this archive."
            ),
            "source": "[raw/ecosire-com-technical-seo-audit-checklist-2026.md]",
        })

    if not parsed["sitemaps"]:
        findings.append({
            "checkpoint": "robots.txt Sitemap: directive",
            "severity_hint": "low",
            "evidence": source_label,
            "detail": "No Sitemap: directive found in robots.txt. Not fatal (a sitemap can be submitted directly to Search Console), but it is the standard discovery path.",
            "source": "[raw/ecosire-com-technical-seo-audit-checklist-2026.md]",
        })

    return findings, parsed


# --------------------------------------------------------------------------------------
# XML sitemap - distillation Section 4 ("XML sitemap mechanics")
# --------------------------------------------------------------------------------------


def parse_sitemap_xml(text):
    """Return (kind, urls) where kind is 'urlset', 'sitemapindex', or None on parse failure."""
    try:
        root = ElementTree.fromstring(text)
    except ElementTree.ParseError as e:
        return None, [], str(e)
    tag = root.tag.rsplit("}", 1)[-1]
    urls = []
    if tag == "urlset":
        for url_el in root:
            loc = url_el.find("{*}loc")
            if loc is None:
                loc = url_el.find("loc")
            if loc is not None and loc.text:
                urls.append(loc.text.strip())
        return "urlset", urls, None
    if tag == "sitemapindex":
        for sm_el in root:
            loc = sm_el.find("{*}loc")
            if loc is None:
                loc = sm_el.find("loc")
            if loc is not None and loc.text:
                urls.append(loc.text.strip())
        return "sitemapindex", urls, None
    return None, [], f"Unrecognized root element <{tag}>"


def check_sitemap(status, text, error, source_label, verify_urls=False, max_verify=25):
    findings = []
    if error and status is None:
        findings.append({
            "checkpoint": "sitemap.xml reachability",
            "severity_hint": "critical",
            "evidence": source_label,
            "detail": f"Sitemap URL could not be reached ({error}).",
            "source": "[raw/seoxpert-io-complete-technical-seo-audit.md]",
        })
        return findings
    if status is not None and status != 200:
        findings.append({
            "checkpoint": "sitemap.xml reachability",
            "severity_hint": "critical",
            "evidence": f"{source_label} -> HTTP {status}",
            "detail": "The sitemap URL itself must return 200 and parse as valid XML; both Google and this archive treat a non-200 sitemap as a hard failure, not a warning.",
            "source": "[raw/seoxpert-io-complete-technical-seo-audit.md]",
        })
        return findings

    kind, urls, parse_error = parse_sitemap_xml(text)
    if parse_error:
        findings.append({
            "checkpoint": "sitemap.xml well-formedness",
            "severity_hint": "critical",
            "evidence": source_label,
            "detail": f"Sitemap did not parse as valid XML: {parse_error}",
            "source": "[raw/seoxpert-io-complete-technical-seo-audit.md]",
        })
        return findings

    findings.append({
        "checkpoint": "sitemap.xml well-formedness",
        "severity_hint": "informational",
        "evidence": f"{source_label}: valid {kind}, {len(urls)} <loc> entries",
        "detail": "Sitemap parses as valid XML." if kind == "urlset" else "Sitemap index parses as valid XML; each child sitemap should be validated individually.",
        "source": "[raw/seoxpert-io-complete-technical-seo-audit.md]",
    })

    if kind == "urlset" and not urls:
        findings.append({
            "checkpoint": "sitemap.xml emptiness",
            "severity_hint": "high",
            "evidence": source_label,
            "detail": "Sitemap parsed cleanly but contains zero <loc> entries.",
            "source": "[raw/seoxpert-io-complete-technical-seo-audit.md]",
        })

    if verify_urls and kind == "urlset" and urls:
        checked = urls[:max_verify]
        bad = []
        for u in checked:
            u_status, u_err = head(u)
            if u_err or u_status is None or u_status >= 300:
                bad.append({"url": u, "status": u_status, "error": u_err})
        findings.append({
            "checkpoint": "sitemap.xml URL honesty",
            "severity_hint": "high" if bad else "informational",
            "evidence": f"Checked {len(checked)} of {len(urls)} listed URLs" + (f"; --max-verify {max_verify} capped the sample" if len(urls) > max_verify else ""),
            "detail": (
                f"{len(bad)} listed URL(s) did not return a clean 200: {bad[:10]}"
                if bad
                else "All sampled sitemap URLs returned 200. Sitemaps containing redirects, 404s, or noindexed URLs are described in this archive as training Google to distrust the sitemap over time, so recurring failures here should be treated as a trend to watch, not a one-off."
            ),
            "source": "[raw/ecosire-com-technical-seo-audit-checklist-2026.md] [raw/seoxpert-io-complete-technical-seo-audit.md]",
        })

    return findings


# --------------------------------------------------------------------------------------
# Canonical tags + meta robots - distillation Section 5-6, local site-data/ only
# --------------------------------------------------------------------------------------


class _HeadSignalParser(HTMLParser):
    """Minimal, tolerant extractor for <link rel=canonical> and <meta name=robots> tags."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.canonicals = []
        self.meta_robots = []
        self.h1_count = 0
        self.title = None
        self._in_title = False

    def handle_starttag(self, tag, attrs):
        attrs_d = {k.lower(): (v or "") for k, v in attrs}
        if tag == "link" and attrs_d.get("rel", "").lower() == "canonical":
            self.canonicals.append(attrs_d.get("href", ""))
        elif tag == "meta" and attrs_d.get("name", "").lower() == "robots":
            self.meta_robots.append(attrs_d.get("content", ""))
        elif tag == "h1":
            self.h1_count += 1
        elif tag == "title":
            self._in_title = True

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False

    def handle_data(self, data):
        if self._in_title and self.title is None:
            self.title = data.strip()


def normalize_url(u):
    p = urlparse(u)
    scheme = p.scheme.lower()
    netloc = p.netloc.lower()
    path = p.path.rstrip("/") or "/"
    return f"{scheme}://{netloc}{path}"


def infer_page_url(html_path, site_host):
    """Best-effort reconstruction of the crawled URL from a site-data/<slug>.html filename.

    Convention (this Stinger's own, not a source claim): site-crawler-wasp-drone writes
    site-data/<slug>.html where <slug> is a URL-safe transform of the page path. Exact slug
    rules belong to site-crawler-stinger; this heuristic only removes the .html suffix and
    prefixes the known site host, and is used purely to LABEL findings for a human reader,
    never to assert a fact about crawl mechanics.
    """
    slug = Path(html_path).stem
    path = slug.replace("__", "/").replace("--", "/")
    if not path.startswith("/"):
        path = "/" + path
    if site_host:
        return f"https://{site_host}{path}"
    return path


def scan_canonicals(site_data_dir, site_host=None, verify_targets=False, max_verify=25):
    findings = []
    site_data_path = Path(site_data_dir)
    if not site_data_path.exists():
        findings.append({
            "checkpoint": "canonical scan input",
            "severity_hint": "critical",
            "evidence": str(site_data_dir),
            "detail": "site-data directory does not exist. This checkpoint reads ONLY from already-crawled site-data/, per PRD-008; it does not fetch pages itself.",
            "source": "[library/requirements/backlog/prd-008-technical-seo/prd-008-technical-seo-index.md]",
        })
        return findings

    html_files = sorted(site_data_path.glob("*.html"))
    if not html_files:
        findings.append({
            "checkpoint": "canonical scan input",
            "severity_hint": "high",
            "evidence": str(site_data_dir),
            "detail": "No .html files found in site-data/. Nothing to scan.",
            "source": "[library/requirements/backlog/prd-007-site-crawler/prd-007-site-crawler-index.md]",
        })
        return findings

    canonical_targets = set()
    for html_path in html_files:
        try:
            text = html_path.read_text(encoding="utf-8", errors="replace")
        except OSError as e:
            findings.append({
                "checkpoint": "canonical scan read error",
                "severity_hint": "review",
                "evidence": str(html_path),
                "detail": str(e),
                "source": "",
            })
            continue

        parser = _HeadSignalParser()
        parser.feed(text)
        page_url = infer_page_url(html_path, site_host)

        if len(parser.canonicals) == 0:
            findings.append({
                "checkpoint": "canonical tag presence",
                "severity_hint": "low",
                "evidence": f"{html_path.name} (~{page_url})",
                "detail": "No <link rel=canonical> tag found on this page.",
                "source": "[raw/seoxpert-io-complete-technical-seo-audit.md]",
            })
        elif len(parser.canonicals) > 1:
            findings.append({
                "checkpoint": "multiple canonical tags",
                "severity_hint": "high",
                "evidence": f"{html_path.name} (~{page_url}): {parser.canonicals}",
                "detail": "Multiple <link rel=canonical> tags present. Only one is honoured by search engines when multiple exist; the others are silently ignored, which makes this an ambiguous, self-inflicted signal.",
                "source": "[raw/seoxpert-io-complete-technical-seo-audit.md]",
            })
        else:
            canon = parser.canonicals[0]
            canon_abs = urljoin(page_url, canon) if canon else ""
            canonical_targets.add(canon_abs)
            if canon_abs:
                try:
                    if normalize_url(canon_abs) != normalize_url(page_url):
                        note = "self-canonical mismatch (protocol/host/trailing-slash) or an intentional cross-page canonical - confirm which"
                        findings.append({
                            "checkpoint": "canonical target vs. page URL",
                            "severity_hint": "review",
                            "evidence": f"{html_path.name}: page ~{page_url} -> canonical {canon_abs}",
                            "detail": note,
                            "source": "[raw/seoxpert-io-complete-technical-seo-audit.md]",
                        })
                    canon_host = urlparse(canon_abs).netloc.lower()
                    page_host = urlparse(page_url).netloc.lower()
                    if site_host and canon_host and canon_host != page_host:
                        findings.append({
                            "checkpoint": "cross-domain canonical",
                            "severity_hint": "high",
                            "evidence": f"{html_path.name}: canonical points to {canon_host}, page is on {page_host}",
                            "detail": "Canonical points to a different domain. May be an intentional syndication/consolidation decision; confirm rather than assume.",
                            "source": "[raw/ecosire-com-technical-seo-audit-checklist-2026.md]",
                        })
                except ValueError:
                    pass

        noindex_hits = [c for c in parser.meta_robots if "noindex" in c.lower()]
        if noindex_hits:
            conflict = bool(parser.canonicals) and len(parser.canonicals) == 1
            findings.append({
                "checkpoint": "noindex present",
                "severity_hint": "review" if not conflict else "high",
                "evidence": f"{html_path.name} (~{page_url}): meta robots = {noindex_hits}",
                "detail": (
                    "Page carries a noindex directive. Confirm this is intentional (CMS template changes "
                    "are described in this archive as regularly noindexing entire sections unnoticed)."
                    + (" This page ALSO has a canonical tag - a canonical pointing at (or from) a noindex page creates a conflicting signal that may cause both to be ignored." if conflict else "")
                ),
                "source": "[raw/ecosire-com-technical-seo-audit-checklist-2026.md] [raw/seoxpert-io-complete-technical-seo-audit.md]",
            })

        if parser.h1_count == 0:
            findings.append({
                "checkpoint": "H1 presence",
                "severity_hint": "low",
                "evidence": f"{html_path.name} (~{page_url})",
                "detail": "No <h1> found on page.",
                "source": "[distilled-technical-seo.md Section 12 heuristic accounting note - not independently cross-validated in this archive]",
            })
        elif parser.h1_count > 1:
            findings.append({
                "checkpoint": "H1 presence",
                "severity_hint": "low",
                "evidence": f"{html_path.name} (~{page_url}): {parser.h1_count} <h1> tags",
                "detail": "Multiple <h1> tags found.",
                "source": "[distilled-technical-seo.md Section 12 heuristic accounting note - not independently cross-validated in this archive]",
            })

    if verify_targets and canonical_targets:
        checked = sorted(canonical_targets)[:max_verify]
        bad = []
        for u in checked:
            if not u:
                continue
            u_status, u_err = head(u)
            if u_err or u_status is None or u_status >= 300:
                bad.append({"url": u, "status": u_status, "error": u_err})
        findings.append({
            "checkpoint": "canonical target reachability",
            "severity_hint": "high" if bad else "informational",
            "evidence": f"Checked {len(checked)} distinct canonical target(s)" + (f"; --max-verify {max_verify} capped the sample" if len(canonical_targets) > max_verify else ""),
            "detail": (
                f"{len(bad)} canonical target(s) did not return a clean 200: {bad[:10]}. A canonical pointing at a non-200 URL creates a broken signal."
                if bad
                else "All sampled canonical targets returned 200."
            ),
            "source": "[raw/seoxpert-io-complete-technical-seo-audit.md]",
        })

    return findings


# --------------------------------------------------------------------------------------
# CLI
# --------------------------------------------------------------------------------------


def build_arg_parser():
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    sub = p.add_subparsers(dest="command", required=True)

    robots_p = sub.add_parser("robots", help="Fetch/validate robots.txt")
    robots_p.add_argument("--robots-url")
    robots_p.add_argument("--robots-file")

    sitemap_p = sub.add_parser("sitemap", help="Fetch/validate sitemap.xml")
    sitemap_p.add_argument("--sitemap-url")
    sitemap_p.add_argument("--sitemap-file")
    sitemap_p.add_argument("--verify-urls", action="store_true")
    sitemap_p.add_argument("--max-verify", type=int, default=25)

    canon_p = sub.add_parser("canonicals", help="Scan site-data/*.html for canonical/noindex/H1 findings")
    canon_p.add_argument("--site-data-dir", required=True)
    canon_p.add_argument("--site-host", default=None)
    canon_p.add_argument("--verify-targets", action="store_true")
    canon_p.add_argument("--max-verify", type=int, default=25)

    all_p = sub.add_parser("all", help="Run robots + sitemap + canonicals in one pass")
    all_p.add_argument("--robots-url")
    all_p.add_argument("--robots-file")
    all_p.add_argument("--sitemap-url")
    all_p.add_argument("--sitemap-file")
    all_p.add_argument("--site-data-dir", required=True)
    all_p.add_argument("--site-host", default=None)
    all_p.add_argument("--verify-urls", action="store_true")
    all_p.add_argument("--max-verify", type=int, default=25)

    for sp in (robots_p, sitemap_p, canon_p, all_p):
        sp.add_argument("--out", default=None, help="Write JSON findings to this path instead of stdout")

    return p


def _load(url_arg, file_arg, label):
    if file_arg:
        text = Path(file_arg).read_text(encoding="utf-8", errors="replace")
        return 200, text, {}, None, f"local file {file_arg}"
    if url_arg:
        status, text, headers, error = fetch(url_arg)
        return status, text, headers, error, url_arg
    return None, "", {}, f"no --{label}-url or --{label}-file given", "(not provided)"


def main(argv=None):
    args = build_arg_parser().parse_args(argv)
    findings = []

    if args.command in ("robots", "all"):
        status, text, headers, error, label = _load(
            getattr(args, "robots_url", None), getattr(args, "robots_file", None), "robots"
        )
        if error and status is None and not getattr(args, "robots_file", None):
            findings.append({
                "checkpoint": "robots.txt input",
                "severity_hint": "review",
                "evidence": label,
                "detail": f"Could not obtain robots.txt: {error}",
                "source": "",
            })
        else:
            rf, _parsed = check_robots_txt(status, text, headers, error, label)
            findings.extend(rf)

    if args.command in ("sitemap", "all"):
        status, text, _headers, error, label = _load(
            getattr(args, "sitemap_url", None), getattr(args, "sitemap_file", None), "sitemap"
        )
        if error and status is None and not getattr(args, "sitemap_file", None):
            findings.append({
                "checkpoint": "sitemap.xml input",
                "severity_hint": "review",
                "evidence": label,
                "detail": f"Could not obtain sitemap.xml: {error}",
                "source": "",
            })
        else:
            findings.extend(
                check_sitemap(
                    status, text, error, label,
                    verify_urls=getattr(args, "verify_urls", False),
                    max_verify=getattr(args, "max_verify", 25),
                )
            )

    if args.command in ("canonicals", "all"):
        findings.extend(
            scan_canonicals(
                args.site_data_dir,
                site_host=args.site_host,
                verify_targets=getattr(args, "verify_targets", getattr(args, "verify_urls", False)),
                max_verify=args.max_verify,
            )
        )

    output = json.dumps({"tool": "seo-technical.py", "findings": findings, "count": len(findings)}, indent=2)
    if args.out:
        Path(args.out).write_text(output, encoding="utf-8")
        print(f"Wrote {len(findings)} finding(s) to {args.out}")
    else:
        print(output)
    return 0


if __name__ == "__main__":
    sys.exit(main())
