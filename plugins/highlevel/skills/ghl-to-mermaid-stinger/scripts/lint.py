#!/usr/bin/env python3
"""Structural lint for generated Mermaid charts and the JSON payloads.

Checks every chart for: valid node ids, balanced label quotes, edges that
reference an undefined node, and the Mermaid `end` keyword collision.
Checks every JSON file for parseability and the 100 KiB ceiling.
"""
import glob, json, os, re, sys

CEILING = 100 * 1024        # file-size ceiling
MAX_CHARS = 50000           # Mermaid maxTextSize default
MAX_EDGES = 500             # Mermaid maxEdges default
NODE_DEF = re.compile(r'^\s+([A-Za-z][A-Za-z0-9_]*)(\[\[|\(\(|\(\[|\[/|\[|\(|\{|>)')
EDGE = re.compile(r'^\s+([A-Za-z][A-Za-z0-9_]*)\s*(?:==>|-\.->|-->|~~~+)(?:\|[^|]*\|)?\s*([A-Za-z][A-Za-z0-9_]*)\s*$')
SUBGRAPH = re.compile(r'^\s+subgraph\s+([A-Za-z][A-Za-z0-9_]*)\["')
DIRECTION = re.compile(r'^\s+direction\s+(TB|TD|BT|RL|LR)\s*$')

def lint_chart(path):
    problems = []
    defined, used = set(), []
    depth = 0
    for n, line in enumerate(open(path, encoding="utf-8"), 1):
        line = line.rstrip("\n")
        if not line.strip() or line.strip().startswith(("%%", "classDef", "flowchart")):
            continue
        if SUBGRAPH.match(line):
            depth += 1
            defined.add(SUBGRAPH.match(line).group(1))
            if line.count('"') % 2:
                problems.append(f"{path}:{n} unbalanced quote in subgraph title")
            continue
        if DIRECTION.match(line):
            continue
        if line.strip() == "end":
            depth -= 1
            if depth < 0:
                problems.append(f"{path}:{n} 'end' without a matching subgraph")
            continue
        m = NODE_DEF.match(line)
        if m:
            node = m.group(1)
            defined.add(node)
            if node.lower() == "end":
                problems.append(f"{path}:{n} node id 'end' collides with Mermaid keyword")
            if line.count('"') % 2:
                problems.append(f"{path}:{n} unbalanced quote in label")
            continue
        e = EDGE.match(line)
        if e:
            used.append((n, e.group(1), e.group(2)))
            continue
        problems.append(f"{path}:{n} unparsed line: {line[:70]}")
    if depth != 0:
        problems.append(f"{path}: {depth} subgraph(s) left unclosed")
    for n, a, b in used:
        for node in (a, b):
            if node not in defined:
                problems.append(f"{path}:{n} edge references undefined node {node}")
    return problems, len(defined), len(used)

def main(outdir="out"):
    problems, charts, nodes, edges = [], 0, 0, 0
    for path in sorted(glob.glob(f"{outdir}/**/*.mmd", recursive=True)):
        p, nd, ed = lint_chart(path)
        problems += p; charts += 1; nodes += nd; edges += ed

    jsons, oversize = 0, []
    for path in sorted(glob.glob(f"{outdir}/**/*.json", recursive=True)):
        jsons += 1
        try:
            json.load(open(path, encoding="utf-8"))
        except Exception as exc:
            problems.append(f"{path}: invalid JSON: {exc}")
        size = os.path.getsize(path)
        if size > CEILING:
            oversize.append((path, size))
    for path in sorted(glob.glob(f"{outdir}/**/*.mmd", recursive=True)):
        size = os.path.getsize(path)
        if size > CEILING:
            oversize.append((path, size))

    for path in sorted(glob.glob(f"{outdir}/**/*.mmd", recursive=True)):
        text = open(path, encoding="utf-8").read()
        if len(text) > MAX_CHARS:
            problems.append(f"{path}: {len(text):,} chars exceeds Mermaid maxTextSize "
                            f"default of {MAX_CHARS:,}")
        n_edges = len(re.findall(r"(?:==>|-\.->|-->|~~~+)", text))
        if n_edges > MAX_EDGES:
            problems.append(f"{path}: {n_edges} edges exceeds Mermaid maxEdges "
                            f"default of {MAX_EDGES}")

    print(f"charts linted : {charts}  ({nodes} nodes, {edges} edges)")
    print(f"json parsed   : {jsons}")
    print(f"over 100 KiB  : {len(oversize)}")
    for path, size in oversize:
        print(f"  {size:,}  {path}")
    if problems:
        print(f"\nPROBLEMS: {len(problems)}")
        for p in problems[:40]:
            print("  " + p)
        return 1
    print("\nno structural problems found")
    return 0

if __name__ == "__main__":
    sys.exit(main(*sys.argv[1:]))
