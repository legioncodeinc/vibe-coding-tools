import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { writeDemoCues } from "../lib/demo-cues.mjs";
import { captionText, countWords, fitReport, formatElevenV4, narrationCues, spellDomains, ttsClips } from "../lib/narration.mjs";

const span = (id, startMs, durationMs, narration) => ({ scene: { id, title: id.toUpperCase(), narration }, startMs, durationMs });

test("audio tags and markup are not spoken words or caption text", () => {
  assert.equal(countWords("[warm] Hello there [short pause] friend <break time=\"500ms\"/> again"), 4);
  assert.equal(captionText("[warm] Hello <b>there</b> [pause] friend"), "Hello there friend");
});

test("cues are timed per scene and report fits, tight and overrun at the plan pace", () => {
  const twenty = Array.from({ length: 20 }, (_, i) => `w${i}`).join(" ");
  const cues = narrationCues([
    span("roomy", 0, 20000, twenty), // 20 words at 120 wpm = 10s, 19.4s available
    span("tight", 20000, 10900, twenty), // 10.3s available
    span("short", 30900, 5000, twenty), // 4.4s available
    span("roomy", 35900, 9000, twenty), // reused clip: narrated once
  ], { wordsPerMinute: 120 });
  assert.deepEqual(cues.map((c) => [c.scene, c.status]), [["roomy", "fits"], ["tight", "tight"], ["short", "overrun"]]);
  assert.equal(cues[0].startMs, 300);
  assert.equal(cues[2].overrunMs, 10000 - 4400);
  assert.equal(cues[2].requiredWpm, Math.round(20 / (4400 / 60000)));
  const report = fitReport(cues, { wordsPerMinute: 120 });
  assert.match(report, /\| 3 \| short \| 20 \| 10\.0 \| 4\.4 \| \d+ \| OVERRUN by 5\.6s \|/);
  assert.match(report, /1 cue\(s\) overrun/);
});

test("Eleven v4 formatting keeps bracketed tags, converts SSML breaks, spells domains", () => {
  const { text, warnings } = formatElevenV4('Open <break time="2s"/> app.example.com/docs [short pause] then <break time="300ms"/> go.', { style: "warm" });
  assert.equal(text, "[warm] Open [long pause] app dot example dot com slash docs [short pause] then [short pause] go.");
  assert.ok(warnings.some((w) => /SSML <break> is not supported/.test(w)));
  assert.ok(warnings.some((w) => /domains spelled out/.test(w)));
  assert.equal(formatElevenV4("[excited] Already tagged.", { style: "warm" }).text, "[excited] Already tagged.");
  assert.deepEqual(formatElevenV4("Plain words [pause] only.").warnings, []);
  assert.equal(spellDomains("Visit https://simple-scheduler.io today"), "Visit simple-scheduler dot io today");
});

test("ttsClips writes one clip per cue and hardcodes no model id", () => {
  const cues = narrationCues([span("hook", 0, 8000, "Welcome to app.example.com"), span("book", 8000, 8000, "Book it <break time=\"1s\"/> now")]);
  const { files, manifest } = ttsClips(cues, { style: "warm" });
  assert.deepEqual(files.map((f) => f.name), ["01-hook.txt", "02-book.txt"]);
  assert.equal(manifest.model, null);
  assert.equal(manifest.voice, null);
  assert.equal(manifest.clips.length, 2);
  assert.deepEqual(manifest.clips.map((c) => c.audioFile), ["01-hook.mp3", "02-book.mp3"]);
  assert.equal(manifest.clips[1].startMs, cues[1].startMs);
  assert.ok(manifest.clips[1].warnings.length > 0);
  assert.equal(files[1].text, "[warm] Book it [pause] now\n");
});

test("writeDemoCues writes private caption, title, fit and clip files from an edited timeline", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "webapp-cues-"));
  fs.writeFileSync(path.join(dir, "timeline.json"), JSON.stringify({ wordsPerMinute: 140, tts: { style: "warm" }, scenes: [
    { id: "hook", title: "Hook", clip: "scenes/01-hook.webm", startMs: 0, durationMs: 5000, narration: "Meet the schedule for ACME-1234." },
    { id: "book", title: "Book", clip: "scenes/02-book.webm", startMs: 5000, durationMs: 9000, narration: "Drag a job onto a free slot." },
  ] }));
  fs.writeFileSync(path.join(dir, "segments.tsv"), "scenes/02-book.webm\t0\t9000\tbook\nscenes/01-hook.webm\t1000\t5000\thook\n");
  const { cues, totalMs, overruns } = writeDemoCues({ redact: { patterns: ["ACME-\\d+"] } }, dir);
  assert.equal(totalMs, 13000);
  assert.deepEqual(cues.map((c) => c.scene), ["book", "hook"]);
  assert.equal(overruns.length, 0);
  for (const f of ["captions.vtt", "titles.srt", "narration/cues.json", "narration/fit.md", "narration/tts/01-book.txt", "narration/tts/02-hook.txt", "narration/tts-manifest.json"]) {
    const p = path.join(dir, f);
    assert.equal(fs.statSync(p).mode & 0o777, 0o600, f);
    assert.ok(!fs.readFileSync(p, "utf8").includes("ACME-1234"), `${f} leaked a redact pattern`);
  }
  assert.match(fs.readFileSync(path.join(dir, "captions.vtt"), "utf8"), /00:00:09\.300 --> /);
  // Reordering renumbers cues; clip texts from the earlier build must not linger.
  fs.writeFileSync(path.join(dir, "segments.tsv"), "scenes/01-hook.webm\t0\t5000\thook\nscenes/02-book.webm\t0\t9000\tbook\n");
  writeDemoCues({}, dir);
  assert.deepEqual(fs.readdirSync(path.join(dir, "narration", "tts")).sort(), ["01-hook.txt", "02-book.txt"]);
  fs.rmSync(dir, { recursive: true, force: true });
});
