#!/usr/bin/env python3
"""Build an internal link graph from a site-data/ crawl output and compute
click depth (BFS from a defined entry-point set), anchor-text quality
scoring, orphan/dead-end status, anchor-text cannibalization, and an
internal-PageRank-style equity distribution.

Deterministic, harness-portable, no absolute paths (per build plan section 6's
scripting convention). This is a pair-local script: shared/scripts/README.md
lists eleven centrally shared scripts and none of them cover link-graph
mechanics, so this Drone is the only one that needs it.

GROUNDING (read before trusting a number this script prints):

  - BFS click depth over the crawlable internal-link graph, from an
    explicitly defined entry-point set rather than a homepage-only
    assumption, is exactly the methodology in
    references/research/distilled-internal-linking.md section 3
    [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md].
  - Orphan (0 inbound) vs. dead-end (0 outbound) as distinct, non-equivalent
    findings is distilled section 2
    [raw/kennytan-net-internal-link-equity-auditor.md].
  - The PageRank power-iteration formula, damping factor 0.85, and the
    dangling-node mass-redistribution rule are distilled section 5
    [raw/kennytan-net-internal-link-equity-auditor.md]. Nofollow internal
    links are excluded from the equity graph per the same section
    [raw/unveilseo-com-internal-link-audit.md].
  - The four anchor-text scoring dimensions (generic ratio, diversity,
    topical relevance, length) are distilled section 4
    [raw/unveilseo-com-internal-link-audit.md]. The SPECIFIC 0-100 composite
    formula and its weights below (WEIGHT_* constants) are this script's own
    engineering judgment call: distilled section 4 says a composite score
    "is one vendor's approach" without disclosing that vendor's weights, so
    this script's weights are NOT a sourced number and should be treated as
    a reasonable starting heuristic, not a validated standard.
  - The equity-distribution classification thresholds (HEALTHY/MODERATE/
    UNDER-SERVED/OVER-LINKED inbound-count and percentile bands) and the
    Gini-coefficient distribution-shape bands are distilled section 5's
    single-vendor scale, reproduced as-is, with the same caveat: a useful
    diagnostic starting point, not an industry-standard benchmark.
  - The edge-level data model (source_key, observed_href, destination_key,
    label, placement, artifact_ref) mirrors distilled section 6
    [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md].
  - The URL-to-slug matching heuristic (derive_expected_slug, and the
    fallback last-path-segment match) is NOT sourced from the research
    archive, because the crawler's actual slug-naming convention is owned by
    site-crawler-wasp-drone (PRD-007) and is not yet built. This script
    matches on a normalized path guess first, then falls back to matching
    the href's last path segment against a known slug, and otherwise
    reports the link as "uncrawled" rather than guessing further. Pass
    --url-map to supply the real path-to-slug mapping once site-crawler
    emits one, which removes the guesswork entirely.
  - Redirect-chain resolution is out of scope: a crawl output only contains
    the final fetched page per slug, not the chain that led there, so this
    script cannot distinguish "genuinely deep" from "deep because of an
    unresolved redirect hop" (distilled section 3's caveat). That
    distinction needs redirect data from site-crawler-wasp-drone, not
    present in site-data/ today.

Usage:
    python3 link-graph.py \\
        --site-data path/to/www.example.com-audit/site-data \\
        --entry-points index,home \\
        [--url-map path/to/url-to-slug.json] \\
        [--damping 0.85] [--max-iterations 30] [--tolerance 1e-6] \\
        [--depth-threshold 3] \\
        [--out internal-linking-graph.json]

Entry points are REQUIRED (no silent homepage guess) because distilled
section 3 explicitly warns against assuming homepage-only entry points.
Pass every distinct journey root that matters for this run (homepage,
category hubs, locale roots), comma-separated, as slugs (filename stems
under --site-data, without the .html extension).

Exit code is non-zero only on a usage or I/O error; graph findings
(orphans, depth outliers, etc.) are reported in the JSON output, not via
exit code, since finding zero orphans is success, not failure.
"""

import argparse
import json
import re
import statistics
import sys
from collections import defaultdict, deque
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote

# --- Anchor-text scoring constants (see grounding note above) -------------

GENERIC_ANCHORS = {
    "click here", "here", "read more", "learn more", "more", "this page",
    "this article", "this link", "continue reading", "see more", "details",
    "link", "more info", "more information", "find out more",
}

# Anchors excluded from cannibalization flagging: reused navigational/
# boilerplate labels legitimately point at many different destinations
# (e.g. "Home" on every page's nav), so flagging them would bury the
# genuine editorial-anchor cannibalization signal in noise. This exclusion
# list is this script's own judgment call, not sourced.
NAVIGATIONAL_ANCHORS = {
    "home", "about", "about us", "contact", "contact us", "blog", "shop",
    "products", "services", "pricing", "faq", "login", "log in", "sign in",
    "sign up", "privacy policy", "terms of service", "terms", "sitemap",
}

STOPWORDS = {
    "a", "an", "the", "and", "or", "of", "to", "for", "in", "on", "with",
    "is", "are", "your", "our", "you", "we", "this", "that", "at", "by",
    "from", "as", "it", "be", "how", "what", "why", "guide",
}

TEMPLATE_TAGS = {"nav", "header", "footer", "aside"}

WEIGHT_GENERIC = 0.30
WEIGHT_DIVERSITY = 0.30
WEIGHT_TOPICAL = 0.25
WEIGHT_LENGTH = 0.15
DIVERSITY_TARGET = 3   # distilled section 4: "fewer than 3 unique anchors" flag
LENGTH_TARGET_WORDS = 3

# --- Equity classification thresholds (distilled section 5) ---------------

HEALTHY_MIN_INBOUND = 20
MODERATE_MIN_INBOUND = 8
OVER_LINKED_MIN_INBOUND = 150
OVER_LINKED_EQUITY_SHARE = 0.05


class LinkExtractor(HTMLParser):
    """Extracts <a> edges, <title>, and <h1> text from one crawled page.

    Tracks a tag stack so an anchor nested inside <nav>/<header>/<footer>/
    <aside> is classified "template" placement and everything else is
    "main" (contextual/editorial), per distilled section 6's contextual-
    vs-template distinction.
    """

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.tag_stack = []
        self.edges = []  # list of dicts: href, label, placement, nofollow
        self._current_anchor = None
        self.title_parts = []
        self.h1_parts = []
        self._in_title = False
        self._in_h1 = False

    def handle_starttag(self, tag, attrs):
        attrs_d = dict(attrs)
        self.tag_stack.append(tag)
        if tag == "title":
            self._in_title = True
        if tag == "h1":
            self._in_h1 = True
        if tag == "a" and attrs_d.get("href"):
            rel = (attrs_d.get("rel") or "").lower()
            placement = "template" if any(t in TEMPLATE_TAGS for t in self.tag_stack) else "main"
            self._current_anchor = {
                "href": attrs_d["href"].strip(),
                "label_parts": [],
                "placement": placement,
                "nofollow": "nofollow" in rel,
            }

    def handle_endtag(self, tag):
        if tag == "a" and self._current_anchor is not None:
            label = " ".join(self._current_anchor.pop("label_parts")).strip()
            label = re.sub(r"\s+", " ", label)
            self._current_anchor["label"] = label
            self.edges.append(self._current_anchor)
            self._current_anchor = None
        if tag == "title":
            self._in_title = False
        if tag == "h1":
            self._in_h1 = False
        if self.tag_stack and self.tag_stack[-1] == tag:
            self.tag_stack.pop()
        elif tag in self.tag_stack:
            # tolerate mismatched/unclosed tags in real-world HTML
            while self.tag_stack and self.tag_stack[-1] != tag:
                self.tag_stack.pop()
            if self.tag_stack:
                self.tag_stack.pop()

    def handle_data(self, data):
        if self._current_anchor is not None:
            self._current_anchor["label_parts"].append(data)
        if self._in_title:
            self.title_parts.append(data)
        if self._in_h1:
            self.h1_parts.append(data)

    @property
    def title(self):
        return re.sub(r"\s+", " ", "".join(self.title_parts)).strip()

    @property
    def h1(self):
        return re.sub(r"\s+", " ", "".join(self.h1_parts)).strip()


def tokenize(text):
    words = re.findall(r"[a-zA-Z0-9']+", text.lower())
    return {w for w in words if w not in STOPWORDS and len(w) > 1}


def derive_expected_slug(path):
    """Best-effort, unsourced URL-path-to-slug guess. See grounding note."""
    path = unquote(path).strip("/")
    if not path:
        return "index"
    return re.sub(r"[^a-zA-Z0-9]+", "-", path).strip("-").lower()


def load_url_map(path):
    if not path:
        return {}
    with open(path, "r", encoding="utf-8") as fh:
        raw = json.load(fh)
    return {k.strip("/"): v for k, v in raw.items()}


def resolve_destination(href, site_host, known_slugs, url_map):
    """Classify one href as (kind, destination_slug_or_None).

    kind is one of: "internal", "uncrawled", "external", "non-http".
    """
    href = href.strip()
    if not href or href.startswith("#"):
        return "non-http", None
    if href.startswith(("mailto:", "tel:", "javascript:")):
        return "non-http", None

    parsed = urlsplit(href)
    if parsed.scheme and parsed.scheme not in ("http", "https"):
        return "non-http", None
    if parsed.netloc and site_host and parsed.netloc.lower().lstrip("www.") != site_host.lower().lstrip("www."):
        return "external", None
    if parsed.netloc and not site_host:
        # No site host supplied: treat any absolute-with-host href as
        # external, conservatively, rather than guessing it is self-referential.
        return "external", None

    path = parsed.path
    mapped = url_map.get(path.strip("/"))
    if mapped and mapped in known_slugs:
        return "internal", mapped

    guess = derive_expected_slug(path)
    if guess in known_slugs:
        return "internal", guess

    last_segment = path.strip("/").rsplit("/", 1)[-1] if path.strip("/") else "index"
    last_segment = re.sub(r"[^a-zA-Z0-9]+", "-", last_segment).strip("-").lower()
    if last_segment in known_slugs:
        return "internal", last_segment

    return "uncrawled", None


def build_graph(site_data_dir, site_host, url_map_path):
    site_data = Path(site_data_dir)
    html_files = sorted(site_data.glob("*.html"))
    if not html_files:
        html_files = sorted(site_data.rglob("*.html"))
    if not html_files:
        raise FileNotFoundError(f"no .html files found under {site_data_dir}")

    url_map = load_url_map(url_map_path)
    known_slugs = {f.stem for f in html_files}

    pages = {}
    edges = []  # full edge list, internal + non-internal, for auditing

    for f in html_files:
        slug = f.stem
        parser = LinkExtractor()
        try:
            parser.feed(f.read_text(encoding="utf-8", errors="replace"))
        except Exception as exc:  # noqa: BLE001 - report and continue
            print(f"warning: failed to parse {f}: {exc}", file=sys.stderr)
        pages[slug] = {
            "title": parser.title,
            "h1": parser.h1,
            "topic_tokens": tokenize(f"{parser.title} {parser.h1}"),
        }
        for a in parser.edges:
            kind, dest = resolve_destination(a["href"], site_host, known_slugs, url_map)
            edges.append({
                "source_key": slug,
                "observed_href": a["href"],
                "destination_key": dest,
                "kind": kind,
                "label": a["label"],
                "placement": a["placement"],
                "nofollow": a["nofollow"],
                "artifact_ref": f"site-data/{slug}.html",
            })

    return pages, edges, known_slugs


def compute_depth(entry_points, known_slugs, internal_edges):
    """Multi-source BFS. Returns dict slug -> {depth, parents_at_min_depth}."""
    adjacency = defaultdict(set)
    for e in internal_edges:
        if e["destination_key"]:
            adjacency[e["source_key"]].add(e["destination_key"])

    depth = {ep: 0 for ep in entry_points if ep in known_slugs}
    parents = defaultdict(set)
    queue = deque(depth.keys())
    while queue:
        current = queue.popleft()
        for nxt in adjacency.get(current, ()):
            if nxt not in depth:
                depth[nxt] = depth[current] + 1
                parents[nxt].add(current)
                queue.append(nxt)
            elif depth[nxt] == depth[current] + 1:
                parents[nxt].add(current)

    result = {}
    for slug in known_slugs:
        if slug in depth:
            result[slug] = {
                "depth": depth[slug],
                "parent_count_at_min_depth": len(parents.get(slug, set())),
                "reachable": True,
            }
        else:
            result[slug] = {
                "depth": None,
                "parent_count_at_min_depth": 0,
                "reachable": False,
            }
    return result


def score_anchor_quality(inbound_edges, topic_tokens):
    """Score one page's inbound-anchor profile. Returns dict with sub-scores
    and a 0-100 composite (see WEIGHT_* grounding note above)."""
    if not inbound_edges:
        return None

    labels = [e["label"].strip() for e in inbound_edges]
    normalized = [l.lower() for l in labels]

    generic_count = sum(1 for l in normalized if l in GENERIC_ANCHORS or l == "")
    generic_ratio = generic_count / len(labels)

    unique_count = len({l for l in normalized if l})

    zero_overlap = 0
    word_counts = []
    for l in labels:
        tokens = tokenize(l)
        word_counts.append(len(l.split()) if l else 0)
        if topic_tokens and not (tokens & topic_tokens):
            zero_overlap += 1
        elif not topic_tokens:
            pass
    topical_relevance = 1 - (zero_overlap / len(labels)) if labels else 0
    avg_words = statistics.mean(word_counts) if word_counts else 0

    composite = 100 * (
        WEIGHT_GENERIC * (1 - generic_ratio)
        + WEIGHT_DIVERSITY * min(unique_count / DIVERSITY_TARGET, 1)
        + WEIGHT_TOPICAL * topical_relevance
        + WEIGHT_LENGTH * min(avg_words / LENGTH_TARGET_WORDS, 1)
    )

    return {
        "inbound_anchor_count": len(labels),
        "generic_ratio": round(generic_ratio, 3),
        "unique_anchor_count": unique_count,
        "topical_relevance": round(topical_relevance, 3),
        "avg_anchor_word_count": round(avg_words, 2),
        "composite_score_0_100": round(composite, 1),
        "flags": {
            "generic_ratio_over_30pct": generic_ratio > 0.30,
            "diversity_under_3": unique_count < DIVERSITY_TARGET,
            "zero_topical_overlap_any": zero_overlap > 0,
        },
    }


def find_cannibalization(internal_edges):
    by_label = defaultdict(set)
    for e in internal_edges:
        label = e["label"].strip().lower()
        if not label or label in GENERIC_ANCHORS or label in NAVIGATIONAL_ANCHORS:
            continue
        if e["destination_key"]:
            by_label[label].add(e["destination_key"])
    return {
        label: sorted(dests)
        for label, dests in by_label.items()
        if len(dests) >= 2
    }


def compute_pagerank(known_slugs, internal_edges, damping, max_iterations, tolerance):
    """Classic power-iteration PageRank with dangling-mass redistribution.
    Excludes rel=nofollow edges from the equity graph (distilled section 5)."""
    equity_edges = [e for e in internal_edges if e["destination_key"] and not e["nofollow"]]

    out_degree = defaultdict(int)
    inbound = defaultdict(list)
    for e in equity_edges:
        out_degree[e["source_key"]] += 1
        inbound[e["destination_key"]].append(e["source_key"])

    n = len(known_slugs)
    if n == 0:
        return {}, 0

    pr = {slug: 1 / n for slug in known_slugs}
    dangling = [slug for slug in known_slugs if out_degree.get(slug, 0) == 0]

    iterations_run = 0
    for _ in range(max_iterations):
        dangling_mass = sum(pr[d] for d in dangling) / n
        new_pr = {}
        delta = 0.0
        for p in known_slugs:
            incoming = sum(pr[q] / out_degree[q] for q in inbound.get(p, ()) if out_degree.get(q, 0) > 0)
            value = (1 - damping) / n + damping * (incoming + dangling_mass)
            new_pr[p] = value
            delta += abs(value - pr[p])
        pr = new_pr
        iterations_run += 1
        if delta < tolerance:
            break

    return pr, iterations_run


def gini_coefficient(values):
    values = sorted(v for v in values if v is not None)
    n = len(values)
    if n == 0 or sum(values) == 0:
        return 0.0
    cumulative = 0
    weighted_sum = 0
    total = sum(values)
    for i, v in enumerate(values, start=1):
        cumulative += v
        weighted_sum += i * v
    return round((2 * weighted_sum) / (n * total) - (n + 1) / n, 4)


def distribution_shape(gini):
    if gini < 0.30:
        return "flat, no discernible hub structure"
    if gini < 0.40:
        return "transitional-flat"
    if gini <= 0.65:
        return "healthy hub-and-spoke"
    if gini <= 0.75:
        return "transitional-concentrated"
    return "over-concentrated, spoke pages likely equity-starved"


def classify_equity(slug, inbound_count, equity_share, percentile):
    if inbound_count == 0:
        return "ORPHAN"
    if inbound_count >= OVER_LINKED_MIN_INBOUND or equity_share > OVER_LINKED_EQUITY_SHARE:
        return "OVER-LINKED"
    if percentile >= 0.80 and inbound_count >= HEALTHY_MIN_INBOUND:
        return "HEALTHY"
    if percentile >= 0.40 and inbound_count >= MODERATE_MIN_INBOUND:
        return "MODERATE"
    return "UNDER-SERVED"


def main():
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("--site-data", required=True)
    parser.add_argument("--entry-points", required=True,
                         help="comma-separated slugs, e.g. index,category-hub")
    parser.add_argument("--site-host", default=None,
                         help="hostname used to distinguish internal vs. external absolute hrefs")
    parser.add_argument("--url-map", default=None,
                         help="optional JSON {url_path: slug} from site-crawler-wasp-drone")
    parser.add_argument("--damping", type=float, default=0.85)
    parser.add_argument("--max-iterations", type=int, default=30)
    parser.add_argument("--tolerance", type=float, default=1e-6)
    parser.add_argument("--depth-threshold", type=int, default=3)
    parser.add_argument("--out", default=None)
    args = parser.parse_args()

    entry_points = [e.strip() for e in args.entry_points.split(",") if e.strip()]
    if not entry_points:
        print("error: --entry-points must name at least one slug", file=sys.stderr)
        return 1

    try:
        pages, edges, known_slugs = build_graph(args.site_data, args.site_host, args.url_map)
    except FileNotFoundError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1

    missing_entry_points = [e for e in entry_points if e not in known_slugs]
    if missing_entry_points:
        print(
            f"error: entry point(s) not found in site-data: {missing_entry_points}",
            file=sys.stderr,
        )
        return 1

    internal_edges = [e for e in edges if e["kind"] == "internal"]

    depth_by_slug = compute_depth(entry_points, known_slugs, internal_edges)

    inbound_by_slug = defaultdict(list)
    outbound_count = defaultdict(int)
    for e in internal_edges:
        inbound_by_slug[e["destination_key"]].append(e)
        outbound_count[e["source_key"]] += 1

    pr, iterations_run = compute_pagerank(
        known_slugs, internal_edges, args.damping, args.max_iterations, args.tolerance
    )
    total_equity = sum(pr.values()) or 1.0
    sorted_by_equity = sorted(known_slugs, key=lambda s: pr.get(s, 0))
    rank_position = {slug: i for i, slug in enumerate(sorted_by_equity)}
    n = len(known_slugs)

    cannibalization = find_cannibalization(internal_edges)

    page_records = {}
    for slug in known_slugs:
        inbound_edges_for_slug = inbound_by_slug.get(slug, [])
        contextual_inbound = [e for e in inbound_edges_for_slug if e["placement"] == "main"]
        inbound_count = len(inbound_edges_for_slug)
        out_count = outbound_count.get(slug, 0)
        percentile = (rank_position[slug] + 1) / n if n else 0
        equity_share = pr.get(slug, 0) / total_equity

        page_records[slug] = {
            "title": pages[slug]["title"],
            "inbound_link_count": inbound_count,
            "outbound_link_count": out_count,
            "is_orphan_candidate": inbound_count == 0,
            "is_dead_end": out_count == 0,
            "depth": depth_by_slug[slug]["depth"],
            "reachable_from_entry_points": depth_by_slug[slug]["reachable"],
            "parent_count_at_min_depth": depth_by_slug[slug]["parent_count_at_min_depth"],
            "depth_outlier": (
                depth_by_slug[slug]["depth"] is not None
                and depth_by_slug[slug]["depth"] > args.depth_threshold
            ),
            "anchor_quality_all_inbound": score_anchor_quality(
                inbound_edges_for_slug, pages[slug]["topic_tokens"]
            ),
            "anchor_quality_contextual_only": score_anchor_quality(
                contextual_inbound, pages[slug]["topic_tokens"]
            ),
            "equity_score": round(pr.get(slug, 0), 6),
            "equity_share_pct": round(equity_share * 100, 3),
            "equity_percentile": round(percentile, 3),
            "equity_classification": classify_equity(slug, inbound_count, equity_share, percentile),
        }

    gini = gini_coefficient([pr.get(s, 0) for s in known_slugs])

    result = {
        "params": {
            "entry_points": entry_points,
            "damping": args.damping,
            "iterations_run": iterations_run,
            "depth_threshold": args.depth_threshold,
            "page_count": n,
        },
        "pages": page_records,
        "summary": {
            "orphan_pages": sorted(s for s, r in page_records.items() if r["is_orphan_candidate"]),
            "dead_end_pages": sorted(s for s, r in page_records.items() if r["is_dead_end"]),
            "unreachable_from_entry_points": sorted(
                s for s, r in page_records.items() if not r["reachable_from_entry_points"]
            ),
            "depth_outliers": sorted(s for s, r in page_records.items() if r["depth_outlier"]),
            "anchor_cannibalization": cannibalization,
            "over_linked_pages": sorted(
                s for s, r in page_records.items() if r["equity_classification"] == "OVER-LINKED"
            ),
            "gini_coefficient": gini,
            "distribution_shape": distribution_shape(gini),
        },
        "edges_uncrawled_or_external_count": sum(1 for e in edges if e["kind"] != "internal"),
    }

    output = json.dumps(result, indent=2)
    if args.out:
        Path(args.out).write_text(output, encoding="utf-8")
        print(f"wrote {args.out}")
    else:
        print(output)

    return 0


if __name__ == "__main__":
    sys.exit(main())
