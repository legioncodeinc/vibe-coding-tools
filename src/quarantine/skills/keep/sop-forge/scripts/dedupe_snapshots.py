#!/usr/bin/env python3
"""
dedupe_snapshots.py

Deterministic snapshot deduplication and secret scanning for sop-forge.

Littlebird screen capture of a single UI state produces many near-identical snapshots.
Writing an SOP from the raw retrieval produces the same step eleven times. This script
collapses a timestamp-sorted snapshot list into distinct UI states, and separately scans
extracted text for credential-shaped strings that must be redacted before any SOP prose
is written.

It is deliberately dumb and deterministic. It does not decide what a step is. It groups
frames and flags candidates, and a human or the model reads the output. Two states it
merged may be two genuinely different steps on a screen that barely changed, so check any
state whose duration or member count is large.

Note on evidence: the research archive behind this skill contains no source on
deduplicating near-identical capture frames. The method here is an engineering decision
made for this skill, not a documented industry practice. See
references/research/distilled-sop-craft.md section 11.

INPUT
-----
JSON, either a bare list or an object with a "snapshots" key. Each item:

    {
      "timestamp": "2026-08-13T14:12:03",   # ISO 8601, or any sortable string
      "app": "chrome",                       # optional, defaults to ""
      "score": 4,                            # optional relevance score 0-5
      "text": "Workflow Builder\nAdd Action\n..."
    }

Build this file from the search_user_context results after sorting by timestamp.
See references/session-reconstruction.md steps 4 and 5.

USAGE
-----
    python3 dedupe_snapshots.py timeline.json
    python3 dedupe_snapshots.py timeline.json --json states.json
    python3 dedupe_snapshots.py timeline.json --threshold 0.90 --max-gap 180
    python3 dedupe_snapshots.py timeline.json --scan-secrets
    python3 dedupe_snapshots.py timeline.json --scan-secrets --secrets-only

EXIT CODES
----------
    0  ran cleanly
    1  bad input
    2  ran cleanly and found secret candidates (only with --scan-secrets)
"""

import argparse
import json
import re
import sys
from datetime import datetime

# ---------------------------------------------------------------- normalization

# UI chrome that appears in nearly every frame and carries no state information.
# Lines that are only this get dropped before similarity is computed.
_CHROME_LINES = {
    "", "search", "settings", "help", "profile", "menu", "close", "back",
    "notifications", "account", "log out", "sign out", "home", "dashboard",
}

_TOKEN_RE = re.compile(r"[a-z0-9]+")
# Volatile substrings that change every frame and would otherwise defeat matching:
# clock readouts, relative times, and pure separators.
_VOLATILE_RE = re.compile(
    r"\b(\d{1,2}:\d{2}(:\d{2})?\s*(am|pm)?"
    r"|\d+\s*(second|minute|hour|day)s?\s*ago"
    r"|just now)\b",
    re.IGNORECASE,
)


def normalize(text):
    """Lowercase, strip volatile time strings and chrome-only lines, return token set."""
    if not text:
        return frozenset()
    text = _VOLATILE_RE.sub(" ", text.lower())
    kept = []
    for line in text.splitlines():
        stripped = line.strip()
        if stripped in _CHROME_LINES:
            continue
        kept.append(stripped)
    return frozenset(_TOKEN_RE.findall(" ".join(kept)))


def jaccard(a, b):
    """Token-set overlap. 1.0 identical, 0.0 disjoint."""
    if not a and not b:
        return 1.0
    if not a or not b:
        return 0.0
    inter = len(a & b)
    union = len(a | b)
    return inter / union if union else 0.0


def parse_ts(value):
    """Best-effort ISO 8601 parse. Returns None if unparseable, which disables the
    time-adjacency rule for that pair rather than crashing."""
    if not isinstance(value, str):
        return None
    candidate = value.strip().replace("Z", "+00:00")
    try:
        return datetime.fromisoformat(candidate)
    except ValueError:
        pass
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%d %H:%M"):
        try:
            return datetime.strptime(value.strip(), fmt)
        except ValueError:
            continue
    return None


def seconds_between(a, b):
    ta, tb = parse_ts(a), parse_ts(b)
    if ta is None or tb is None:
        return None
    return abs((tb - ta).total_seconds())


# ---------------------------------------------------------------- grouping

def group_states(snapshots, threshold, max_gap):
    """Collapse a timestamp-sorted snapshot list into UI states.

    Three signals, all of which must allow a merge:
      1. token-set similarity to the state's representative is at or above threshold
      2. the gap to the previous snapshot is at or below max_gap seconds
      3. the app has not changed

    Similarity is measured against the state's current representative rather than the
    immediately preceding frame, so a long run of slowly drifting frames cannot chain
    its way into one state.
    """
    states = []
    for snap in snapshots:
        tokens = normalize(snap.get("text", ""))
        app = snap.get("app", "") or ""

        merged = False
        if states:
            cur = states[-1]
            gap = seconds_between(cur["members"][-1]["timestamp"], snap.get("timestamp"))
            same_app = cur["app"] == app
            close_enough = gap is None or gap <= max_gap
            sim = jaccard(cur["rep_tokens"], tokens)
            if same_app and close_enough and sim >= threshold:
                cur["members"].append(snap)
                # Representative is the member with the most extracted text, because
                # that frame carries the most field values.
                if len(snap.get("text", "")) > len(cur["rep"].get("text", "")):
                    cur["rep"] = snap
                    cur["rep_tokens"] = tokens
                merged = True

        if not merged:
            states.append({
                "app": app,
                "rep": snap,
                "rep_tokens": tokens,
                "members": [snap],
            })

    out = []
    for i, st in enumerate(states):
        first = st["members"][0].get("timestamp")
        last = st["members"][-1].get("timestamp")
        dur = seconds_between(first, last)
        scores = [m.get("score") for m in st["members"] if isinstance(m.get("score"), (int, float))]
        out.append({
            "state": i + 1,
            "app": st["app"],
            "first_seen": first,
            "last_seen": last,
            "duration_seconds": dur,
            "frames": len(st["members"]),
            "max_score": max(scores) if scores else None,
            "text": st["rep"].get("text", ""),
            "representative_timestamp": st["rep"].get("timestamp"),
        })
    return out


# ---------------------------------------------------------------- secret scan

# Structural signatures only. This finds shape, never meaning, so it misses any
# sensitive value that does not look unusual. The semantic sweep in
# references/redaction-pass.md is not optional just because this ran.
SECRET_PATTERNS = [
    ("stripe-style secret key",   re.compile(r"\bsk_(live|test)_[A-Za-z0-9]{16,}")),
    ("openai-style key",          re.compile(r"\bsk-[A-Za-z0-9_\-]{20,}")),
    ("publishable key",           re.compile(r"\bpk_(live|test)_[A-Za-z0-9]{16,}")),
    ("github token",              re.compile(r"\bgh[pousr]_[A-Za-z0-9]{20,}")),
    ("slack token",               re.compile(r"\bxox[abprs]-[A-Za-z0-9\-]{10,}")),
    ("aws access key id",         re.compile(r"\b(AKIA|ASIA)[0-9A-Z]{16}\b")),
    ("google api key",            re.compile(r"\bAIza[0-9A-Za-z_\-]{35}\b")),
    ("jwt",                       re.compile(r"\beyJ[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}")),
    ("bearer header",             re.compile(r"\bBearer\s+[A-Za-z0-9._\-]{16,}")),
    ("private key block",         re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----")),
    ("connection string",         re.compile(r"\b[a-z+]{2,12}://[^\s:@/]+:[^\s:@/]+@")),
    ("hex blob 32+",              re.compile(r"\b[0-9a-fA-F]{32,}\b")),
    ("secret-labelled field",     re.compile(
        r"(?i)\b(api[_\- ]?key|secret|password|passwd|token|credential|client[_\- ]?secret"
        r"|signing[_\- ]?secret|access[_\- ]?key|private[_\- ]?key)\b\s*[:=]\s*\S{6,}")),
    ("credential in url query",   re.compile(
        r"(?i)[?&](token|key|secret|signature|access_token|api_key)=[^&\s]{8,}")),
    ("card-shaped digits",        re.compile(r"\b(?:\d[ \-]?){13,19}\b")),
    ("email address",             re.compile(r"\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b")),
]


def scan_secrets(states):
    """Return candidate hits. Reports the pattern name and a masked excerpt only.
    Never prints the matched value, because printing it into a transcript or a log is
    the exact disclosure the redaction pass exists to prevent."""
    hits = []
    for st in states:
        text = st.get("text", "")
        for label, pattern in SECRET_PATTERNS:
            for m in pattern.finditer(text):
                raw = m.group(0)
                start = max(0, m.start() - 40)
                lead = text[start:m.start()].splitlines()
                context = lead[-1].strip() if lead else ""
                hits.append({
                    "state": st["state"],
                    "timestamp": st.get("representative_timestamp"),
                    "app": st.get("app"),
                    "pattern": label,
                    "length": len(raw),
                    "preceding_text": context[-60:],
                })
    return hits


# ---------------------------------------------------------------- io

def load(path):
    with open(path, "r", encoding="utf-8") as fh:
        data = json.load(fh)
    if isinstance(data, dict):
        data = data.get("snapshots", data.get("items", []))
    if not isinstance(data, list):
        raise ValueError("input must be a JSON list, or an object with a snapshots key")
    for i, item in enumerate(data):
        if not isinstance(item, dict):
            raise ValueError("item %d is not an object" % i)
        if "timestamp" not in item:
            raise ValueError("item %d has no timestamp" % i)
    # Stable sort by timestamp. Retrieval is relevance-ordered, so this is required
    # before anything else runs.
    return sorted(data, key=lambda d: str(d.get("timestamp", "")))


def fmt_duration(seconds):
    if seconds is None:
        return "?"
    seconds = int(seconds)
    if seconds < 60:
        return "%ds" % seconds
    return "%dm%02ds" % (seconds // 60, seconds % 60)


def first_line(text, width=72):
    for line in text.splitlines():
        line = line.strip()
        if line:
            return line[:width]
    return "(no text)"


def print_states(states, total_in):
    print("Snapshot deduplication")
    print("=" * 72)
    print("%d snapshots in, %d distinct UI states out" % (total_in, len(states)))
    print()
    print("%-5s %-12s %-21s %6s %8s  %s" % (
        "STATE", "APP", "FIRST SEEN", "FRAMES", "DURATION", "FIRST LINE"))
    print("-" * 72)
    for st in states:
        print("%-5d %-12s %-21s %6d %8s  %s" % (
            st["state"],
            (st["app"] or "-")[:12],
            str(st["first_seen"])[:21],
            st["frames"],
            fmt_duration(st["duration_seconds"]),
            first_line(st["text"], 30),
        ))
    print()
    suspicious = [s for s in states if s["frames"] >= 6 or (s["duration_seconds"] or 0) > 300]
    if suspicious:
        print("Check these by hand. A large frame count or a long duration can mean two")
        print("real steps were merged on a screen that barely changed:")
        for st in suspicious:
            print("  state %d: %d frames over %s"
                  % (st["state"], st["frames"], fmt_duration(st["duration_seconds"])))
        print()


def print_secrets(hits):
    print("Secret candidate scan")
    print("=" * 72)
    if not hits:
        print("No credential-shaped strings matched.")
        print()
        print("This is a structural scan. It finds shape, not meaning. It cannot see a")
        print("client name, a deal value, or a tenant identifier that looks like an")
        print("ordinary word. Run the semantic and context sweeps in")
        print("references/redaction-pass.md before writing any SOP prose.")
        return
    print("%d candidate(s). Values are never printed." % len(hits))
    print()
    print("%-6s %-21s %-24s %6s  %s" % (
        "STATE", "TIMESTAMP", "PATTERN", "LEN", "PRECEDING TEXT"))
    print("-" * 72)
    for h in hits:
        print("%-6d %-21s %-24s %6d  %s" % (
            h["state"],
            str(h["timestamp"])[:21],
            h["pattern"][:24],
            h["length"],
            h["preceding_text"],
        ))
    print()
    print("Redact every one of these before writing SOP prose. Anything matching an")
    print("authentication pattern should also be treated as exposed and rotated. See")
    print("references/redaction-pass.md.")


def main():
    ap = argparse.ArgumentParser(
        description="Deduplicate Littlebird screen snapshots into distinct UI states.")
    ap.add_argument("input", help="path to timestamp-sorted snapshot JSON")
    ap.add_argument("--threshold", type=float, default=0.85,
                    help="token-set similarity at or above which two frames are the same "
                         "state (default 0.85). Lower merges more aggressively.")
    ap.add_argument("--max-gap", type=float, default=120.0,
                    help="seconds between frames beyond which a new state always starts, "
                         "so returning to the same screen later stays a separate event "
                         "(default 120)")
    ap.add_argument("--json", metavar="PATH", help="write the state list to this path")
    ap.add_argument("--scan-secrets", action="store_true",
                    help="also scan state text for credential-shaped strings")
    ap.add_argument("--secrets-only", action="store_true",
                    help="print only the secret scan, implies --scan-secrets")
    args = ap.parse_args()

    if not 0.0 < args.threshold <= 1.0:
        print("threshold must be between 0 and 1", file=sys.stderr)
        return 1

    try:
        snapshots = load(args.input)
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print("could not read input: %s" % exc, file=sys.stderr)
        return 1

    states = group_states(snapshots, args.threshold, args.max_gap)

    if not args.secrets_only:
        print_states(states, len(snapshots))

    hits = []
    if args.scan_secrets or args.secrets_only:
        hits = scan_secrets(states)
        print_secrets(hits)

    if args.json:
        try:
            with open(args.json, "w", encoding="utf-8") as fh:
                json.dump({"states": states, "secret_candidates": hits}, fh, indent=2)
        except OSError as exc:
            print("could not write json: %s" % exc, file=sys.stderr)
            return 1

    return 2 if hits else 0


if __name__ == "__main__":
    sys.exit(main())
