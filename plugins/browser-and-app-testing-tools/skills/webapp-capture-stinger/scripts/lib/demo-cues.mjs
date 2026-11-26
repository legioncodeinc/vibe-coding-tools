// Write captions, scene-title SRT, narration timings and TTS clips for a demo folder
// from its timeline.json and segments.tsv. Shared by record-demo.mjs and build-cues.mjs.
// Designed by Legion Code Inc.
import fs from "node:fs";
import path from "node:path";
import { redactCapture } from "./redaction.mjs";
import { ensurePrivateOutputDir, writePrivateCapture } from "./common.mjs";
import { editedSpans, parseSegments, titleCues, toSrt, toVtt } from "./demo-plan.mjs";
import { fitReport, narrationCues, ttsClips } from "./narration.mjs";

export function writeDemoCues(cfg, dir) {
  const timeline = JSON.parse(fs.readFileSync(path.join(dir, "timeline.json"), "utf8"));
  const segments = parseSegments(fs.readFileSync(path.join(dir, "segments.tsv"), "utf8"));
  const { spans, totalMs } = editedSpans(timeline, segments);
  const wpm = timeline.wordsPerMinute || 140;
  const cues = narrationCues(spans, { wordsPerMinute: wpm });
  const narrationDir = path.join(dir, "narration"), ttsDir = path.join(narrationDir, "tts");
  ensurePrivateOutputDir(ttsDir);
  writePrivateCapture(path.join(dir, "captions.vtt"), redactCapture(cfg, toVtt(cues)));
  writePrivateCapture(path.join(dir, "titles.srt"), redactCapture(cfg, toSrt(titleCues(spans))));
  writePrivateCapture(path.join(narrationDir, "cues.json"), JSON.stringify(redactCapture(cfg, { wordsPerMinute: wpm, totalMs, cues: cues.map(({ narration, ...c }) => c) }), null, 2));
  writePrivateCapture(path.join(narrationDir, "fit.md"), redactCapture(cfg, fitReport(cues, { wordsPerMinute: wpm })));
  const { files, manifest } = ttsClips(cues, timeline.tts || {});
  // Cue numbers change when segments are reordered, so clear clip texts from an earlier build.
  for (const name of fs.readdirSync(ttsDir)) {
    const p = path.join(ttsDir, name);
    if (/^\d{2}-[A-Za-z0-9._-]+\.txt$/.test(name) && fs.lstatSync(p).isFile()) fs.rmSync(p);
  }
  for (const f of files) writePrivateCapture(path.join(ttsDir, f.name), redactCapture(cfg, f.text));
  writePrivateCapture(path.join(narrationDir, "tts-manifest.json"), JSON.stringify(redactCapture(cfg, manifest), null, 2));
  return { cues, totalMs, overruns: cues.filter((c) => c.status === "overrun") };
}
