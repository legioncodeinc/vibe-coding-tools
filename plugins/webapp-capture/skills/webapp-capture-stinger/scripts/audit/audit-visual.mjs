// Visual inconsistency audit over captured inventory data (inventory/_raw state
// JSONs, groups.json, tokens-raw.json). No browser needed. Writes JSON + Markdown.
// Usage: RAW=<inventory _raw dir> OUT=<report path without extension> [DE=2] node audit/audit-visual.mjs
import fs from "node:fs";
import path from "node:path";
import { capturePaths } from "../lib/common.mjs";

const P = capturePaths();
const RAW = P.raw;
const OUT = process.env.OUT || path.join(P.audit, `${P.today}-visual-audit`);
// CIEDE2000 distance at or below which two colors are treated as one token rendered
// inconsistently. Below 1 is imperceptible, 1 to 2 is a just noticeable difference,
// 2 and above is clearly different (research/distilled-webapp-capture.md, visual section).
const DE_SAME = Number(process.env.DE || 2);
const read = (f) => JSON.parse(fs.readFileSync(path.join(RAW, f), "utf8"));
const tokens = read("tokens-raw.json");
const groups = fs.existsSync(path.join(RAW, "groups.json")) ? read("groups.json") : [];

// ---- color math: hex -> sRGB -> XYZ (D65) -> Lab, CIEDE2000 ----
const hexToRgba = (h) => {
  const m = h.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/i);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255, m[2] ? parseInt(m[2], 16) / 255 : 1];
};
const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
function toLab([r, g, b]) {
  const [R, G, B] = [lin(r), lin(g), lin(b)];
  const X = (0.4124564 * R + 0.3575761 * G + 0.1804375 * B) / 0.95047;
  const Y = 0.2126729 * R + 0.7151522 * G + 0.072175 * B;
  const Z = (0.0193339 * R + 0.119192 * G + 0.9503041 * B) / 1.08883;
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
  return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
}
function deltaE2000([L1, a1, b1], [L2, a2, b2]) {
  const rad = Math.PI / 180, deg = 180 / Math.PI;
  const C1 = Math.hypot(a1, b1), C2 = Math.hypot(a2, b2), Cb = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7)));
  const a1p = (1 + G) * a1, a2p = (1 + G) * a2;
  const C1p = Math.hypot(a1p, b1), C2p = Math.hypot(a2p, b2);
  const h = (a, b) => (a === 0 && b === 0 ? 0 : (Math.atan2(b, a) * deg + 360) % 360);
  const h1p = h(a1p, b1), h2p = h(a2p, b2);
  const dLp = L2 - L1, dCp = C2p - C1p;
  let dhp = C1p * C2p === 0 ? 0 : h2p - h1p;
  if (dhp > 180) dhp -= 360; else if (dhp < -180) dhp += 360;
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp / 2) * rad);
  const Lbp = (L1 + L2) / 2, Cbp = (C1p + C2p) / 2;
  let hbp = h1p + h2p;
  if (C1p * C2p !== 0) hbp = Math.abs(h1p - h2p) > 180 ? (h1p + h2p + (h1p + h2p < 360 ? 360 : -360)) / 2 : (h1p + h2p) / 2;
  const T = 1 - 0.17 * Math.cos((hbp - 30) * rad) + 0.24 * Math.cos(2 * hbp * rad) + 0.32 * Math.cos((3 * hbp + 6) * rad) - 0.2 * Math.cos((4 * hbp - 63) * rad);
  const dTheta = 30 * Math.exp(-(((hbp - 275) / 25) ** 2));
  const RC = 2 * Math.sqrt(Cbp ** 7 / (Cbp ** 7 + 25 ** 7));
  const SL = 1 + (0.015 * (Lbp - 50) ** 2) / Math.sqrt(20 + (Lbp - 50) ** 2), SC = 1 + 0.045 * Cbp, SH = 1 + 0.015 * Cbp * T;
  const RT = -Math.sin(2 * dTheta * rad) * RC;
  return Math.sqrt((dLp / SL) ** 2 + (dCp / SC) ** 2 + (dHp / SH) ** 2 + RT * (dCp / SC) * (dHp / SH));
}

// ---- near-duplicate colors (per role, same alpha band) ----
function nearDuplicates(list, role) {
  const items = list.map((e) => ({ ...e, rgba: hexToRgba(e.value) })).filter((e) => e.rgba);
  items.forEach((e) => (e.lab = toLab(e.rgba)));
  const used = new Set(), clusters = [];
  for (const a of items) {
    if (used.has(a.value)) continue;
    const members = items.filter((b) => !used.has(b.value) && Math.abs(a.rgba[3] - b.rgba[3]) < 0.05 && deltaE2000(a.lab, b.lab) <= DE_SAME);
    const uses = members.reduce((n, m) => n + m.count, 0);
    if (members.length > 1 && uses >= 5) {
      members.forEach((m) => used.add(m.value));
      clusters.push({ role, keep: members[0].value, variants: members.map((m) => ({ value: m.value, count: m.count, routes: m.routes, deltaE: +deltaE2000(a.lab, m.lab).toFixed(2) })) });
    }
  }
  return clusters;
}

const px = (v) => parseFloat(v);
const findings = [];
const add = (severity, area, title, detail, evidence) => findings.push({ severity, area, title, detail, evidence });

for (const role of ["color", "backgroundColor", "borderColor"]) {
  for (const c of nearDuplicates(tokens.observed[role] || [], role)) {
    add(c.variants.length > 2 ? "medium" : "low", "color", `${role}: ${c.variants.length} near-identical values around ${c.keep} (${c.variants.reduce((n, v) => n + v.count, 0)} uses)`, `CIEDE2000 <= ${DE_SAME} from ${c.keep}; candidates to collapse into one token.`, c.variants);
  }
}

const scale = (key, label, grid) => {
  const list = (tokens.observed[key] || []).filter((e) => /px$/.test(e.value));
  const total = list.reduce((n, e) => n + e.count, 0) || 1;
  const rare = list.filter((e) => e.count / total < 0.01);
  if (list.length > 8) add("medium", label, `${list.length} distinct ${label} values`, `A consistent scale usually needs 6 to 8. Rare values (<1% of uses) are the first candidates to remove.`, list.map((e) => ({ value: e.value, count: e.count, routes: e.routes })));
  if (grid) {
    const off = list.filter((e) => px(e.value) > 0 && px(e.value) % grid !== 0 && px(e.value) % grid !== grid / 2);
    if (off.length) add("low", label, `${off.length} ${label} values off the ${grid}px grid`, "Values that are not multiples of the grid (or half-steps) often come from one-off arbitrary values.", off);
  }
  if (rare.length) add("low", label, `${rare.length} rarely used ${label} values`, "Each appears in under 1% of elements.", rare);
};
scale("fontSize", "font size");
scale("borderRadius", "border radius", 2);
scale("spacing", "spacing", 4);
if ((tokens.observed.fontFamily || []).length > 3) add("medium", "typography", `${tokens.observed.fontFamily.length} font-family stacks`, "Expect one sans, one mono, and one icon font at most.", tokens.observed.fontFamily);
if ((tokens.observed.boxShadow || []).length > 5) add("low", "elevation", `${tokens.observed.boxShadow.length} distinct box-shadows`, "An elevation scale usually has 3 to 5 steps.", tokens.observed.boxShadow.slice(0, 20));

// ---- component drift: one fuzzy group whose exact variants differ in core styling ----
for (const g of groups) {
  if (g.variantCount < 3 || ["icon", "IMG", "DIV", "SPAN"].includes(g.category)) continue;
  const fields = { bg: new Set(), radius: new Set(), font: new Set(), pad: new Set() };
  for (const v of g.variants) {
    const s = v.examples[0]?.style;
    if (!s) continue;
    fields.bg.add(s.backgroundColor); fields.radius.add(s.borderRadius); fields.font.add(`${s.fontSize} ${s.fontWeight}`); fields.pad.add(`${s.paddingTop} ${s.paddingRight}`);
  }
  const drift = Object.entries(fields).filter(([, set]) => set.size > 1).map(([k, set]) => `${k}: ${[...set].join(" | ")}`);
  if (drift.length >= 2) add("medium", "component drift", `${g.gid} ${g.category} has ${g.variantCount} styling variants`, `Same component shape, different ${drift.map((d) => d.split(":")[0]).join(", ")}. Confirm intentional variants versus drift.`, { routes: g.routes.slice(0, 10), drift, sampleText: g.sampleText.slice(0, 5) });
}

const order = { high: 0, medium: 1, low: 2 };
findings.sort((a, b) => order[a.severity] - order[b.severity]);
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(`${OUT}.json`, JSON.stringify({ deltaEThreshold: DE_SAME, states: tokens.generatedFrom, findings }, null, 1));
const md = [
  "# Visual inconsistency audit", "",
  `Source: ${tokens.generatedFrom.states} captured page states across ${tokens.generatedFrom.routes} routes. Near-duplicate color threshold: CIEDE2000 <= ${DE_SAME}.`, "",
  "| Severity | Area | Finding |", "| --- | --- | --- |",
  ...findings.map((f) => `| ${f.severity} | ${f.area} | ${f.title} |`), "",
  ...findings.flatMap((f, i) => [`## ${i + 1}. ${f.title}`, "", `- Severity: ${f.severity}`, `- Area: ${f.area}`, "", f.detail, "", "```json", JSON.stringify(f.evidence, null, 1).slice(0, 3000), "```", ""]),
].join("\n");
fs.writeFileSync(`${OUT}.md`, md);
console.log(`${findings.length} findings -> ${OUT}.md`);
