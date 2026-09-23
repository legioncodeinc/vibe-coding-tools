// Prepare the shadcn/ui map stage: batches of ledger components for mapping agents,
// filled MAP and THEME instructions, and a dispatch plan. Run after build.mjs.
// Designed by Legion Code Inc.
// Usage: CAPTURE_CONFIG=... [BATCH=30] node inventory/shadcn-prepare.mjs [--pending]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { capturePaths } from "../lib/common.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const P = capturePaths();
const cfg = P.cfg;
const INV = path.resolve(P.inventory);
const OUT = path.join(INV, "shadcn");
const BATCH = Number(process.env.BATCH || 30);
const ledgerPath = path.join(INV, "ledger.json");
if (!fs.existsSync(ledgerPath)) throw new Error(`${ledgerPath} not found: build the component library first`);
const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf8"));
fs.mkdirSync(path.join(OUT, "batches"), { recursive: true });

// Rich per-component input: ledger entry plus the measured variant visuals from styles.json.
const input = ledger.components.map((c) => {
  const folder = path.join(INV, c.path);
  let styles = {};
  try { styles = JSON.parse(fs.readFileSync(path.join(folder, "styles.json"), "utf8")); } catch {}
  const variants = Object.entries(styles).map(([key, v]) => ({
    key, description: v.description, visual: v.visual, measured: v.computed?.[0]?.style || null,
  }));
  return { name: c.name, kind: c.kind, layer: c.layer, instances: c.instances, routes: c.routes.slice(0, 12), related: c.related, parts: c.parts, variants, folder };
});

const catalogText = fs.readFileSync(path.join(here, "../../references/shadcn-catalog.json"), "utf8");
const fill = (t, extra = {}) => t.replace(/^<!-- Template\..*?-->\s*/s, "").replace(/\{\{(\w+)\}\}/g, (m, k) => ({
  APP_NAME: cfg?.app?.name || "the app",
  APP_CONTEXT: cfg?.app?.context || "a web application",
  THEME: cfg?.browser?.colorScheme || "default",
  SHADCN_DIR: OUT,
  INVENTORY_DIR: INV,
  CATALOG: catalogText.trim(),
  ...extra,
}[k] ?? m));
fs.writeFileSync(path.join(OUT, "MAP-INSTRUCTIONS.md"), fill(fs.readFileSync(path.join(here, "../../references/prompts/shadcn-map.md"), "utf8")));
fs.writeFileSync(path.join(OUT, "THEME-INSTRUCTIONS.md"), fill(fs.readFileSync(path.join(here, "../../references/prompts/shadcn-theme.md"), "utf8")));

const n = Math.ceil(input.length / BATCH);
const ids = [];
for (let i = 0; i < n; i++) {
  const id = String(i + 1).padStart(2, "0");
  fs.writeFileSync(path.join(OUT, "batches", `batch-${id}.json`), JSON.stringify(input.slice(i * BATCH, (i + 1) * BATCH), null, 1));
  ids.push(id);
}
const done = (id) => {
  try {
    const want = JSON.parse(fs.readFileSync(path.join(OUT, "batches", `batch-${id}.json`), "utf8")).map((c) => c.name);
    const got = JSON.parse(fs.readFileSync(path.join(OUT, "batches", `map-${id}.json`), "utf8"));
    return want.every((name) => got.some((m) => m.name === name));
  } catch { return false; }
};
const pending = process.argv.includes("--pending") ? ids.filter((id) => !done(id)) : ids;

console.log(JSON.stringify({
  components: input.length,
  batches: ids.length,
  toDispatch: pending,
  model: cfg?.ai?.mergeModel || "sonnet",
  mapPrompt: `Read and follow ${path.join(OUT, "MAP-INSTRUCTIONS.md")} exactly.\\nBatch file: ${path.join(OUT, "batches", "batch-NN.json")}\\nOutput file: ${path.join(OUT, "batches", "map-NN.json")}`,
  themePrompt: `Read and follow ${path.join(OUT, "THEME-INSTRUCTIONS.md")} exactly.`,
  then: "CAPTURE_CONFIG=... node inventory/shadcn-build.mjs",
}, null, 2));
