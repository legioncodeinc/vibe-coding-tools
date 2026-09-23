// Convert tokens-raw.json (observed values + CSS variables) into a CANDIDATE token file
// in the DTCG Format Module 2025.10 shape: $type on groups, $value per token, color
// objects with colorSpace/components/alpha/hex, dimensions as {value, unit}.
// Observation data (counts, routes, source variable) goes under $extensions, which the
// spec requires tools to preserve. Names are provisional: a designer or the UX AI renames.
// Usage: SRC=<tokens-raw.json> DEST=<candidate.tokens.json> [MIN_USES=5] node inventory/tokens-dtcg.mjs
import fs from "node:fs";
import path from "node:path";
import { capturePaths } from "../lib/common.mjs";

const P = process.env.SRC && process.env.DEST ? null : capturePaths();
const SRC = process.env.SRC || P.tokensRaw;
const DEST = process.env.DEST || path.join(P.inventory, "candidate.tokens.json");
const MIN = Number(process.env.MIN_USES || 5);
const raw = JSON.parse(fs.readFileSync(SRC, "utf8"));
const EXT = "com.legioncodeinc.webapp-capture";

const hexRe = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i;
const colorValue = (hex) => {
  const m = hex.match(hexRe);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  const comps = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => +(c / 255).toFixed(4));
  const v = { colorSpace: "srgb", components: comps, hex: `#${m[1].toLowerCase()}` };
  if (m[2]) v.alpha = +(parseInt(m[2], 16) / 255).toFixed(3);
  return v;
};
const dimension = (s) => {
  const m = String(s).match(/^(-?[\d.]+)(px|rem)$/);
  return m ? { value: +m[1], unit: m[2] } : null;
};

// Reverse map: resolved value -> CSS variable names, so candidates can carry authored names.
const varsByValue = new Map();
for (const group of Object.values(raw.cssVariables?.resolvedByPrefix || {})) {
  for (const [name, v] of Object.entries(group)) {
    const val = typeof v === "object" ? v.value : v;
    if (!val) continue;
    const key = String(val).toLowerCase();
    varsByValue.set(key, [...(varsByValue.get(key) || []), name]);
  }
}
const obs = (e) => ({ [EXT]: { uses: e.count, routes: e.routes, cssVariables: varsByValue.get(String(e.value).toLowerCase()) || [] } });
const nameFor = (e, prefix, i) => {
  const v = (varsByValue.get(String(e.value).toLowerCase()) || [])[0];
  return v ? v.replace(/^--/, "").replace(/[{}.$]/g, "-") : `${prefix}-${String(i + 1).padStart(2, "0")}`;
};

const out = {
  $description: `Candidate tokens observed in a captured web app (${raw.generatedFrom?.routes} routes, ${raw.generatedFrom?.states} page states, ${raw.generatedFrom?.theme} theme). Values are measured, names are provisional. Values used fewer than ${MIN} times are omitted.`,
};

const colorGroup = (role, prefix, desc) => {
  const g = { $type: "color", $description: desc };
  (raw.observed[role] || []).filter((e) => e.count >= MIN).forEach((e, i) => {
    const value = colorValue(e.value);
    if (value) g[nameFor(e, prefix, i)] = { $value: value, $extensions: obs(e) };
  });
  return g;
};
out.color = {
  text: colorGroup("color", "text", "Text colors by observed frequency"),
  background: colorGroup("backgroundColor", "bg", "Background colors by observed frequency"),
  border: colorGroup("borderColor", "border", "Border colors by observed frequency"),
};

const dimGroup = (key, prefix, desc) => {
  const g = { $type: "dimension", $description: desc };
  (raw.observed[key] || []).filter((e) => e.count >= MIN).forEach((e, i) => {
    const d = dimension(e.value);
    if (d) g[`${prefix}-${d.value}`.replace(".", "_")] = { $value: d, $extensions: obs(e) };
  });
  return g;
};
out.fontSize = dimGroup("fontSize", "font-size", "Font sizes by observed frequency");
out.radius = dimGroup("borderRadius", "radius", "Border radii (fully rounded values are reported as 'full' in tokens-raw.json and omitted here)");
out.spacing = dimGroup("spacing", "space", "Padding, margin, and gap values by observed frequency");

out.fontWeight = { $type: "fontWeight", $description: "Font weights by observed frequency" };
(raw.observed.fontWeight || []).filter((e) => e.count >= MIN).forEach((e) => {
  out.fontWeight[`weight-${e.value}`] = { $value: Number(e.value), $extensions: obs(e) };
});
out.fontFamily = { $type: "fontFamily", $description: "Font family stacks by observed frequency" };
(raw.observed.fontFamily || []).filter((e) => e.count >= MIN).forEach((e, i) => {
  const stack = e.value.split(",").map((f) => f.trim().replace(/^"|"$/g, ""));
  out.fontFamily[`family-${String(i + 1).padStart(2, "0")}`] = { $value: stack, $extensions: obs(e) };
});

fs.writeFileSync(DEST, JSON.stringify(out, null, 2) + "\n");
const count = (g) => Object.keys(g).filter((k) => !k.startsWith("$")).length;
console.log(`candidate tokens: text ${count(out.color.text)}, bg ${count(out.color.background)}, border ${count(out.color.border)}, fontSize ${count(out.fontSize)}, radius ${count(out.radius)}, spacing ${count(out.spacing)}, weight ${count(out.fontWeight)}, family ${count(out.fontFamily)}`);
