#!/usr/bin/env python3
"""Capture CDN/caching-related response headers for a sampled page set.

Grounding note: the header NAMES and their general meanings in
CDN_IDENTIFYING_HEADERS and CACHE_HEADERS below are general, long-standing
HTTP and CDN-vendor convention (RFC 9111 Cache-Control semantics, and
publicly documented vendor edge headers). None of this is cited to a source
in this Stinger's references/research/raw/ archive, per the archive's own
gap note (references/research/distilled-performance-cwv.md, section 7):
neither raw source documents CDN caching behavior or header-level audit
methodology. This script performs mechanical, read-only HTTP header capture
only. It does not judge whether a caching strategy is "good", that
adequacy judgment is out of scope until a dedicated research pass exists,
see guides/02-cdn-and-caching-headers.md.

Read-only and passive, per this pair's conduct rules: issues a HEAD request
(falling back to a Range-limited GET if HEAD is rejected) against each URL,
never a POST/PUT/DELETE, never authenticates, never submits a form.

Harness-portable: standard library only (urllib), no absolute paths, no
third-party dependencies.

Usage:
    python3 cdn-header-scan.py --urls url1 url2 ... [--out findings.json]
    python3 cdn-header-scan.py --url-file path/to/urls.txt [--out findings.json]
"""

from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

CACHE_HEADERS = [
    "Cache-Control",
    "CDN-Cache-Control",
    "Age",
    "ETag",
    "Vary",
    "Expires",
]

CDN_IDENTIFYING_HEADERS = [
    "Server",
    "X-Cache",
    "X-Served-By",
    "Via",
    "CF-Ray",
    "CF-Cache-Status",
    "X-Amz-Cf-Id",
    "X-Amz-Cf-Pop",
    "X-Akamai-Transformed",
    "X-Vercel-Cache",
    "X-Vercel-Id",
    "X-Nf-Request-Id",
    "X-Fastly-Request-Id",
]

USER_AGENT = (
    "Mozilla/5.0 (compatible; LegionCodeWebsiteAuditor/1.0; "
    "+https://legioncode.example/website-auditor)"
)


def _fetch_headers(url: str, timeout: float = 15.0) -> dict:
    request = urllib.request.Request(url, method="HEAD", headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:  # noqa: S310
            return {
                "status": response.status,
                "method": "HEAD",
                "headers": dict(response.headers.items()),
            }
    except urllib.error.HTTPError as exc:
        if exc.code in (405, 501):
            # Some origins reject HEAD; fall back to a read-only GET.
            get_request = urllib.request.Request(url, method="GET", headers={"User-Agent": USER_AGENT})
            try:
                with urllib.request.urlopen(get_request, timeout=timeout) as response:  # noqa: S310
                    return {
                        "status": response.status,
                        "method": "GET",
                        "headers": dict(response.headers.items()),
                    }
            except urllib.error.URLError as get_exc:
                return {"error": str(get_exc)}
        return {"error": f"HTTP {exc.code}: {exc.reason}"}
    except urllib.error.URLError as exc:
        return {"error": str(exc)}


def scan_url(url: str) -> dict:
    result = _fetch_headers(url)
    if "error" in result:
        return {"url": url, "error": result["error"]}

    headers = result["headers"]
    cache = {name: headers[name] for name in CACHE_HEADERS if name in headers}
    cdn = {name: headers[name] for name in CDN_IDENTIFYING_HEADERS if name in headers}

    return {
        "url": url,
        "status": result["status"],
        "request_method": result["method"],
        "cache_headers": cache,
        "cdn_identifying_headers": cdn,
        "cache_control_present": "Cache-Control" in headers,
        "raw_headers": headers,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--urls", nargs="*", default=None, help="One or more URLs to scan.")
    parser.add_argument(
        "--url-file",
        default=None,
        help="Path to a text file with one URL per line (e.g. drawn from site-data/).",
    )
    parser.add_argument("--out", default=None, help="Optional path to write JSON output. Defaults to stdout.")
    args = parser.parse_args()

    urls = list(args.urls or [])
    if args.url_file:
        file_path = Path(args.url_file)
        if not file_path.exists():
            print(f"error: url file not found: {file_path}", file=sys.stderr)
            return 1
        urls.extend(
            line.strip()
            for line in file_path.read_text(encoding="utf-8").splitlines()
            if line.strip() and not line.strip().startswith("#")
        )

    if not urls:
        print("error: no URLs provided, use --urls or --url-file", file=sys.stderr)
        return 1

    results = [scan_url(url) for url in urls]
    payload = json.dumps(results, indent=2)

    if args.out:
        Path(args.out).write_text(payload, encoding="utf-8")
    else:
        print(payload)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
