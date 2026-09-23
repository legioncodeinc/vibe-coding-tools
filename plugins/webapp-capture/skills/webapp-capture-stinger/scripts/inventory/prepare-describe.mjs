// Fill the describe prompt template for this app and list the batches to dispatch.
// Run after sheets.mjs. Designed by Legion Code Inc.
// Usage: CAPTURE_CONFIG=... [RAW=<inventory _raw>] node inventory/prepare-describe.mjs [--pending]
//   --pending  list only batches that do not have a valid desc-NN.json yet (for reruns)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "../lib/common.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const cfg = loadConfig();
const RAW = path.resolve(process.env.RAW || path.join(cfg.output.inventory, "_raw"));
const AI = path.join(RAW, "ai");
if (!fs.existsSync(AI)) throw new Error(`${AI} not found: run inventory/sheets.mjs first`);

const fill = (t) => t
  .replaceAll("{{APP_NAME}}", cfg.app.name || cfg.app.origin)
  .replaceAll("{{APP_CONTEXT}}", cfg.app.context || "a web application")
  .replaceAll("{{RAW_DIR}}", RAW)
  .replace(/^<!-- Template\..*?-->\s*/s, "");
const template = fs.readFileSync(path.join(here, "../../references/prompts/describe-groups.md"), "utf8");
fs.writeFileSync(path.join(AI, "INSTRUCTIONS.md"), fill(template));

const batches = fs.readdirSync(AI).filter((f) => /^batch-\d+\.json$/.test(f)).sort().map((f) => f.match(/\d+/)[0]);
const valid = (n) => {
  const f = path.join(AI, `desc-${n}.json`);
  if (!fs.existsSync(f)) return false;
  try {
    const got = JSON.parse(fs.readFileSync(f, "utf8"));
    const want = JSON.parse(fs.readFileSync(path.join(AI, `batch-${n}.json`), "utf8")).map((g) => g.gid);
    return Array.isArray(got) && want.every((gid) => got.some((d) => d.gid === gid));
  } catch { return false; }
};
const list = process.argv.includes("--pending") ? batches.filter((n) => !valid(n)) : batches;

console.log(JSON.stringify({
  instructions: path.join(AI, "INSTRUCTIONS.md"),
  model: cfg.ai?.describeModel || "sonnet",
  maxConcurrentAgents: cfg.ai?.maxConcurrentAgents || 18,
  totalBatches: batches.length,
  toDispatch: list.length,
  batches: list,
  promptFor: `Read and follow ${path.join(AI, "INSTRUCTIONS.md")} exactly.\\nBatch file: ${path.join(AI, "batch-NN.json")}\\nOutput file: ${path.join(AI, "desc-NN.json")}`,
}, null, 2));
