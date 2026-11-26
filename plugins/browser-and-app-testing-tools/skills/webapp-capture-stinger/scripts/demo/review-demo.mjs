// Human privacy review for a recorded demo: tiles each scene clip into a contact sheet
// (ffmpeg) and lists the masked email, phone and redact.patterns hits found in page text
// per scene during recording. Nothing here changes the app. Designed by Legion Code Inc.
// Usage: CAPTURE_CONFIG=... DEMO_DIR=<output.demo>/<slug> [EVERY_SECONDS=2] node demo/review-demo.mjs
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { ensurePrivateOutputDir, loadConfig, log, writePrivateCapture } from "../lib/common.mjs";
import { redactCapture } from "../lib/redaction.mjs";

const cfg = loadConfig();
if (!process.env.DEMO_DIR) throw new Error("Set DEMO_DIR to the recorded demo folder");
const dir = path.resolve(process.env.DEMO_DIR);
const every = Number(process.env.EVERY_SECONDS || 2);
if (!(every > 0 && every <= 30)) throw new Error("EVERY_SECONDS must be between 0 and 30");
const timeline = JSON.parse(fs.readFileSync(path.join(dir, "timeline.json"), "utf8"));
const review = ensurePrivateOutputDir(path.join(dir, "review"));

// ffmpeg writes to a pipe; the private writer owns the file, so ffmpeg never opens an output path.
// The grid grows with the clip length, so no sampled frame is dropped from the sheet.
const sheet = (clip, durationMs) => new Promise((resolve, reject) => {
  const input = path.join(dir, clip);
  const st = fs.lstatSync(input);
  if (!st.isFile() || st.isSymbolicLink() || st.nlink !== 1) return reject(new Error(`refusing linked or unusual clip ${clip}`));
  const rows = Math.max(1, Math.ceil((Math.ceil((Number(durationMs) || 0) / 1000 / every) + 1) / 4));
  const child = spawn("ffmpeg", ["-v", "error", "-i", input, "-vf", `fps=1/${every},scale=480:-1,tile=4x${rows}:padding=6:margin=6`, "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "pipe:1"], { stdio: ["ignore", "pipe", "pipe"] });
  const chunks = []; let detail = "";
  child.stdout.on("data", (d) => chunks.push(d)); child.stderr.on("data", (d) => { detail += d; });
  child.once("error", reject);
  child.once("exit", (code) => code === 0 ? resolve(Buffer.concat(chunks)) : reject(new Error(`contact sheet failed for ${clip}: ${detail.slice(0, 300)}`)));
});

const lines = ["# Demo privacy review", "", `Contact sheets: one tile every ${every}s per scene. Check every tile for names, emails, phone numbers, hover cards and tooltips.`, ""];
const privacy = fs.existsSync(path.join(dir, "privacy-review.json")) ? JSON.parse(fs.readFileSync(path.join(dir, "privacy-review.json"), "utf8")) : { scenes: [] };
for (const scene of timeline.scenes) {
  lines.push(`## ${scene.id}: ${scene.title || ""} (${scene.status})`, "");
  if (scene.clip) {
    const name = `${scene.id}-sheet.png`;
    writePrivateCapture(path.join(review, name), await sheet(scene.clip, scene.durationMs));
    lines.push(`- Sheet: review/${name}`);
  }
  const hits = privacy.scenes.find((s) => s.id === scene.id)?.hits || [];
  lines.push(hits.length ? `- Text hits for human review: ${hits.map((h) => `${h.kind} ${h.masked} x${h.count}${h.action ? ` (after action ${h.action})` : ""}`).join("; ")}` : "- Text hits: none found by the scan (pixels can still show data the scan cannot read)", "");
}
writePrivateCapture(path.join(review, "REVIEW.md"), redactCapture(cfg, lines.join("\n")));
const total = privacy.scenes.reduce((n, s) => n + s.hits.length, 0);
log(`review written to ${path.join(review, "REVIEW.md")}; ${total} masked text hit(s) to check`);
