#!/usr/bin/env python3
"""aeo-technical.py - deterministic AEO (Answer Engine Optimization) technical-standards
validator for aeo-audit-stinger.

Grounded in skills/aeo-audit-stinger/references/research/distilled-aeo-audit.md
sections 2-4 (llms.txt standard, AI-crawler robots.txt access, structured-data/schema
signals). That archive is explicitly thin - two vendor/practitioner sources, no official
spec for llms.txt itself (see distillation Section 7, "Research gaps") - so this script
only ever states what it directly observed (a file exists at a given status, a schema
type is present in JSON-LD, a user-agent line is or is not disallowed). It never asserts
a citation-rate outcome; citation-rate claims belong in the subjective section of the
audit, not in this script's output. See skills/aeo-audit-stinger/guides/05-subjective-
topical-alignment.md for that separate, explicitly-labelled read.

Two checks, matching PRD-009 AC-1 ("llms.txt presence/correctness and AI-crawler access
are scored with direct evidence: file fetch result, robots directives"):

1. llms.txt presence, HTTP status, and shape (site name / description / section links
   present, per the minimum-content description in distillation Section 2).
2. AI-crawler robots.txt access, per-engine, for the six agents named in distillation
   Section 3: GPTBot (OpenAI/ChatGPT), PerplexityBot, ClaudeBot (Anthropic/Claude),
   Googlebot (Google Search AND Gemini - same user-agent), Google-Extended (Google AI
   features generally), Cohere-AI.

llms.txt and robots.txt are both singleton site-root metadata files, not part of the
100-page crawl budget in site-data/ - the same judgment call documented in
seo-technical.py's docstring applies here: a direct, bounded fetch of these two
well-known URLs is not a re-crawl of the page set PRD-009 restricts.

No third-party dependencies (stdlib only). No absolute paths.

Usage:
    python3 aeo-technical.py llms-txt --url https://example.com/llms.txt
    python3 aeo-technical.py robots-access --robots-url https://example.com/robots.txt
    python3 aeo-technical.py all --site https://example.com --out ./04-aeo/aeo-technical-findings.json
"""

import argparse
import json
import sys
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urljoin

USER_AGENT = "WebsiteAuditorLegionCode/1.0 (+aeo-audit-stinger; read-only audit tool)"
REQUEST_TIMEOUT = 15
LLMS_TXT_PRACTICAL_TRUNCATION_CHARS = 2000  # heuristic, not a spec - see distillation Section 2

# Section 3 of distilled-aeo-audit.md: engine -> user-agent token(s) to check in robots.txt
AI_AGENTS = [
    {"engine": "ChatGPT (OpenAI)", "agents": ["GPTBot", "ChatGPT-User"]},
    {"engine": "Perplexity", "agents": ["PerplexityBot"]},
    {"engine": "Claude (Anthropic)", "agents": ["ClaudeBot"]},
    {"engine": "Gemini / Google Search (shared UA)", "agents": ["Googlebot"]},
    {"engine": "Google AI features generally", "agents": ["Google-Extended"]},
    {"engine": "Cohere", "agents": ["Cohere-AI"]},
]

MINIMUM_LLMS_TXT_MARKERS = {
    "site_name_or_h1": r"^#\s+.+",  # llms.txt convention: leading H1 as site name
    "has_links": r"\[.+?\]\(https?://",
}


def fetch(url, timeout=REQUEST_TIMEOUT):
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
    except Exception as e:  # noqa: BLE001
        return None, "", {}, str(e)


def _load(url_arg, file_arg):
    if file_arg:
        return 200, Path(file_arg).read_text(encoding="utf-8", errors="replace"), {}, None, f"local file {file_arg}"
    if url_arg:
        status, text, headers, error = fetch(url_arg)
        return status, text, headers, error, url_arg
    return None, "", {}, "no URL or file given", "(not provided)"


# --------------------------------------------------------------------------------------
# llms.txt - distillation Section 2
# --------------------------------------------------------------------------------------


def check_llms_txt(status, text, error, source_label):
    findings = []
    if error and status is None:
        findings.append({
            "checkpoint": "llms.txt reachability",
            "severity_hint": "critical",
            "evidence": source_label,
            "detail": f"llms.txt could not be reached ({error}).",
            "source": "[raw/theaeoreport-com-answer-engine-optimization-checklist.md]",
        })
        return findings
    if status == 404:
        findings.append({
            "checkpoint": "llms.txt presence",
            "severity_hint": "critical",
            "evidence": f"{source_label} -> HTTP 404",
            "detail": (
                "No llms.txt at site root. Per this archive, engines that do not find it at root do not "
                "look elsewhere (no fallback subdirectory or meta-tag path is documented). As of May 2026, "
                "Google Lighthouse formally audits llms.txt under its 'Agentic Browsing' category and a "
                "missing file fails that category outright - one vendor source's specific claim, flagged as "
                "such, not independently corroborated in this archive."
            ),
            "source": "[raw/theaeoreport-com-answer-engine-optimization-checklist.md]",
        })
        return findings
    if status is not None and status != 200:
        findings.append({
            "checkpoint": "llms.txt reachability",
            "severity_hint": "high",
            "evidence": f"{source_label} -> HTTP {status}",
            "detail": "Unexpected non-200/non-404 status fetching llms.txt.",
            "source": "[raw/theaeoreport-com-answer-engine-optimization-checklist.md]",
        })
        return findings

    findings.append({
        "checkpoint": "llms.txt presence",
        "severity_hint": "informational",
        "evidence": f"{source_label} -> HTTP 200",
        "detail": "llms.txt is present at site root.",
        "source": "[raw/theaeoreport-com-answer-engine-optimization-checklist.md]",
    })

    char_count = len(text)
    if char_count > LLMS_TXT_PRACTICAL_TRUNCATION_CHARS:
        findings.append({
            "checkpoint": "llms.txt length",
            "severity_hint": "review",
            "evidence": f"{source_label}: {char_count} characters",
            "detail": (
                f"File exceeds ~{LLMS_TXT_PRACTICAL_TRUNCATION_CHARS} characters. One vendor source reports "
                "most engines truncate parsing around this point on initial parse (no official spec sets a "
                "hard limit, this is a practitioner heuristic, not a disclosed standard). If the critical "
                "site name/description/section links are not front-loaded, they may be dropped."
            ),
            "source": "[raw/theaeoreport-com-answer-engine-optimization-checklist.md]",
        })

    has_heading = bool(text.lstrip().startswith("#"))
    has_link = "](http" in text
    if not has_heading:
        findings.append({
            "checkpoint": "llms.txt shape: leading site identity",
            "severity_hint": "review",
            "evidence": source_label,
            "detail": "File does not open with a Markdown H1 (# Site Name), the conventional llms.txt shape for site identity. This archive has no official spec confirming this is required, only a description of typical minimum content (site name, one-line description, primary content sections with URLs); flagging for human review, not scoring as a hard failure.",
            "source": "[raw/theaeoreport-com-answer-engine-optimization-checklist.md]",
        })
    if not has_link:
        findings.append({
            "checkpoint": "llms.txt shape: section links",
            "severity_hint": "review",
            "evidence": source_label,
            "detail": "No Markdown links to content sections detected. The described minimum content includes primary content sections with URLs; confirm manually since this is a shape heuristic, not a validated parser.",
            "source": "[raw/theaeoreport-com-answer-engine-optimization-checklist.md]",
        })

    return findings


# --------------------------------------------------------------------------------------
# AI-crawler robots.txt access - distillation Section 3
# --------------------------------------------------------------------------------------


def parse_robots_txt_agent_rules(text):
    """Return {agent_lower: [(disallow|allow, path), ...]}.

    Standard robots.txt grouping: one or more consecutive User-agent lines form a single
    group that shares whatever Allow/Disallow lines follow. A rule line closes that
    group, so the next User-agent line (even if no blank line separates it) starts a
    NEW group rather than adding to the running list of agents. Getting this wrong
    silently cross-contaminates rules between unrelated agent blocks.
    """
    groups = {}
    current_agents = []
    group_open = False  # True while still collecting User-agent lines for the current group
    for raw_line in text.splitlines():
        line = raw_line.split("#", 1)[0].strip()
        if not line or ":" not in line:
            continue
        key, _, value = line.partition(":")
        key = key.strip().lower()
        value = value.strip()
        if key == "user-agent":
            agent = value.lower()
            if not group_open:
                current_agents = [agent]
                group_open = True
            else:
                current_agents.append(agent)
            groups.setdefault(agent, [])
        elif key in ("disallow", "allow"):
            group_open = False  # a rule line closes the current agent-collection group
            for agent in current_agents or ["*"]:
                groups.setdefault(agent, [])
                groups[agent].append((key, value))
    return groups


def evaluate_agent_access(groups, agent_token):
    """Blocked if the agent's own group (or '*' if no specific group exists) disallows '/'."""
    agent_lower = agent_token.lower()
    if agent_lower in groups:
        rules = groups[agent_lower]
        source = agent_token
    elif "*" in groups:
        rules = groups["*"]
        source = "* (no specific rule for this agent; falls through to the default group)"
    else:
        return "allowed", "no matching group and no default '*' group - full access by default"

    # Longest-match-wins per robots.txt convention, restricted to path-prefix rules that
    # apply to "/" or the site root; a simple, defensible read of "is this agent blocked
    # site-wide", not a full path-matching engine.
    blocked = False
    allowed_override = False
    for rule_type, path in rules:
        if path in ("/", ""):
            if rule_type == "disallow" and path == "/":
                blocked = True
            elif rule_type == "allow" and path == "/":
                allowed_override = True
    if allowed_override:
        return "allowed", f"{source}: explicit Allow: / present"
    if blocked:
        return "blocked", f"{source}: Disallow: / present"
    return "allowed", f"{source}: no site-wide Disallow found (path-specific rules may still apply, not evaluated by this script)"


def check_ai_crawler_access(status, text, error, source_label):
    findings = []
    if error and status is None:
        findings.append({
            "checkpoint": "AI-crawler robots.txt access",
            "severity_hint": "critical",
            "evidence": source_label,
            "detail": f"robots.txt could not be reached to evaluate AI-crawler access ({error}).",
            "source": "[raw/theaeoreport-com-answer-engine-optimization-checklist.md]",
        })
        return findings
    if status == 404:
        findings.append({
            "checkpoint": "AI-crawler robots.txt access",
            "severity_hint": "informational",
            "evidence": f"{source_label} -> HTTP 404",
            "detail": "No robots.txt found. No rules means no AI-crawler blocking by robots.txt; all six tracked agents are allowed by default.",
            "source": "[raw/theaeoreport-com-answer-engine-optimization-checklist.md]",
        })
        return findings
    if status is not None and status != 200:
        findings.append({
            "checkpoint": "AI-crawler robots.txt access",
            "severity_hint": "high",
            "evidence": f"{source_label} -> HTTP {status}",
            "detail": "Unexpected non-200/non-404 status fetching robots.txt; cannot evaluate AI-crawler access reliably.",
            "source": "",
        })
        return findings

    groups = parse_robots_txt_agent_rules(text)
    per_engine = []
    blocked_agents = []
    allowed_agents = []
    for entry in AI_AGENTS:
        engine = entry["engine"]
        for agent in entry["agents"]:
            state, why = evaluate_agent_access(groups, agent)
            per_engine.append({"engine": engine, "agent": agent, "state": state, "why": why})
            (blocked_agents if state == "blocked" else allowed_agents).append(agent)

    findings.append({
        "checkpoint": "AI-crawler robots.txt access (per-engine)",
        "severity_hint": "critical" if blocked_agents else "informational",
        "evidence": f"{source_label}: {json.dumps(per_engine)}",
        "detail": (
            f"{len(blocked_agents)} of {len(per_engine)} tracked agent lines are blocked site-wide: {blocked_agents}."
            if blocked_agents
            else "All six tracked AI-crawler agents (GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, Googlebot, Google-Extended, Cohere-AI) appear allowed site-wide based on a site-wide Disallow: / check."
        ),
        "source": "[raw/theaeoreport-com-answer-engine-optimization-checklist.md] [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md]",
    })

    gptbot_blocked = any(a["agent"] == "GPTBot" and a["state"] == "blocked" for a in per_engine)
    ccbot_state = evaluate_agent_access(groups, "CCBot")[0]
    if gptbot_blocked and ccbot_state == "allowed":
        findings.append({
            "checkpoint": "GPTBot-blocked-but-CCBot-allowed trap",
            "severity_hint": "review",
            "evidence": source_label,
            "detail": (
                "GPTBot is blocked while CCBot (Common Crawl) is allowed. Per this archive, that combination "
                "lets ChatGPT train on the content via Common Crawl's dataset while blocking GPTBot from "
                "citing that content directly in answers - described as 'the worst of both worlds' if the "
                "site's actual intent was to opt out of AI use entirely, or a genuine gap if the intent was "
                "only to prevent live-citation crawling. Confirm intent rather than treating either reading "
                "as automatically correct."
            ),
            "source": "[raw/theaeoreport-com-answer-engine-optimization-checklist.md]",
        })

    return findings


# --------------------------------------------------------------------------------------
# CLI
# --------------------------------------------------------------------------------------


def build_arg_parser():
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    sub = p.add_subparsers(dest="command", required=True)

    llms_p = sub.add_parser("llms-txt", help="Fetch/validate llms.txt")
    llms_p.add_argument("--url")
    llms_p.add_argument("--file")

    robots_p = sub.add_parser("robots-access", help="Evaluate AI-crawler access in robots.txt")
    robots_p.add_argument("--robots-url")
    robots_p.add_argument("--robots-file")

    all_p = sub.add_parser("all", help="Run llms.txt + AI-crawler-access checks for a site")
    all_p.add_argument("--site", help="Base URL, e.g. https://example.com (derives /llms.txt and /robots.txt)")
    all_p.add_argument("--llms-url")
    all_p.add_argument("--llms-file")
    all_p.add_argument("--robots-url")
    all_p.add_argument("--robots-file")

    for sp in (llms_p, robots_p, all_p):
        sp.add_argument("--out", default=None)

    return p


def main(argv=None):
    args = build_arg_parser().parse_args(argv)
    findings = []

    if args.command == "llms-txt":
        status, text, _h, error, label = _load(args.url, args.file)
        findings.extend(check_llms_txt(status, text, error, label))

    elif args.command == "robots-access":
        status, text, _h, error, label = _load(args.robots_url, args.robots_file)
        findings.extend(check_ai_crawler_access(status, text, error, label))

    elif args.command == "all":
        llms_url = args.llms_url or (urljoin(args.site.rstrip("/") + "/", "llms.txt") if args.site else None)
        robots_url = args.robots_url or (urljoin(args.site.rstrip("/") + "/", "robots.txt") if args.site else None)
        status, text, _h, error, label = _load(llms_url, args.llms_file)
        findings.extend(check_llms_txt(status, text, error, label))
        status, text, _h, error, label = _load(robots_url, args.robots_file)
        findings.extend(check_ai_crawler_access(status, text, error, label))

    output = json.dumps({"tool": "aeo-technical.py", "findings": findings, "count": len(findings)}, indent=2)
    if args.out:
        Path(args.out).write_text(output, encoding="utf-8")
        print(f"Wrote {len(findings)} finding(s) to {args.out}")
    else:
        print(output)
    return 0


if __name__ == "__main__":
    sys.exit(main())
