// Record a scripted product demo: one video per scene, 3x key screenshots,
// WebVTT captions timed to the recording, a narration script, and an ffmpeg
// assembly script. The demo plan is human-approved JSON (see demo-plan.example.json).
// Designed by Legion Code Inc.
// Usage: CAPTURE_CONFIG=... PLAN=demo-plan.json node demo/record-demo.mjs
import fs from "node:fs";
import path from "node:path";
import { gotoChecked, loadConfig, log, openApp, pad, settle, shotOptions, slugify } from "../lib/common.mjs";

const cfg = loadConfig();
if (!process.env.PLAN) throw new Error("Set PLAN=/path/to/demo-plan.json (see demo/demo-plan.example.json)");
const plan = JSON.parse(fs.readFileSync(process.env.PLAN, "utf8"));
if (!Array.isArray(plan.scenes) || !plan.scenes.length) throw new Error("plan.scenes must be a non-empty array");
if (plan.approved !== true) throw new Error('plan.approved is not true. Show the plan to the user, and set "approved": true only after they approve it.');
const ACTIONS = new Set(["wait", "hover", "click", "type", "scroll"]);
for (const [i, sc] of plan.scenes.entries()) {
  if (!sc.route || !sc.route.startsWith("/")) throw new Error(`scene ${i + 1}: route must start with /`);
  for (const a of sc.actions || []) {
    if (!ACTIONS.has(a.type)) throw new Error(`scene ${i + 1}: unknown action type "${a.type}"`);
    if (["hover", "click", "type"].includes(a.type) && !a.selector) throw new Error(`scene ${i + 1}: ${a.type} needs a selector`);
  }
}
const OUT = path.join(cfg.output.demo, slugify(plan.title || "demo"));
const VIDEO = { width: plan.video?.width || 1920, height: plan.video?.height || 1080 };
const WPM = plan.narration?.wordsPerMinute || 140; // 130 to 150 wpm band (research: demo section)
fs.mkdirSync(path.join(OUT, "scenes"), { recursive: true });
fs.mkdirSync(path.join(OUT, "screenshots"), { recursive: true });

// Guard rails: a demo plan may interact, but never with destructive-looking targets.
const DENY = new RegExp(plan.safety?.denyPattern || "(delete|remove|destroy|drop|reset|revoke|shutdown|restart|log ?out|sign ?out|pay|purchase|transfer)", "i");
const secretLike = /(password|secret|token|api[_-]?key)/i;

const words = (s) => (s || "").trim().split(/\s+/).filter(Boolean).length;
const narrationMs = (s) => Math.ceil((words(s) / WPM) * 60000);
const ts = (ms) => {
  const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60, x = ms % 1000;
  return `${pad(h, 2)}:${pad(m, 2)}:${pad(s, 2)}.${pad(x, 3)}`;
};

const cues = [];
const scriptLines = [`# ${plan.title}`, "", plan.summary || "", "", `Estimated narration pace: ${WPM} words per minute.`, ""];
const concat = [];
let offset = 0;

for (const [i, scene] of plan.scenes.entries()) {
  const id = `${pad(i + 1, 2)}-${slugify(scene.id || scene.title)}`;
  const { browser, context, page } = await openApp(
    { ...cfg, browser: { ...cfg.browser, viewport: VIDEO, deviceScaleFactor: 1 } },
    {
      slowMo: plan.video?.slowMo ?? 250, // human-watchable pacing
      // showActions: Playwright outlines each interacted element, adds an action subtitle, and draws a cursor.
      recordVideo: { dir: path.join(OUT, "scenes", id), size: VIDEO, showActions: plan.video?.showActions ?? { duration: 500, position: "top-right" } },
    },
  );
  const t0 = Date.now();
  try {
    await gotoChecked(cfg, page, scene.route);
    const minHold = narrationMs(scene.narration);
    for (const a of scene.actions || []) {
      const target = a.selector ? page.locator(a.selector).first() : null;
      if (target) {
        const label = (await target.innerText().catch(() => "")) + " " + (await target.getAttribute("aria-label").catch(() => "") || "");
        if (["click", "type"].includes(a.type) && DENY.test(label)) throw new Error(`blocked destructive-looking target "${label.trim()}" in scene ${id}`);
        const box = await target.boundingBox();
        if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 25 });
      }
      if (a.type === "click") { await target.click(); await settle(page, 5000, 600); }
      else if (a.type === "hover") await page.waitForTimeout(a.ms || 800);
      else if (a.type === "type") {
        if (secretLike.test(a.selector) || secretLike.test(a.text)) throw new Error(`refusing to type into a secret-looking field in scene ${id}`);
        await target.pressSequentially(a.text, { delay: a.delay || 60 });
      } else if (a.type === "scroll") await page.mouse.wheel(0, a.dy || 600);
      else if (a.type === "wait") await page.waitForTimeout(a.ms || 1000);
      if (a.screenshot) {
        await page.screenshot(shotOptions(cfg, page, { path: path.join(OUT, "screenshots", `${id}-${slugify(a.screenshot)}.png`) }));
      }
    }
    const elapsed = Date.now() - t0;
    if (elapsed < minHold) await page.waitForTimeout(minHold - elapsed);
  } finally {
    await context.close(); // video is flushed to disk only when the context closes
    await browser.close();
  }
  const dur = Date.now() - t0;
  const webm = fs.readdirSync(path.join(OUT, "scenes", id)).find((f) => f.endsWith(".webm"));
  fs.renameSync(path.join(OUT, "scenes", id, webm), path.join(OUT, "scenes", `${id}.webm`));
  fs.rmSync(path.join(OUT, "scenes", id), { recursive: true, force: true });
  concat.push(`file 'scenes/${id}.mp4'`);
  if (scene.narration) cues.push(`${cues.length + 1}\n${ts(offset + 300)} --> ${ts(offset + Math.max(dur - 300, 1000))}\n${scene.narration}\n`);
  scriptLines.push(`## Scene ${i + 1}: ${scene.title}`, "", `- Route: \`${scene.route}\``, `- Recorded length: ${(dur / 1000).toFixed(1)}s (narration needs about ${(narrationMs(scene.narration) / 1000).toFixed(1)}s)`, "", `> ${scene.narration || "(no narration)"}`, "");
  offset += dur;
  log(`scene ${id}: ${(dur / 1000).toFixed(1)}s`);
}

fs.writeFileSync(path.join(OUT, "captions.vtt"), "WEBVTT\n\n" + cues.join("\n"));
fs.writeFileSync(path.join(OUT, "script.md"), scriptLines.join("\n"));
fs.writeFileSync(path.join(OUT, "concat.txt"), concat.join("\n") + "\n");
fs.writeFileSync(path.join(OUT, "plan.json"), JSON.stringify(plan, null, 2));
fs.writeFileSync(path.join(OUT, "make-video.sh"), `#!/usr/bin/env bash
# Assemble the demo. Requires ffmpeg. Run from this directory.
set -euo pipefail
# 1) Normalize every clip to identical H.264 1920x1080 streams (concat demuxer needs identical codec parameters).
for f in scenes/*.webm; do
  ffmpeg -y -i "$f" -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black" \\
    -c:v libx264 -pix_fmt yuv420p -crf 20 -preset slow -r 30 -an "\${f%.webm}.mp4"
done
# 2) Concatenate without re-encoding.
ffmpeg -y -f concat -safe 0 -i concat.txt -c copy demo-silent.mp4
# 3) Soft, toggleable captions; +faststart last so playback starts before the download finishes.
ffmpeg -y -i demo-silent.mp4 -i captions.vtt -map 0:v -map 1 -c:v copy -c:s mov_text -movflags +faststart demo.mp4
# Optional narration (video stream copied, audio encoded once):
#   ffmpeg -y -i demo.mp4 -i narration.wav -map 0:v -map 1:a -map 0:s? -c:v copy -c:s copy -c:a aac -shortest -movflags +faststart demo-narrated.mp4
# Optional burned-in captions for players without subtitle tracks:
#   ffmpeg -y -i demo-silent.mp4 -vf subtitles=captions.vtt -c:v libx264 -pix_fmt yuv420p -crf 20 demo-burned.mp4
# Optional GIF preview (two-pass palette):
#   ffmpeg -y -i demo-silent.mp4 -vf "fps=15,scale=480:-1:flags=lanczos,palettegen" palette.png
#   ffmpeg -y -i demo-silent.mp4 -i palette.png -lavfi "fps=15,scale=480:-1:flags=lanczos[x];[x][1:v]paletteuse" demo.gif
`);
fs.chmodSync(path.join(OUT, "make-video.sh"), 0o755);
log(`demo written to ${OUT}`);
