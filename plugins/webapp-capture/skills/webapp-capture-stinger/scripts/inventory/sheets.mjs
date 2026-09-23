// Build one composite image per group (up to 4 variant crops) and batch files for the describe agents.
// Usage: RAW=<dir> BATCH=10 node sheets.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { capturePaths } from "../lib/common.mjs";

const RAW = capturePaths().raw;
const BATCH = Number(process.env.BATCH || 10);
const AI = path.join(RAW, "ai");
const SHEETS = path.join(AI, "sheets");
fs.mkdirSync(SHEETS, { recursive: true });
const groups = JSON.parse(fs.readFileSync(path.join(RAW, "groups.json"), "utf8"));
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const KEEP = ["display", "color", "backgroundColor", "backgroundImage", "borderTopColor", "borderTopWidth", "borderRadius", "boxShadow", "fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "textTransform", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "gap", "width", "height", "cursor", "opacity"];
const W = 1400, LAB = 44, GAP = 20;

const slim = [];
for (const g of groups) {
  const withCrops = g.variants.filter((v) => v.crops.length).slice(0, 4);
  let sheet = null;
  if (withCrops.length) {
    const parts = [];
    let y = 0;
    for (const [i, v] of withCrops.entries()) {
      const img = await sharp(path.join(RAW, v.crops[0])).resize({ width: W - 2 * GAP, height: 700, fit: "inside", withoutEnlargement: true }).png().toBuffer();
      const m = await sharp(img).metadata();
      const label = esc(`variant ${i + 1}: ${v.instances}x on ${v.routes.length} route(s)`);
      parts.push({ input: Buffer.from(`<svg width="${W}" height="${LAB}"><text x="${GAP}" y="30" font-family="Menlo" font-size="22" fill="#f5a37b">${label}</text></svg>`), left: 0, top: y });
      parts.push({ input: img, left: GAP, top: y + LAB });
      y += LAB + m.height + GAP;
    }
    sheet = path.join(SHEETS, `${g.gid}.webp`);
    await sharp({ create: { width: W, height: y, channels: 3, background: "#3a3d44" } }).composite(parts).webp({ quality: 90 }).toFile(sheet);
  }
  slim.push({
    gid: g.gid, category: g.category, instances: g.instances, variantCount: g.variantCount,
    routes: g.routes, regions: g.regions, sections: g.sections, labels: g.labels,
    icons: g.icons.slice(0, 20), sampleText: g.sampleText.slice(0, 10), classes: g.classes, sheet,
    variants: g.variants.slice(0, 4).map((v) => {
      const e = v.examples[0];
      return { instances: v.instances, routes: v.routes, example: e && {
        text: e.text, ariaLabel: e.ariaLabel, context: e.context, rect: e.rect,
        style: Object.fromEntries(KEEP.map((k) => [k, e.style[k]])), html: e.html.slice(0, 1500),
      } };
    }),
  });
}
const n = Math.ceil(slim.length / BATCH);
for (let i = 0; i < n; i++) {
  fs.writeFileSync(path.join(AI, `batch-${String(i + 1).padStart(2, "0")}.json`), JSON.stringify(slim.slice(i * BATCH, (i + 1) * BATCH), null, 1));
}
console.log(`${slim.filter((s) => s.sheet).length} sheets, ${n} batches of up to ${BATCH}`);
