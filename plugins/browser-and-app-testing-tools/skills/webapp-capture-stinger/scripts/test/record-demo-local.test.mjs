import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { chromiumPath, saveSessionState } from "../lib/common.mjs";
import { bodyDigest } from "../lib/browser-policy.mjs";

const scripts = fileURLToPath(new URL("..", import.meta.url));
const hasFfmpeg = () => { try { execFileSync("ffmpeg", ["-version"], { stdio: "ignore" }); execFileSync("ffprobe", ["-version"], { stdio: "ignore" }); return true; } catch { return false; } };

const PAGE = `<!doctype html><html><body>
  <h1>Schedule</h1><label><input type="checkbox" id="repeats" checked> Repeats</label>
  <button id="save">Save</button><p id="status">idle</p>
  <script>
    save.addEventListener("click", () => fetch("/api/save", { method: "POST", body: "fixture" })
      .then(() => { document.getElementById("status").textContent = "saved"; }, () => { document.getElementById("status").textContent = "refused"; }));
  </script></body></html>`;

function setup(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "webapp-demo-local-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}
function writeConfig(root, origin, browser = {}) {
  const cfg = { app: { name: "Synthetic demo", origin, context: "Local synthetic fixture only", loginPath: "/login" }, auth: { storageState: path.join(root, "auth.json") }, browser: { viewport: { width: 640, height: 480 }, deviceScaleFactor: 1, ...browser }, routes: { startPath: "/schedule" }, tabs: { selector: '[role="tab"]' }, redact: { patterns: ["CAPTURE_CANARY"] }, output: { screenshots: path.join(root, "screenshots"), inventory: path.join(root, "inventory"), demo: path.join(root, "demo"), audit: path.join(root, "audit") } };
  const config = path.join(root, "capture.config.json");
  fs.writeFileSync(config, JSON.stringify(cfg), { mode: 0o600 });
  return { cfg, config };
}
const run = (script, env, args = []) => new Promise((resolve, reject) => {
  const child = spawn(process.execPath, [path.join(scripts, script), ...args], { cwd: scripts, env: { ...process.env, ...env }, stdio: ["ignore", "pipe", "pipe"] });
  let output = ""; child.stdout.on("data", (d) => { output += d; }); child.stderr.on("data", (d) => { output += d; });
  child.once("error", reject); child.once("exit", (code) => resolve({ code, output }));
});

test("review-demo contact sheet covers a clip longer than sixteen samples", { skip: !hasFfmpeg() && "ffmpeg or ffprobe not installed" }, async (t) => {
  const root = setup(t);
  const { config } = writeConfig(root, "http://127.0.0.1:9");
  const dir = path.join(root, "take");
  fs.mkdirSync(path.join(dir, "scenes"), { recursive: true, mode: 0o700 });
  execFileSync("ffmpeg", ["-v", "error", "-f", "lavfi", "-i", "testsrc=size=320x240:rate=2:duration=40", "-c:v", "libvpx", path.join(dir, "scenes/01-long.webm")]);
  fs.chmodSync(path.join(dir, "scenes/01-long.webm"), 0o600);
  fs.writeFileSync(path.join(dir, "timeline.json"), JSON.stringify({ scenes: [{ id: "long", title: "Long", status: "ok", clip: "scenes/01-long.webm", durationMs: 40000 }] }), { mode: 0o600 });
  const result = await run("demo/review-demo.mjs", { CAPTURE_CONFIG: config, DEMO_DIR: dir, EVERY_SECONDS: "2" });
  assert.equal(result.code, 0, result.output);
  const png = fs.readFileSync(path.join(dir, "review/long-sheet.png"));
  // 20 samples need at least 5 rows of 360 px tiles; a fixed 4x4 grid is shorter than this.
  assert.ok(png.readUInt32BE(20) >= 5 * 360, `sheet height ${png.readUInt32BE(20)}`);
});

test("record, review, rebuild cues and assemble against a local fixture; writes stay in declared scenes", { skip: !hasFfmpeg() && "ffmpeg or ffprobe not installed" }, async (t) => {
  try { await import("playwright-core"); } catch { t.skip("playwright-core is not installed"); return; }
  const root = setup(t);
  let posts = 0;
  const server = http.createServer((req, res) => {
    if (req.method === "POST") { posts++; res.end("ok"); return; }
    res.setHeader("content-type", "text/html; charset=utf-8"); res.end(PAGE);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => { server.closeAllConnections(); server.close(resolve); }));
  const executablePath = chromiumPath({ browser: {} });
  const { cfg, config } = writeConfig(root, `http://127.0.0.1:${server.address().port}`, executablePath ? { executablePath } : {});
  saveSessionState(cfg, { cookies: [], origins: [] }, {});
  const planPath = path.join(root, "plan.json");
  fs.writeFileSync(planPath, JSON.stringify({
    title: "Local demo", approved: true, video: { width: 640, height: 480, cursor: true, slowMo: 0 },
    safety: { environment: "local", requests: [{ approved: true, method: "POST", path: "/api/save", bodySha256: bodyDigest("fixture") }] },
    writes: [{ id: "save-once", scene: "book", description: "Saves once", effect: "Status reads saved", approved: true }],
    scenes: [
      { id: "browse", title: "Browse", route: "/schedule?ref=CAPTURE_CANARY", narration: "Here is the schedule.", actions: [{ type: "click", selector: "#save" }], verify: [{ type: "text", selector: "#status", expect: "refused" }] },
      { id: "book", title: "Book", route: "/schedule", narration: "Save the job.", actions: [{ type: "uncheck", selector: "#repeats" }, { type: "click", selector: "#save", screenshot: "saved" }], verify: [{ type: "text", selector: "#status", expect: "saved" }] },
    ],
  }));
  const env = { CAPTURE_CONFIG: config, PLAN: planPath, RETAKE: "" };
  const first = await run("demo/record-demo.mjs", env);
  assert.equal(first.code, 0, first.output);
  assert.equal(posts, 1, "only the declared write scene may send the granted request");
  const take = path.join(cfg.output.demo, "local-demo");
  const read = (name) => fs.readFileSync(path.join(take, name), "utf8");
  assert.deepEqual(JSON.parse(read("timeline.json")).scenes.map((s) => s.status), ["ok", "verified"]);
  assert.deepEqual(JSON.parse(read("writes-report.json")).writes.map((w) => [w.id, w.status]), [["save-once", "verified"]]);
  for (const name of ["timeline.json", "script.md", "plan.json"]) assert.ok(!read(name).includes("CAPTURE_CANARY"), `${name} leaked a redact pattern`);
  const again = await run("demo/record-demo.mjs", env);
  assert.notEqual(again.code, 0);
  assert.match(again.output, /Refusing to rerun/);
  assert.equal(posts, 1);
  const review = await run("demo/review-demo.mjs", { ...env, DEMO_DIR: take });
  assert.equal(review.code, 0, review.output);
  const cues = await run("demo/build-cues.mjs", { ...env, DEMO_DIR: take });
  assert.equal(cues.code, 0, cues.output);
  execFileSync("bash", ["make-video.sh"], { cwd: take, stdio: "pipe" });
  const streams = execFileSync("ffprobe", ["-v", "error", "-show_entries", "stream=codec_type", "-of", "csv=p=0", path.join(take, "demo.mp4")], { encoding: "utf8" });
  assert.deepEqual(streams.trim().split("\n").sort(), ["subtitle", "video"]);
});

test("in-scene page navigations do not abort the masked recording", { skip: !hasFfmpeg() && "ffmpeg or ffprobe not installed" }, async (t) => {
  try { await import("playwright-core"); } catch { t.skip("playwright-core is not installed"); return; }
  const root = setup(t);
  // Slow documents and subresources keep frames in flight while the page is replaced.
  const server = http.createServer((req, res) => setTimeout(() => {
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.end(`<h1>${req.url}</h1><a id="next" href="${req.url === "/a" ? "/b" : "/a"}">next</a><img src="/slow.png" alt="">`);
  }, req.url === "/slow.png" ? 700 : 350));
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => { server.closeAllConnections(); server.close(resolve); }));
  const executablePath = chromiumPath({ browser: {} });
  const { cfg, config } = writeConfig(root, `http://127.0.0.1:${server.address().port}`, executablePath ? { executablePath } : {});
  saveSessionState(cfg, { cookies: [], origins: [] }, {});
  const planPath = path.join(root, "plan.json");
  const hop = [{ type: "click", selector: "#next" }, { type: "wait", ms: 300 }];
  fs.writeFileSync(planPath, JSON.stringify({ title: "Navigate", approved: true, video: { width: 640, height: 480, cursor: true, fps: 10, slowMo: 0 }, scenes: [{ id: "nav", route: "/a", actions: [...hop, ...hop, ...hop], verify: [{ type: "text", selector: "h1", expect: "/b" }] }] }));
  const result = await run("demo/record-demo.mjs", { CAPTURE_CONFIG: config, PLAN: planPath, RETAKE: "" });
  assert.equal(result.code, 0, result.output);
  const [scene] = JSON.parse(fs.readFileSync(path.join(cfg.output.demo, "navigate", "timeline.json"), "utf8")).scenes;
  assert.equal(scene.status, "ok", scene.error);
  assert.ok(scene.durationMs > 1000);
});
