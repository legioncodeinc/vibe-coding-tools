// Merge ordered screenshot manifests into one final state ledger. Successful
// retries supersede earlier errors or truncations for the same state.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export function mergeScreenshotManifests({ inputs, output, ignore = null }) {
  if (!inputs.length) throw new Error("Set CAPTURE_MANIFESTS to an ordered comma-separated list");

  const states = new Map();
  for (const input of inputs) {
    const content = fs.readFileSync(input, "utf8").trim();
    const lines = content ? content.split(/\r?\n/).slice(1) : [];
    for (const line of lines) {
      if (!line) continue;
      const [route, state, shots, truncated, url] = line.split("\t");
      if (!route || !state || shots === undefined || truncated === undefined || url === undefined) {
        throw new Error(`invalid screenshot manifest row in ${input}: ${line}`);
      }
      if (ignore) {
        ignore.lastIndex = 0;
        if (ignore.test(state)) continue;
      }
      const success = Number(shots) > 0 && truncated === "false" && !String(url).startsWith("error:");
      const key = `${route}\u0000${state}`;
      const current = states.get(key);
      if (success || !current?.success) states.set(key, { line, route, state, success });
    }
  }

  const rows = [...states.values()].sort((a, b) => a.route.localeCompare(b.route) || a.state.localeCompare(b.state));
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `route\tstate\tshots\ttruncated\turl\n${rows.map((row) => row.line).join("\n")}${rows.length ? "\n" : ""}`);
  const failures = rows.filter((row) => !row.success);
  return { inputs: inputs.length, rows, failures };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const inputs = (process.env.CAPTURE_MANIFESTS || "").split(",").filter(Boolean).map((p) => path.resolve(p));
  const output = path.resolve(process.env.CAPTURE_FINAL_MANIFEST || "manifest-final.tsv");
  const ignore = process.env.CAPTURE_IGNORE_STATE_PATTERN ? new RegExp(process.env.CAPTURE_IGNORE_STATE_PATTERN) : null;
  const result = mergeScreenshotManifests({ inputs, output, ignore });
  console.log(`Merged ${result.inputs} manifest(s): ${result.rows.length} states, ${result.failures.length} unresolved.`);
  if (result.failures.length) {
    for (const row of result.failures) console.error(`UNRESOLVED ${row.route}\t${row.state}`);
    process.exitCode = 1;
  }
}
