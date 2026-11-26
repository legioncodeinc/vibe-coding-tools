// Rebuild captions, scene-title SRT, narration timings and Eleven v4 clip texts after
// editing segments.tsv (trim, reorder, splice). No browser needed.
// Designed by Legion Code Inc.
// Usage: CAPTURE_CONFIG=... DEMO_DIR=<output.demo>/<slug> node demo/build-cues.mjs
import path from "node:path";
import { loadConfig, log } from "../lib/common.mjs";
import { writeDemoCues } from "../lib/demo-cues.mjs";

const cfg = loadConfig();
if (!process.env.DEMO_DIR) throw new Error("Set DEMO_DIR to the recorded demo folder");
const dir = path.resolve(process.env.DEMO_DIR);
const { cues, totalMs, overruns } = writeDemoCues(cfg, dir);
log(`${cues.length} narration cue(s) over ${(totalMs / 1000).toFixed(1)}s; see narration/fit.md`);
for (const c of overruns) log(`OVERRUN cue ${c.index} (${c.scene}): needs ${(c.neededMs / 1000).toFixed(1)}s, has ${(c.availableMs / 1000).toFixed(1)}s`);
