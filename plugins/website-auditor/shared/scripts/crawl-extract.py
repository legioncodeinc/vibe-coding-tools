#!/usr/bin/env python3
"""crawl-extract.py: platform-aware URL-frontier crawler for site-crawler-wasp-drone.

Owner: site-crawler-stinger (see skills/site-crawler-stinger/references/scripts/README.md).
Forge stage: 4 (References), authored against skills/site-crawler-stinger/references/research/
distilled-site-crawler.md and this Stinger's own guides/04-storage-and-manifest-convention.md.
Harness-portable: stdlib only (urllib, html.parser, xml.etree, json, re, hashlib), no absolute
paths, no third-party dependencies, so it runs unmodified inside Claude Code, Cursor, Codex, or
Cowork's sandboxed execution environment.

WHAT THIS SCRIPT DOES NOT DO (read before trusting its output)
- It does not execute JavaScript. Per the archived research, a plain HTTP fetch on a fully
  client-rendered page captures a near-empty shell; only the header/cookie signal channel stays
  reliable on those pages [distilled-site-crawler.md, section 4, citing
  raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md]. If
  `target-profile.json` names a client-rendered stack, treat this script's HTML/MD output for
  those pages as a known-thin capture, not a rendering bug.
- Its Markdown extraction is a heuristic stdlib-only pass (strip <script>/<style>/<nav>/<footer>,
  keep heading/paragraph/list text in reading order). It is not a readability-grade extractor.
  This is a judgment call made because the plugin promises zero third-party runtime dependencies;
  flag it explicitly rather than silently presenting the .md output as publication-quality.
- "Depth 100" in this pair's PRD overview is a total-page-count budget, not a 100-hop link depth.
  The PRD's own acceptance criterion (AC-2, "up to 100 page pairs") and Goals section ("crawls up
  to 100 pages") are the binding, more precise reading; this script enforces a 100-page cap on the
  whole crawl, not 100 hops from the seed. See site-crawler-stinger guides/01-crawl-procedure.md.
- Per-page platform re-detection (an inference in distilled-site-crawler.md section 1, not a
  stated recommendation in either raw source) is intentionally NOT implemented here. This script
  trusts the single `target-profile.json` classification for the whole run, consistent with
  PRD-003's contract that later Drones "read `target-profile.json` instead of re-detecting."

Usage:
    python3 crawl-extract.py \
        --target-profile path/to/_shared/target-profile.json \
        --out-dir path/to/www.<domain>-audit/site-data \
        --base-url https://example.com \
        [--max-pages 100] [--delay-seconds 0.5] [--timeout-seconds 15]

Writes <out-dir>/<slug>.html and <out-dir>/<slug>.md per page, plus <out-dir>/manifest.json,
the single index downstream Wave-5 Drones read instead of re-deriving slugs. See
skills/site-crawler-stinger/guides/04-storage-and-manifest-convention.md for the full contract.
"""

import argparse
import hashlib
import html.parser
import json
import re
import sys
import time
import urllib.error
import urllib.request
import urllib.robotparser
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from urllib.parse import urljoin, urlparse, urlunparse

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)
# A real desktop Chrome UA, matching the UA-spoofing tactic documented in
# distilled-site-crawler.md section 4 (raw/edgedns-dev-guides-domain-tech.md): fetching with a
# real Chrome UA so sites that gate content behind UA sniffing return their full markup.

ASSET_EXTENSIONS = (
    ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".ico", ".css", ".js", ".mjs",
    ".woff", ".woff2", ".ttf", ".eot", ".pdf", ".zip", ".mp4", ".mp3", ".json", ".xml",
    ".txt", ".map",
)

# Platform-aware seed paths, per PRD-007 AC-1: "uses that platform's specific traversal
# strategy rather than a generic link-follow." Mechanism precedent for well-known platform paths
# (e.g. /wp-content/, /wp-admin/) comes from distilled-site-crawler.md section 3
# (raw/edgedns-dev-guides-domain-tech.md, raw/dev-to-scrapemint-...md). The specific per-platform
# seed lists below (WordPress /wp-json/ REST endpoints, Shopify /collections//products/,
# Magento's search/catalog surface) are a judgment call reasoned from the build plan's platform
# guide names (plan/website-auditor-build-plan.md section 6), NOT directly grounded in either raw
# source, because neither raw source discusses crawl seeding. Flagged here, not smoothed over.
PLATFORM_SEEDS = {
    "wordpress": ["/wp-json/wp/v2/pages", "/wp-json/wp/v2/posts", "/sitemap.xml", "/sitemap_index.xml"],
    "shopify": ["/sitemap.xml", "/collections/all", "/collections", "/products"],
    "magento": ["/sitemap.xml", "/catalogsearch/advanced"],
    "nextjs": ["/sitemap.xml"],
    "sveltekit": ["/sitemap.xml"],
    "react-vite": ["/sitemap.xml"],
    "unknown": ["/sitemap.xml"],
}


def slugify(url_path: str) -> str:
    """Deterministic URL-path -> filename-slug conversion.

    Rules (spelled out in full so a downstream Drone never needs to re-derive them; read
    manifest.json's per-page "slug" field instead of re-running this function when possible):
    1. Query string and fragment are dropped before slugifying. /page?x=1 and /page are treated
       as the same page, so only the first-seen one gets crawled.
    2. Root path "/" (or "") slugifies to "index".
    3. Trailing slash is stripped (except root).
    4. Path separators "/" become "__" (double underscore), so slug segments stay visually
       distinguishable from in-segment hyphens.
    5. Within each segment: lowercase, then any character that is not [a-z0-9_-] becomes "-".
    6. If the resulting slug exceeds 150 characters, it is truncated to 142 chars and an 8-hex-char
       md5 suffix of the full original path is appended, joined by "-", to stay unique and under
       common filesystem filename limits.
    """
    parsed = urlparse(url_path)
    path = parsed.path or "/"
    if path in ("", "/"):
        return "index"
    path = path.rstrip("/")
    segments = [s for s in path.split("/") if s != ""]
    cleaned_segments = []
    for seg in segments:
        seg = seg.lower()
        seg = re.sub(r"[^a-z0-9_-]", "-", seg)
        seg = re.sub(r"-{2,}", "-", seg).strip("-")
        cleaned_segments.append(seg or "seg")
    slug = "__".join(cleaned_segments)
    if len(slug) > 150:
        digest = hashlib.md5(path.encode("utf-8")).hexdigest()[:8]
        slug = f"{slug[:142]}-{digest}"
    return slug


def normalize_url(base_url: str, link: str) -> str | None:
    """Resolve a possibly-relative link against base_url, strip query/fragment, drop non-http(s)."""
    try:
        absolute = urljoin(base_url, link)
    except ValueError:
        return None
    parsed = urlparse(absolute)
    if parsed.scheme not in ("http", "https"):
        return None
    normalized = urlunparse((parsed.scheme, parsed.netloc, parsed.path or "/", "", "", ""))
    return normalized


class _LinkAndTextExtractor(html.parser.HTMLParser):
    """Single-pass stdlib HTML parser: collects same-document links and a heuristic Markdown body.

    Skips <script>, <style>, <nav>, <footer>, <header>, <noscript> content for the Markdown body,
    per the "precision beats recall" and boilerplate-stripping discipline in distilled-site-crawler
    (crawl_core's local backend does something structurally similar with its extraction cascade,
    per skills/keyword-intelligence-stinger/references/research/raw/github-com-divyambhutani-
    crawl-core.md, cross-referenced here since it is the closest raw-sourced precedent for
    boilerplate-aware extraction in this plugin's archive).
    """

    SKIP_TAGS = {"script", "style", "nav", "footer", "header", "noscript"}
    HEADING_TAGS = {f"h{n}": n for n in range(1, 7)}
    BLOCK_TAGS = {"p", "li", "blockquote", "td", "th"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links: list[str] = []
        self.md_lines: list[str] = []
        self._skip_depth = 0
        self._current_heading_level = 0
        self._current_text: list[str] = []
        self.title: str | None = None
        self._in_title = False

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == "a" and "href" in attrs_dict:
            self.links.append(attrs_dict["href"])
        if tag == "title":
            self._in_title = True
        if tag in self.SKIP_TAGS:
            self._skip_depth += 1
        if tag in self.HEADING_TAGS and self._skip_depth == 0:
            self._flush_block()
            self._current_heading_level = self.HEADING_TAGS[tag]
        elif tag in self.BLOCK_TAGS and self._skip_depth == 0:
            self._flush_block()

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        if tag in self.SKIP_TAGS and self._skip_depth > 0:
            self._skip_depth -= 1
        if tag in self.HEADING_TAGS or tag in self.BLOCK_TAGS:
            self._flush_block()

    def handle_data(self, data):
        if self._in_title:
            if self.title is None:
                stripped = data.strip()
                if stripped:
                    self.title = stripped
            return
        if self._skip_depth > 0:
            return
        text = data.strip()
        if text:
            self._current_text.append(text)

    def _flush_block(self):
        text = " ".join(self._current_text).strip()
        text = re.sub(r"\s{2,}", " ", text)
        if text:
            if self._current_heading_level:
                self.md_lines.append(f"{'#' * self._current_heading_level} {text}")
            else:
                self.md_lines.append(text)
        self._current_text = []
        self._current_heading_level = 0

    def close(self):
        self._flush_block()
        super().close()


def build_markdown(title: str | None, md_lines: list[str], source_url: str) -> str:
    header = f"# {title}\n\n" if title else ""
    body = "\n\n".join(md_lines)
    footer = f"\n\nSource: {source_url}\n"
    return header + body + footer


def is_asset_path(path: str) -> bool:
    lowered = path.lower()
    return any(lowered.endswith(ext) for ext in ASSET_EXTENSIONS)


def fetch(url: str, timeout_seconds: float):
    """Single fetch attempt. Returns (status, content_type, body_bytes) or raises."""
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "*/*"})
    with urllib.request.urlopen(req, timeout=timeout_seconds) as resp:
        status = resp.status
        content_type = resp.headers.get("Content-Type", "")
        body = resp.read()
        return status, content_type, body


def load_sitemap_urls(base_url: str, timeout_seconds: float) -> list[str]:
    """Best-effort sitemap.xml parse. Returns [] on any failure; never raises to the caller.

    Per the raw research's stated failure discipline: "record reachable: false and move on rather
    than retrying into a block" [distilled-site-crawler.md section 5,
    raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md]. Applied
    here to sitemap discovery specifically: a missing or malformed sitemap is a normal, expected
    condition, not a crawl-stopping error.
    """
    sitemap_url = urljoin(base_url, "/sitemap.xml")
    try:
        status, content_type, body = fetch(sitemap_url, timeout_seconds)
    except Exception:
        return []
    if status != 200:
        return []
    try:
        root = ET.fromstring(body)
    except ET.ParseError:
        return []
    urls = []
    for elem in root.iter():
        tag = elem.tag.rsplit("}", 1)[-1]
        if tag == "loc" and elem.text:
            urls.append(elem.text.strip())
    return urls


def crawl(target_profile_path: str, out_dir: str, base_url: str, max_pages: int,
          delay_seconds: float, timeout_seconds: float):
    import os

    with open(target_profile_path, "r", encoding="utf-8") as f:
        target_profile = json.load(f)
    platform = str(target_profile.get("platform", "unknown")).lower()
    seeds = PLATFORM_SEEDS.get(platform, PLATFORM_SEEDS["unknown"])

    os.makedirs(out_dir, exist_ok=True)

    robots = urllib.robotparser.RobotFileParser()
    robots_url = urljoin(base_url, "/robots.txt")
    try:
        robots.set_url(robots_url)
        robots.read()
    except Exception:
        robots = None  # Missing/unreachable robots.txt is treated as "no restrictions stated."

    def allowed(url: str) -> bool:
        if robots is None:
            return True
        try:
            return robots.can_fetch(USER_AGENT, url)
        except Exception:
            return True

    seen: set[str] = set()
    frontier: list[tuple[str, str]] = []  # (url, discovered_via)

    root_url = normalize_url(base_url, "/")
    frontier.append((root_url, "seed-root"))
    seen.add(root_url)

    for seed_path in seeds:
        seed_url = normalize_url(base_url, seed_path)
        if seed_url and seed_url not in seen:
            frontier.append((seed_url, "platform-seed"))
            seen.add(seed_url)

    for sitemap_entry in load_sitemap_urls(base_url, timeout_seconds):
        normalized = normalize_url(base_url, sitemap_entry)
        if normalized and normalized not in seen:
            frontier.append((normalized, "sitemap"))
            seen.add(normalized)

    pages_meta = []
    unreachable = []
    fetch_order = 0

    while frontier and fetch_order < max_pages:
        url, discovered_via = frontier.pop(0)
        parsed = urlparse(url)
        if is_asset_path(parsed.path):
            continue
        if not allowed(url):
            unreachable.append({"url": url, "reason": "robots-disallowed", "fetch_order": None})
            continue

        try:
            status, content_type, body = fetch(url, timeout_seconds)
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, OSError) as exc:
            # Record reachable: false and move on; do not retry into a block. Per
            # distilled-site-crawler.md section 5.
            unreachable.append({"url": url, "reason": str(exc), "fetch_order": None})
            time.sleep(delay_seconds)
            continue

        if status != 200 or "text/html" not in content_type.lower():
            unreachable.append({
                "url": url,
                "reason": f"non-html-or-non-200 (status={status}, content-type={content_type})",
                "fetch_order": None,
            })
            time.sleep(delay_seconds)
            continue

        try:
            html_text = body.decode("utf-8", errors="replace")
        except Exception:
            html_text = body.decode("latin-1", errors="replace")

        parser = _LinkAndTextExtractor()
        parser.feed(html_text)
        parser.close()

        slug = slugify(url)
        existing_slugs = {p["slug"] for p in pages_meta}
        if slug in existing_slugs:
            digest = hashlib.md5(url.encode("utf-8")).hexdigest()[:6]
            slug = f"{slug}-{digest}"

        html_path = os.path.join(out_dir, f"{slug}.html")
        md_path = os.path.join(out_dir, f"{slug}.md")
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(html_text)
        markdown = build_markdown(parser.title, parser.md_lines, url)
        with open(md_path, "w", encoding="utf-8") as f:
            f.write(markdown)

        fetch_order += 1
        pages_meta.append({
            "url": url,
            "slug": slug,
            "html_path": f"site-data/{slug}.html",
            "md_path": f"site-data/{slug}.md",
            "discovered_via": discovered_via,
            "fetch_order": fetch_order,
            "http_status": status,
            "reachable": True,
            "content_type": content_type,
            "bytes_html": len(body),
            "fetched_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        })

        for link in parser.links:
            normalized = normalize_url(url, link)
            if not normalized or normalized in seen:
                continue
            if urlparse(normalized).netloc != urlparse(base_url).netloc:
                continue  # same-domain only; no cross-domain crawling.
            if is_asset_path(urlparse(normalized).path):
                continue
            seen.add(normalized)
            frontier.append((normalized, "link-follow"))

        time.sleep(delay_seconds)

    manifest = {
        "run_generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "target_url": base_url,
        "platform": platform,
        "rendering": target_profile.get("rendering", "unknown"),
        "max_pages": max_pages,
        "pages_fetched": len(pages_meta),
        "pages": pages_meta,
        "unreachable": unreachable,
    }
    manifest_path = os.path.join(out_dir, "manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    return manifest


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--target-profile", required=True, help="Path to _shared/target-profile.json")
    parser.add_argument("--out-dir", required=True, help="Path to this audit's site-data/ directory")
    parser.add_argument("--base-url", required=True, help="The audited site's canonical base URL")
    parser.add_argument("--max-pages", type=int, default=100)
    parser.add_argument("--delay-seconds", type=float, default=0.5)
    parser.add_argument("--timeout-seconds", type=float, default=15.0)
    args = parser.parse_args()

    manifest = crawl(
        target_profile_path=args.target_profile,
        out_dir=args.out_dir,
        base_url=args.base_url,
        max_pages=args.max_pages,
        delay_seconds=args.delay_seconds,
        timeout_seconds=args.timeout_seconds,
    )
    print(json.dumps({"pages_fetched": manifest["pages_fetched"],
                       "unreachable": len(manifest["unreachable"]),
                       "manifest_path": "site-data/manifest.json"}, indent=2))


if __name__ == "__main__":
    sys.exit(main())
