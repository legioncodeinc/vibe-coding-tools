// Validate components.json before building: every group assigned exactly once,
// required fields present, names unique kebab-case, related[] pointing at real names.
// --fix removes dangling related[] entries and trims duplicate gids (keeps first).
// Designed by Legion Code Inc.
// Usage: RAW=<inventory _raw> node inventory/validate-merge.mjs [--fix]
import fs from "node:fs";
import path from "node:path";
import { capturePaths } from "../lib/common.mjs";

const RAW = capturePaths().raw;
const file = path.join(RAW, "ai", "components.json");
const fix = process.argv.includes("--fix");
if (!fs.existsSync(file)) { console.error(`${file} not found`); process.exit(2); }
const plan = JSON.parse(fs.readFileSync(file, "utf8"));
const groups = JSON.parse(fs.readFileSync(path.join(RAW, "groups.json"), "utf8"));
const REQUIRED = ["name", "kind", "layer", "purpose", "anatomy", "variants", "gids", "confidence"];
const errors = [], warnings = [];

if (!Array.isArray(plan.components)) { console.error("components.json has no components[]"); process.exit(1); }
const names = new Set();
for (const c of plan.components) {
  const miss = REQUIRED.filter((k) => !(k in c));
  if (miss.length) errors.push(`${c.name || "(unnamed)"}: missing ${miss.join(", ")}`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(c.name || "")) errors.push(`${c.name}: name is not kebab-case`);
  if (names.has(c.name)) errors.push(`${c.name}: duplicate component name`);
  names.add(c.name);
  for (const v of c.variants || []) if (!v.name) errors.push(`${c.name}: a variant has no name`);
}

const seen = new Map();
for (const c of plan.components) {
  const unique = [];
  for (const g of c.gids || []) {
    if (seen.has(g)) { (fix ? warnings : errors).push(`${g} assigned to both ${seen.get(g)} and ${c.name}`); if (fix) continue; }
    seen.set(g, c.name); unique.push(g);
  }
  if (fix) c.gids = unique;
}
for (const u of plan.unassigned || []) {
  if (seen.has(u.gid)) errors.push(`${u.gid} is both assigned (${seen.get(u.gid)}) and unassigned`);
  seen.set(u.gid, "(unassigned)");
}
const missing = groups.filter((g) => !seen.has(g.gid)).map((g) => g.gid);
if (missing.length) errors.push(`${missing.length} group(s) not assigned: ${missing.slice(0, 30).join(", ")}${missing.length > 30 ? " ..." : ""}`);
const unknown = [...seen.keys()].filter((g) => !groups.some((x) => x.gid === g));
if (unknown.length) warnings.push(`${unknown.length} gid(s) not in groups.json: ${unknown.slice(0, 10).join(", ")}`);

for (const c of plan.components) {
  const dangling = (c.related || []).filter((r) => !names.has(r));
  if (dangling.length) {
    (fix ? warnings : errors).push(`${c.name}: related names not found: ${dangling.join(", ")}`);
    if (fix) c.related = (c.related || []).filter((r) => names.has(r));
  }
}

if (fix) fs.writeFileSync(file, JSON.stringify(plan, null, 1));
console.log(JSON.stringify({ ok: !errors.length, components: plan.components.length, unassigned: (plan.unassigned || []).length, groups: groups.length, errors, warnings }, null, 2));
process.exit(errors.length ? 1 : 0);
