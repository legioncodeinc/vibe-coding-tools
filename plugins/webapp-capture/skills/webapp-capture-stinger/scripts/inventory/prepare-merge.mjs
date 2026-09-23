// Validate every describe output, combine them, and prepare the merge stage:
// one merge input (small apps) or kind-based shards plus a reconcile prompt (large apps).
// Exits 1 and lists batches to rerun if any group is missing or malformed.
// Designed by Legion Code Inc.
// Usage: CAPTURE_CONFIG=... [RAW=<inventory _raw>] [SHARD_ABOVE=200] node inventory/prepare-merge.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "../lib/common.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const cfg = loadConfig();
const RAW = path.resolve(process.env.RAW || path.join(cfg.output.inventory, "_raw"));
const AI = path.join(RAW, "ai");
const SHARD_ABOVE = Number(process.env.SHARD_ABOVE || 200);
const FIELDS = ["gid", "name", "kind", "purpose", "anatomy", "variants", "states", "visual", "tokens_observed", "usage", "same_as", "is_noise", "confidence"];

const groups = JSON.parse(fs.readFileSync(path.join(RAW, "groups.json"), "utf8"));
const batchOf = {};
for (const f of fs.readdirSync(AI).filter((f) => /^batch-\d+\.json$/.test(f))) {
  for (const g of JSON.parse(fs.readFileSync(path.join(AI, f), "utf8"))) batchOf[g.gid] = f.match(/\d+/)[0];
}

const problems = [];
const byGid = new Map();
for (const f of fs.readdirSync(AI).filter((f) => /^desc-\d+\.json$/.test(f)).sort()) {
  let arr;
  try { arr = JSON.parse(fs.readFileSync(path.join(AI, f), "utf8")); } catch (e) { problems.push({ batch: f.match(/\d+/)[0], issue: `invalid JSON: ${e.message}` }); continue; }
  if (!Array.isArray(arr)) { problems.push({ batch: f.match(/\d+/)[0], issue: "not a JSON array" }); continue; }
  for (const d of arr) {
    const missingFields = FIELDS.filter((k) => !(k in d));
    if (missingFields.length) problems.push({ batch: batchOf[d.gid], gid: d.gid, issue: `missing fields ${missingFields.join(", ")}` });
    if (byGid.has(d.gid)) problems.push({ batch: batchOf[d.gid], gid: d.gid, issue: "described twice" });
    byGid.set(d.gid, d);
  }
}
for (const g of groups) if (!byGid.has(g.gid)) problems.push({ batch: batchOf[g.gid], gid: g.gid, issue: "not described" });

if (problems.length) {
  const rerun = [...new Set(problems.map((p) => p.batch).filter(Boolean))].sort();
  console.log(JSON.stringify({ ok: false, problems: problems.slice(0, 50), problemCount: problems.length, rerunBatches: rerun }, null, 2));
  process.exit(1);
}

const descriptions = groups.map((g) => byGid.get(g.gid));
fs.writeFileSync(path.join(AI, "descriptions.json"), JSON.stringify(descriptions, null, 1));
const input = groups.map((g) => {
  const d = byGid.get(g.gid);
  const sheet = path.join(AI, "sheets", `${g.gid}.webp`);
  return { ...d, instances: g.instances, variantCount: g.variantCount, routes: g.routes, regions: g.regions, category: g.category, icons: (g.icons || []).slice(0, 20), sheet: fs.existsSync(sheet) ? sheet : null };
});
fs.writeFileSync(path.join(AI, "merge-input.json"), JSON.stringify(input));

const fill = (t, extra = "") => t
  .replaceAll("{{APP_NAME}}", cfg.app.name || cfg.app.origin)
  .replaceAll("{{APP_CONTEXT}}", cfg.app.context || "a web application")
  .replaceAll("{{RAW_DIR}}", RAW)
  .replace(/^<!-- Template\..*?-->\s*/s, "")
  .replace("## Input", `${extra}## Input`);
const mergeTemplate = fs.readFileSync(path.join(here, "../../references/prompts/merge-components.md"), "utf8");

// Kind families keep related components in the same shard.
const FAMILIES = {
  "buttons-links": ["button", "icon-button", "link", "kbd"],
  "badges-text": ["badge", "pill", "tag", "label", "text", "code"],
  "cards-containers": ["card", "container", "other"],
  "panels-banners-layout": ["panel", "banner", "layout", "nav-item", "dialog", "menu", "tooltip"],
  "forms": ["input", "select", "switch", "checkbox", "radio", "radiogroup"],
  "tables-lists": ["table", "table-header", "table-cell", "table-row", "list-item"],
  "tabs-headings": ["tab", "tablist", "heading"],
  "icons-images": ["icon", "logo", "image"],
};

let plan;
if (input.length <= SHARD_ABOVE) {
  fs.writeFileSync(path.join(AI, "MERGE-INSTRUCTIONS.md"), fill(mergeTemplate));
  plan = { mode: "single", agents: 1, prompt: `Read and follow ${path.join(AI, "MERGE-INSTRUCTIONS.md")} exactly.` };
} else {
  const shardNote = "## Sharding\n\nThis merge is sharded by component kind. Your shard holds only some kinds; other agents handle the rest in parallel, and a reconciliation agent unifies names across shards afterward. Merge within your shard only. If an entry clearly belongs with a component of another kind, still assign it in your shard and say so in that component's `notes`. Use names that make sense app-wide. Your input and output files are named in your task, and they replace the single merge-input.json and components.json paths below.\n\n";
  fs.writeFileSync(path.join(AI, "MERGE-INSTRUCTIONS.md"), fill(mergeTemplate, shardNote));
  const known = new Set(Object.values(FAMILIES).flat());
  const shards = [];
  for (const [name, kinds] of Object.entries(FAMILIES)) {
    const part = input.filter((x) => kinds.includes(x.kind) || (name === "cards-containers" && !known.has(x.kind)));
    if (!part.length) continue;
    // Split oversized families so no merge agent holds more than SHARD_ABOVE groups.
    const pieces = Math.ceil(part.length / SHARD_ABOVE);
    for (let i = 0; i < pieces; i++) {
      const id = pieces > 1 ? `${name}-${i + 1}` : name;
      fs.writeFileSync(path.join(AI, `merge-input-${id}.json`), JSON.stringify(part.slice(i * SHARD_ABOVE, (i + 1) * SHARD_ABOVE)));
      shards.push({ id, groups: Math.min(SHARD_ABOVE, part.length - i * SHARD_ABOVE) });
    }
  }
  const reconcile = fs.readFileSync(path.join(here, "../../references/prompts/reconcile-components.md"), "utf8")
    .replaceAll("{{APP_NAME}}", cfg.app.name || cfg.app.origin)
    .replaceAll("{{APP_CONTEXT}}", cfg.app.context || "a web application")
    .replaceAll("{{RAW_DIR}}", RAW)
    .replaceAll("{{SHARD_FILES}}", shards.map((s) => path.join(AI, `components-${s.id}.json`)).join(", "))
    .replaceAll("{{TOTAL_GROUPS}}", String(input.length))
    .replace(/^<!-- Template\..*?-->\s*/s, "");
  fs.writeFileSync(path.join(AI, "RECONCILE-INSTRUCTIONS.md"), reconcile);
  plan = {
    mode: "sharded",
    shards,
    shardPrompt: `Read and follow ${path.join(AI, "MERGE-INSTRUCTIONS.md")} exactly.\\nShard: <id>\\nShard input file: ${path.join(AI, "merge-input-<id>.json")}\\nShard output file: ${path.join(AI, "components-<id>.json")}\\nVerify every gid in the shard input appears exactly once in your output before finishing.`,
    reconcilePrompt: `Read and follow ${path.join(AI, "RECONCILE-INSTRUCTIONS.md")} exactly.`,
  };
}
console.log(JSON.stringify({ ok: true, groups: input.length, model: cfg.ai?.mergeModel || "sonnet", ...plan }, null, 2));
