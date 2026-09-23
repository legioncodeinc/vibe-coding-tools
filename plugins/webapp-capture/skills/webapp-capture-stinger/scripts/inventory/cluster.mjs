// Group raw candidates into exact signatures, then merge near-duplicates
// (fuzzy uniques). Writes <OUT>/_raw/groups.json.
import fs from "node:fs";
import path from "node:path";
import { capturePaths } from "../lib/common.mjs";

const RAW = process.env.OUT && !process.env.RAW ? path.join(process.env.OUT, "_raw") : capturePaths().raw;
const THRESHOLD = Number(process.env.THRESHOLD || 0.82);

const states = fs
  .readdirSync(RAW)
  .filter((f) => f.endsWith(".json") && f !== "groups.json")
  .map((f) => JSON.parse(fs.readFileSync(path.join(RAW, f), "utf8")))
  .filter((s) => Array.isArray(s.candidates));

const px = (v) => Math.round(parseFloat(v) || 0);
const q = (v, step = 4) => Math.round(px(v) / step) * step; // quantize spacing
// Class tokens that describe design rather than layout position or content.
const designClass = (c) =>
  !/^(data-|hover:|group|peer|w-|h-|min-|max-|top-|left-|right-|bottom-|z-|order-|col-|row-|grid-cols|flex-1|shrink|grow|basis|translate|absolute|relative|fixed|sticky|inset|mx-|my-|ml-|mr-|mt-|mb-|m-|self-|justify-self|place-self|truncate|line-clamp|overflow|sr-only|hidden|block|inline)/.test(c);

function sig(c) {
  const s = c.style;
  const border = parseFloat(s.borderTopWidth) > 0 && s.borderTopStyle !== "none" ? `${s.borderTopWidth} ${s.borderTopColor}` : "none";
  const isIcon = c.classes.some((k) => /material-(symbols|icons)/.test(k));
  const category = isIcon ? "icon" : c.role || (c.tag === "INPUT" ? `input:${c.type || "text"}` : c.tag);
  const exact = [
    category, c.shape, s.backgroundColor, s.backgroundImage.slice(0, 60), border, s.borderRadius,
    s.boxShadow === "none" ? "" : "shadow", s.fontSize, s.fontWeight, s.color,
    q(s.paddingTop), q(s.paddingRight), s.display,
  ].join("|");
  return { category, exact };
}

const styleVector = (c) => {
  const s = c.style;
  return [
    s.backgroundColor, s.borderRadius, `${s.borderTopWidth} ${s.borderTopColor}`, s.boxShadow === "none" ? "" : "shadow",
    s.fontSize, s.fontWeight, s.color, `${q(s.paddingTop)} ${q(s.paddingRight)}`, s.display, s.backgroundImage === "none" ? "" : "bgimg",
  ];
};

const jaccard = (a, b) => {
  if (!a.size && !b.size) return 0.5; // no evidence either way
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
};

// 1) exact groups
const exact = new Map();
for (const st of states) {
  for (const c of st.candidates) {
    const { category, exact: key } = sig(c);
    let g = exact.get(key);
    if (!g) {
      g = {
        category, key, instances: 0, states: new Set(), routes: new Set(), regions: new Set(),
        classes: new Set(c.classes.filter(designClass)),
        shapeTokens: new Set(c.shape.split(/[,()]/).filter(Boolean)),
        styleVec: styleVector(c), examples: [], crops: [], texts: new Set(), icons: new Set(), images: new Set(),
      };
      exact.set(key, g);
    }
    g.instances++;
    g.states.add(st.state);
    g.routes.add(st.route);
    g.regions.add(c.region);
    if (c.text) g.texts.add(c.text.slice(0, 60));
    if (c.context?.section) (g.sections ??= new Set()).add(c.context.section);
    if (c.context?.label) (g.labels ??= new Set()).add(c.context.label);
    c.icons.forEach((i) => g.icons.add(i));
    c.images.forEach((i) => i && g.images.add(i));
    if (g.examples.length < 3) g.examples.push({ state: st.state, id: c.id, context: c.context, html: c.html, style: c.style, rect: c.rect, text: c.text, ariaLabel: c.ariaLabel });
    if (c.crop && g.crops.length < 4) g.crops.push(c.crop);
  }
}

// 2) fuzzy merge within a category. Greedy, representative-based (no chaining):
//    each exact group joins the first cluster whose most common variant it resembles.
const groups = [...exact.values()].sort((a, b) => b.instances - a.instances);
function similarity(ga, gb) {
  const styleSim = ga.styleVec.filter((v, k) => v === gb.styleVec[k]).length / ga.styleVec.length;
  // Weight only the signals both groups actually have.
  let num = 0.45 * styleSim, den = 0.45;
  if (ga.classes.size || gb.classes.size) { num += 0.35 * jaccard(ga.classes, gb.classes); den += 0.35; }
  if (ga.shapeTokens.size || gb.shapeTokens.size) { num += 0.2 * jaccard(ga.shapeTokens, gb.shapeTokens); den += 0.2; }
  return num / den;
}
const clusters = new Map(); // category -> [variants[]]
for (const g of groups) {
  const list = clusters.get(g.category) ?? clusters.set(g.category, []).get(g.category);
  const home = list.find((variants) => similarity(variants[0], g) >= THRESHOLD);
  if (home) home.push(g); else list.push([g]);
}
const merged = new Map([...clusters.values()].flat().map((v, i) => [i, v]));

const out = [...merged.values()]
  .map((variants) => {
    variants.sort((a, b) => b.instances - a.instances);
    const u = (k) => [...new Set(variants.flatMap((v) => [...v[k]]))];
    return {
      category: variants[0].category,
      instances: variants.reduce((n, v) => n + v.instances, 0),
      variantCount: variants.length,
      routes: u("routes"),
      states: u("states"),
      regions: u("regions"),
      icons: u("icons").slice(0, 40),
      images: u("images").slice(0, 20),
      sampleText: u("texts").slice(0, 15),
      sections: [...new Set(variants.flatMap((v) => [...(v.sections || [])]))].slice(0, 12),
      labels: [...new Set(variants.flatMap((v) => [...(v.labels || [])]))].slice(0, 12),
      classes: [...variants[0].classes],
      variants: variants.slice(0, 12).map((v) => ({
        instances: v.instances, key: v.key, routes: [...v.routes], crops: v.crops, examples: v.examples,
      })),
    };
  })
  // Drop plain wrapper noise: generic div/span seen once with no crop.
  .filter((g) => !(["DIV", "SPAN"].includes(g.category) && g.instances < 2 && !g.variants.some((v) => v.crops.length)))
  .sort((a, b) => b.instances - a.instances)
  .map((g, i) => ({ gid: `g${String(i + 1).padStart(4, "0")}`, ...g }));

fs.writeFileSync(path.join(RAW, "groups.json"), JSON.stringify(out, null, 1));
const byCategory = {};
for (const g of out) byCategory[g.category] = (byCategory[g.category] || 0) + 1;
console.log(`exact signatures: ${groups.length}, fuzzy groups: ${out.length}`);
console.log("by category:", JSON.stringify(byCategory));
