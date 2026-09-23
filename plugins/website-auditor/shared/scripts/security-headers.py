#!/usr/bin/env python3
"""security-headers.py - external, passive HTTP security-header check.

Used by: web-security-posture-stinger (see shared/scripts/README.md).

WHAT THIS SCRIPT IS. A read-only HTTP HEAD (falling back to GET if the
server rejects HEAD) against one or more already-known URLs, using only the
Python standard library, so it runs unmodified on every target harness.
It never authenticates, never submits a form, never places an order, and
never sends anything but a plain HEAD/GET request, per the plugin's binding
conduct rule 1 (read-only by default, plan/website-auditor-build-plan.md
section 7) and PRD-014's non-goal (no exploitation, no authentication
bypass, no file-upload testing by default).

WHAT THIS SCRIPT CHECKS AND WHY. The header set and recommended values below
are grounded in this Stinger's distilled research (references/research/
distilled-web-security-posture.md section 1), itself synthesized from
OWASP's HTTP Headers Cheat Sheet and Google's web.dev security-headers
article, both official docs. Where the two sources disagree on emphasis,
distilled section 1 already reconciled it; this script implements that
reconciled table, not either source alone.

Each header is scored on the build plan's zero-to-six scale (section 4.1).
Presence/value checks here are the "boolean checkpoints resolve only to 6
or 1" case named explicitly in that section, since a header is either
present with an acceptable value or it is not; there is no partial-credit
case a passive HEAD request can observe.

EXPLICIT GAPS, NOT GUESSED. Per distilled-web-security-posture.md section 6:
nothing in this Stinger's research archive documents TLS/certificate-chain
configuration (cipher suites, chain validation, expiry monitoring) beyond
OWASP's one-line HSTS warning, and nothing documents payment-path integrity
at all. This script performs one coarse TLS reachability check (does the
https:// URL resolve without a certificate error, using Python's default
verifying SSL context) and explicitly labels it "coarse, not a full TLS
audit" in its own output. It makes no payment-path claim whatsoever; that
scope item stays an open, explicitly-flagged research gap for the Drone to
report as "requires internal verification" (conduct rule 5), not to fill
in from training data.

USAGE
    python3 security-headers.py --url https://example.com --out path/to/07-security/header-scan-findings.json
    python3 security-headers.py --urls-file path/to/urls.txt --out path/to/07-security/header-scan-findings.json

No absolute paths are hard-coded; pass real paths/URLs on the command line.
Runs on Python 3.8+, standard library only.
"""

from __future__ import annotations

import argparse
import json
import socket
import ssl
import sys
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urlparse

USER_AGENT = "LegionCodeWebsiteAuditor/1.0 (+external passive security-header check; read-only, no auth, no payload)"
TIMEOUT_SECONDS = 15


def fetch_headers(url: str):
    """HEAD first; GET fallback only if the server rejects HEAD (405/501)."""
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT_SECONDS) as resp:
            return dict(resp.headers), resp.status, resp.geturl(), "HEAD"
    except urllib.error.HTTPError as e:
        if e.code in (405, 501):
            req = urllib.request.Request(url, method="GET", headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=TIMEOUT_SECONDS) as resp:
                return dict(resp.headers), resp.status, resp.geturl(), "GET (HEAD rejected)"
        return dict(e.headers or {}), e.code, url, f"HEAD (error {e.code})"


def coarse_tls_check(url: str):
    """Confirms an HTTPS handshake completes with default certificate verification.

    This is explicitly NOT a TLS/cipher-suite audit; that scope item is an
    unresearched gap (distilled section 6). It only answers: does a standard
    client trust this certificate chain right now.
    """
    parsed = urlparse(url)
    if parsed.scheme != "https":
        return {
            "checked": False,
            "reason": f"URL scheme is {parsed.scheme!r}, not https; HSTS/TLS checks do not apply the same way",
        }
    host = parsed.hostname
    port = parsed.port or 443
    ctx = ssl.create_default_context()
    try:
        with socket.create_connection((host, port), timeout=TIMEOUT_SECONDS) as sock:
            with ctx.wrap_socket(sock, server_hostname=host) as ssock:
                cert = ssock.getpeercert()
                return {
                    "checked": True,
                    "handshake_ok": True,
                    "certificate_subject": cert.get("subject"),
                    "certificate_not_after": cert.get("notAfter"),
                    "note": "Coarse check only: confirms the certificate chain verifies with the default trust store and reports expiry. Cipher-suite strength, chain intermediate validation depth, and revocation status are NOT checked here (unresearched gap, distilled-web-security-posture.md section 6).",
                }
    except ssl.SSLCertVerificationError as e:
        return {"checked": True, "handshake_ok": False, "error": str(e)}
    except OSError as e:
        return {"checked": True, "handshake_ok": False, "error": str(e)}


def parse_set_cookie(raw_headers, header_name="Set-Cookie"):
    """http.client.HTTPMessage folds repeated headers; get_all preserves each Set-Cookie."""
    return raw_headers.get_all(header_name) if hasattr(raw_headers, "get_all") else None


def evaluate(url: str):
    findings = []
    headers, status, final_url, method_used = fetch_headers(url)
    lower_headers = {k.lower(): v for k, v in headers.items()}

    def h(name):
        return lower_headers.get(name.lower())

    # --- Required-present headers, boolean 6/1, distilled section 1 ---
    hsts = h("Strict-Transport-Security")
    findings.append({
        "checkpoint": "hsts-present",
        "header": "Strict-Transport-Security",
        "score": 6 if hsts else 1,
        "evidence": hsts or "(header absent)",
        "justification": "OWASP-recommended: max-age=63072000; includeSubDomains; preload. Forces HTTPS-only access. [raw/cheatsheetseries-owasp-org-cheatsheets-http-headers-cheat-sheet-html.md] [raw/web-dev-articles-security-headers.md]",
        "note": "If present with a long max-age alongside a lapsed certificate, OWASP warns this can lock out legitimate users; cross-check against the coarse TLS result below." if hsts else None,
    })

    csp = h("Content-Security-Policy")
    findings.append({
        "checkpoint": "csp-present",
        "header": "Content-Security-Policy",
        "score": 6 if csp else 1,
        "evidence": csp or "(header absent)",
        "justification": "Mitigates XSS and data-injection by restricting script/origin loading. Nonce-based (server-rendered) or hash-based (static/cached) strategy per web.dev. [raw/cheatsheetseries-owasp-org-cheatsheets-http-headers-cheat-sheet-html.md] [raw/web-dev-articles-security-headers.md]",
    })

    xfo = h("X-Frame-Options")
    csp_has_frame_ancestors = bool(csp and "frame-ancestors" in csp.lower())
    findings.append({
        "checkpoint": "clickjacking-protection",
        "header": "X-Frame-Options or CSP frame-ancestors",
        "score": 6 if (xfo or csp_has_frame_ancestors) else 1,
        "evidence": xfo or (f"CSP frame-ancestors present: {csp}" if csp_has_frame_ancestors else "(neither header present)"),
        "justification": "OWASP notes CSP's frame-ancestors obsoletes X-Frame-Options for supporting browsers; either satisfies this checkpoint. [raw/cheatsheetseries-owasp-org-cheatsheets-http-headers-cheat-sheet-html.md]",
    })

    xcto = h("X-Content-Type-Options")
    findings.append({
        "checkpoint": "mime-sniffing-protection",
        "header": "X-Content-Type-Options",
        "score": 6 if xcto and xcto.lower() == "nosniff" else 1,
        "evidence": xcto or "(header absent)",
        "justification": "Recommended value: nosniff. Blocks MIME-sniffing / MIME confusion attacks. [raw/cheatsheetseries-owasp-org-cheatsheets-http-headers-cheat-sheet-html.md] [raw/web-dev-articles-security-headers.md]",
    })

    referrer = h("Referrer-Policy")
    findings.append({
        "checkpoint": "referrer-policy-present",
        "header": "Referrer-Policy",
        "score": 6 if referrer else 1,
        "evidence": referrer or "(header absent)",
        "justification": "OWASP recommends setting explicitly (e.g. strict-origin-when-cross-origin) even though modern browsers default similarly, for older-browser users. [raw/cheatsheetseries-owasp-org-cheatsheets-http-headers-cheat-sheet-html.md]",
    })

    # --- Headers that should NOT be present / should be explicitly disabled ---
    xxss = h("X-XSS-Protection")
    xxss_ok = (xxss is None) or (xxss.strip() == "0")
    findings.append({
        "checkpoint": "legacy-xss-filter-not-misconfigured",
        "header": "X-XSS-Protection",
        "score": 6 if xxss_ok else 1,
        "evidence": xxss if xxss is not None else "(header absent, which is fine)",
        "justification": "OWASP: do not set, or explicitly disable (value 0); this legacy header can itself introduce XSS and is superseded by CSP. [raw/cheatsheetseries-owasp-org-cheatsheets-http-headers-cheat-sheet-html.md]",
    })

    expect_ct = h("Expect-CT")
    findings.append({
        "checkpoint": "expect-ct-not-present",
        "header": "Expect-CT",
        "score": 6 if expect_ct is None else 1,
        "evidence": expect_ct if expect_ct is not None else "(header absent, which is correct)",
        "justification": "OWASP marks this header deprecated with an explicit warning; mainstream clients now require CT qualification independent of it. [raw/cheatsheetseries-owasp-org-cheatsheets-http-headers-cheat-sheet-html.md]",
    })

    # --- Cookie flags, evaluated per Set-Cookie header present, not boolean-scored overall ---
    set_cookie_raw = None
    # urllib's HTTPMessage (headers) supports get_all for repeated header names.
    try:
        req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=TIMEOUT_SECONDS) as resp:
            set_cookie_raw = resp.headers.get_all("Set-Cookie")
    except Exception:  # noqa: BLE001 - cookie-flag detail is best-effort, not the primary checkpoint
        set_cookie_raw = None

    cookie_findings = []
    if set_cookie_raw:
        for cookie in set_cookie_raw:
            lc = cookie.lower()
            cookie_findings.append({
                "cookie": cookie.split("=", 1)[0],
                "secure": "secure" in lc,
                "httponly": "httponly" in lc,
                "samesite": "samesite=strict" in lc and "strict" or ("samesite=lax" in lc and "lax") or ("samesite=none" in lc and "none") or None,
                "raw": cookie,
            })
    findings.append({
        "checkpoint": "cookie-flags",
        "header": "Set-Cookie",
        "score": None,
        "evidence": cookie_findings if cookie_findings else "(no Set-Cookie header observed on this request; re-check an authenticated or session-bearing page if one exists)",
        "justification": "Not itself scored as a single boolean; OWASP defers cookie-attribute depth to its Session Management Cheat Sheet, not archived here. Report per-cookie Secure/HttpOnly/SameSite presence as evidence for the Drone to score per PRD-014's evidence-pointer requirement. [raw/cheatsheetseries-owasp-org-cheatsheets-http-headers-cheat-sheet-html.md]",
    })

    cache_control = h("Cache-Control")
    findings.append({
        "checkpoint": "cache-control-present",
        "header": "Cache-Control",
        "score": 6 if cache_control else 1,
        "evidence": cache_control or "(header absent)",
        "justification": "no-store for sensitive data, private for user-specific caching; note no-cache does NOT prevent caching, it only forces revalidation. [raw/cheatsheetseries-owasp-org-cheatsheets-http-headers-cheat-sheet-html.md]",
        "note": "This script only checks presence; whether the value is appropriate to the page's sensitivity is a judgment call for the Drone, not this script.",
    })

    tls = coarse_tls_check(final_url)

    return {
        "url_requested": url,
        "final_url": final_url,
        "http_status": status,
        "method_used": method_used,
        "findings": findings,
        "coarse_tls_check": tls,
        "unresearched_gaps": [
            "TLS cipher-suite strength and full certificate-chain validation depth: not documented in this Stinger's raw research archive beyond OWASP's one-line HSTS/lapsed-certificate warning.",
            "Payment-path integrity (checkout-flow script integrity, PCI-relevant header/script controls, payment-form injection detection): not documented at all in this Stinger's raw research archive. Report as requiring internal verification, per conduct rule 5, not as a scored finding.",
        ],
    }


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--url", help="A single URL to check (typically the landing page)")
    ap.add_argument("--urls-file", help="A text file, one URL per line, for checking multiple crawled pages")
    ap.add_argument("--out", required=True, help="Path to write the JSON findings file")
    args = ap.parse_args()

    urls = []
    if args.url:
        urls.append(args.url)
    if args.urls_file:
        urls.extend(
            line.strip()
            for line in Path(args.urls_file).read_text(encoding="utf-8").splitlines()
            if line.strip() and not line.strip().startswith("#")
        )
    if not urls:
        print("error: pass --url or --urls-file", file=sys.stderr)
        return 2

    results = []
    for url in urls:
        try:
            results.append(evaluate(url))
        except (urllib.error.URLError, OSError, socket.timeout) as exc:
            results.append({
                "url_requested": url,
                "error": f"{type(exc).__name__}: {exc}",
                "note": "Request failed entirely; report as requiring internal verification rather than scoring a finding from an unreachable target.",
            })

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps({"script": "security-headers.py", "results": results}, indent=2), encoding="utf-8")
    print(f"wrote {out_path} ({len(urls)} URL(s) checked)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
