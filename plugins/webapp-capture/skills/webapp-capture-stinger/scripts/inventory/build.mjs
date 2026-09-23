// Build the component inventory deliverable from the merge plan.
// Usage: RAW=<dir with groups.json, crops/, ai/components.json, tokens-raw.json> DEST=<output dir> node build.mjs
import fs from "node:fs";
import path from "node:path";
import { capturePaths } from "../lib/common.mjs";

const P = capturePaths();
const RAW = P.raw;
const DEST = process.env.DEST || P.inventory;
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const groups = Object.fromEntries(read(path.join(RAW, "groups.json")).map((g) => [g.gid, g]));
const plan = read(path.join(RAW, "ai", "components.json"));
const descs = Object.fromEntries(read(path.join(RAW, "ai", "descriptions.json")).map((d) => [d.gid, d]));

const COMP = path.join(DEST, "components");
fs.rmSync(COMP, { recursive: true, force: true });
fs.mkdirSync(COMP, { recursive: true });

const STYLE_KEYS = ["display", "color", "backgroundColor", "backgroundImage", "borderTopColor", "borderTopWidth", "borderTopStyle", "borderRadius", "boxShadow", "fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "textTransform", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "gap", "width", "height", "cursor", "opacity"];
const pick = (s) => Object.fromEntries(STYLE_KEYS.filter((k) => s?.[k] !== undefined).map((k) => [k, s[k]]));
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "default";
const list = (a) => (a && a.length ? a.map((x) => `- ${x}`).join("\n") : "- none recorded");
const visualTable = (v) =>
  v && Object.keys(v).length
    ? "| Property | Value |\n| --- | --- |\n" + Object.entries(v).filter(([, x]) => x).map(([k, x]) => `| ${k} | ${String(x).replace(/\|/g, "\\|")} |`).join("\n")
    : "";

const h2 = (n) => Math.round(n).toString(16).padStart(2, "0");
const hexify = (v) =>
  String(v).replace(/rgba?\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\s*\)/g, (_, r, g, b, a) =>
    `#${h2(+r)}${h2(+g)}${h2(+b)}${a !== undefined && +a < 1 ? h2(+a * 255) : ""}`);
const cleanShadow = (v) => {
  if (!v || v === "none") return "none";
  const layers = hexify(v).split(/,(?![^(]*\))/).map((x) => x.trim()).filter((x) => !/^#[0-9a-f]{6}00\b/.test(x) && !/^#00000000/.test(x));
  return layers.length ? layers.join(", ") : "none";
};
const computedTable = (entry) => {
  const e = entry?.computed?.[0];
  if (!e) return "";
  const st = e.style;
  const border = parseFloat(st.borderTopWidth) > 0 && st.borderTopStyle !== "none" ? `${st.borderTopWidth} ${st.borderTopStyle} ${st.borderTopColor}` : "none";
  const rows = [
    ["background", st.backgroundImage && st.backgroundImage !== "none" ? `${st.backgroundColor}; image ${st.backgroundImage.slice(0, 120)}` : st.backgroundColor],
    ["text color", st.color], ["border", border], ["radius", st.borderRadius], ["shadow", st.boxShadow],
    ["font", `${st.fontSize}/${st.lineHeight} ${st.fontWeight} ${String(st.fontFamily).split(",")[0]}`],
    ["padding", `${st.paddingTop} ${st.paddingRight} ${st.paddingBottom} ${st.paddingLeft}`], ["gap", st.gap],
    ["size", `${e.rect.w} x ${e.rect.h} px`], ["page state", e.page],
  ];
  return "| Property | Value |\n| --- | --- |\n" + rows.map(([k, v]) => `| ${k} | ${(k === "shadow" ? cleanShadow(v) : hexify(v)).replace(/\|/g, "\\|")} |`).join("\n");
};

const ledger = [];
const iconGlyphs = new Map();
const images = new Map();

for (const c of plan.components) {
  const dir = path.join(COMP, c.name);
  const shots = path.join(dir, "screenshots");
  fs.mkdirSync(shots, { recursive: true });

  const allGids = [...new Set(c.gids)];
  const members = allGids.map((g) => groups[g]).filter(Boolean);
  const instances = members.reduce((n, g) => n + g.instances, 0);
  const routes = [...new Set(members.flatMap((g) => g.routes))].sort();
  const regions = [...new Set(members.flatMap((g) => g.regions))];

  const styles = {};
  const htmlBlocks = [];
  const shotList = [];
  const buckets = [
    ...(c.variants || []).map((v) => ({ kind: "variant", ...v })),
    ...(c.parts || []).map((p) => ({ kind: "part", ...p })),
  ];
  for (const b of buckets) {
    const key = `${b.kind === "part" ? "part-" : ""}${slug(b.name)}`;
    const bg = (b.gids || []).map((g) => groups[g]).filter(Boolean);
    const examples = bg.flatMap((g) => g.variants.flatMap((v) => v.examples.map((e) => ({ ...e, gid: g.gid }))));
    styles[key] = {
      description: b.description || "",
      gids: b.gids || [],
      visual: b.visual || null,
      computed: examples.slice(0, 3).map((e) => ({ gid: e.gid, page: e.state, rect: e.rect, style: pick(e.style) })),
    };
    if (examples[0]) {
      htmlBlocks.push(`<!-- ${b.kind}: ${b.name} (gid ${examples[0].gid}, page state ${examples[0].state}) -->\n${examples[0].html}`);
    }
    let n = 0;
    for (const g of bg) {
      for (const v of g.variants) {
        for (const crop of v.crops) {
          if (n >= 3) break;
          const src = path.join(RAW, crop);
          if (!fs.existsSync(src)) continue;
          const file = `${key}-${String(++n).padStart(2, "0")}.png`;
          fs.copyFileSync(src, path.join(shots, file));
          shotList.push(`screenshots/${file}`);
        }
      }
    }
  }

  const glyphs = [...new Set([...(c.glyphs || []), ...members.flatMap((g) => g.icons || [])])].filter(Boolean);
  const imgs = [...new Set(members.flatMap((g) => g.images || []))].filter(Boolean);
  glyphs.forEach((gl) => iconGlyphs.set(gl, (iconGlyphs.get(gl) || new Set()).add(c.name)));
  imgs.forEach((src) => images.set(src, (images.get(src) || new Set()).add(c.name)));

  fs.writeFileSync(path.join(dir, "code.html"), htmlBlocks.join("\n\n") + "\n");
  fs.writeFileSync(path.join(dir, "styles.json"), JSON.stringify(styles, null, 1));
  fs.writeFileSync(path.join(dir, "assets.json"), JSON.stringify({ iconFont: glyphs.length ? "Material Symbols Outlined" : null, glyphs, images: imgs }, null, 1));

  const md = [
    `# ${c.name}`,
    "",
    `- **Kind:** ${c.kind}`,
    `- **Layer:** ${c.layer}`,
    `- **Instances observed:** ${instances} across ${routes.length} route(s)`,
    `- **Regions:** ${regions.join(", ")}`,
    `- **Confidence:** ${c.confidence}`,
    "",
    "## Purpose",
    "",
    c.purpose,
    "",
    "## Anatomy",
    "",
    c.anatomy,
    "",
    ...(c.parts?.length ? ["## Parts", "", ...c.parts.map((p) => `- **${p.name}:** ${p.description}`), ""] : []),
    "## Variants",
    "",
    ...(c.variants || []).flatMap((v) => [
      `### ${v.name}`, "", v.description, "",
      "Described:", "", visualTable(v.visual), "",
      ...(computedTable(styles[slug(v.name)]) ? ["Measured in the browser (first example):", "", computedTable(styles[slug(v.name)]), ""] : []),
    ]),
    "## States",
    "",
    list(c.states),
    "",
    "## Tokens observed",
    "",
    list(c.tokens_observed),
    "",
    "## Usage",
    "",
    c.usage,
    "",
    "Routes:",
    "",
    list(routes.map((r) => `\`${r}\``)),
    "",
    ...(glyphs.length ? ["## Icon glyphs", "", glyphs.map((g) => `\`${g}\``).join(", "), ""] : []),
    ...(c.related?.length ? ["## Related components", "", list(c.related.map((r) => `[${r}](../${r}/component.md)`)), ""] : []),
    ...(c.notes ? ["## Notes", "", c.notes, ""] : []),
    "## Files",
    "",
    "- `code.html`: representative markup for each variant and part (sensitive values redacted)",
    "- `styles.json`: computed styles per variant and part",
    "- `assets.json`: icon glyphs and images used",
    `- \`screenshots/\`: ${shotList.length} crops at 3x`,
    "",
    "## Source groups",
    "",
    allGids.map((g) => `\`${g}\` (${descs[g]?.name || "?"})`).join(", "),
    "",
  ].join("\n");
  fs.writeFileSync(path.join(dir, "component.md"), md);

  ledger.push({
    name: c.name, kind: c.kind, layer: c.layer, confidence: c.confidence,
    variants: (c.variants || []).map((v) => v.name), parts: (c.parts || []).map((p) => p.name),
    instances, routes, regions, related: c.related || [], sourceGroups: allGids,
    path: `components/${c.name}/`,
  });
}

ledger.sort((a, b) => a.layer.localeCompare(b.layer) || b.instances - a.instances);
fs.writeFileSync(path.join(DEST, "ledger.json"), JSON.stringify({
  generated: new Date().toISOString().slice(0, 10),
  source: process.env.SOURCE || P.source,
  components: ledger,
  unassigned: plan.unassigned || [],
  inconsistencies: plan.inconsistencies || [],
}, null, 1));

fs.mkdirSync(path.join(DEST, "assets"), { recursive: true });
fs.writeFileSync(path.join(DEST, "assets", "icons.json"), JSON.stringify({
  font: "Material Symbols Outlined",
  glyphs: [...iconGlyphs.entries()].map(([g, s]) => ({ glyph: g, usedBy: [...s] })).sort((a, b) => a.glyph.localeCompare(b.glyph)),
}, null, 1));
fs.writeFileSync(path.join(DEST, "assets", "images.json"), JSON.stringify(
  [...images.entries()].map(([src, s]) => ({ src, usedBy: [...s] })), null, 1));
if (fs.existsSync(path.join(RAW, "tokens-raw.json"))) {
  fs.copyFileSync(path.join(RAW, "tokens-raw.json"), path.join(DEST, "tokens-raw.json"));
}
console.log(`built ${ledger.length} components, ${iconGlyphs.size} glyphs, ${images.size} images`);
