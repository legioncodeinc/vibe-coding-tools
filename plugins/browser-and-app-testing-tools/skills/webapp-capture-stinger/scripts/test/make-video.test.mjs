import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const script = new URL("../demo/make-video.sh", import.meta.url).pathname;
const has = (bin) => spawnSync(bin, ["-version"], { stdio: "ignore" }).status === 0;
const ready = has("ffmpeg") && has("ffprobe");

const root = fs.mkdtempSync(path.join(os.tmpdir(), "webapp-make-video-"));
const fixtures = path.join(root, "fixtures");
// Two 2 second test clips, encoded once and copied into each case.
const clip = (name, src) => execFileSync("ffmpeg", ["-v", "error", "-f", "lavfi", "-i", `${src}=size=320x240:rate=30:duration=2`, "-c:v", "libvpx", "-b:v", "200k", path.join(fixtures, name)]);
if (ready) { fs.mkdirSync(fixtures); clip("01-hook.webm", "testsrc"); clip("02-book.webm", "testsrc2"); }

const SEGMENTS = "# file\tin_ms\tout_ms\tscene\nscenes/02-book.webm\t500\t1500\tbook\nscenes/01-hook.webm\t0\t1000\thook\n";
function prepare(name, { segments = SEGMENTS, hold = "1.5" } = {}) {
  const dir = path.join(root, name);
  fs.mkdirSync(path.join(dir, "scenes"), { recursive: true, mode: 0o700 });
  for (const f of fs.readdirSync(fixtures)) fs.copyFileSync(path.join(fixtures, f), path.join(dir, "scenes", f));
  fs.writeFileSync(path.join(dir, "segments.tsv"), segments);
  fs.writeFileSync(path.join(dir, "assembly.conf"), `end_hold_seconds=${hold}\n`);
  fs.writeFileSync(path.join(dir, "captions.vtt"), "WEBVTT\n\n1\n00:00:00.300 --> 00:00:01.500\nHello\n");
  return dir;
}
const run = (dir) => spawnSync("bash", [script], { cwd: dir, encoding: "utf8" });
const probe = (file, entries) => execFileSync("ffprobe", ["-v", "error", "-show_entries", entries, "-of", "csv=p=0", file], { encoding: "utf8" }).trim();

test.after(() => fs.rmSync(root, { recursive: true, force: true }));

test("make-video.sh trims, reorders, holds the end frame and writes private outputs", { skip: !ready && "ffmpeg or ffprobe not installed" }, () => {
  const dir = prepare("valid");
  const result = run(dir);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /assembled from 2 segment\(s\)/);
  // 1.0s + 1.0s of trimmed clips plus a 1.5s end hold.
  const seconds = Number(probe(path.join(dir, "demo.mp4"), "format=duration"));
  assert.ok(Math.abs(seconds - 3.5) < 0.25, `duration ${seconds}`);
  assert.ok(Math.abs(Number(probe(path.join(dir, "segments/001.mp4"), "format=duration")) - 1.0) < 0.15);
  assert.ok(Math.abs(Number(probe(path.join(dir, "segments/002.mp4"), "format=duration")) - 2.5) < 0.2);
  assert.equal(probe(path.join(dir, "demo.mp4"), "stream=codec_type").split("\n").sort().join(","), "subtitle,video");
  assert.equal(probe(path.join(dir, "segments/001.mp4"), "stream=width,height"), "1920,1080");
  for (const f of ["segments/001.mp4", "segments/002.mp4", "segments-concat.txt", "demo-silent.mp4", "demo.mp4"]) assert.equal(fs.statSync(path.join(dir, f)).mode & 0o777, 0o600, f);
  assert.equal(fs.statSync(path.join(dir, "segments")).mode & 0o777, 0o700);
  // A second run refuses rather than overwriting what is there.
  const again = run(dir);
  assert.notEqual(again.status, 0);
  assert.match(again.stderr, /refused unsafe input or existing output/);
});

test("make-video.sh without an end hold keeps the trimmed length", { skip: !ready && "ffmpeg or ffprobe not installed" }, () => {
  const dir = prepare("no-hold", { hold: "0" });
  assert.equal(run(dir).status, 0);
  assert.ok(Math.abs(Number(probe(path.join(dir, "demo.mp4"), "format=duration")) - 2.0) < 0.25);
});

test("make-video.sh reads zero padded trim points as base 10", { skip: !ready && "ffmpeg or ffprobe not installed" }, () => {
  const dir = prepare("zero-padded", { segments: "scenes/01-hook.webm\t0100\t0900\thook\n", hold: "0" });
  const result = run(dir);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(Math.abs(Number(probe(path.join(dir, "segments/001.mp4"), "format=duration")) - 0.8) < 0.15);
});

test("make-video.sh refuses linked inputs, linked or existing outputs and unsafe segment paths", { skip: !ready && "ffmpeg or ffprobe not installed" }, () => {
  const sentinel = path.join(root, "sentinel.txt");
  fs.writeFileSync(sentinel, "unchanged outside sentinel");
  const cases = {
    "symlinked-captions": (dir) => { fs.rmSync(path.join(dir, "captions.vtt")); fs.symlinkSync(sentinel, path.join(dir, "captions.vtt")); },
    "hard-linked-clip": (dir) => { fs.linkSync(path.join(dir, "scenes/01-hook.webm"), path.join(root, "hard-link.webm")); },
    "symlinked-output": (dir) => { fs.symlinkSync(sentinel, path.join(dir, "demo.mp4")); },
    "existing-output": (dir) => { fs.writeFileSync(path.join(dir, "demo-silent.mp4"), "old"); },
    "existing-segments-dir": (dir) => { fs.mkdirSync(path.join(dir, "segments")); },
    "traversal": (dir) => { fs.writeFileSync(path.join(dir, "segments.tsv"), "scenes/../../sentinel.webm\t0\t1000\tx\n"); },
    "outside-file": (dir) => { fs.writeFileSync(path.join(dir, "segments.tsv"), "/etc/hosts\t0\t1000\tx\n"); },
    "empty-window": (dir) => { fs.writeFileSync(path.join(dir, "segments.tsv"), "scenes/01-hook.webm\t900\t900\thook\n"); },
    "linked-clips-dir": (dir) => { fs.symlinkSync(path.join(dir, "scenes"), path.join(dir, "clips")); fs.writeFileSync(path.join(dir, "segments.tsv"), "clips/01-hook.webm\t0\t1000\thook\n"); },
  };
  for (const [name, mutate] of Object.entries(cases)) {
    const dir = prepare(name);
    mutate(dir);
    const result = run(dir);
    assert.notEqual(result.status, 0, `${name} should be refused`);
    assert.match(result.stderr, /refused unsafe input or existing output/, name);
    assert.ok(!fs.existsSync(path.join(dir, "segments-concat.txt")), `${name} created output before refusing`);
    fs.rmSync(path.join(root, "hard-link.webm"), { force: true });
  }
  assert.equal(fs.readFileSync(sentinel, "utf8"), "unchanged outside sentinel");
});
