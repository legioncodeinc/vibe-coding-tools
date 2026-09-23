#!/usr/bin/env python3
"""select-recent-posts.py

Deterministic helper for blog-content-wasp-drone (wave W6a, conditional).

Given a crawled `site-data/` corpus (produced by site-crawler-wasp-drone: one
`<slug>.html` and one `<slug>.md` per crawled page), this script:

1. Finds pages that look like blog posts, using a path-pattern heuristic
   (`--path-pattern`, default matches /blog/, /news/, /articles/, /insights/,
   /resources/, /guides/ segments).
2. Extracts a publish date per candidate page from, in priority order:
   JSON-LD `datePublished`, the `<meta property="article:published_time">`
   tag, an `<time datetime="...">` element, then (fallback) a `date:` field
   in the paired markdown file's frontmatter.
3. Sorts by that date descending and keeps the top `--count` (default 10).
4. Computes a word count for each kept post from the paired `.md` file's
   body (frontmatter stripped, markdown syntax characters stripped, then a
   plain whitespace split).

This script does NOT judge quality and does NOT estimate AI authorship.
Word count and recency ranking are the only two things in this pipeline
that are genuinely deterministic; per this Stinger's binding conduct rule
(see guides/03-ai-authorship-probability-band-reporting.md) subjective
quality reads and AI-authorship probability bands are produced by the Drone's
own reasoning against the distilled research, never by a script, and never
presented as this script's output.

No third-party dependencies. Stdlib only. No absolute paths - pass the
site-data directory in with --site-data.

Usage:
    python3 select-recent-posts.py --site-data /path/to/site-data --count 10 --out /path/to/11-blog/post-selection.json

Output JSON shape:
    {
      "generated_by": "select-recent-posts.py",
      "requested_count": 10,
      "candidates_found": 14,
      "posts": [
        {
          "slug": "why-we-rebuilt-our-onboarding",
          "url": "https://example.com/blog/why-we-rebuilt-our-onboarding",
          "html_path": "site-data/why-we-rebuilt-our-onboarding.html",
          "md_path": "site-data/why-we-rebuilt-our-onboarding.md",
          "published_date": "2026-07-30",
          "date_source": "json-ld:datePublished",
          "word_count": 1284
        },
        ...
      ],
      "warnings": []
    }

If fewer than `--count` candidates are found, `posts` holds whatever was
found and a warning is added - the calling Drone decides how to report that
(it is not this script's job to pad or invent posts).
"""

import argparse
import json
import re
import sys
from datetime import datetime
from pathlib import Path

DEFAULT_PATH_PATTERN = r"/(blog|news|articles|insights|resources|guides)/"

DATE_PATTERNS = [
    # JSON-LD datePublished, tolerant of surrounding whitespace/quotes.
    (re.compile(r'"datePublished"\s*:\s*"([^"]+)"'), "json-ld:datePublished"),
    (re.compile(r'<meta[^>]+property=["\']article:published_time["\'][^>]+content=["\']([^"\']+)["\']', re.IGNORECASE), "meta:article:published_time"),
    (re.compile(r'<time[^>]+datetime=["\']([^"\']+)["\']', re.IGNORECASE), "time:datetime"),
]

FRONTMATTER_DATE_PATTERN = re.compile(r'^date:\s*["\']?([0-9]{4}-[0-9]{2}-[0-9]{2}[^"\'\n]*)', re.MULTILINE)


def parse_date(raw):
    """Best-effort ISO-ish date parse. Returns a datetime or None."""
    raw = raw.strip()
    for fmt in ("%Y-%m-%dT%H:%M:%S%z", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%d", "%Y/%m/%d"):
        try:
            return datetime.strptime(raw, fmt)
        except ValueError:
            continue
    # Trim a trailing "Z" or timezone offset the strptime formats above missed.
    trimmed = re.sub(r"Z$", "", raw)
    for fmt in ("%Y-%m-%dT%H:%M:%S", "%Y-%m-%d"):
        try:
            return datetime.strptime(trimmed[:19] if "T" in trimmed else trimmed[:10], fmt)
        except ValueError:
            continue
    return None


def extract_date(html_text, md_text):
    for pattern, source in DATE_PATTERNS:
        match = pattern.search(html_text)
        if match:
            parsed = parse_date(match.group(1))
            if parsed:
                return parsed, source
    if md_text:
        match = FRONTMATTER_DATE_PATTERN.search(md_text)
        if match:
            parsed = parse_date(match.group(1).strip())
            if parsed:
                return parsed, "frontmatter:date"
    return None, None


def strip_frontmatter(md_text):
    if md_text.startswith("---"):
        end = md_text.find("\n---", 3)
        if end != -1:
            return md_text[end + 4 :]
    return md_text


def word_count(md_text):
    body = strip_frontmatter(md_text)
    # Drop fenced code blocks - they are not editorial prose.
    body = re.sub(r"```.*?```", " ", body, flags=re.DOTALL)
    # Strip markdown link/image syntax down to the visible text.
    body = re.sub(r"!\[([^\]]*)\]\([^)]+\)", r"\1", body)
    body = re.sub(r"\[([^\]]*)\]\([^)]+\)", r"\1", body)
    # Strip remaining markup characters that are not word content.
    body = re.sub(r"[#>*_`~|]", " ", body)
    words = body.split()
    return len(words)


def find_candidates(site_data_dir, path_pattern):
    pattern = re.compile(path_pattern)
    candidates = []
    for html_path in sorted(site_data_dir.glob("*.html")):
        slug = html_path.stem
        md_path = html_path.with_suffix(".md")
        html_text = html_path.read_text(encoding="utf-8", errors="ignore")
        # Recover the crawled URL from a canonical link tag if present,
        # otherwise fall back to the slug - this script does not invent a
        # domain.
        url_match = re.search(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\']', html_text, re.IGNORECASE)
        url = url_match.group(1) if url_match else slug
        if not pattern.search(url) and not pattern.search(slug):
            continue
        candidates.append((slug, url, html_path, md_path, html_text))
    return candidates


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--site-data", required=True, help="Path to the run's site-data/ directory")
    parser.add_argument("--count", type=int, default=10, help="How many most-recent posts to keep (default 10, per PRD-018 AC-2)")
    parser.add_argument("--path-pattern", default=DEFAULT_PATH_PATTERN, help="Regex used to identify blog-section URLs/slugs")
    parser.add_argument("--out", default=None, help="Write JSON here instead of stdout")
    args = parser.parse_args()

    site_data_dir = Path(args.site_data)
    if not site_data_dir.is_dir():
        print(json.dumps({"error": f"--site-data path does not exist or is not a directory: {site_data_dir}"}))
        sys.exit(1)

    warnings = []
    candidates = find_candidates(site_data_dir, args.path_pattern)

    dated = []
    for slug, url, html_path, md_path, html_text in candidates:
        md_text = md_path.read_text(encoding="utf-8", errors="ignore") if md_path.exists() else ""
        published_date, date_source = extract_date(html_text, md_text)
        if published_date is None:
            warnings.append(f"no publish date found for candidate '{slug}', excluded from ranking")
            continue
        wc = word_count(md_text) if md_text else 0
        if not md_text:
            warnings.append(f"no paired .md file found for '{slug}', word_count is 0")
        dated.append(
            {
                "slug": slug,
                "url": url,
                "html_path": str(html_path),
                "md_path": str(md_path) if md_path.exists() else None,
                "published_date": published_date.strftime("%Y-%m-%d"),
                "date_source": date_source,
                "word_count": wc,
                "_sort_key": published_date,
            }
        )

    dated.sort(key=lambda p: p["_sort_key"], reverse=True)
    kept = dated[: args.count]
    for p in kept:
        del p["_sort_key"]

    if len(kept) < args.count:
        warnings.append(f"only {len(kept)} dated blog candidates found, fewer than the requested {args.count}")

    result = {
        "generated_by": "select-recent-posts.py",
        "requested_count": args.count,
        "candidates_found": len(candidates),
        "posts": kept,
        "warnings": warnings,
    }

    output = json.dumps(result, indent=2)
    if args.out:
        Path(args.out).write_text(output, encoding="utf-8")
    else:
        print(output)


if __name__ == "__main__":
    main()
