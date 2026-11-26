// Record a scripted product demo: one video per scene, key screenshots, a write
// ledger with read-only verification, a privacy scan, an editable timeline, captions,
// scene titles, narration timings and Eleven v4 clip texts, plus the ffmpeg assembly
// script. The demo plan is human-approved JSON (see demo-plan.example.json).
// Designed by Legion Code Inc.
// Usage: CAPTURE_CONFIG=... PLAN=demo-plan.json node demo/record-demo.mjs [--retake]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { captureScreenshot, ensurePrivateOutputDir, gotoChecked, loadConfig, log, openApp, pad, settle, slugify, writePrivateCapture } from "../lib/common.mjs";
import { redactCapture } from "../lib/redaction.mjs";
import { startMaskedVideo } from "../lib/video-privacy.mjs";
import { withApprovedRequests } from "../lib/browser-policy.mjs";
import { findingEntry, isGuardrailError, maskText, planDigest, planTake, sceneKey, scanText, segmentsTsv, buildTimeline, validateDemoPlan, writesForScene } from "../lib/demo-plan.mjs";
import { countWords } from "../lib/narration.mjs";
import { DemoSceneError, installCursorOverlay, runAction, runVerify, visibleText } from "../lib/demo-actions.mjs";
import { assertSafeDemoTarget, demoDenyPattern } from "../lib/demo-guard.mjs";
import { writeDemoCues } from "../lib/demo-cues.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const cfg = loadConfig();
if (!process.env.PLAN) throw new Error("Set PLAN=/path/to/demo-plan.json (see demo/demo-plan.example.json)");
const plan = validateDemoPlan(JSON.parse(fs.readFileSync(process.env.PLAN, "utf8")));
if (!cfg.output.demo) throw new Error("output.demo is required in the capture config for demo recordings");
const r = (s) => redactCapture(cfg, maskText(s));
const mkdirPrivate = (dir) => ensurePrivateOutputDir(dir);
const writePrivate = (file, text) => writePrivateCapture(file, text);

// Write ledger: every take that attempted a write is remembered, so a rerun cannot
// silently repeat it (an accidental second appointment, a second drop).
const slug = slugify(redactCapture(cfg, plan.title || "demo")) || "demo";
const ROOT = cfg.output.demo;
mkdirPrivate(ROOT);
const ledgerPath = path.join(ROOT, `${slug}.ledger.json`);
const ledger = fs.existsSync(ledgerPath) ? JSON.parse(fs.readFileSync(ledgerPath, "utf8")) : { title: r(plan.title || slug), takes: [] };
const retake = process.argv.includes("--retake") || process.env.RETAKE === "1";
const decision = planTake(ledger, plan, slug, { retake });
if (decision.refuse) throw new Error(decision.message);
log(decision.message);
const OUT = path.join(ROOT, decision.dir);
if (fs.existsSync(OUT)) throw new Error(`${OUT} already exists. Move it aside; takes never overwrite earlier output.`);
const takeRecord = { take: decision.take, dir: decision.dir, startedAt: new Date().toISOString(), planDigest: planDigest(plan), attemptedWrites: [] };
ledger.takes.push(takeRecord);
const saveLedger = () => writePrivate(ledgerPath, JSON.stringify(ledger, null, 2));
saveLedger();
for (const sub of ["scenes", "screenshots", "failures"]) mkdirPrivate(path.join(OUT, sub));

const VIDEO = { width: plan.video?.width || 1920, height: plan.video?.height || 1080 };
const WPM = plan.narration?.wordsPerMinute || 140; // 130 to 150 wpm band (research: demo section)
const END_HOLD_MS = plan.video?.endHoldMs ?? 1500;
const parkAt = plan.video?.parkAt || { x: VIDEO.width - 40, y: VIDEO.height - 40 };
const cursor = plan.video?.cursor === true;
// Built-in deny list always applies; plan.safety.denyPattern only adds to it.
const DENY = demoDenyPattern(plan.safety?.denyPattern);
const guard = (locator, action) => assertSafeDemoTarget(locator, action, DENY);
const patterns = cfg.redact?.patterns || [];

const rows = [], report = [], privacy = [];
let writeBlocked = null, abort = null;
const findingsPath = path.join(ROOT, "findings.md");
const addFinding = (scene, kind, detail, evidence) => {
  if (!fs.existsSync(findingsPath)) writePrivate(findingsPath, "# Demo findings\n\nAppended by record-demo.mjs. Text is masked and redacted.\n\n");
  writePrivateCapture(findingsPath, r(findingEntry({ when: new Date().toISOString(), title: plan.title || slug, take: decision.dir, scene, kind, detail, evidence })), { append: true });
};

for (const [i, scene] of plan.scenes.entries()) {
  const key = sceneKey(scene, i);
  const id = `${pad(i + 1, 2)}-${slugify(redactCapture(cfg, key)) || "scene"}`;
  const writes = writesForScene(plan, key);
  const safeKey = r(key);
  const row = { id: safeKey, title: r(scene.title || key), route: r(scene.route), narration: r(scene.narration || ""), clip: null, durationMs: 0, status: "ok" };
  rows.push(row);
  const skip = (reason) => {
    row.status = "skipped"; row.reason = reason;
    for (const w of writes) report.push({ id: w.id, scene: safeKey, description: r(w.description), effect: r(w.effect), status: "skipped", reason, checks: [] });
    log(`scene ${id}: skipped (${reason})`);
  };
  if (abort) { skip("run aborted by a guardrail"); continue; }
  if (writes.length && writeBlocked) { skip(`earlier write scene "${writeBlocked}" did not verify`); continue; }

  const { browser, context, page } = await openApp(
    { ...cfg, browser: { ...cfg.browser, viewport: VIDEO, deviceScaleFactor: 1 } },
    { slowMo: plan.video?.slowMo ?? 250 }, // human-watchable pacing
  );
  // Video is built from masked screenshot frames, so headless shows no cursor. With
  // video.cursor the DOM overlay draws one and it appears in every masked frame.
  if (cursor) await context.addInitScript(installCursorOverlay);
  let recorder;
  const t0 = Date.now();
  // Declared local/seeded request grants are active only while an action runs, and only in
  // scenes listed in writes[], so every granted request is in the ledger and verified.
  const wrap = writes.length && plan.safety?.requests?.length ? (fn) => withApprovedRequests(cfg, page, { ...plan.safety, approved: plan.approved }, fn) : (fn) => fn();
  const ctx = { guard, deny: DENY, settle: (p) => settle(p, 0, 600), wrap, parkAt, pointer: parkAt };
  // Every navigation reloads the overlay at its hidden start, so put it back where the pointer is.
  const restore = () => page.mouse.move(ctx.pointer.x, ctx.pointer.y).catch(() => {});
  page.on("load", restore);
  const hits = [];
  const scan = async (action) => {
    for (const h of scanText(await visibleText(page), patterns)) {
      const prev = hits.find((x) => x.kind === h.kind && x.masked === h.masked);
      if (prev) prev.count = Math.max(prev.count, h.count); else hits.push({ ...h, action });
    }
  };
  const failureShot = async () => {
    const file = path.join(OUT, "failures", `${id}.png`);
    writePrivateCapture(file, await captureScreenshot(cfg, page));
    return path.relative(ROOT, file);
  };
  let checks = [], evidence = null;
  try {
    if (writes.length) {
      // Recorded before any action runs: a crash mid-scene still counts as an attempt.
      takeRecord.attemptedWrites.push(...writes.map((w) => w.id));
      saveLedger();
    }
    recorder = await startMaskedVideo(cfg, page, path.join(OUT, "scenes", id), { fps: plan.video?.fps || 5 });
    await gotoChecked(cfg, page, scene.route, { idleMs: 0, extraMs: 800 });
    await restore();
    await scan(0);
    for (const [j, a] of (scene.actions || []).entries()) {
      try { await runAction(page, a, ctx); } catch (e) { e.message = `action ${j + 1} (${a.type}): ${e.message}`; throw e; }
      if (a.screenshot) {
        writePrivateCapture(path.join(OUT, "screenshots", `${id}-${slugify(redactCapture(cfg, a.screenshot))}.png`), await captureScreenshot(cfg, page));
      }
      await scan(j + 1);
    }
    for (const v of scene.verify || []) checks.push(await runVerify(page, v));
    const failed = checks.filter((c) => !c.pass);
    row.status = failed.length ? "mismatch" : writes.length ? "verified" : "ok";
    if (failed.length) {
      evidence = await failureShot().catch(() => null);
      row.error = r(failed.map((c) => `${c.check}: got ${c.actual}`).join("; "));
    }
    // Hold long enough for the narration at the plan's pace, plus caption lead and tail.
    const hold = Math.ceil((countWords(scene.narration) / WPM) * 60000) + 600;
    const elapsed = Date.now() - t0;
    if (elapsed < hold) await page.waitForTimeout(hold - elapsed);
  } catch (e) {
    const guardrail = !(e instanceof DemoSceneError) && isGuardrailError(e);
    row.status = guardrail ? "aborted" : "failed";
    row.error = r(e.message);
    if (guardrail) abort = e;
    evidence = await failureShot().catch(() => null);
  } finally {
    page.off("load", restore);
    try {
      if (recorder) {
        const recording = await recorder.stop(path.join(OUT, "scenes", `${id}.webm`));
        row.clip = `scenes/${id}.webm`;
        row.durationMs = recording.durationMs;
      }
    } catch (e) { if (!abort) { abort = e; row.status = "aborted"; row.error = r(e.message); } }
    finally { await context.close(); await browser.close(); }
  }
  const dur = row.durationMs;
  row.checks = checks.map((c) => ({ ...c, actual: r(c.actual), expected: r(c.expected) }));
  privacy.push({ id: safeKey, hits });

  const writeStatus = { verified: "verified", mismatch: "mismatch" }[row.status] || "failed";
  for (const w of writes) report.push({ id: w.id, scene: safeKey, description: r(w.description), effect: r(w.effect), status: writeStatus, checks: row.checks, ...(row.error ? { error: row.error } : {}) });
  if (writes.length && writeStatus !== "verified") writeBlocked = key;
  if (["failed", "mismatch", "aborted"].includes(row.status)) addFinding(key, row.status, row.error || "unknown error", evidence);
  log(`scene ${id}: ${row.status}, ${(dur / 1000).toFixed(1)}s${hits.length ? `, ${hits.length} masked text hit(s) for review` : ""}`);
}

// Timeline, edit list and assembly settings. Failed, aborted and mismatched scenes stay in
// timeline.json but are left out of segments.tsv so they do not reach the video by default.
const timeline = buildTimeline(rows);
writePrivate(path.join(OUT, "timeline.json"), JSON.stringify({ title: r(plan.title || slug), take: decision.take, wordsPerMinute: WPM, tts: plan.narration?.tts || {}, totalMs: timeline.totalMs, scenes: timeline.scenes }, null, 2));
const usable = timeline.scenes.filter((s) => s.clip && ["ok", "verified"].includes(s.status));
writePrivate(path.join(OUT, "segments.tsv"), segmentsTsv({ scenes: usable }));
writePrivate(path.join(OUT, "assembly.conf"), `# Read by make-video.sh\nend_hold_seconds=${Math.max(0, Math.round(END_HOLD_MS)) / 1000}\n`);
writePrivate(path.join(OUT, "writes-report.json"), JSON.stringify({ take: decision.take, generatedAt: new Date().toISOString(), writes: report }, null, 2));
writePrivate(path.join(OUT, "privacy-review.json"), JSON.stringify({ take: decision.take, note: "Masked hits only; raw page text is never stored. Run review-demo.mjs and check every tile.", scenes: privacy }, null, 2));
writePrivate(path.join(OUT, "plan.json"), JSON.stringify(redactCapture(cfg, plan), null, 2));

const script = [`# ${r(plan.title || slug)}`, "", r(plan.summary || ""), "", `Take ${decision.take}. Narration pace: ${WPM} words per minute.`, ""];
for (const [i, s] of timeline.scenes.entries()) {
  script.push(`## Scene ${i + 1}: ${s.title} (${s.status})`, "", `- Route: \`${s.route}\``,
    s.clip ? `- Recorded length: ${(s.durationMs / 1000).toFixed(1)}s, starts at ${(s.startMs / 1000).toFixed(1)}s${usable.includes(s) ? "" : " (left out of segments.tsv)"}` : `- Not recorded${s.reason ? `: ${s.reason}` : ""}`,
    `- Narration needs about ${((countWords(s.narration) / WPM) * 60).toFixed(1)}s`,
    ...(s.checks || []).map((c) => `- Verify: ${c.check}: ${c.pass ? "pass" : `FAIL (got ${c.actual})`}`),
    ...(s.error ? [`- Error: ${s.error}`] : []), "", `> ${s.narration || "(no narration)"}`, "");
}
writePrivate(path.join(OUT, "script.md"), redactCapture(cfg, script.join("\n")));
const makeVideo = path.join(OUT, "make-video.sh");
writePrivate(makeVideo, fs.readFileSync(path.join(here, "make-video.sh"), "utf8"));
fs.chmodSync(makeVideo, 0o700);

if (usable.length) {
  const { cues, overruns } = writeDemoCues(cfg, OUT);
  log(`${cues.length} narration cue(s); see narration/fit.md`);
  for (const c of overruns) log(`OVERRUN cue ${c.index} (${c.scene}): needs ${(c.neededMs / 1000).toFixed(1)}s, has ${(c.availableMs / 1000).toFixed(1)}s`);
} else log("no usable scenes, so no captions or narration cues were written");

Object.assign(takeRecord, { finishedAt: new Date().toISOString(), statuses: Object.fromEntries(rows.map((s) => [s.id, s.status])) });
saveLedger();
const bad = report.filter((w) => w.status !== "verified");
if (bad.length) log(`${bad.length} write(s) not verified; see writes-report.json and ${findingsPath}`);
log(`demo take ${decision.take} written to ${OUT}`);
if (abort) throw abort;
