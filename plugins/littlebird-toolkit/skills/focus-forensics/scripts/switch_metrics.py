#!/usr/bin/env python3
"""Compute switch, run and hour metrics from a labeled snapshot list.

Why this exists: every number in a focus-forensics report is a count over an ordered
sequence, and the ordering, the deduplication, the gap threshold and the adjacent-pair
denominators are all easy to get subtly wrong by hand. A wrong headline count is the
fastest way this report loses the user's trust, and the arithmetic is fully deterministic,
so it belongs in code rather than in a model's head.

What it does NOT do, deliberately:

  - It does not assign context labels. The model does that, with the rules in
    references/switch-and-run-detection.md, and passes them in.
  - It does not convert anything to hours, minutes of work, or percentages of a day.
    Bounded intervals are emitted in seconds and are labeled as intervals bounded by two
    observations, never as durations.
  - It does not decide what a rabbit hole is, or what the nudge should be.
  - It does not compare two weeks. It emits one window's metrics in a stable shape so a
    later run can compare two of its own outputs.
  - It does not suppress thin hours by itself; it flags them and lets the caller obey the
    reporting floor.

Input: a JSON array of snapshot records on stdin or at a path.

    [
      {
        "ts": "2026-08-11T09:12:04",
        "app": "chrome",
        "context": "helix-migration",
        "text_len": 812
      }
    ]

Required per record: "ts" (ISO 8601, naive local time) and "context" (a short label, or
the literal "unclear" when the model could not assign one confidently). "app" is optional
and is carried through for reporting. Any other keys are ignored.

Usage:

    python3 switch_metrics.py snapshots.json
    python3 switch_metrics.py snapshots.json --gap-minutes 25
    cat snapshots.json | python3 switch_metrics.py -

Output: JSON on stdout with cadence, coverage, switch and run metrics, hour and weekday
breakdowns, bursts, and an exclusions block listing everything dropped and why. Read the
exclusions block. It is the honest part.
"""

import argparse
import json
import statistics
import sys
from collections import defaultdict
from datetime import datetime

UNCLEAR = "unclear"

# Reporting floor for an hour bucket, from references/switch-and-run-detection.md step 7.
MIN_PAIRS_FOR_HOUR_RATE = 20

# A burst is this many consecutive snapshots with every adjacent pair a switch.
BURST_MIN_LEN = 4

# Gap threshold is max(GAP_CADENCE_MULTIPLE * median interval, GAP_FLOOR_MINUTES).
GAP_CADENCE_MULTIPLE = 4
GAP_FLOOR_MINUTES = 20


def parse_ts(value):
    """Parse an ISO 8601 timestamp, tolerating a trailing Z and a space separator."""
    text = str(value).strip().replace(" ", "T")
    if text.endswith("Z"):
        text = text[:-1]
    return datetime.fromisoformat(text)


def load_records(source):
    raw = sys.stdin.read() if source == "-" else open(source, encoding="utf-8").read()
    data = json.loads(raw)
    if not isinstance(data, list):
        raise SystemExit("Input must be a JSON array of snapshot records.")
    return data


def normalize(records):
    """Validate, parse timestamps, and separate usable records from rejects."""
    usable, rejected = [], []
    for index, item in enumerate(records):
        if not isinstance(item, dict):
            rejected.append({"index": index, "reason": "not an object"})
            continue
        if "ts" not in item:
            rejected.append({"index": index, "reason": "missing ts"})
            continue
        if "context" not in item or not str(item.get("context", "")).strip():
            rejected.append({"index": index, "reason": "missing context label"})
            continue
        try:
            when = parse_ts(item["ts"])
        except (ValueError, TypeError):
            rejected.append({"index": index, "reason": "unparseable ts: %r" % item["ts"]})
            continue
        usable.append(
            {
                "ts": when,
                "app": str(item.get("app", "")).strip(),
                "context": str(item["context"]).strip(),
                "text_len": item.get("text_len"),
            }
        )
    usable.sort(key=lambda rec: rec["ts"])
    return usable, rejected


def dedupe(records):
    """Collapse records sharing a timestamp and an app into one observation.

    OCR of dense UI produces duplicate and fragmentary lines, and repeated identical lines
    are one observation rather than several. Where two records share a timestamp and an
    app but disagree on context, the collision is reported rather than silently resolved.
    """
    kept, collapsed, collisions = [], 0, []
    seen = {}
    for rec in records:
        key = (rec["ts"], rec["app"])
        if key in seen:
            collapsed += 1
            prior = seen[key]
            if prior["context"] != rec["context"]:
                collisions.append(
                    {
                        "ts": rec["ts"].isoformat(),
                        "app": rec["app"],
                        "contexts": sorted({prior["context"], rec["context"]}),
                    }
                )
            continue
        seen[key] = rec
        kept.append(rec)
    return kept, collapsed, collisions


def intervals(records):
    return [
        (records[i + 1]["ts"] - records[i]["ts"]).total_seconds()
        for i in range(len(records) - 1)
    ]


def build_pairs(records, gap_seconds):
    """Classify every adjacent pair as a break, a switch, an unclear boundary, or a hold.

    A pair separated by more than the gap threshold is a break: it ends a run, it is never
    counted as a switch in either direction, and it is excluded from every rate
    denominator. Nothing happened between those two snapshots that was observed.
    """
    pairs = []
    for i in range(len(records) - 1):
        left, right = records[i], records[i + 1]
        delta = (right["ts"] - left["ts"]).total_seconds()
        if delta > gap_seconds:
            kind = "break"
        elif left["context"] == UNCLEAR or right["context"] == UNCLEAR:
            kind = "unclear_boundary"
        elif left["context"] != right["context"]:
            kind = "switch"
        else:
            kind = "hold"
        pairs.append(
            {
                "index": i,
                "kind": kind,
                "seconds": delta,
                "from": left["context"],
                "to": right["context"],
                "hour": left["ts"].hour,
                "weekday": left["ts"].strftime("%a"),
                "date": left["ts"].date().isoformat(),
            }
        )
    return pairs


def build_runs(records, pairs):
    """A run is a maximal sequence of consecutive snapshots sharing one context.

    Runs are terminated by a switch, a break, an unclear snapshot, or the end of the data.
    Unclear snapshots never form runs of their own.
    """
    runs = []
    start = 0
    for i, pair in enumerate(pairs):
        if pair["kind"] == "hold":
            continue
        runs.append((start, i, pair["kind"]))
        start = i + 1
    runs.append((start, len(records) - 1, "end_of_data"))

    out = []
    for first, last, terminator in runs:
        if first > last:
            continue
        context = records[first]["context"]
        if context == UNCLEAR:
            continue
        out.append(
            {
                "context": context,
                "length_snapshots": last - first + 1,
                "first_ts": records[first]["ts"].isoformat(),
                "last_ts": records[last]["ts"].isoformat(),
                "bounded_interval_seconds": int(
                    (records[last]["ts"] - records[first]["ts"]).total_seconds()
                ),
                "bounded_interval_note": (
                    "Interval bounded by two observations. Not a measured duration. "
                    "Nothing between the snapshots was observed."
                ),
                "terminator": terminator,
                "date": records[first]["ts"].date().isoformat(),
            }
        )
    return out


def bucket_rates(pairs, key):
    """Transition rate per bucket, with the sample size that earns it.

    Breaks are excluded from the denominator because nothing was observed across them.
    Unclear boundaries stay in the denominator: the pair was observed, it simply could not
    be classified as a switch, and dropping it would inflate every rate.
    """
    counted = defaultdict(int)
    switched = defaultdict(int)
    for pair in pairs:
        if pair["kind"] == "break":
            continue
        counted[pair[key]] += 1
        if pair["kind"] == "switch":
            switched[pair[key]] += 1

    out = {}
    for bucket, total in sorted(counted.items(), key=lambda kv: str(kv[0])):
        out[str(bucket)] = {
            "adjacent_pairs": total,
            "switches": switched[bucket],
            "transition_rate": round(switched[bucket] / total, 4) if total else None,
            "meets_reporting_floor": total >= MIN_PAIRS_FOR_HOUR_RATE,
        }
    return out


def find_bursts(records, pairs):
    """A burst: BURST_MIN_LEN or more consecutive snapshots, every adjacent pair a switch."""
    bursts, current = [], []
    for pair in pairs:
        if pair["kind"] == "switch":
            current.append(pair)
            continue
        if len(current) + 1 >= BURST_MIN_LEN:
            bursts.append(current)
        current = []
    if len(current) + 1 >= BURST_MIN_LEN:
        bursts.append(current)

    out = []
    for group in bursts:
        first_index = group[0]["index"]
        last_index = group[-1]["index"] + 1
        sequence = [records[i]["context"] for i in range(first_index, last_index + 1)]
        out.append(
            {
                "date": records[first_index]["ts"].date().isoformat(),
                "first_ts": records[first_index]["ts"].isoformat(),
                "last_ts": records[last_index]["ts"].isoformat(),
                "snapshots": last_index - first_index + 1,
                "context_sequence": sequence,
                "note": (
                    "A dense cluster of observed transitions. This is not labeled as "
                    "distraction, interruption or recovery. What it was is not observable."
                ),
            }
        )
    return out


def summarize(records, pairs, runs, gap_seconds, median_interval):
    lengths = [run["length_snapshots"] for run in runs]
    non_break = [p for p in pairs if p["kind"] != "break"]
    switches = [p for p in pairs if p["kind"] == "switch"]
    unclear_count = sum(1 for r in records if r["context"] == UNCLEAR)
    days = sorted({r["ts"].date().isoformat() for r in records})

    longest = max(runs, key=lambda run: run["length_snapshots"]) if runs else None

    return {
        "coverage": {
            "snapshots": len(records),
            "days_with_snapshots": len(days),
            "days": days,
            "first_ts": records[0]["ts"].isoformat() if records else None,
            "last_ts": records[-1]["ts"].isoformat() if records else None,
            "unclear_snapshots": unclear_count,
            "unclear_share": round(unclear_count / len(records), 4) if records else None,
            "thin_window": len(days) < 3 or len(records) < 50,
            "thin_window_note": (
                "Fewer than 3 days with snapshots, or fewer than 50 snapshots. Report "
                "coverage and the meeting section, skip the switching analysis and the "
                "nudge."
            ),
        },
        "cadence": {
            "median_interval_seconds": median_interval,
            "gap_threshold_seconds": gap_seconds,
            "gap_threshold_note": (
                "max(%d x median interval, %d minutes). Pairs wider than this are breaks "
                "and are not interpreted." % (GAP_CADENCE_MULTIPLE, GAP_FLOOR_MINUTES)
            ),
        },
        "switching": {
            "adjacent_pairs_total": len(pairs),
            "breaks": sum(1 for p in pairs if p["kind"] == "break"),
            "unclear_boundaries": sum(1 for p in pairs if p["kind"] == "unclear_boundary"),
            "adjacent_pairs_counted": len(non_break),
            "switches": len(switches),
            "transition_rate": (
                round(len(switches) / len(non_break), 4) if non_break else None
            ),
            "transition_rate_note": (
                "Switches per adjacent observed pair, excluding breaks. A proportion "
                "between 0 and 1. Never a rate per hour or per minute."
            ),
        },
        "runs": {
            "count": len(runs),
            "median_length_snapshots": (
                round(statistics.median(lengths), 2) if lengths else None
            ),
            "runs_of_length_1": sum(1 for n in lengths if n == 1),
            "runs_of_length_5_plus": sum(1 for n in lengths if n >= 5),
            "longest": longest,
            "no_mean_note": (
                "No mean run length is emitted. Published run-length distributions carry "
                "standard deviations at or above their own means, so the distribution is "
                "skewed and a mean is the wrong summary."
            ),
        },
    }


def main():
    parser = argparse.ArgumentParser(
        description="Compute deterministic switch, run and hour metrics for focus-forensics."
    )
    parser.add_argument("input", help="Path to a JSON array of snapshots, or - for stdin.")
    parser.add_argument(
        "--gap-minutes",
        type=float,
        default=None,
        help="Override the derived gap threshold, in minutes.",
    )
    parser.add_argument(
        "--indent", type=int, default=2, help="JSON output indent. Default 2."
    )
    args = parser.parse_args()

    records, rejected = normalize(load_records(args.input))
    records, collapsed, collisions = dedupe(records)

    if len(records) < 2:
        json.dump(
            {
                "error": "Fewer than two usable snapshots. No switching analysis possible.",
                "usable_snapshots": len(records),
                "exclusions": {
                    "rejected_records": rejected,
                    "collapsed_duplicates": collapsed,
                    "timestamp_app_collisions": collisions,
                },
            },
            sys.stdout,
            indent=args.indent,
        )
        sys.stdout.write("\n")
        return

    gaps = intervals(records)
    median_interval = round(statistics.median(gaps), 1)
    if args.gap_minutes is not None:
        gap_seconds = args.gap_minutes * 60.0
    else:
        gap_seconds = max(
            GAP_CADENCE_MULTIPLE * median_interval, GAP_FLOOR_MINUTES * 60.0
        )

    pairs = build_pairs(records, gap_seconds)
    runs = build_runs(records, pairs)

    result = summarize(records, pairs, runs, gap_seconds, median_interval)
    result["by_hour"] = bucket_rates(pairs, "hour")
    result["by_weekday"] = bucket_rates(pairs, "weekday")
    result["by_date"] = bucket_rates(pairs, "date")
    result["bursts"] = find_bursts(records, pairs)
    result["runs"]["all"] = runs
    result["exclusions"] = {
        "rejected_records": rejected,
        "collapsed_duplicates": collapsed,
        "timestamp_app_collisions": collisions,
        "note": (
            "Collisions are timestamps where two records shared an app but disagreed on "
            "context. They are not resolved here. Resolve them by relabeling before "
            "trusting any count."
        ),
    }
    result["forbidden_outputs"] = [
        "hours lost",
        "percentage of the day",
        "productivity or focus score",
        "minutes of cost per switch",
        "comparison against any other person or published figure",
        "any claim about what happened between two snapshots",
    ]

    json.dump(result, sys.stdout, indent=args.indent, default=str)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
