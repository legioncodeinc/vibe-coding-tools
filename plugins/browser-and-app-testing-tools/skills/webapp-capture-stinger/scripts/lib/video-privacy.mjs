// Videos are assembled only from screenshot frames masked by Playwright.
// No unmasked continuous video is created, including initial and dynamic frames.
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { shotOptions, captureScreenshot, ensurePrivateOutputDir, writePrivateCapture, validatePageMaskSelectors } from "./common.mjs";
function refuseLinkedPath(file) {
  let current = path.resolve(file);
  for (;;) {
    if (fs.existsSync(current) || (() => { try { fs.lstatSync(current); return true; } catch { return false; } })()) {
      const st = fs.lstatSync(current);
      if (st.isSymbolicLink() && !(process.platform === "darwin" && ["/tmp", "/var", "/etc"].includes(current) && fs.realpathSync(current) === `/private${current}`)) throw new Error("refusing linked masked-video output path");
    }
    const parent = path.dirname(current); if (parent === current) break; current = parent;
  }
}
const NAVIGATING = /context was destroyed|capture context changed during the image|frame (?:was|has been) detached|cannot find context|attempting a navigation|navigation interrupted|unable to capture screenshot/i;
const MAX_GAP_MS = 15000;
export async function startMaskedVideo(cfg, page, directory, { fps = 5 } = {}) {
  if (!Number.isInteger(fps) || fps < 1 || fps > 15) throw new Error("masked video fps must be an integer from 1 to 15");
  const frames = path.join(directory, "masked-frames");
  refuseLinkedPath(frames);
  ensurePrivateOutputDir(directory);
  ensurePrivateOutputDir(frames);
  if (process.platform !== "win32" && (fs.statSync(frames).mode & 0o077)) throw new Error("masked frame directory must be private (mode 700)");
  if (fs.readdirSync(frames).length) throw new Error("masked video frame directory must be empty");
  const selectors = [...new Set(["input[type=password]", ...(cfg.redact?.maskSelectors || [])])];
  const privacy = { ...cfg, redact: { ...cfg.redact, maskSelectors: selectors } };
  await validatePageMaskSelectors(privacy, page);
  for (const selector of selectors) await page.locator(selector).count();
  let stopped = false, failure, count = 0, lastBytes;
  const started = Date.now();
  const capture = async () => {
    const bytes = await captureScreenshot(privacy, page, { scale: "css" });
    const target = Math.max(count + 1, Math.floor((Date.now() - started) * fps / 1000) + 1);
    while (count < target) {
      const file = path.join(frames, `${String(++count).padStart(8, "0")}.png`);
      writePrivateCapture(file, count === target ? bytes : (lastBytes || bytes));
    }
    lastBytes = bytes;
  };
  await capture();
  // A navigation replaces the document mid-capture, and captureScreenshot then returns no
  // bytes. Drop that frame and try again; the next good capture fills the gap with the last
  // masked frame. Any other error, or a page that stays uncapturable, still fails closed.
  let lastGood = Date.now();
  const captureUnlessNavigating = async () => {
    try { await capture(); lastGood = Date.now(); return true; }
    catch (error) {
      if (!NAVIGATING.test(error.message) || Date.now() - lastGood > MAX_GAP_MS) throw error;
      return false;
    }
  };
  const pause = () => new Promise((resolve) => setTimeout(resolve, 1000 / fps));
  const loop = (async () => {
    while (!stopped) {
      await pause();
      if (!stopped) try { await captureUnlessNavigating(); } catch (error) { failure = error; stopped = true; }
    }
  })();
  return { frames, stop: async (output) => {
    stopped = true; await loop;
    if (failure) throw failure;
    while (!(await captureUnlessNavigating())) await pause();
    // Feed a private exclusive output descriptor instead of ffmpeg overwriting a path.
    refuseLinkedPath(output);
    const descriptor = fs.openSync(output, "wx", 0o600);
    try {
      await new Promise((resolve, reject) => {
        const child = spawn("ffmpeg", ["-v", "error", "-framerate", String(fps), "-i", path.join(frames, "%08d.png"), "-c:v", "libvpx-vp9", "-pix_fmt", "yuv420p", "-f", "webm", "pipe:1"], { stdio: ["ignore", descriptor, "pipe"] });
        let detail = ""; child.stderr.on("data", (data) => { detail += data; });
        child.once("error", reject); child.once("exit", (code) => code === 0 ? resolve() : reject(new Error(`masked video assembly failed (${code}): ${detail.slice(0, 500)}`)));
      });
    } finally { fs.closeSync(descriptor); }
    return { output, frames: count, fps, durationMs: Math.round(count / fps * 1000), privacy: "masked-screenshot-frames" };
  } };
}
