#!/usr/bin/env python3
"""
Split a SuperSnapshot AI HighLevel location export into:
  out/workflows/<nnn>-<slug>/workflow.json   per-workflow data + resolved asset ties
  out/workflows/<nnn>-<slug>/workflow.mmd    per-workflow Mermaid flowchart
  out/account/*.mmd                          account-level overview charts
  out/account/*.json                         account-level graph payloads
  out/index.md                               manifest

Every emitted file is kept under MAX_BYTES; oversized charts are split into parts.

Usage: python3 src/extract.py <export.json> [outdir]
"""
import json, math, os, re, sys, unicodedata
from collections import defaultdict, Counter

MAX_BYTES = 95 * 1024          # headroom under a 100 KiB file ceiling
# Mermaid's own maxTextSize default is 50000 CHARACTERS (config schema), which is the
# limit that actually binds when a chart is pasted into a stock renderer. It is tighter
# than the byte ceiling, so charts are capped against both.
MAX_CHARS = 45000
COLLAPSE_BRANCH_STUBS = True   # render single-exit branch steps as edge labels


# ---------------------------------------------------------------- text helpers

def clean(text, limit=70):
    """Make an arbitrary user string safe to sit inside a Mermaid node label."""
    if text is None:
        return ""
    s = unicodedata.normalize("NFKC", str(text))
    s = "".join(ch if ch >= " " or ch == "\n" else " " for ch in s)
    s = s.replace("\r", " ").replace("\n", " ")
    s = s.replace('"', "'").replace("<", "(").replace(">", ")")
    s = s.replace("#", "no.").replace("|", "/")
    s = re.sub(r"\s+", " ", s).strip()
    if len(s) > limit:
        s = s[: limit - 1].rstrip() + "…"
    return s


def slug(text, limit=48):
    s = unicodedata.normalize("NFKD", str(text or "untitled"))
    s = s.encode("ascii", "ignore").decode()
    s = re.sub(r"[^A-Za-z0-9]+", "-", s).strip("-").lower()
    return (s[:limit].strip("-")) or "untitled"


def nid(prefix, raw):
    """Mermaid-safe node id."""
    return prefix + re.sub(r"[^A-Za-z0-9]", "", str(raw))[-24:]


# ------------------------------------------------------------- node vocabulary
# shape: how the step is drawn.  cls: Mermaid classDef bucket.
STEP_STYLE = {
    "email":                      ("rect",    "comms",   "Email"),
    "sms":                        ("rect",    "comms",   "SMS"),
    "internal_notification":      ("rect",    "notify",  "Notify"),
    "task-notification":          ("rect",    "notify",  "Task"),
    "wait":                       ("skew",    "wait",    "Wait"),
    "drip":                       ("skew",    "wait",    "Drip"),
    "if_else":                    ("diamond", "logic",   "If/Else"),
    "goto":                       ("aslant",  "logic",   "Go To"),
    "transition":                 ("round",   "logic",   "Transition"),
    "workflow_goal":              ("circle",  "goal",    "Goal"),
    "add_contact_tag":            ("rect",    "crm",     "Add tag"),
    "remove_contact_tag":         ("rect",    "crm",     "Remove tag"),
    "dnd_contact":                ("rect",    "crm",     "DND"),
    "update_custom_value":        ("rect",    "crm",     "Set value"),
    "create_opportunity":         ("rect",    "crm",     "Opportunity"),
    "copy_contact_to_subaccount": ("rect",    "crm",     "Copy contact"),
    "add_to_workflow":            ("subroutine", "flow", "Start workflow"),
    "remove_from_workflow":       ("subroutine", "flow", "Remove from workflow"),
    "google_sheets":              ("rect",    "ext",     "Google Sheets"),
    "webhook":                    ("rect",    "ext",     "Webhook"),
}
DEFAULT_STYLE = ("rect", "other", "Step")

SHAPES = {
    "rect":       ("[\"", "\"]"),
    "round":      ("(\"", "\")"),
    "stadium":    ("([\"", "\"])"),
    "subroutine": ("[[\"", "\"]]"),
    "diamond":    ("{\"", "\"}"),
    "circle":     ("((\"", "\"))"),
    "skew":       ("[/\"", "\"/]"),
    "aslant":     (">\"", "\"]"),
}

CLASSDEFS = """  classDef trigger fill:#0f766e,stroke:#0d5c56,color:#fff
  classDef comms   fill:#1d4ed8,stroke:#1e3a8a,color:#fff
  classDef notify  fill:#7c3aed,stroke:#5b21b6,color:#fff
  classDef wait    fill:#a16207,stroke:#713f12,color:#fff
  classDef logic   fill:#be123c,stroke:#881337,color:#fff
  classDef goal    fill:#15803d,stroke:#14532d,color:#fff
  classDef crm     fill:#0369a1,stroke:#075985,color:#fff
  classDef flow    fill:#c2410c,stroke:#7c2d12,color:#fff
  classDef ext     fill:#4b5563,stroke:#374151,color:#fff
  classDef other   fill:#334155,stroke:#1e293b,color:#fff
  classDef term    fill:#e2e8f0,stroke:#94a3b8,color:#0f172a"""


def node_line(node_id, label, shape, cls):
    open_, close = SHAPES.get(shape, SHAPES["rect"])
    return f"  {node_id}{open_}{label}{close}:::{cls}"


# ------------------------------------------------------------------- loading

def load(path):
    with open(path, "r", encoding="utf-8") as fh:
        return json.load(fh)


def build_indexes(doc):
    """Name lookup for every asset id, so references resolve to human labels."""
    names, kinds = {}, {}
    for n in doc.get("_graph", {}).get("nodes", []):
        names[n["ghlId"]] = n.get("name") or n["ghlId"]
        kinds[n["ghlId"]] = n["type"]
    for bucket in ("custom_values", "custom_fields", "tags", "forms", "surveys",
                   "links", "email_templates", "workflow"):
        for item in doc.get(bucket, []):
            if isinstance(item, dict) and item.get("id"):
                names.setdefault(item["id"], item.get("name") or item["id"])
                kinds.setdefault(item["id"], bucket)
    return names, kinds


def resolve(ref, names):
    """A reference value is either an id we know, or already a literal name."""
    val = ref.get("value")
    return names.get(val, val)


# -------------------------------------------------------- per-workflow model

def workflow_slices(doc):
    steps_by_wf = defaultdict(list)
    for s in doc["_workflowSteps"]["steps"]:
        steps_by_wf[s["workflowId"]].append(s)

    trig_by_wf = defaultdict(list)
    for t in doc.get("workflow_triggers", []):
        if not t.get("deleted"):
            trig_by_wf[t["workflowId"]].append(t)

    edges_by_wf = defaultdict(list)
    for e in doc.get("_graph", {}).get("edges", []):
        if e["from"].startswith("workflow:"):
            edges_by_wf[e["from"].split(":", 1)[1]].append(e)

    meta_by_wf = {w["id"]: w for w in doc.get("workflow", [])}
    return steps_by_wf, trig_by_wf, edges_by_wf, meta_by_wf


def order_steps(steps):
    """Depth-first traversal from the root; returns (ordered, roots, cyclic)."""
    by_id = {s["stepId"]: s for s in steps}
    targeted = {n for s in steps for n in (s.get("next") or [])}
    roots = [s["stepId"] for s in steps if s["stepId"] not in targeted]
    cyclic = not roots
    if cyclic:  # every step is pointed at: pick the lowest-order step as entry
        roots = [min(steps, key=lambda s: (s.get("order", 0), s["stepId"]))["stepId"]]

    ordered, seen = [], set()
    stack = list(reversed(roots))
    while stack:
        sid = stack.pop()
        if sid in seen or sid not in by_id:
            continue
        seen.add(sid)
        ordered.append(by_id[sid])
        for nxt in reversed(by_id[sid].get("next") or []):
            if nxt not in seen:
                stack.append(nxt)
    for s in steps:  # anything unreachable still gets emitted
        if s["stepId"] not in seen:
            ordered.append(s)
    return ordered, roots, cyclic


# ------------------------------------------------------- per-workflow mermaid

def step_label(step, names, step_assets):
    style = STEP_STYLE.get(step["type"], DEFAULT_STYLE)
    verb = style[2]
    name = clean(step.get("name") or verb, 48)
    lines = [f"{verb}: {name}" if name.lower() != verb.lower() else verb]

    if step["type"] in ("wait", "drip") and step.get("waitDuration"):
        w = step["waitDuration"]
        lines[0] = clean(f"Wait {w.get('value','?')} {w.get('type','')}"
                         f" ({w.get('when','')})", 48)
    if step.get("subject"):
        lines.append(clean(f"“{step['subject']}”", 52))
    for asset in step_assets.get(step["stepId"], [])[:3]:
        lines.append(clean(f"→ {asset}", 52))
    return "<br/>".join(lines)


def workflow_mermaid(wf_id, meta, steps, triggers, step_assets, names, title):
    ordered, roots, cyclic = order_steps(steps)
    by_id = {s["stepId"]: s for s in steps}

    # Branch stubs: a branch child with one exit becomes an edge label.
    stub_label, stub_target = {}, {}
    if COLLAPSE_BRANCH_STUBS:
        for s in steps:
            for br in s.get("branches") or []:
                child = by_id.get(br["id"])
                if child and child["type"] == "if_else" and len(child.get("next") or []) <= 1:
                    stub_label[br["id"]] = clean(br.get("name") or "branch", 28)
                    nxt = child.get("next") or []
                    stub_target[br["id"]] = nxt[0] if nxt else None

    out = ["flowchart TD", CLASSDEFS, f'  %% {clean(title, 120)}']

    # triggers
    trig_ids = []
    for i, t in enumerate(triggers):
        tid = nid("TRG", f"{wf_id}{i}")
        trig_ids.append(tid)
        label = clean(f"⚡ {t.get('name') or t.get('type')}", 56)
        if t.get("conditions"):
            label += "<br/>" + clean(t["conditions"], 60)
        if not t.get("active"):
            label += "<br/>(inactive)"
        out.append(node_line(tid, label, "stadium", "trigger"))
    if not triggers:
        tid = nid("TRG", wf_id + "none")
        trig_ids.append(tid)
        out.append(node_line(tid, "⚡ No active trigger (manual / inbound only)",
                             "stadium", "trigger"))

    # step nodes
    emitted = set()
    for s in ordered:
        if s["stepId"] in stub_label:
            continue
        shape, cls, _ = STEP_STYLE.get(s["type"], DEFAULT_STYLE)
        out.append(node_line(nid("S", s["stepId"]), step_label(s, names, step_assets),
                             shape, cls))
        emitted.add(s["stepId"])

    endn = nid("END", wf_id)
    out.append(node_line(endn, "End", "stadium", "term"))

    # entry edges
    for tid in trig_ids:
        for r in roots:
            target = stub_target.get(r, r) if r in stub_label else r
            if target in emitted:
                out.append(f"  {tid} --> {nid('S', target)}")

    # step edges
    seen_edges = set()
    for s in ordered:
        if s["stepId"] in stub_label:
            continue
        src = nid("S", s["stepId"])
        nexts = s.get("next") or []
        if not nexts and s["type"] not in ("remove_from_workflow",):
            line = f"  {src} --> {endn}"
            if line not in seen_edges:
                seen_edges.add(line); out.append(line)
        for nxt in nexts:
            if nxt in stub_label:
                label, target = stub_label[nxt], stub_target[nxt]
                if target is None:
                    line = f"  {src} -->|{label}| {endn}"
                else:
                    line = f"  {src} -->|{label}| {nid('S', target)}"
            else:
                line = f"  {src} --> {nid('S', nxt)}"
            if line not in seen_edges:
                seen_edges.add(line); out.append(line)

    return "\n".join(out) + "\n", {"steps": len(steps), "roots": len(roots),
                                   "cyclic": cyclic, "triggers": len(triggers)}


# ------------------------------------------------------------- email metadata

# Never emit message content. Everything else on an email asset is fair game.
EMAIL_BODY_FIELDS = ("html", "bodyPreview", "body", "content", "textBody")


def email_index(doc):
    """id -> non-body metadata for every email asset in the export."""
    idx = {}
    for a in doc.get("email_actions", []):
        idx[a["id"]] = {
            "kind": "email_action",
            "name": a.get("name") or a.get("actionName"),
            "subject": a.get("subject") or None,
            "fromName": a.get("fromName") or None,
            "fromEmail": a.get("fromEmail") or None,
            "snippet": a.get("snippetName") or None,
            "attachments": a.get("attachmentCount") or 0,
            "trackClicks": a.get("trackClicks") or None,
            "workflowName": a.get("workflowName"),
            "workflowStatus": a.get("workflowStatus"),
        }
    for t in doc.get("email_templates", []):
        idx[t["id"]] = {
            "kind": "email_template",
            "name": t.get("name"),
            "subject": None,
            "fromName": None,
            "fromEmail": None,
            "templateType": t.get("templateType"),
            "folder": t.get("folderPath") or t.get("folder") or None,
            "plainText": t.get("isPlainText"),
            "updatedBy": t.get("updatedBy"),
            "lastUpdated": t.get("lastUpdated"),
            "archived": t.get("archived"),
        }
    for key, meta in list(idx.items()):
        for field in EMAIL_BODY_FIELDS:
            meta.pop(field, None)
        idx[key] = {k: v for k, v in meta.items()
                    if v not in (None, "", 0, False, [])}
        idx[key]["kind"] = meta.get("kind")
    return idx


def email_label(meta, fallback):
    """Compact node label: name, then subject, then sender. Never body."""
    if not meta:
        return clean(fallback, 40)
    lines = [clean(meta.get("name") or fallback, 40)]
    if meta.get("subject"):
        lines.append(clean("✉ " + meta["subject"], 44))
    sender = meta.get("fromName") or meta.get("fromEmail")
    if sender:
        lines.append(clean("from " + sender, 32))
    if meta.get("attachments"):
        lines.append(f"{meta['attachments']} attachment(s)")
    if meta.get("kind") == "email_template":
        tail = [meta.get("templateType"), meta.get("folder")]
        tail = [t for t in tail if t]
        if tail:
            lines.append(clean(" · ".join(tail), 38))
    return "<br/>".join(lines)


def grid_columns(n):
    """Columns that keep a cluster near a 1.8 aspect ratio.

    Measured cell size in rendered Mermaid output is ~389px wide by ~178px
    tall, so width/height = cols^2 * 2.185 / n. Solving for 1.8 gives
    cols = 0.91 * sqrt(n). Verified against rendered sizes for n = 5..70.
    """
    if n <= 2:
        return max(1, n)
    return max(2, round(0.91 * math.sqrt(n)))


def email_charts(doc, names, emails):
    """One chart per workflow that sends email.

    Emails are chained into rows with invisible `~~~` links, which emit no
    path elements at all. A plain fan-out stacks them in a single column:
    30 emails measured 605x5316 (0.11 ratio) that way versus 2280x916 (2.49)
    with row chaining.
    """
    g = doc["_graph"]
    node_by_id = {n["id"]: n for n in g["nodes"]}
    groups = defaultdict(list)
    for e in g["edges"]:
        if e["type"] != "sends email":
            continue
        if e["to"].split(":", 1)[0] not in ("email_templates", "email_actions"):
            continue
        if e["to"] not in groups[e["from"]]:
            groups[e["from"]].append(e["to"])

    charts = []
    ordered = sorted(groups.items(),
                     key=lambda kv: (node_by_id.get(kv[0], {}).get("name") or "").lower())
    for wf_key, targets in ordered:
        wf = node_by_id.get(wf_key, {})
        wf_name = wf.get("name") or wf_key
        wid = nid("N", wf_key)
        cols = grid_columns(len(targets))

        out = ["flowchart LR", CLASSDEFS,
               f"  %% {clean(wf_name, 100)} sends {len(targets)} email(s)",
               f'  subgraph SG{wid}["{clean(wf_name, 56)}"]',
               "    direction LR",
               "  " + node_line(wid, clean(wf_name, 44), "subroutine", "flow")]
        ids = []
        for tkey in targets:
            gid = tkey.split(":", 1)[1]
            label = email_label(emails.get(gid), node_by_id.get(tkey, {}).get("name"))
            node_id = nid("N", tkey)
            ids.append(node_id)
            out.append("  " + node_line(node_id, label, "rect", "comms"))
        for start in range(0, len(ids), cols):
            row = ids[start:start + cols]
            out.append(f"    {wid} --> {row[0]}")
            for left, right in zip(row, row[1:]):
                out.append(f"    {left} ~~~ {right}")
        out.append("  end")
        charts.append((wf_name, len(targets), cols, "\n".join(out) + "\n"))
    return charts


# ------------------------------------------------------------ account charts

ACCOUNT_EDGE_STYLE = {
    "starts workflow":       ("==>", "starts"),
    "removes from workflow": ("-.->", "removes"),
    "adds tag":              ("-->", "+tag"),
    "removes tag":           ("-.->", "-tag"),
    "uses tag":              ("-.->", "uses"),
    "sends email":           ("-->", "email"),
}


def account_chart(doc, names, include_types, title, direction="LR",
                  emails=None, email_name_limit=34):
    g = doc["_graph"]
    keep = {n["id"]: n for n in g["nodes"] if n["type"] in include_types}
    edges = [e for e in g["edges"] if e["from"] in keep and e["to"] in keep]
    used = {e["from"] for e in edges} | {e["to"] for e in edges}

    out = [f"flowchart {direction}", CLASSDEFS, f"  %% {clean(title, 120)}"]
    cls_for = {"workflow": "flow", "tags": "crm", "email_templates": "comms",
               "email_actions": "comms", "forms": "trigger", "funnels": "other",
               "custom_values": "crm", "links": "ext", "websites": "other",
               "surveys": "trigger", "custom_fields": "crm"}
    shape_for = {"workflow": "subroutine", "tags": "round",
                 "email_templates": "rect", "email_actions": "rect"}
    for node_key in sorted(used):
        n = keep[node_key]
        if emails is not None and n["type"] in ("email_templates", "email_actions"):
            meta = emails.get(n["ghlId"], {})
            label = clean(meta.get("name") or n.get("name"), email_name_limit)
        else:
            label = clean(n.get("name"), 56)
        out.append(node_line(nid("N", node_key), label,
                             shape_for.get(n["type"], "rect"),
                             cls_for.get(n["type"], "other")))
    seen = set()
    for e in edges:
        arrow, label = ACCOUNT_EDGE_STYLE.get(e["type"], ("-->", e["type"]))
        line = f"  {nid('N', e['from'])} {arrow}|{label}| {nid('N', e['to'])}"
        if line not in seen:
            seen.add(line); out.append(line)
    return "\n".join(out) + "\n", len(used), len(seen)


def shared_tag_charts(doc, names, min_workflows=2, tags_per_chart=6):
    """Tags touched by more than one workflow, chunked.

    Single-use tags carry no cross-workflow signal and were most of the node
    count. The remainder is a two-rank bipartite graph, which is tall in LR
    (558x3594) and wide in TD (6337x231); chunking is what actually bounds it.
    """
    g = doc["_graph"]
    node_by_id = {n["id"]: n for n in g["nodes"]}
    tag_wf = defaultdict(set)
    for e in g["edges"]:
        if e["to"].startswith("tags:"):
            tag_wf[e["to"]].add(e["from"])
    shared = sorted((t for t, wfs in tag_wf.items() if len(wfs) >= min_workflows),
                    key=lambda t: (node_by_id.get(t, {}).get("name") or "").lower())

    charts = []
    for start in range(0, len(shared), tags_per_chart):
        group = set(shared[start:start + tags_per_chart])
        edges = [e for e in g["edges"] if e["to"] in group]
        used = {e["from"] for e in edges} | group
        # TD, not LR. This is a two-rank bipartite graph: LR sends the flow
        # left-to-right but stacks the parallel workflows vertically, giving a
        # 558x1458 column. TD spreads them horizontally into a 2687x231 band
        # that reads across the screen, and straightness is unchanged
        # (detour 1.053 vs 1.050). Chaining any of these nodes to widen it
        # instead costs detour (1.188-1.218), because they are all one
        # connected component.
        out = ["flowchart TD", CLASSDEFS,
               f"  %% Tags touched by {min_workflows}+ workflows "
               f"({len(shared)} of {len(tag_wf)} tags), "
               f"group {start // tags_per_chart + 1}"]
        for key in sorted(used):
            n = node_by_id.get(key, {})
            is_tag = key.startswith("tags:")
            out.append(node_line(nid("N", key), clean(n.get("name"), 44),
                                 "round" if is_tag else "subroutine",
                                 "crm" if is_tag else "flow"))
        seen = set()
        for e in edges:
            arrow, label = ACCOUNT_EDGE_STYLE.get(e["type"], ("-->", e["type"]))
            line = f"  {nid('N', e['from'])} {arrow}|{label}| {nid('N', e['to'])}"
            if line not in seen:
                seen.add(line); out.append(line)
        charts.append(("\n".join(out) + "\n", len(used), len(seen)))
    return charts


def account_summary_chart(doc, names):
    """One node per workflow, grouped so nothing floats unexplained.

    The account is not one graph. Measured on a real export: one cluster of 17
    workflows, three pairs, two self-referencing singletons, and 21 workflows
    with no workflow-to-workflow edge at all. Drawing that flat produces a field
    of apparent orphans, so each connected cluster gets its own labelled box and
    the unconnected ones get a box that says exactly why they are there.

    Solid edges are control flow (starts / removes from). Dotted edges bridge a
    workflow that has no control-flow link to the workflow it shares the most
    tags or emails with, which is the only cross-cluster signal in the data.
    """
    g = doc["_graph"]
    node_by_id = {n["id"]: n for n in g["nodes"]}
    wf_keys = {n["id"] for n in g["nodes"] if n["type"] == "workflow"}

    touches = defaultdict(Counter)
    asset_users = defaultdict(set)
    for e in g["edges"]:
        if e["from"] not in wf_keys:
            continue
        kind = e["to"].split(":", 1)[0]
        touches[e["from"]][(kind, e["type"])] += 1
        if kind != "workflow":
            asset_users[e["to"]].add(e["from"])

    LABELS = {("email_templates", "sends email"): "email",
              ("email_actions", "sends email"): "email",
              ("tags", "adds tag"): "+tag", ("tags", "removes tag"): "-tag",
              ("tags", "uses tag"): "tag",
              ("workflow", "starts workflow"): "starts wf",
              ("workflow", "removes from workflow"): "removes wf"}

    flow_edges = [e for e in g["edges"] if e["from"] in wf_keys and e["to"] in wf_keys]
    adj = defaultdict(set)
    for e in flow_edges:
        if e["from"] != e["to"]:
            adj[e["from"]].add(e["to"]); adj[e["to"]].add(e["from"])
    linked = {e["from"] for e in flow_edges} | {e["to"] for e in flow_edges}

    # connected components among control-flow-linked workflows
    comps, seen_c = [], set()
    for key in sorted(linked, key=lambda k: (node_by_id[k].get("name") or "").lower()):
        if key in seen_c:
            continue
        stack, comp = [key], set()
        while stack:
            x = stack.pop()
            if x in seen_c:
                continue
            seen_c.add(x); comp.add(x)
            stack += [y for y in adj[x] if y not in seen_c]
        comps.append(sorted(comp, key=lambda k: (node_by_id[k].get("name") or "").lower()))
    comps.sort(key=len, reverse=True)

    # unconnected workflows, and their strongest shared-asset partner if any
    shared_edges = []
    unlinked = sorted(wf_keys - linked,
                      key=lambda k: (node_by_id[k].get("name") or "").lower())
    for wf in unlinked:
        overlap, kinds = Counter(), {}
        for asset, users in asset_users.items():
            if wf in users and len(users) > 1:
                for other in users - {wf}:
                    overlap[other] += 1
                    kinds.setdefault(other, asset.split(":", 1)[0])
        if overlap:
            partner, n = overlap.most_common(1)[0]
            label = "shares tag" if kinds.get(partner) == "tags" else "shares email"
            shared_edges.append((wf, partner, f"{label} x{n}" if n > 1 else label))

    def node_for(key, indent="  "):
        n = node_by_id[key]
        counts = Counter()
        for (kind, rel), c in touches.get(key, {}).items():
            counts[LABELS.get((kind, rel), rel)] += c
        bits = ", ".join(f"{c} {lab}" for lab, c in sorted(counts.items()))
        label = clean(n.get("name"), 46)
        if bits:
            label += "<br/>" + clean(bits, 46)
        status = (n.get("status") or "").lower()
        return indent + node_line(nid("N", key), label, "subroutine",
                                  "flow" if status == "published" else "other").lstrip()

    out = ["flowchart LR", CLASSDEFS,
           "  %% Account summary. Solid = control flow. Dotted = shares a tag or email.",
           "  %% Each box is a cluster that does not touch the others."]
    box_ids = []

    for i, comp in enumerate(comps, 1):
        title = (f"Cluster {i}: {len(comp)} workflow"
                 f"{'s' if len(comp) != 1 else ''}")
        box_ids.append(f"SGC{i}")
        out.append(f'  subgraph SGC{i}["{title}"]')
        out.append("    direction LR")
        for key in comp:
            out.append("    " + node_for(key, ""))
        out.append("  end")

    if unlinked:
        box_ids.append("SGSTANDALONE")
        out.append(f'  subgraph SGSTANDALONE["Standalone: no starts/removes link '
                   f'to any other workflow ({len(unlinked)})"]')
        out.append("    direction LR")
        for key in unlinked:
            out.append("    " + node_for(key, ""))
        ids = [nid("N", k) for k in unlinked]
        cols = grid_columns(len(ids))
        for start in range(0, len(ids), cols):
            row = ids[start:start + cols]
            for left, right in zip(row, row[1:]):
                out.append(f"    {left} ~~~ {right}")
        out.append("  end")

    seen = set()
    for e in flow_edges:
        arrow, label = ACCOUNT_EDGE_STYLE.get(e["type"], ("-->", e["type"]))
        line = f"  {nid('N', e['from'])} {arrow}|{label}| {nid('N', e['to'])}"
        if line not in seen:
            seen.add(line); out.append(line)
    for a, b, label in shared_edges:
        line = f"  {nid('N', a)} -.->|{label}| {nid('N', b)}"
        if line not in seen:
            seen.add(line); out.append(line)

    # Chain the CONTAINERS so the boxes run left to right instead of stacking.
    # Safe here in a way chaining nodes is not: the boxes carry no edges between
    # themselves, so the layout engine satisfies the invisible row without
    # distorting any real edge. Measured identical ink (597) and detour (1.095)
    # with the aspect flipping from 0.36 to 2.98.
    for left, right in zip(box_ids, box_ids[1:]):
        out.append(f"  {left} ~~~ {right}")

    return "\n".join(out) + "\n", len(wf_keys), len(seen)

def split_chart(text, max_bytes=MAX_BYTES, max_chars=MAX_CHARS):
    """Split an oversized chart on edge boundaries, repeating the header.

    Capped against both a byte ceiling (file-size limits) and a character ceiling
    (Mermaid's maxTextSize default of 50000, which binds first in practice).
    """
    if len(text.encode()) <= max_bytes and len(text) <= max_chars:
        return [text]
    max_bytes = min(max_bytes, max_chars)
    lines = text.split("\n")
    header = [l for l in lines if not l.strip().startswith(("  N", "  S")) or "-->" not in l]
    head = lines[:2 + len(CLASSDEFS.split("\n"))]
    body = lines[len(head):]
    parts, cur, size = [], list(head), len("\n".join(head).encode())
    for line in body:
        add = len(line.encode()) + 1
        if size + add > max_bytes and len(cur) > len(head):
            parts.append("\n".join(cur) + "\n")
            cur, size = list(head), len("\n".join(head).encode())
        cur.append(line); size += add
    parts.append("\n".join(cur) + "\n")
    return parts


def slim_steps(ordered, step_asset_refs, names):
    """Project steps into a compact, lossless-enough shape.

    Collapses the two overlapping asset lists (`assets` from graph edges,
    `references` from the step itself) into one deduped `touches` array, and
    swaps 36-char UUIDs for short local ids. The UUIDs survive in stepIdMap.
    """
    short = {s["stepId"]: f"s{i}" for i, s in enumerate(ordered)}
    out = []
    for s in ordered:
        touches, seen = [], set()
        for a in step_asset_refs.get(s["stepId"], []):
            key = (a["assetType"], a["assetName"], a["relationship"])
            if key not in seen:
                seen.add(key)
                touches.append({"kind": key[0], "name": key[1], "rel": key[2]})
        for r in s.get("references") or []:
            key = (r["type"], resolve(r, names), r["relationship"])
            if key not in seen:
                seen.add(key)
                touches.append({"kind": key[0], "name": key[1], "rel": key[2]})

        row = {"id": short[s["stepId"]], "type": s["type"]}
        name = s.get("name")
        if name and name != s["type"]:
            row["name"] = name
        subject = s.get("subject")
        if subject and (not name or subject not in name):
            row["subject"] = subject
        if s.get("category"):
            row["category"] = s["category"]
        if s.get("waitDuration"):
            w = s["waitDuration"]
            row["wait"] = " ".join(str(x) for x in
                                   (w.get("value"), w.get("type"), w.get("when"))
                                   if x is not None)
        nxt = [short.get(n, n) for n in (s.get("next") or [])]
        if nxt:
            row["next"] = nxt
        branches = [{"to": short.get(b["id"], b["id"]), "name": b.get("name")}
                    for b in (s.get("branches") or [])]
        if branches:
            row["branches"] = branches
        if touches:
            row["touches"] = touches
        out.append(row)
    return out, {v: k for k, v in short.items()}


# ---------------------------------------------------------------------- main


def write_json(path, payload, heavy_keys, max_bytes=MAX_BYTES, indent=2):
    """Write payload as JSON, splitting heavy arrays across numbered parts if
    it exceeds max_bytes. Scalar metadata is repeated in each part so every
    file stands alone. Returns (list_of_paths, largest_bytes).

    The split budget is verified against the real serialized size and retried,
    because indentation inflates items well beyond their compact length.
    """
    full = json.dumps(payload, indent=indent, ensure_ascii=False)
    if len(full.encode()) <= max_bytes:
        return [path], write(path, full)

    base = {k: v for k, v in payload.items() if k not in heavy_keys}
    stem, ext = os.path.splitext(path)
    extra = []

    base_bytes = len(json.dumps(base, indent=indent, ensure_ascii=False).encode())
    if base_bytes > max_bytes - 4096:
        # metadata alone is too big to repeat: park it in its own file
        meta_path = f"{stem}.meta{ext}"
        write(meta_path, json.dumps(base, indent=indent, ensure_ascii=False))
        base = {k: base[k] for k in ("workflowId", "name", "locationId") if k in base}
        base["_metaFile"] = os.path.basename(meta_path)
        base_bytes = len(json.dumps(base, indent=indent, ensure_ascii=False).encode())
        extra.append(meta_path)

    stream = [(k, it) for k in heavy_keys for it in (payload.get(k) or [])]
    sizes = [len(json.dumps(it, ensure_ascii=False).encode()) + 2 for _, it in stream]
    budget = max(512, max_bytes - base_bytes - 512)

    def build(budget):
        groups, cur, size = [], defaultdict(list), 0
        for (key, item), b in zip(stream, sizes):
            if size + b > budget and size > 0:
                groups.append(cur); cur, size = defaultdict(list), 0
            cur[key].append(item); size += b
        if cur:
            groups.append(cur)
        bodies = []
        for i, grp in enumerate(groups, 1):
            body = dict(base)
            body["_part"] = {"index": i, "of": len(groups),
                             "splitKeys": list(heavy_keys),
                             "note": "Heavy arrays are split across parts; "
                                     "scalar metadata is repeated in each part."}
            for k in heavy_keys:
                body[k] = grp.get(k, [])
            bodies.append(json.dumps(body, indent=indent, ensure_ascii=False))
        return bodies

    bodies = build(budget)
    for _ in range(8):
        worst = max(len(b.encode()) for b in bodies)
        if worst <= max_bytes:
            break
        budget = int(budget * max_bytes / worst * 0.92)
        if budget < 512:
            break
        bodies = build(budget)

    written, largest = list(extra), 0
    for i, body in enumerate(bodies, 1):
        target = f"{stem}.part{i}{ext}"
        largest = max(largest, write(target, body))
        written.append(target)
    return written, largest


def slim_steps(ordered, step_asset_refs, names):
    """Project steps into a compact, lossless-enough shape.

    Collapses the two overlapping asset lists (`assets` from graph edges,
    `references` from the step itself) into one deduped `touches` array, and
    swaps 36-char UUIDs for short local ids. The UUIDs survive in stepIdMap.
    """
    short = {s["stepId"]: f"s{i}" for i, s in enumerate(ordered)}
    out = []
    for s in ordered:
        touches, seen = [], set()
        for a in step_asset_refs.get(s["stepId"], []):
            key = (a["assetType"], a["assetName"], a["relationship"])
            if key not in seen:
                seen.add(key)
                touches.append({"kind": key[0], "name": key[1], "rel": key[2]})
        for r in s.get("references") or []:
            key = (r["type"], resolve(r, names), r["relationship"])
            if key not in seen:
                seen.add(key)
                touches.append({"kind": key[0], "name": key[1], "rel": key[2]})

        row = {"id": short[s["stepId"]], "type": s["type"]}
        name = s.get("name")
        if name and name != s["type"]:
            row["name"] = name
        subject = s.get("subject")
        if subject and (not name or subject not in name):
            row["subject"] = subject
        if s.get("category"):
            row["category"] = s["category"]
        if s.get("waitDuration"):
            w = s["waitDuration"]
            row["wait"] = " ".join(str(x) for x in
                                   (w.get("value"), w.get("type"), w.get("when"))
                                   if x is not None)
        nxt = [short.get(n, n) for n in (s.get("next") or [])]
        if nxt:
            row["next"] = nxt
        branches = [{"to": short.get(b["id"], b["id"]), "name": b.get("name")}
                    for b in (s.get("branches") or [])]
        if branches:
            row["branches"] = branches
        if touches:
            row["touches"] = touches
        out.append(row)
    return out, {v: k for k, v in short.items()}


# ---------------------------------------------------------------------- main


def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(text)
    return len(text.encode())


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    src_path = sys.argv[1]
    outdir = sys.argv[2] if len(sys.argv) > 2 else "out"

    doc = load(src_path)
    names, kinds = build_indexes(doc)
    emails = email_index(doc)
    steps_by_wf, trig_by_wf, edges_by_wf, meta_by_wf = workflow_slices(doc)

    # step -> [asset label] from the resolved graph edges (via workflow_step:<id>)
    step_assets = defaultdict(list)
    step_asset_refs = defaultdict(list)
    for e in doc["_graph"]["edges"]:
        if not e.get("via", "").startswith("workflow_step:"):
            continue
        sid = e["via"].split(":", 1)[1]
        kind, gid = e["to"].split(":", 1)
        label = names.get(gid, gid)
        step_assets[sid].append(label)
        step_asset_refs[sid].append({"assetType": kind, "assetId": gid,
                                     "assetName": label, "relationship": e["type"]})

    manifest, oversize = [], []
    for i, (wf_id, steps) in enumerate(
            sorted(steps_by_wf.items(),
                   key=lambda kv: (kv[1][0]["workflowName"] or "").lower()), 1):
        meta = meta_by_wf.get(wf_id, {})
        name = steps[0]["workflowName"]
        triggers = trig_by_wf.get(wf_id, [])
        folder = f"{outdir}/workflows/{i:02d}-{slug(name)}"

        ordered, roots, cyclic = order_steps(steps)
        touched = defaultdict(set)
        for s in steps:
            for r in s.get("references") or []:
                touched[r["type"]].add(resolve(r, names))
            for r in step_asset_refs.get(s["stepId"], []):
                touched[r["assetType"]].add(r["assetName"])

        slim, id_map = slim_steps(ordered, step_asset_refs, names)
        payload = {
            "workflowId": wf_id,
            "name": name,
            "status": meta.get("status"),
            "version": meta.get("version"),
            "updatedAt": meta.get("updatedAt"),
            "counts": {"steps": len(steps), "triggers": len(triggers),
                       "emails": meta.get("emailCount"), "sms": meta.get("smsCount"),
                       "conditions": meta.get("conditionCount")},
            "integrity": {"rootSteps": len(roots), "containsCycle": cyclic,
                          "gotoStepsWithUnresolvedTarget":
                              sum(1 for s in steps
                                  if s["type"] == "goto" and not s.get("next"))},
            "triggers": [{"id": t["id"], "name": t.get("name"), "type": t.get("type"),
                          "active": t.get("active"),
                          "conditions": t.get("conditions")} for t in triggers],
            "touchesAssets": {k: sorted(v) for k, v in sorted(touched.items())},
            "stepIdMap": id_map,
            "steps": slim,
        }

        json_paths, jb = write_json(f"{folder}/workflow.json", payload,
                                    ["steps"], indent=1)
        chart, stats = workflow_mermaid(wf_id, meta, steps, triggers,
                                        step_assets, names, name)
        parts = split_chart(chart)
        mb = 0
        for p, part in enumerate(parts, 1):
            suffix = "" if len(parts) == 1 else f".part{p}"
            mb = max(mb, write(f"{folder}/workflow{suffix}.mmd", part))
        if jb > MAX_BYTES:
            oversize.append((json_paths[0], jb))
        manifest.append({"n": i, "name": name, "folder": folder,
                         "steps": len(steps), "triggers": len(triggers),
                         "status": meta.get("status"), "cyclic": cyclic,
                         "jsonBytes": jb, "jsonParts": len(json_paths),
                         "mmdBytes": mb, "mmdParts": len(parts),
                         "assets": {k: len(v) for k, v in touched.items()}})

    # ---- account-level charts
    charts = [
        ("01-workflow-to-workflow", ["workflow"],
         "Account map: workflow to workflow (starts / removes)", "LR"),
    ]
    account = []
    for key, types, title, direction in charts:
        chart, nodes, edges = account_chart(doc, names, set(types), title,
                                            direction, emails=emails)
        parts = split_chart(chart)
        for p, part in enumerate(parts, 1):
            suffix = "" if len(parts) == 1 else f".part{p}"
            b = write(f"{outdir}/account/{key}{suffix}.mmd", part)
            account.append({"file": f"{outdir}/account/{key}{suffix}.mmd",
                            "bytes": b, "nodes": nodes, "edges": edges,
                            "title": title})

    for i, (chart, nodes, edges) in enumerate(shared_tag_charts(doc, names), 1):
        path = f"{outdir}/account/02-shared-tags.{i:02d}.mmd"
        b = write(path, chart)
        account.append({"file": path, "bytes": b, "nodes": nodes, "edges": edges,
                        "title": "Tags touched by 2+ workflows"})

    chart, nodes, edges = account_summary_chart(doc, names)
    for p2, part in enumerate(split_chart(chart), 1):
        suffix = "" if p2 == 1 else f".part{p2}"
        path = f"{outdir}/account/04-account-summary{suffix}.mmd"
        b = write(path, part)
        account.append({"file": path, "bytes": b, "nodes": nodes, "edges": edges,
                        "title": "Account summary: one node per workflow"})

    # workflow-to-email: one chart per workflow that sends email
    for i, (wf_name, n_emails, cols, chart) in enumerate(
            email_charts(doc, names, emails), 1):
        for p2, part in enumerate(split_chart(chart), 1):
            suffix = "" if p2 == 1 else f".part{p2}"
            path = (f"{outdir}/account/03-email.{i:02d}-"
                    f"{slug(wf_name, 40)}{suffix}.mmd")
            b = write(path, part)
            account.append({"file": path, "bytes": b, "nodes": n_emails + 1,
                            "edges": part.count("-->"),
                            "title": f"{wf_name} sends {n_emails} email(s), "
                                     f"{cols} col grid"})

    # email reference: every non-body field, so charts can stay compact
    referenced = {e["to"].split(":", 1)[1] for e in doc["_graph"]["edges"]
                  if e["type"] == "sends email"}
    email_ref = {"note": "Email metadata only. Message bodies (html, bodyPreview) "
                         "are deliberately excluded.",
                 "excludedFields": list(EMAIL_BODY_FIELDS),
                 "count": len(referenced),
                 "emails": [dict(emails[g], id=g) for g in sorted(referenced)
                            if g in emails]}
    email_paths, eb = write_json(f"{outdir}/account/emails.json", email_ref,
                                 ["emails"], indent=1)

    # account graph JSON (nodes+edges the charts are built from)
    g = doc["_graph"]
    gj = {"schemaVersion": g.get("schemaVersion"),
          "locationId": g.get("locationId"),
          "stats": g.get("stats"),
          "nodes": [{k: v for k, v in
                     (("id", n["id"]), ("type", n["type"]),
                      ("name", n.get("name")), ("status", n.get("status")))
                     if v is not None} for n in g["nodes"]],
          "edges": [{"from": e["from"], "to": e["to"], "type": e["type"]}
                    for e in g["edges"]]}
    graph_paths, gb = write_json(f"{outdir}/account/graph.json", gj,
                                 ["nodes", "edges"], indent=1)

    # ---- index
    lines = ["# HighLevel account extract",
             "",
             f"- Source: `{os.path.basename(src_path)}`",
             f"- Location: `{doc['_exportMetadata']['locationId']}`",
             f"- Exported: {doc['_exportMetadata']['exportDate']}",
             f"- Workflows: {len(manifest)}  |  Steps: {doc['_workflowSteps']['stats']['steps']}"
             f"  |  Graph: {g['stats']['nodes']} nodes / {g['stats']['edges']} edges",
             f"- Size ceiling enforced: {MAX_BYTES // 1024} KiB per file",
             "", "## Account charts", "",
             "| File | Bytes | Nodes | Edges |", "|---|---:|---:|---:|"]
    for a in account:
        lines.append(f"| `{a['file']}` | {a['bytes']:,} | {a['nodes']} | {a['edges']} |")
    for ep in email_paths:
        lines.append(f"| `{ep}` | {os.path.getsize(ep):,} | "
                     f"{email_ref['count']} emails | metadata only, no bodies |")
    for gp in graph_paths:
        lines.append(f"| `{gp}` | {os.path.getsize(gp):,} | "
                     f"{g['stats']['nodes']} | {g['stats']['edges']} |")
    lines += [
              "", "## Workflows", "",
              "| # | Workflow | Status | Steps | Trig | JSON B | JSON parts | MMD B | MMD parts |",
              "|---:|---|---|---:|---:|---:|---:|---:|---:|"]
    for m in manifest:
        flag = " ⟲" if m["cyclic"] else ""
        lines.append(f"| {m['n']} | [{m['name']}{flag}]({m['folder'].replace(outdir + '/', '')}/workflow.mmd) "
                     f"| {m['status'] or '-'} | {m['steps']} | {m['triggers']} "
                     f"| {m['jsonBytes']:,} | {m['jsonParts']} "
                     f"| {m['mmdBytes']:,} | {m['mmdParts']} |")
    lines += ["", "⟲ = workflow graph contains a cycle (no unique entry step).", ""]
    write(f"{outdir}/index.md", "\n".join(lines))

    print(f"workflows written : {len(manifest)}")
    print(f"account charts    : {len(account)} files")
    print(f"largest wf json   : {max(m['jsonBytes'] for m in manifest):,} bytes")
    print(f"largest wf mmd    : {max(m['mmdBytes'] for m in manifest):,} bytes")
    print(f"largest acct mmd  : {max(a['bytes'] for a in account):,} bytes")
    print(f"emails.json       : {eb:,} bytes across {len(email_paths)} file(s) "
          f"({email_ref['count']} emails, bodies excluded)")
    print(f"graph.json        : {gb:,} bytes across {len(graph_paths)} file(s)")
    if oversize:
        print("OVERSIZE (json, not splittable):")
        for path, b in oversize:
            print(f"  {b:,}  {path}")


if __name__ == "__main__":
    main()
