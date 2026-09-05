#!/usr/bin/env python3
"""Deterministic helper for a learning-capturer knowledge base.

Three jobs, all mechanical, none of them judgment:

  --index   rebuild INDEX.md from entries/
  --check   score a candidate symptom string against existing entries and the
            rejection ledger, so a second encounter updates instead of duplicating
  --stale   flag entries that have not been confirmed inside their review window

It reads only files the skill itself wrote. It never edits an entry, never deletes
anything, and never prints the contents of a fenced block, so a value that survived
scrubbing inside an entry body cannot leak through this tool.

Usage:
    python3 kb_index.py <kb-dir> --index
    python3 kb_index.py <kb-dir> --check "the literal error string"
    python3 kb_index.py <kb-dir> --stale [--today YYYY-MM-DD]
    python3 kb_index.py <kb-dir> --tags

Exit codes: 0 ok, 1 bad usage or missing directory.
"""

import argparse
import datetime as dt
import os
import re
import sys

META_KEYS = (
    "id", "first-seen", "last-seen", "occurrences", "solved-by", "understood",
    "root-cause-status", "confidence", "tags", "review-after", "last-confirmed",
)

# Fast-moving ecosystems age faster. Used only to explain a flag, never to set one.
FAST_MOVING = (
    "node", "nodejs", "npm", "react", "nextjs", "next", "vite", "android", "ios",
    "react-native", "expo", "bun", "deno", "swift",
)

# Substrings stripped before two symptom strings are compared. Volatile detail only.
NORMALIZE_PATTERNS = (
    (re.compile(r"[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}", re.I), " "),
    (re.compile(r"\b[a-f0-9]{7,}\b", re.I), " "),          # hashes, ids
    (re.compile(r"(/[\w.\-]+){2,}"), " "),                  # absolute-ish paths
    (re.compile(r"\b[A-Za-z]:\\[\\\w.\-]+"), " "),          # windows paths
    (re.compile(r":\d+:\d+"), " "),                         # line:col
    (re.compile(r"\b(?:0x)?[0-9]{4,}\b"), " "),             # long digit runs, ports, addrs
    (re.compile(r"\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2})?"), " "),
)

# Kept during normalization because they are the discriminators, not the noise.
KEEP_TOKEN = re.compile(r"^[a-z][a-z0-9_.\-]{1,}$")

STOPWORDS = {
    "the", "a", "an", "at", "in", "on", "of", "to", "for", "is", "was", "and", "or",
    "with", "from", "this", "that", "it", "be", "not", "no", "error", "failed",
}


# --------------------------------------------------------------------------- parsing


def parse_entry(path):
    """Pull the metadata block, the SEARCH line, and the title out of one entry file.

    Deliberately shallow. It does not read fenced blocks and does not read prose
    bodies, so nothing from the entry body reaches stdout.
    """
    meta = {}
    title = ""
    search = ""
    also = []
    versions_unknown = False
    retired = False

    with open(path, "r", encoding="utf-8", errors="replace") as fh:
        in_fence = False
        for line in fh:
            stripped = line.strip()

            if stripped.startswith("```"):
                in_fence = not in_fence
                continue
            if in_fence:
                continue

            if not title and stripped.startswith("# "):
                title = stripped[2:].strip()
                continue

            if stripped.startswith("RETIRED"):
                retired = True
                continue

            for key in META_KEYS:
                prefix = key + ":"
                if stripped.startswith(prefix):
                    meta[key] = stripped[len(prefix):].strip()
                    break

            if stripped.startswith("SEARCH:"):
                search = stripped[len("SEARCH:"):].strip()
            elif stripped.startswith("Also searched as:"):
                value = stripped[len("Also searched as:"):].strip()
                if value:
                    also.append(value)
            elif "unknown, not captured" in stripped and "|" in stripped:
                versions_unknown = True

    meta["_path"] = path
    meta["_title"] = title
    meta["_search"] = search
    meta["_also"] = also
    meta["_versions_unknown"] = versions_unknown
    meta["_retired"] = retired
    meta.setdefault("id", os.path.splitext(os.path.basename(path))[0])
    return meta


def load_entries(kb_dir):
    entries_dir = os.path.join(kb_dir, "entries")
    if not os.path.isdir(entries_dir):
        return []
    out = []
    for name in sorted(os.listdir(entries_dir)):
        if name.endswith(".md"):
            out.append(parse_entry(os.path.join(entries_dir, name)))
    return out


def load_rejected(kb_dir):
    """Read fingerprints out of the rejection ledger's markdown table."""
    path = os.path.join(kb_dir, "rejected.md")
    rejected = []
    if not os.path.isfile(path):
        return rejected
    with open(path, "r", encoding="utf-8", errors="replace") as fh:
        for line in fh:
            if not line.strip().startswith("|"):
                continue
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            if len(cells) < 4 or cells[0].lower().startswith("date"):
                continue
            if set(cells[0]) <= set("-: "):
                continue
            rejected.append({"date": cells[0], "symptom": cells[1],
                             "reason": cells[2], "fingerprint": cells[3]})
    return rejected


# ----------------------------------------------------------------------- comparison


def normalize(text):
    out = text.lower()
    for pattern, repl in NORMALIZE_PATTERNS:
        out = pattern.sub(repl, out)
    out = re.sub(r"[^a-z0-9_.\-\s]", " ", out)
    return re.sub(r"\s+", " ", out).strip()


def tokens(text):
    raw = normalize(text).split()
    return {t for t in raw if t not in STOPWORDS and KEEP_TOKEN.match(t)}


def score(candidate, existing):
    """Weighted Jaccard on normalized tokens, 0.0 to 1.0.

    Matches text, not meaning. It is a first pass. Read `kb-structure-and-dedupe.md`
    section 3 and judge symptom, cause, and fix by hand before merging anything.
    """
    a, b = tokens(candidate), tokens(existing)
    if not a or not b:
        return 0.0
    inter = len(a & b)
    if not inter:
        return 0.0
    # Containment beats symmetry here: a short pasted fragment of a long stored
    # error should still score high.
    return round(max(inter / len(a), inter / len(b)) * (inter / len(a | b)) ** 0.5, 3)


def fingerprint(text):
    """Stable slug for the rejection ledger."""
    toks = sorted(tokens(text))[:6]
    return "-".join(toks) if toks else "unfingerprintable"


# ---------------------------------------------------------------------------- dates


def parse_date(value):
    if not value or value.lower() in ("never", "unknown", "n/a", ""):
        return None
    try:
        return dt.date.fromisoformat(value.strip())
    except ValueError:
        return None


def months_between(later, earlier):
    return (later.year - earlier.year) * 12 + (later.month - earlier.month)


# -------------------------------------------------------------------------- actions


def cmd_index(kb_dir, entries):
    lines = [
        "# Knowledge base index",
        "",
        "Generated by `scripts/kb_index.py --index`. Do not hand-edit.",
        "",
        "| id | title | tags | occ | last seen | status |",
        "|---|---|---|---|---|---|",
    ]
    live = [e for e in entries if not e["_retired"]]
    for e in sorted(live, key=lambda x: x.get("last-seen", ""), reverse=True):
        title = e["_title"].replace("|", "\\|") or "(untitled)"
        status = []
        if e.get("root-cause-status") in ("empirical", "unknown"):
            status.append("cause " + e["root-cause-status"])
        if e.get("solved-by") == "ai-assistant" and e.get("understood") == "no":
            status.append("ai, unverified")
        if e["_versions_unknown"]:
            status.append("versions unknown")
        lines.append("| {} | {} | {} | {} | {} | {} |".format(
            e.get("id", ""), title, e.get("tags", ""), e.get("occurrences", "1"),
            e.get("last-seen", ""), ", ".join(status) or "ok",
        ))

    retired = [e for e in entries if e["_retired"]]
    lines += ["", "Live entries: {}. Retired: {}.".format(len(live), len(retired))]
    if retired:
        lines += ["", "## Retired", ""]
        lines += ["- {}".format(e.get("id", "")) for e in retired]

    out_path = os.path.join(kb_dir, "INDEX.md")
    with open(out_path, "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines) + "\n")
    print("wrote {} ({} live, {} retired)".format(out_path, len(live), len(retired)))


def cmd_check(kb_dir, entries, candidate):
    rejected = load_rejected(kb_dir)
    print("candidate fingerprint: {}".format(fingerprint(candidate)))
    print("")

    hits = []
    for r in rejected:
        s = max(score(candidate, r["symptom"]), score(candidate, r["fingerprint"]))
        if s >= 0.30:
            hits.append((s, r))
    if hits:
        print("REJECTED PREVIOUSLY. Do not re-propose without asking the user directly.")
        for s, r in sorted(hits, reverse=True, key=lambda x: x[0]):
            print("  {:.3f}  {}  rejected {}  reason: {}".format(
                s, r["fingerprint"], r["date"], r["reason"]))
        print("")

    scored = []
    for e in entries:
        best = score(candidate, e["_search"])
        best = max(best, score(candidate, e["_title"]))
        for alt in e["_also"]:
            best = max(best, score(candidate, alt))
        if best > 0:
            scored.append((best, e))

    if not scored:
        print("no textual match in {} entries. Treat as NEW.".format(len(entries)))
        return

    print("matches, highest first:")
    for s, e in sorted(scored, reverse=True, key=lambda x: x[0])[:8]:
        if s >= 0.60:
            verdict = "LIKELY SAME, update the existing entry"
        elif s >= 0.35:
            verdict = "possible, judge by hand"
        else:
            verdict = "weak"
        print("  {:.3f}  {}  [{}]".format(s, e.get("id", ""), verdict))
        print("         {}".format(e["_title"][:100]))
    print("")
    print("Thresholds are a design decision, not researched practice. Confirm symptom,")
    print("cause, and fix by hand before merging. See kb-structure-and-dedupe.md.")


def cmd_stale(entries, today):
    flagged = []
    for e in entries:
        if e["_retired"]:
            continue
        reasons = []
        review_after = parse_date(e.get("review-after", ""))
        last_conf = parse_date(e.get("last-confirmed", ""))
        first_seen = parse_date(e.get("first-seen", ""))

        if review_after and review_after < today:
            if last_conf is None or last_conf < review_after:
                reasons.append("review-after {} passed, not reconfirmed since".format(
                    e.get("review-after")))

        if last_conf is None and first_seen and months_between(today, first_seen) >= 12:
            reasons.append("never reconfirmed, written {}".format(e.get("first-seen")))

        if e.get("root-cause-status") in ("empirical", "unknown"):
            if first_seen and months_between(today, first_seen) >= 12:
                reasons.append("cause {}, over 12 months old".format(
                    e.get("root-cause-status")))

        if e.get("solved-by") == "ai-assistant" and e.get("understood") == "no":
            if first_seen and months_between(today, first_seen) >= 6:
                reasons.append("ai-assisted and unverified, over 6 months old")

        if e["_versions_unknown"]:
            reasons.append("versions not captured, staleness cannot be checked")

        if reasons:
            tagline = e.get("tags", "").lower()
            fast = [w for w in FAST_MOVING if w in tagline]
            flagged.append((int(e.get("occurrences", "1") or 1), e, reasons, fast))

    if not flagged:
        print("no stale entries as of {}".format(today.isoformat()))
        return

    print("{} stale entries as of {}, highest occurrence first".format(
        len(flagged), today.isoformat()))
    print("Surface at most 4 in a weekly report. A long staleness list gets muted.")
    print("")
    for occ, e, reasons, fast in sorted(flagged, reverse=True, key=lambda x: x[0]):
        print("STALE: {}  (occurrences: {})".format(e.get("id", ""), occ))
        print("  {}".format(e["_title"][:100]))
        for r in reasons:
            print("  - {}".format(r))
        if fast:
            print("  - fast-moving ecosystem tags: {}".format(", ".join(fast)))
        print("")


def cmd_tags(entries):
    counts = {}
    for e in entries:
        for tag in [t.strip() for t in e.get("tags", "").split(",") if t.strip()]:
            counts[tag] = counts.get(tag, 0) + 1
    if not counts:
        print("no tags found")
        return
    print("tag histogram, {} distinct tags. Near-duplicates here are tag drift.".format(
        len(counts)))
    for tag, n in sorted(counts.items(), key=lambda kv: (-kv[1], kv[0])):
        print("  {:4d}  {}".format(n, tag))


# ----------------------------------------------------------------------------- main


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("kb_dir", help="path to the knowledge-base directory")
    ap.add_argument("--index", action="store_true", help="rebuild INDEX.md")
    ap.add_argument("--check", metavar="SYMPTOM",
                    help="score a candidate symptom against existing entries")
    ap.add_argument("--stale", action="store_true", help="flag unconfirmed entries")
    ap.add_argument("--tags", action="store_true", help="print the tag histogram")
    ap.add_argument("--today", metavar="YYYY-MM-DD",
                    help="override today's date for --stale")
    args = ap.parse_args(argv)

    if not os.path.isdir(args.kb_dir):
        print("not a directory: {}".format(args.kb_dir), file=sys.stderr)
        return 1
    if not (args.index or args.check or args.stale or args.tags):
        ap.print_help()
        return 1

    entries = load_entries(args.kb_dir)

    if args.check:
        cmd_check(args.kb_dir, entries, args.check)
    if args.index:
        cmd_index(args.kb_dir, entries)
    if args.stale:
        today = parse_date(args.today) or dt.date.today()
        cmd_stale(entries, today)
    if args.tags:
        cmd_tags(entries)
    return 0


if __name__ == "__main__":
    sys.exit(main())
