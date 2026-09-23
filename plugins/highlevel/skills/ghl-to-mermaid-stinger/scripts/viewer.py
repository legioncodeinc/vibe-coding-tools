#!/usr/bin/env python3
"""Build a single self-contained HTML viewer for every generated .mmd chart.

Charts are embedded in the page, so it works from file:// with no server and
no fetch. Mermaid itself loads from a CDN, so the page needs internet once.

Includes pan/zoom: wheel or pinch to zoom at the pointer, drag to pan, plus
fit / 1:1 / keyboard controls and an SVG download.

Usage: python3 src/viewer.py [outdir]
"""
import glob, json, os, sys

TEMPLATE = r"""<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>HighLevel account charts</title>
<style>
  :root { --bg:#fff; --fg:#0f172a; --mut:#64748b; --line:#e2e8f0;
          --sel:#1d4ed8; --panel:#f8fafc; }
  @media (prefers-color-scheme: dark) {
    :root { --bg:#0f172a; --fg:#e2e8f0; --mut:#94a3b8; --line:#1e293b;
            --sel:#60a5fa; --panel:#111c33; }
  }
  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body { margin:0; font:14px/1.5 ui-sans-serif,system-ui,sans-serif;
         background:var(--bg); color:var(--fg); display:flex; }
  aside { width:330px; flex:none; border-right:1px solid var(--line);
          overflow:auto; padding:12px; background:var(--panel); }
  main { flex:1; min-width:0; display:flex; flex-direction:column; }
  h1 { font-size:15px; margin:4px 0 12px; }
  .grp { font-size:11px; text-transform:uppercase; letter-spacing:.06em;
         color:var(--mut); margin:14px 0 6px; }
  #nav button { display:block; width:100%; text-align:left; border:0;
                background:none; color:inherit; font:inherit; padding:6px 8px;
                border-radius:6px; cursor:pointer; }
  #nav button:hover { background:var(--line); }
  #nav button[aria-current="true"] { background:var(--sel); color:#fff; }

  .bar { display:flex; gap:6px; align-items:center; flex-wrap:wrap;
         padding:8px 12px; border-bottom:1px solid var(--line); }
  .bar .meta { color:var(--mut); font-size:12px; margin-right:auto;
               overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .bar button { border:1px solid var(--line); background:var(--bg);
                color:inherit; font:inherit; padding:3px 9px; border-radius:6px;
                cursor:pointer; }
  .bar button:hover { background:var(--line); }
  #pct { font-variant-numeric:tabular-nums; min-width:52px; text-align:center;
         color:var(--mut); font-size:12px; }

  #view { flex:1; position:relative; overflow:hidden; cursor:grab;
          touch-action:none; background:var(--bg); }
  #view.drag { cursor:grabbing; }
  #stage { position:absolute; top:0; left:0; transform-origin:0 0;
           will-change:transform; }
  #stage svg { display:block; max-width:none !important; height:auto; }
  #hint { position:absolute; inset:0; display:grid; place-items:center;
          color:var(--mut); pointer-events:none; }
  .err { color:#dc2626; padding:16px; }
  details { border-top:1px solid var(--line); }
  details summary { cursor:pointer; color:var(--mut); padding:8px 12px; }
  pre { background:var(--panel); margin:0; padding:12px; overflow:auto;
        font-size:12px; max-height:30vh; }
  @media (max-width:820px) {
    body { flex-direction:column; }
    aside { width:100%; max-height:28vh; border-right:0;
            border-bottom:1px solid var(--line); }
    main { min-height:72vh; }
  }
</style>

<aside><h1>HighLevel account charts</h1><div id="nav"></div></aside>
<main>
  <div class="bar">
    <span class="meta" id="meta">Pick a chart on the left.</span>
    <button id="zout" title="Zoom out (-)">&minus;</button>
    <span id="pct">100%</span>
    <button id="zin" title="Zoom in (+)">+</button>
    <button id="fitw" title="Fit width (0)">Fit W</button>
    <button id="fit" title="Fit whole chart (9)">Fit all</button>
    <button id="one" title="Actual size (1)">1:1</button>
    <button id="dl" title="Download this chart as SVG">SVG</button>
  </div>
  <div id="view"><div id="stage"></div><div id="hint">Pick a chart on the left.</div></div>
  <details><summary>Mermaid source</summary><pre id="src"></pre></details>
</main>

<script type="application/json" id="charts">__PAYLOAD__</script>
<script type="module">
import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";

const dark = matchMedia("(prefers-color-scheme: dark)").matches;
mermaid.initialize({ startOnLoad:false, securityLevel:"loose",
                     maxTextSize:900000, maxEdges:5000,
                     theme: dark ? "dark" : "default" });

const charts = JSON.parse(document.getElementById("charts").textContent);
const view  = document.getElementById("view");
const stage = document.getElementById("stage");
const hint  = document.getElementById("hint");
const pct   = document.getElementById("pct");
let cur = null, curBtn = null;
let k = 1, tx = 0, ty = 0;          // scale, translate

const MIN = 0.02, MAX = 30;
const clamp = v => Math.min(MAX, Math.max(MIN, v));

function apply() {
  stage.style.transform = `translate(${tx}px, ${ty}px) scale(${k})`;
  pct.textContent = Math.round(k * 100) + "%";
}

function zoomAt(px, py, factor) {
  const next = clamp(k * factor);
  factor = next / k;                 // honour the clamp
  tx = px - (px - tx) * factor;
  ty = py - (py - ty) * factor;
  k = next;
  apply();
}

function svgSize() {
  const svg = stage.querySelector("svg");
  if (!svg) return null;
  const vb = svg.viewBox && svg.viewBox.baseVal;
  if (vb && vb.width) return { w: vb.width, h: vb.height };
  const b = svg.getBoundingClientRect();
  return { w: b.width / k, h: b.height / k };
}

function fit() {
  const s = svgSize(); if (!s) return;
  const r = view.getBoundingClientRect();
  k = clamp(Math.min(r.width / s.w, r.height / s.h) * 0.94);
  tx = (r.width  - s.w * k) / 2;
  ty = (r.height - s.h * k) / 2;
  apply();
}

// Many of these charts are very tall and narrow (one cluster per workflow),
// so fitting both axes lands at an unreadable 4%. Fit width, pin to the top,
// and let the user pan down.
function fitWidth() {
  const s = svgSize(); if (!s) return;
  const r = view.getBoundingClientRect();
  k = clamp(Math.min(r.width / s.w * 0.96, 1.5));
  tx = (r.width - s.w * k) / 2;
  ty = 12;
  apply();
}

function actual() {
  const s = svgSize(); if (!s) return;
  const r = view.getBoundingClientRect();
  k = 1;
  tx = (r.width - s.w) / 2;
  ty = (r.height - s.h) / 2;
  apply();
}

// ---- wheel / trackpad: ctrl+wheel and pinch arrive as ctrlKey wheel events
view.addEventListener("wheel", e => {
  e.preventDefault();
  const r = view.getBoundingClientRect();
  const px = e.clientX - r.left, py = e.clientY - r.top;
  if (e.ctrlKey || e.metaKey) {
    zoomAt(px, py, Math.exp(-e.deltaY * 0.01));
  } else if (e.shiftKey) {
    tx -= e.deltaY; apply();
  } else {
    zoomAt(px, py, Math.exp(-e.deltaY * 0.0022));
  }
}, { passive: false });

// ---- pointer drag to pan, two-pointer pinch to zoom
const pts = new Map();
let pinch = null;

view.addEventListener("pointerdown", e => {
  view.setPointerCapture(e.pointerId);
  pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pts.size === 1) view.classList.add("drag");
  if (pts.size === 2) {
    const [a, b] = [...pts.values()];
    pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) };
  }
});

view.addEventListener("pointermove", e => {
  const p = pts.get(e.pointerId); if (!p) return;
  const dx = e.clientX - p.x, dy = e.clientY - p.y;
  p.x = e.clientX; p.y = e.clientY;
  if (pts.size === 2 && pinch) {
    const [a, b] = [...pts.values()];
    const d = Math.hypot(a.x - b.x, a.y - b.y);
    const r = view.getBoundingClientRect();
    zoomAt((a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top, d / pinch.d);
    pinch.d = d;
  } else if (pts.size === 1) {
    tx += dx; ty += dy; apply();
  }
});

function release(e) {
  pts.delete(e.pointerId);
  if (pts.size < 2) pinch = null;
  if (pts.size === 0) view.classList.remove("drag");
}
view.addEventListener("pointerup", release);
view.addEventListener("pointercancel", release);
view.addEventListener("dblclick", e => {
  const r = view.getBoundingClientRect();
  zoomAt(e.clientX - r.left, e.clientY - r.top, e.shiftKey ? 1/1.6 : 1.6);
});

// ---- buttons and keys
const center = f => {
  const r = view.getBoundingClientRect();
  zoomAt(r.width / 2, r.height / 2, f);
};
document.getElementById("zin").onclick  = () => center(1.25);
document.getElementById("zout").onclick = () => center(1/1.25);
document.getElementById("fit").onclick  = fit;
document.getElementById("fitw").onclick = fitWidth;
document.getElementById("one").onclick  = actual;
document.getElementById("dl").onclick = () => {
  const svg = stage.querySelector("svg"); if (!svg || !cur) return;
  const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = cur.file.replace(/[\/]/g, "_").replace(/\.mmd$/, "") + ".svg";
  a.click(); URL.revokeObjectURL(a.href);
};
addEventListener("keydown", e => {
  if (e.target.matches("input, textarea")) return;
  if (e.key === "+" || e.key === "=") { center(1.25); e.preventDefault(); }
  else if (e.key === "-") { center(1/1.25); e.preventDefault(); }
  else if (e.key === "0") { fitWidth(); e.preventDefault(); }
  else if (e.key === "9") { fit(); e.preventDefault(); }
  else if (e.key === "1") { actual(); e.preventDefault(); }
});
addEventListener("resize", () => { if (cur) fitWidth(); });

// ---- nav
const nav = document.getElementById("nav");
for (const group of ["account", "workflows"]) {
  const items = charts.filter(c => c.group === group);
  if (!items.length) continue;
  const h = document.createElement("div");
  h.className = "grp"; h.textContent = `${group} (${items.length})`;
  nav.append(h);
  for (const c of items) {
    const b = document.createElement("button");
    b.textContent = c.title;
    b.onclick = () => show(c, b);
    nav.append(b);
  }
}

async function show(c, btn) {
  if (curBtn) curBtn.setAttribute("aria-current", "false");
  curBtn = btn; cur = c;
  btn.setAttribute("aria-current", "true");
  document.getElementById("meta").textContent =
    `${c.file} — ${c.bytes.toLocaleString()} bytes`;
  document.getElementById("src").textContent = c.code;
  hint.textContent = "Rendering…"; hint.style.display = "grid";
  stage.innerHTML = "";
  try {
    const { svg } = await mermaid.render("m" + Date.now(), c.code);
    stage.innerHTML = svg;
    const el = stage.querySelector("svg");
    if (el) { el.removeAttribute("width"); el.removeAttribute("height");
              el.style.maxWidth = "none";
              const s = svgSize();
              if (s) { el.setAttribute("width", s.w); el.setAttribute("height", s.h); } }
    hint.style.display = "none";
    fitWidth();
  } catch (err) {
    stage.innerHTML = `<p class="err">Mermaid failed: ${
      String(err && err.message || err).replace(/[<>]/g, "")}</p>`;
    hint.style.display = "none";
  }
}
</script>
"""


def main(outdir="out"):
    charts = []
    for path in sorted(glob.glob(f"{outdir}/**/*.mmd", recursive=True)):
        rel = os.path.relpath(path, outdir)
        group = "account" if rel.startswith("account") else "workflows"
        if group == "workflows":
            title = os.path.basename(os.path.dirname(path))
            if os.path.basename(path) != "workflow.mmd":
                title += " / " + os.path.basename(path)[:-4]
        else:
            title = os.path.basename(path)[:-4]
        charts.append({"file": rel, "group": group, "title": title,
                       "bytes": os.path.getsize(path),
                       "code": open(path, encoding="utf-8").read()})
    payload = json.dumps(charts, ensure_ascii=False).replace("</", "<\\/")
    target = f"{outdir}/viewer.html"
    with open(target, "w", encoding="utf-8") as fh:
        fh.write(TEMPLATE.replace("__PAYLOAD__", payload))
    print(f"{target}  {os.path.getsize(target):,} bytes  {len(charts)} charts")


if __name__ == "__main__":
    main(*sys.argv[1:])
