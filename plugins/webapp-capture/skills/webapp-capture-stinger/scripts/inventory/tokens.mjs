// Aggregate observed style values and CSS custom properties into tokens-raw.json.
// Usage: RAW=<dir with state JSONs> DEST=<output file> node tokens.mjs
import fs from "node:fs";
import path from "node:path";
import { capturePaths } from "../lib/common.mjs";

const P = capturePaths();
const RAW = P.raw;
const DEST = process.env.DEST || P.tokensRaw;
const capturedTheme = P.cfg?.browser?.colorScheme || "unknown";

const states = fs
  .readdirSync(RAW)
  .filter((f) => f.endsWith(".json") && f !== "groups.json")
  .map((f) => JSON.parse(fs.readFileSync(path.join(RAW, f), "utf8")))
  .filter((s) => Array.isArray(s.candidates));

const hex = (n) => n.toString(16).padStart(2, "0");
const toHex = (r, g, b, a = 1) => {
  const c = (x) => hex(Math.max(0, Math.min(255, Math.round(x))));
  const base = `#${c(r)}${c(g)}${c(b)}`;
  return a >= 1 ? base : `${base}${c(a * 255)}`;
};
// linear-light sRGB (0..1) -> 8-bit gamma-encoded
const gamma = (x) => 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);

function oklabToRgb(L, A, B) {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    gamma(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    gamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    gamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}
function labToRgb(L, A, B) {
  // CIELAB (D50) -> XYZ D50 -> XYZ D65 (Bradford) -> linear sRGB
  const e = 216 / 24389, k = 24389 / 27;
  const fy = (L + 16) / 116, fx = fy + A / 500, fz = fy - B / 200;
  const inv = (f) => (f ** 3 > e ? f ** 3 : (116 * f - 16) / k);
  const X = 0.96422 * inv(fx), Y = L > k * e ? fy ** 3 : L / k, Z = 0.82521 * inv(fz);
  const x = 0.9555766 * X - 0.0230393 * Y + 0.0631636 * Z;
  const y = -0.0282895 * X + 1.0099416 * Y + 0.0210077 * Z;
  const z = 0.0122982 * X - 0.020483 * Y + 1.3299098 * Z;
  return [
    gamma(3.2404542 * x - 1.5371385 * y - 0.4985314 * z),
    gamma(-0.969266 * x + 1.8760108 * y + 0.041556 * z),
    gamma(0.0556434 * x - 0.2040259 * y + 1.0572252 * z),
  ];
}
function normColor(v) {
  let m = v.match(/^rgba?\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\s*\)$/);
  if (m) return toHex(+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]);
  m = v.match(/^(oklab|lab)\(\s*([-\d.e]+)%?\s+([-\d.e]+)\s+([-\d.e]+)(?:\s*\/\s*([\d.]+)(%?))?\s*\)$/);
  if (m) {
    const alpha = m[5] === undefined ? 1 : m[6] ? +m[5] / 100 : +m[5];
    const [r, g, b] = m[1] === "oklab" ? oklabToRgb(+m[2], +m[3], +m[4]) : labToRgb(+m[2], +m[3], +m[4]);
    return toHex(r, g, b, alpha);
  }
  return v;
}
const normRadius = (v) => v.split(" ").map((p) => (parseFloat(p) >= 9999 ? "full" : p)).join(" ");
const COLOR_KEYS = new Set(["color", "backgroundColor", "borderColor"]);

// Merge per-state counts, and track how many routes use each value.
const merged = {};
for (const st of states) {
  for (const [key, values] of Object.entries(st.stats || {})) {
    merged[key] ??= {};
    for (const [raw, count] of Object.entries(values)) {
      const v = COLOR_KEYS.has(key) ? normColor(raw) : key === "borderRadius" ? normRadius(raw) : raw;
      const e = (merged[key][v] ??= { value: v, count: 0, routes: new Set() });
      e.count += count;
      e.routes.add(st.route);
    }
  }
}
const observed = {};
for (const [key, values] of Object.entries(merged)) {
  observed[key] = Object.values(values)
    .map((e) => ({ value: e.value, count: e.count, routes: e.routes.size }))
    .sort((a, b) => b.count - a.count);
}

// CSS custom properties (captured once, on /home).
const varsState = states.find((s) => s.vars);
let cssVariables = null;
if (varsState) {
  const groups = {};
  for (const [name, value] of Object.entries(varsState.vars.resolved)) {
    const prefix = (name.match(/^--([a-z]+)/) || [, "other"])[1];
    const converted = normColor(value);
    (groups[prefix] ??= {})[name] = converted !== value ? { value: converted, css: value } : value;
  }
  cssVariables = {
    htmlClass: varsState.vars.htmlClass,
    resolvedByPrefix: groups,
    definedBySelector: varsState.vars.bySelector,
  };
}

const out = {
  generatedFrom: { states: states.length, routes: new Set(states.map((s) => s.route)).size, theme: capturedTheme },
  notes: [
    "observed.* counts are text or box occurrences across all captured page states; routes = distinct routes using the value.",
    "Colors are normalized to hex, with an alpha byte when opacity < 1.",
    `cssVariables.resolvedByPrefix are computed values on <html> in ${capturedTheme} theme; definedBySelector shows the raw declarations per selector (light and dark sets).`,
  ],
  observed,
  cssVariables,
};
fs.mkdirSync(path.dirname(DEST), { recursive: true });
fs.writeFileSync(DEST, JSON.stringify(out, null, 1));
console.log(
  `tokens-raw.json: ${states.length} states,`,
  Object.entries(observed).map(([k, v]) => `${k}=${v.length}`).join(" "),
  cssVariables ? `, css vars=${Object.values(cssVariables.resolvedByPrefix).reduce((n, g) => n + Object.keys(g).length, 0)}` : ", no css vars",
);
